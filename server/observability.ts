export const CRITICAL_FLOW_PREFIXES = ["practice.", "mock.", "tutor.", "billing.", "courseDirection."] as const;

export function getCriticalProcedurePaths(pathname: string) {
  return pathname
    .replace(/^\//, "")
    .split(",")
    .map(path => decodeURIComponent(path))
    .filter(path => CRITICAL_FLOW_PREFIXES.some(prefix => path.startsWith(prefix)));
}

export function createCriticalFlowLog(input: { requestId: string; pathname: string; statusCode: number; durationMs: number }) {
  const procedures = getCriticalProcedurePaths(input.pathname);
  if (!procedures.length) return null;
  return {
    event: "exampilot.critical_flow",
    requestId: input.requestId,
    procedures,
    statusCode: input.statusCode,
    durationMs: Math.max(0, Math.round(input.durationMs)),
  };
}
