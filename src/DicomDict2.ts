export default interface DicomDict2 {
  meta: {
    [key: number]: {
      Value: any;
      vr: string;
    };
  };
  dict: {
    [key: number]: {
      Value: any;
      vr: string;
    };
  };
  upsertTag: (tag: string, vr: string, value: any) => void;
  write: () => ArrayBuffer;
}
