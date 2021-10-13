import logToDiv from './logToDiv';
// import monitorMemory from './monitorMemory';
import dcmjs from 'dcmjs';
import DicomDict2 from './DicomDict2';

import { cornerstone, cornerstoneWADOImageLoader } from './cornerstone/cornerstone-setup.js';

import Study from './Study';
import { Ref } from 'vue';
import aTick from './aTick';
import shouldQuarantine from './shouldQuarantine';

export default async function loadImages(
  imageSources: { urls?: string[]; files?: FileList },
  studies: Ref<Study[]>,
  loadStatus: Ref
) {
  const { urls, files } = imageSources;
  let cornerstoneImageObjects: any[] = [];

  if (urls) {
    for (const url of urls) {
      const imageId = `wadouri:${url}`;
      loadStatus.value.status = `Loading image: ${imageId}...`;
      const image = await cornerstone.loadAndCacheImage(imageId);
      image.dicomP10ArrayBuffer = image.data.byteArray.buffer;
      image.decompressedPixelData = image.imageFrame.pixelData;
      cornerstoneImageObjects.push(image);
      loadStatus.value.status = `Loading image: ${imageId}... done`;
    }
  }
  if (files) {
    for (const file of Array.from(files)) {
      try {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        loadStatus.value.status = `Loading image: ${imageId}`;
        const image = await cornerstone.loadAndCacheImage(imageId);
        image.dicomP10ArrayBuffer = image.data.byteArray.buffer;
        image.decompressedPixelData = image.imageFrame.pixelData;
        image.originalFileName = file.name;
        cornerstoneImageObjects.push(image);
        loadStatus.value.status = `Loading image: ${imageId}... done`;
      } catch (err) {
        console.error(err);
      }
    }
  }
  loadStatus.value.status = `Loaded: ${cornerstoneImageObjects.length} images.`;

  for (const [index, image] of cornerstoneImageObjects.entries()) {
    await aTick();
    logToDiv(`Processing image ${index + 1} of ${cornerstoneImageObjects.length}`);
    let dicomData: DicomDict2;
    const { dicomP10ArrayBuffer } = image;

    try {
      // Parse DICOM
      console.time('parse');
      dicomData = dcmjs.data.DicomMessage.readFile(dicomP10ArrayBuffer);
      console.timeEnd('parse');

      console.log(JSON.parse(JSON.stringify(dicomData)));
      logToDiv('Parsed DICOM file');
      image.dicomDataset = dicomData;

      // Check if image should be quarantined
      const quarantine = shouldQuarantine(image.dicomDataset);

      if (quarantine && quarantine.action === 'fail') {
        loadStatus.value.messages.push(
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
      }
    } catch (err) {
      logToDiv('Failed to process DICOM');
      console.error(err);
    }
  }

  // Sort series instances by instanceNumber
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
}
