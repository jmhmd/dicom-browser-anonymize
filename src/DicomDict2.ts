export default interface DicomDict2 {
  meta: {
    [key: string]: {
      Value: any;
      vr: string;
    };
  };
  dict: {
    [key: string]: {
      Value: any;
      vr: string;
    };
  };
  upsertTag: (tag: string, vr: string, value: any) => void;
  write: () => ArrayBuffer;
}
