import cornerstone from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import dicomParser from 'dicom-parser';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as Hammer from 'hammerjs';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneTools.external.Hammer = Hammer;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstoneMath = cornerstoneMath;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.init();

cornerstoneTools.toolColors.setToolColor('#3DD0FC');
cornerstoneTools.toolColors.setActiveColor('#86d3f7');

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

export { cornerstoneTools, cornerstone, cornerstoneWADOImageLoader, cornerstoneMath };
