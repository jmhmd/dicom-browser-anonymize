import { ref } from 'vue';

const logs = ref<string[]>([]);

export default function logToDiv(content: string) {
  logs.value.unshift(content);
}

export { logs };
