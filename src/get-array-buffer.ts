import { TypedArray } from './ImageFrame';

export default function getArrayBuffer(buffer: TypedArray) {
  const { buffer: b, byteOffset, byteLength } = buffer;
  return b.slice(byteOffset, byteOffset + byteLength);
}
