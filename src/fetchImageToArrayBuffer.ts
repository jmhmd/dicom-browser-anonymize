export default async function fetchImageToArrayBuffer(url: string) {
  const file = await window.fetch(url);
  const fileArrayBuffer = await file.arrayBuffer();
  return fileArrayBuffer;
}
