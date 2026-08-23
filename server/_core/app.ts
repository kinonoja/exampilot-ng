import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { handlePaystackWebhook, isValidPaystackSignature } from "../paystack";
import { createCriticalFlowLog } from "../observability";

/**
 * Creates the API-only Express application shared by the long-running local
 * server and Vercel's serverless function. Static delivery remains the
 * responsibility of the surrounding runtime.
 */
export function createExamPilotApiApp() {
  const app = express();

  app.get("/api/webhooks/paystack", (_req, res) => {
    res.status(200).json({ status: "ready", service: "paystack-webhook" });
  });

  // This must stay before express.json so Paystack signatures use the exact
  // raw bytes that Paystack signed.
  app.post(
    "/api/webhooks/paystack",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const rawBody = req.body as Buffer;
      if (!isValidPaystackSignature(rawBody, req.header("x-paystack-signature"))) {
        res.status(401).json({ error: "Invalid Paystack signature" });
        return;
      }

      try {
        const event = JSON.parse(rawBody.toString("utf8")) as Parameters<
          typeof handlePaystackWebhook
        >[0];
        await handlePaystackWebhook(event);
        console.info("[Paystack webhook] Accepted", {
          event: event.event,
          reference: event.data?.reference ?? null,
          status: 200,
        });
        res.sendStatus(200);
      } catch (error) {
        console.error("[Paystack webhook] Processing failed", error);
        res.sendStatus(500);
      }
    }
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.use("/api/trpc", (req, res, next) => {
    const requestId = crypto.randomUUID();
    const startedAt = performance.now();
    res.locals.examPilotRequestId = requestId;
    res.setHeader("X-Request-ID", requestId);
    res.once("finish", () => {
      const event = createCriticalFlowLog({
        requestId,
        pathname: req.path,
        statusCode: res.statusCode,
        durationMs: performance.now() - startedAt,
      });
      if (event) console.info(JSON.stringify(event));
    });
    next();
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}
