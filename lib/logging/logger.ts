export function logInfo(message: string, context?: Record<string, unknown>) {
  console.info(`[INFO] ${message}`, context ?? {});
}

export function logError(message: string, context?: Record<string, unknown>) {
  console.error(`[ERROR] ${message}`, context ?? {});
}
