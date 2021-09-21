import humanFileSize from './humanFileSize';

export default function monitorMemory() {
  let memoryMin: number | null = null;
  let memoryMax = 0;
  window.setInterval(() => {
    const el = document.getElementById('memory');
    const performance = window.performance as any;
    const memoryLimit = humanFileSize(performance.memory.jsHeapSizeLimit);
    const memoryAllocated = humanFileSize(performance.memory.totalJSHeapSize);
    const memoryUsed = humanFileSize(performance.memory.usedJSHeapSize);

    if (performance.memory.totalJSHeapSize > memoryMax)
      memoryMax = performance.memory.totalJSHeapSize;
    if (!memoryMin) {
      memoryMin = performance.memory.totalJSHeapSize;
    }
    if (memoryMin && performance.memory.totalJSHeapSize < memoryMin)
      memoryMin = performance.memory.totalJSHeapSize;

    if (el?.innerHTML) {
      el.innerHTML = `
      <div>Mem Limit: ${memoryLimit}</div>
      <div>Mem Alloc: ${memoryAllocated}</div>
      <div>Mem Used: ${memoryUsed}</div>
      <div>Min alloc: ${memoryMin && humanFileSize(memoryMin)}</div>
      <div>Max alloc: ${memoryMax && humanFileSize(memoryMax)}</div>
      `;
    }
  }, 200);
}
