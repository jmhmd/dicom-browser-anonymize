import humanFileSize from './humanFileSize';
import logToDiv from './logToDiv';
// import monitorMemory from './monitorMemory';
import dcmjs from 'dcmjs';
import DicomDict2 from './DicomDict2';
import knownTransferSyntax from './knownTransferSyntax';
import getArrayBuffer from './get-array-buffer';
import anonymizeDicomDataset from './anonymize/anonymizeDicomDataset';
import defaultScript from './anonymize/scripts/header-script.default';

import { cornerstone, cornerstoneWADOImageLoader } from './cornerstone/cornerstone-setup.js';

import Study from './Study';
import { Ref } from 'vue';

// For use later testing multiple files
// document.getElementById('input-files')?.addEventListener('change', (event) => {
//   const fileList = (event.target as HTMLInputElement).files;
// });

export default async function loadImages(
  imageSources: { urls?: string[]; files?: FileList },
  studies: Ref<Study[]>
) {
  const { urls, files } = imageSources;
  let cornerstoneImageObjects: any[] = [];

  if (urls) {
    for (const url of urls) {
      const imageId = `wadouri:${url}`;
      const image = await cornerstone.loadAndCacheImage(imageId);
      image.dicomP10ArrayBuffer = image.data.byteArray.buffer;
      image.decompressedPixelData = image.imageFrame.pixelData;
      cornerstoneImageObjects.push(image);
    }
  }
  if (files) {
    for (const file of Array.from(files)) {
      const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      const image = await cornerstone.loadAndCacheImage(imageId);
      image.dicomP10ArrayBuffer = image.data.byteArray.buffer;
      image.decompressedPixelData = image.imageFrame.pixelData;
      cornerstoneImageObjects.push(image);
    }
  }

  for (const [index, image] of cornerstoneImageObjects.entries()) {
    logToDiv(`Processing image ${index + 1} of ${cornerstoneImageObjects.length}`);
    let dicomData: DicomDict2;
    const { dicomP10ArrayBuffer, decompressedPixelData } = image;

    try {
      // Parse DICOM
      console.time('parse');
      dicomData = dcmjs.data.DicomMessage.readFile(dicomP10ArrayBuffer);
      console.timeEnd('parse');

      console.log(JSON.parse(JSON.stringify(dicomData)));
      logToDiv('Parsed DICOM file');
      image.dicomDataset = dicomData;

      // Sort into Study & Series
      const studyInstanceUID = dicomData.dict['0020000D'].Value[0];
      const studyDescription = dicomData.dict['00081030'].Value[0];
      let study = studies.value.find((s) => s.studyInstanceUID === studyInstanceUID);
      if (!study) {
        study = {
          studyInstanceUID,
          studyDescription,
          series: [],
        };
        studies.value.push(study);
      }
      const seriesInstanceUID = dicomData.dict['0020000E'].Value[0];
      const seriesDescription = dicomData.dict['0008103E'].Value[0];
      const modality = dicomData.dict['00080060'].Value[0];
      let series = study.series.find((s) => s.seriesInstanceUID === seriesInstanceUID);
      if (!series) {
        series = {
          seriesInstanceUID,
          seriesDescription,
          modality,
          instances: [],
        };
      }
      series.instances.push({
        imageId: image.imageId,
        image,
      });
      study.series.push(series);

      // Write decompressed pixel data to DICOM dataset, change transfer syntax
      const pixelDataArrayBuffer = getArrayBuffer(decompressedPixelData);
      anonymizedDicomData.meta['00020010'].Value = ['1.2.840.10008.1.2']; // Transfer syntax to implicit little endian
      // anonymizedDicomData.upsertTag('00020010', 'UI', ['1.2.840.10008.1.2']); // Transfer syntax to implicit little endian
      anonymizedDicomData.upsertTag('7FE00010', 'OW', [pixelDataArrayBuffer]);
      console.time('write');
      const decompressedPart10Buffer = anonymizedDicomData.write();
      console.timeEnd('write');
      logToDiv(
        `Generated new P10 buffer with decompressed pixel data, size: ${humanFileSize(
          decompressedPart10Buffer.byteLength
        )}`
      );
      // console.log(decompressedPart10Buffer);

      // Try to parse buffer
      // const byteArray = new Uint8Array(decompressedPart10Buffer);
      // dicomParser.parseDicom(byteArray);
      // logToDiv('Successfully parsed generated P10 buffer');

      // Make file available for download
      // document.getElementById('download-file')?.addEventListener('click', () => {
      //   var blob = new Blob([decompressedPart10Buffer], { type: 'application/dicom' });
      //   var link = document.createElement('a');
      //   link.href = window.URL.createObjectURL(blob);
      //   var fileName = 'anonymized-dicom-file';
      //   link.download = fileName;
      //   link.click();
      // });
    } catch (err) {
      logToDiv('Failed to process DICOM');
      console.error(err);
    }
  }
}

// function main() {
//   const fileUrlInput = document.getElementById('test-file');
//   const fileUrl = (fileUrlInput as HTMLInputElement).value;
//   loadImages({ urls: [fileUrl] });
// }

// main();

// // getHeaderAnonymizationScript('/anonymizer-scripts/dicom-anonymizer.default.script');

// monitorMemory();
