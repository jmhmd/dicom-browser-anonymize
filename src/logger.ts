import { ref, computed } from 'vue';

export type LogLevel = 'warn' | 'error' | 'info';
type Sublog = Omit<Log, 'timestamp'>;

interface Log {
  level: LogLevel;
  message: string;
  sublogs?: Sublog[];
  timestamp: Date;
}

const logs = ref<Log[]>([]);
const status = ref<null | { message: string; timestamp: Date }>(null);

// Return latest log or status update, whichever is most recent
const latestMessage = computed(() => {
  const lastLog = logs.value[0];
  if (lastLog?.timestamp && status.value?.timestamp) {
    if (lastLog.timestamp.getTime() > status.value.timestamp.getTime()) {
      return lastLog.message;
    } else {
      return status.value.message;
    }
  } else {
    return status.value?.message || lastLog?.message;
  }
});

// export function logToDiv(content: string) {
//   logs.value.unshift({ level: 'info', message: content });
// }

export function addLog(level: LogLevel, message: string, sublogs?: Sublog[]) {
  logs.value.unshift({ level, message, sublogs, timestamp: new Date() });
}

export function updateStatus(message: string) {
  if (!message) {
    status.value = null;
  } else {
    status.value = { message, timestamp: new Date() };
  }
}

export { logs, status, latestMessage };
