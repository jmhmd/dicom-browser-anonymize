/**
 *
 * @param {import("./ImageFrame").TypedArray} buffer
 * @returns
 */
export default function getArrayBuffer(buffer) {
  const { buffer: b, byteOffset, byteLength } = buffer;
  return b.slice(byteOffset, byteOffset + byteLength);
}
