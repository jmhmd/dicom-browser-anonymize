export default function getPixelData(
  dataSet: any,
  frameIndex = 0,
  cornerstoneWADOImageLoader: any
) {
  const { getEncapsulatedImageFrame, getUncompressedImageFrame } =
    cornerstoneWADOImageLoader.wadouri;

  const pixelDataElement = dataSet.elements.x7fe00010 || dataSet.elements.x7fe00008;

  if (!pixelDataElement) {
    return null;
  }

  if (pixelDataElement.encapsulatedPixelData) {
    return getEncapsulatedImageFrame(dataSet, frameIndex);
  }

  return getUncompressedImageFrame(dataSet, frameIndex);
}
