import getArrayBuffer from './get-array-buffer.js';
import humanFileSize from './humanFileSize.js';
import Instance from './Instance.js';
import isColorImage from './isColorImage';
import { addLog } from './logger';

export default function writeInstanceToBuffer(instance: Instance) {
  const { anonymizedDicomData } = instance.image;
  if (!anonymizedDicomData) {
    throw new Error(
      `Instance has not been successfully anonymized. Instance ${JSON.stringify(instance)}`
    );
  }

  // TODO: #1 Find out why writing to implicit LE doesn't work correctly
  anonymizedDicomData.meta['00020010'].Value = ['1.2.840.10008.1.2.1']; // Transfer syntax to explicit little endian
  let pixelDataArrayBuffer = getArrayBuffer(instance.image.imageFrame.pixelData);

  if (isColorImage(anonymizedDicomData)) {
    anonymizedDicomData.upsertTag('00280004', 'CS', ['RGB']);
    anonymizedDicomData.upsertTag('00280002', 'US', [3]);
    // Edit pixel data array to remove alpha channel
    const pixelArray = instance.image.imageFrame.pixelData;
    const newPixelArray = new Uint8Array(pixelArray.length * 0.75);
    let targetPosition = 0;
    for (let srcPosition = 0; srcPosition < pixelArray.length; srcPosition += 1) {
      if ((srcPosition + 1) % 4 === 0) {
        continue;
      }
      newPixelArray[targetPosition] = pixelArray[srcPosition];
      targetPosition += 1;
    }
    pixelDataArrayBuffer = newPixelArray.buffer;
  }

  anonymizedDicomData.upsertTag('7FE00010', 'OW', [pixelDataArrayBuffer]); // Set new pixel data
  instance.image.dicomP10ArrayBuffer = anonymizedDicomData.write();
  addLog(
    'info',
    `${
      instance.imageId
    }: Generated new P10 buffer with decompressed pixel data, size: ${humanFileSize(
      instance.image.dicomP10ArrayBuffer.byteLength
    )}`
  );
  return instance;
}
