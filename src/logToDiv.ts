export default function logToDiv(content: string) {
  const newEl = document.createElement('div');
  newEl.innerHTML = content;
  const logEl = document.getElementById('log');
  logEl?.prepend(newEl);
}
