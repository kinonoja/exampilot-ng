export function getClampedCountdown(startedAt: Date | string, durationSeconds: number, now = Date.now()) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  return Math.max(0, Math.min(durationSeconds, durationSeconds - elapsedSeconds));
}
