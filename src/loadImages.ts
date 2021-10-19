import { addLog, updateStatus } from './logger';
// import monitorMemory from './monitorMemory';
import dcmjs from 'dcmjs';
import DicomDict2 from './DicomDict2';

import { cornerstone, cornerstoneWADOImageLoader } from './cornerstone/cornerstone-setup.js';

import Study from './Study';
import { Ref } from 'vue';
import aTick from './aTick';
import shouldQuarantine from './shouldQuarantine';

export default async function loadImages(
  imageSources: { urls?: string[]; files?: File[] },
  studies: Ref<Study[]>
) {
  const { urls, files } = imageSources;
  let cornerstoneImageObjects: any[] = [];
  let urlsAndFiles: (string | File)[] = [];

  if (urls) {
    urlsAndFiles = urlsAndFiles.concat(urls);
  }
  if (files) {
    urlsAndFiles = urlsAndFiles.concat(files);
  }

  for (const urlOrFile of urlsAndFiles) {
    let imageId: string;
    let file: File | undefined = undefined;

    if (typeof urlOrFile === 'string') {
      imageId = `wadouri:${urlOrFile}`;
    } else {
      file = urlOrFile;
      imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    }

    updateStatus(`Loading image: ${imageId}`);

    try {
      const image = await cornerstone.loadAndCacheImage(imageId);
      image.dicomP10ArrayBuffer = image.data.byteArray.buffer;
      image.decompressedPixelData = image.imageFrame.pixelData;
      if (file) {
        image.originalFileName = file.name;
      }
      cornerstoneImageObjects.push(image);
      updateStatus(`Loading image: ${imageId}... done`);
      addLog(
        'info',
        `${imageId}${file ? ` (${file.name})` : ''}: Successfully parsed DICOM part 10`
      );
    } catch (err: any) {
      if (err?.error?.message && typeof err.error.message === 'string') {
        addLog(
          'error',
          `Error parsing file ${imageId}${file ? ` (${file.name})` : ''}: ${err.error.message}`
        );
      }
      console.error(err);
    }
  }

  updateStatus(`Loaded: ${cornerstoneImageObjects.length} images.`);

  for (const [index, image] of cornerstoneImageObjects.entries()) {
    await aTick();
    let dicomData: DicomDict2;
    const { dicomP10ArrayBuffer } = image;

    try {
      // Parse DICOM
      dicomData = dcmjs.data.DicomMessage.readFile(dicomP10ArrayBuffer);

      image.dicomDataset = dicomData;

      // Check if image should be quarantined
      const quarantine = shouldQuarantine(image.dicomDataset);

      // If quarantine check results in 'fail' action, don't further process the file
      if (quarantine && quarantine.action === 'fail') {
        addLog(
          'error',
          `Failed to load image "${image.originalFileName || image.imageId}": ${quarantine.reason}`
        );
      } else {
        // Sort into Study & Series
        const studyInstanceUID = dicomData.dict['0020000D']?.Value[0];
        const studyDescription = dicomData.dict['00081030']?.Value[0];

        let study = studies.value.find((s) => s.studyInstanceUID === studyInstanceUID);
        if (!study) {
          study = {
            studyInstanceUID,
            studyDescription,
            series: [],
          };
          studies.value.push(study);
        }
        const seriesInstanceUID = dicomData.dict['0020000E']?.Value[0];
        const seriesDescription = dicomData.dict['0008103E']?.Value[0];
        const modality = dicomData.dict['00080060']?.Value[0];
        let series = study.series.find((s) => s.seriesInstanceUID === seriesInstanceUID);
        if (!series) {
          series = {
            seriesInstanceUID,
            seriesDescription,
            modality,
            instances: [],
          };
          study.series.push(series);
        }

        series.instances.push({
          imageId: image.imageId,
          image,
          quarantine,
        });

        addLog('info', `Parsed DICOM dataset for file ${image.originalFileName || image.imageId}`);
      }
    } catch (err: any) {
      const errMessage = err.message || err.error?.message;
      if (errMessage && typeof errMessage === 'string') {
        addLog(
          'error',
          `Error parsing file ${image.originalFileName || image.imageId} with dcmjs: ${errMessage}`
        );
      }
      console.error(err);
    }
  }

  updateStatus(`Parsed: ${cornerstoneImageObjects.length} images.`);

  // Sort series instances by instanceNumber
  updateStatus(`Sorting images...`);
  for (const study of studies.value) {
    for (const series of study.series) {
      series.instances.sort((a, b) => {
        if (!a.image.dicomDataset || !b.image.dicomDataset) return 0;
        const aInstanceNumber = parseInt(
          a.image.dicomDataset.dict['00200013'].Value[0] as string,
          10
        );
        const bInstanceNumber = parseInt(
          b.image.dicomDataset.dict['00200013'].Value[0] as string,
          10
        );
        return aInstanceNumber - bInstanceNumber;
      });
    }
  }
  updateStatus(`Sorting images... done.`);
}
