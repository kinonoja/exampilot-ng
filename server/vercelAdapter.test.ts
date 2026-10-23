import { afterEach, describe, expect, it } from "vitest";
import { createServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { createExamPilotApiApp } from "./_core/app";
import vercelApiHandler from "../api/[...path]";

let server: Server | undefined;

afterEach(async () => {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server?.close(error => (error ? reject(error) : resolve()));
  });
  server = undefined;
});

describe("Vercel Express adapter", () => {
  it("exports the shared Express app from the Vercel catch-all function", () => {
    expect(typeof vercelApiHandler).toBe("function");
  });

  it("keeps the unsigned Paystack readiness endpoint available through the shared API app", async () => {
    server = createServer(createExamPilotApiApp());
    await new Promise<void>((resolve, reject) => {
      server?.listen(0, "127.0.0.1", error => (error ? reject(error) : resolve()));
    });

    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Expected a TCP test server address");
    const response = await fetch(`http://127.0.0.1:${address.port}/api/webhooks/paystack`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "ready",
      service: "paystack-webhook",
    });
  });

  it("routes Vercel API traffic to a catch-all Node 22 function and preserves SPA fallback", async () => {
    const config = JSON.parse(
      await readFile(new URL("../vercel.json", import.meta.url), "utf8")
    ) as { functions: Record<string, unknown>; rewrites: Array<{ source: string; destination: string }> };

    expect(config.functions["api/[...path].ts"]).toMatchObject({ runtime: "nodejs22.x" });
    expect(config.rewrites).toContainEqual({ source: "/api/:path*", destination: "/api/:path*" });
    expect(config.rewrites).toContainEqual({ source: "/:path*", destination: "/index.html" });
  });
});
