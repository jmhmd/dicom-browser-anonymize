/** @type {{ level: string; message: string }[]} */
let logs = [];

/**
 *
 * @param {string} level Log level 'warn' | 'error' | 'info'
 * @param {string} message Log message
 */
export function log(level, message) {
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
