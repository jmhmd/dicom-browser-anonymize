export default function getArrayBuffer(buffer: Uint16Array) {
  const { buffer: b, byteOffset, byteLength } = buffer;
  return b.slice(byteOffset, byteOffset + byteLength);
}
