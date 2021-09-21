import humanFileSize from './humanFileSize';
import logToDiv from './logToDiv';
import fetchImageToArrayBuffer from './fetchImageToArrayBuffer';
import monitorMemory from './monitorMemory';
import dcmjs from 'dcmjs';
import DicomDict2 from './DicomDict2';
import knownTransferSyntax from './knownTransferSyntax';
import decompressPixelData from './decompress-pixel-data/decompressPixelData';
import getArrayBuffer from './get-array-buffer';
import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import anonymizeDicomDataset from './anonymize/anonymizeP10Buffer';

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

    try {
      // Parse DICOM
      dicomData = dcmjs.data.DicomMessage.readFile(fileArrayBuffer);

      // const naturalizedDicomData: NamedDicomDict = {
      //   meta: dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.meta),
      //   dict: dcmjs.data.DicomMetaDictionary.naturalizeDataset(dicomData.dict),
      // }
      console.log(dicomData);
      logToDiv('Parsed DICOM file');

      // Anonymize buffer headers
      const anonymizedDicomData = await anonymizeDicomDataset(
        dicomData,
        '/anonymizer-scripts/dicom-anonymizer.default.script'
      );

      // Decompress pixel data if necessary
      logToDiv(
        `Transfer syntax: ${knownTransferSyntax(anonymizedDicomData.meta['00020010'].Value[0])}`
      );
      const image = await decompressPixelData(fileArrayBuffer);
      const { pixelData: decompressedPixelData } = image.imageFrame;
      logToDiv(
        `Decompressed image, size: ${humanFileSize(decompressedPixelData.buffer.byteLength)}`
      );

      // Write decompressed pixel data to DICOM dataset, change transfer syntax
      const pixelDataArrayBuffer = getArrayBuffer(decompressedPixelData);
      anonymizedDicomData.upsertTag('7FE00010', 'OW', [pixelDataArrayBuffer]);
      anonymizedDicomData.upsertTag('00020010', 'UI', '1.2.840.10008.1.2'); // Transfer syntax to implicit little endian
      const decompressedPart10Buffer = anonymizedDicomData.write();
      logToDiv(
        `Generated new P10 buffer with decompressed pixel data, size: ${humanFileSize(
          decompressedPart10Buffer.byteLength
        )}`
      );
      // console.log(decompressedPart10Buffer);

      // Try to display image
      logToDiv('Displaying image...');
      const element = document.getElementById('image');
      cornerstone.enable(element);
      var viewport = cornerstone.getDefaultViewportForImage(element, image);
      cornerstone.displayImage(element, image, viewport);

      // Try to parse buffer
      const byteArray = new Uint8Array(decompressedPart10Buffer);
      dicomParser.parseDicom(byteArray);
      logToDiv('Successfully parsed generated P10 buffer');
    } catch (err) {
      logToDiv('Failed to process DICOM');
      console.error(err);
    }
  }
}

main();

// getHeaderAnonymizationScript('/anonymizer-scripts/dicom-anonymizer.default.script');

monitorMemory();
