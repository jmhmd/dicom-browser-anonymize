export default interface NamedDicomDict {
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
}
