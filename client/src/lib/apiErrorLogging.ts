import { TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE } from "@shared/const";

export function shouldLogApiError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message !== TEMPORARY_ASSISTANT_UNAVAILABLE_MESSAGE;
}
