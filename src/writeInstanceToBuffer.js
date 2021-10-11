import getArrayBuffer from './get-array-buffer.js';
import humanFileSize from './humanFileSize.js';
import logToDiv from './logToDiv';

/**
 *
 * @param {import("./Instance").default} instance
 * @returns {import('./Instance').default}
 */
export default function writeInstanceToBuffer(instance) {
  const { anonymizedDicomData } = instance.image;
  if (!anonymizedDicomData) {
    throw new Error(
      `Instance has not been successfully anonymized. Instance ${JSON.stringify(instance)}`
    );
  }

  // TODO: #1 Find out why writing to implicit LE doesn't work correctly
  anonymizedDicomData.meta['00020010'].Value = ['1.2.840.10008.1.2.1']; // Transfer syntax to explicit little endian
  const pixelDataArrayBuffer = getArrayBuffer(instance.image.imageFrame.pixelData);
  anonymizedDicomData.upsertTag('7FE00010', 'OW', [pixelDataArrayBuffer]); // Set new pixel data
  console.time('write');
  instance.image.dicomP10ArrayBuffer = anonymizedDicomData.write();
  console.timeEnd('write');
  logToDiv(
    `Generated new P10 buffer with decompressed pixel data, size: ${humanFileSize(
      instance.image.dicomP10ArrayBuffer.byteLength
    )}`
  );
  return instance;
}
