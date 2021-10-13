import { ref } from 'vue';

export type LogLevel = 'warn' | 'error' | 'info';

interface Log {
  level: LogLevel;
  message: string;
  sublogs?: Log[];
}

const logs = ref<Log[]>([]);

export function logToDiv(content: string) {
  logs.value.unshift({ level: 'info', message: content });
}

export function addLog(level: LogLevel, message: string, sublogs: Log[]) {
  logs.value.unshift({ level, message, sublogs });
}

export { logs };
