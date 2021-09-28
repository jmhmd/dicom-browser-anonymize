import { DicomDict2 } from './anonymize/util/modifyTag';
import ImageFrame, { TypedArray } from './ImageFrame';

export interface Instance {
  imageId: string;
  image: {
    anonymizedDicomData?: DicomDict2;
    dicomDataset?: DicomDict2;
    imageFrame: ImageFrame;
    dicomP10ArrayBuffer: ArrayBuffer;
    decompressedPixelData: TypedArray;
    [key: string]: any;
  };
  anonymizationLogs?: { logLevel: string; message: string }[];
}

export default interface Series {
  seriesInstanceUID: string;
  seriesDescription?: string;
  modality?: string;
  instances: Instance[];
  redactionBoxes?: any[];
  quarantined?: { imageId: string; reason?: string; remove?: boolean }[];
  userRemoved?: { imageId: string }[];
  reviewed?: Date;
}
