import { DicomDict2 } from './anonymize/util/modifyTag';
import ImageFrame, { TypedArray } from './ImageFrame';

export default interface Instance {
  imageId: string;
  image: {
    anonymizedDicomData?: DicomDict2;
    dicomDataset?: DicomDict2;
    imageFrame: ImageFrame;
    dicomP10ArrayBuffer: ArrayBuffer;
    decompressedPixelData: TypedArray;
    [key: string]: any;
  };
  anonymizationLogs?: { level: string; message: string }[];
}
