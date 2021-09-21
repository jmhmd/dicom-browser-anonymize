import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstone from 'cornerstone-core';
import dicomParser from 'dicom-parser';
import getPixelData from './wado-image-loader-mocks/getPixelData';
import createMetaDataProvider from './wado-image-loader-mocks/metaDataProvider';
import dataSetCacheManager from './wado-image-loader-mocks/dataSetCacheManager';

cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure();

cornerstoneWADOImageLoader.webWorkerManager.initialize({
  maxWebWorkers: 4,
  startWebWorkersOnDemand: true,
  webWorkerTaskPaths: [],
  taskConfiguration: {
    decodeTask: {
      initializeCodecsOnStartup: true,
      strict: true,
    },
  },
});

const { createImage } = cornerstoneWADOImageLoader;
const metaDataProvider = createMetaDataProvider(cornerstoneWADOImageLoader);
cornerstone.metaData.addProvider(metaDataProvider, 1);

export default async function decompressPixelData(dicomPart10ArrayBuffer: ArrayBuffer, frame = 0) {
  // console.log(cornerstoneWADOImageLoader);

  const byteArray = new Uint8Array(dicomPart10ArrayBuffer);

  let imagePromise;
  let dataSet: any;
  let imageId: string;

  try {
    dataSet = dicomParser.parseDicom(byteArray);

    imageId = 'image1';

    dataSetCacheManager.load(dataSet, imageId);

    const pixelData = getPixelData(dataSet, frame, cornerstoneWADOImageLoader);
    const transferSyntax = dataSet.string('x00020010');

    // console.log(pixelData);

    imagePromise = createImage(imageId, pixelData, transferSyntax, {});
  } catch (error) {
    console.error(error);
    throw error;
  }

  const image = await imagePromise;
  image.data = dataSet;
  image.sharedCacheKey = imageId;

  // console.log(image.imageFrame.pixelData);

  dataSetCacheManager.purge();

  return image;
}
