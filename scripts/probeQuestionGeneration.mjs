const response = await fetch(`${process.env.BUILT_IN_FORGE_API_URL}/v1/chat/completions`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.BUILT_IN_FORGE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    messages: [
      { role: "system", content: "Return only valid JSON matching the requested schema." },
      { role: "user", content: "Return a one-sentence readiness confirmation." },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "generation_readiness",
        strict: true,
        schema: {
          type: "object",
          properties: { ready: { type: "boolean" }, message: { type: "string" } },
          required: ["ready", "message"],
          additionalProperties: false,
        },
      },
    },
  }),
});

const body = await response.json();
if (!response.ok) {
  console.error(JSON.stringify({ status: response.status, body }));
  process.exit(1);
}
console.log(JSON.stringify({ status: response.status, content: body.choices?.[0]?.message?.content ?? null }));
