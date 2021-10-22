let logs: { level: string; message: string }[] = [];

type Level = 'warn' | 'error' | 'info';

export function log(level: Level, message: string) {
  logs.push({
    level,
    message,
  });
}

export function getLogs() {
  return logs;
}

export function clearLogs() {
  logs = [];
}
