import { DicomDict2 } from './anonymize/util/modifyTag';
import ImageFrame, { TypedArray } from './ImageFrame';
import { LogLevel } from './logToDiv';

export default interface Instance {
  imageId: string;
  image: {
    originalFileName?: string;
    anonymizedDicomData?: DicomDict2;
    dicomDataset?: DicomDict2;
    imageFrame: ImageFrame;
    dicomP10ArrayBuffer: ArrayBuffer;
    decompressedPixelData: TypedArray;
    [key: string]: any;
  };
  anonymizationLogs?: { level: LogLevel; message: string }[];
  quarantine: false | { action: string; reason: string; attestNoPHI?: Date };
  remove?: boolean;
}
