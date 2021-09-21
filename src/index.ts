import humanFileSize from './humanFileSize';
import logToDiv from './logToDiv';
import fetchImageToArrayBuffer from './fetchImageToArrayBuffer';
import monitorMemory from './monitorMemory';
import dcmjs from 'dcmjs';
import DicomDict2 from './DicomDict2';
import NamedDicomDict from './NamedDicomDict';
import knownTransferSyntax from './knownTransferSyntax';
import decompressPixelData from './decompress-pixel-data/decompressPixelData';
import getArrayBuffer from './get-array-buffer';
import cornerstone from 'cornerstone-core';

// For use later testing multiple files
document.getElementById('input-files')?.addEventListener('change', (event) => {
  const fileList = (event.target as HTMLInputElement).files;
});

export default async function main() {
  const fileUrlInput = document.getElementById('test-file');
  const fileUrl = (fileUrlInput as HTMLInputElement).value;
  const fileArrayBuffers: ArrayBuffer[] = [];

  if (fileUrl) {
    fileArrayBuffers[0] = await fetchImageToArrayBuffer(fileUrl);
    logToDiv(`Fetched file, size: ${humanFileSize(fileArrayBuffers[0].byteLength)}`);
  }
  for (const fileArrayBuffer of fileArrayBuffers) {
    let dicomData: DicomDict2;
    let namedDicomData: NamedDicomDict;

    try {
      // Parse DICOM
      dicomData = dcmjs.data.DicomMessage.readFile(fileArrayBuffer);
      namedDicomData = {
        meta: dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.meta),
        dict: dcmjs.data.DicomMetaDictionary.namifyDataset(dicomData.dict),
      };
      // const naturalizedDicomData: NamedDicomDict = {
      //   meta: dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.meta),
      //   dict: dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict),
      // }
      console.log(dicomData);
      logToDiv('Parsed DICOM file');

      // Decompress pixel data if necessary
      logToDiv(
        `Transfer syntax: ${knownTransferSyntax(namedDicomData.meta.TransferSyntaxUID.Value[0])}`
      );
      const image = await decompressPixelData(fileArrayBuffer);
      const { pixelData: decompressedPixelData } = image.imageFrame;
      logToDiv(`Decompressed image, size: ${humanFileSize(decompressedPixelData.length)}`);

      // Write decompressed pixel data to DICOM dataset, change transfer syntax
      const pixelDataArrayBuffer = getArrayBuffer(decompressedPixelData);
      dicomData.upsertTag('7FE00010', 'OW', [pixelDataArrayBuffer]);
      dicomData.upsertTag('00020010', 'UI', '1.2.840.10008.1.2');
      const decompressedPart10Buffer = dicomData.write();
      console.log(decompressedPart10Buffer);

      // Try to display image
      const element = document.getElementById('image');
      cornerstone.enable(element);
      var viewport = cornerstone.getDefaultViewportForImage(element, image);
      cornerstone.displayImage(element, image, viewport);
    } catch (err) {
      logToDiv('Failed to process DICOM');
      console.error(err);
    }
  }
}

main();

monitorMemory();
