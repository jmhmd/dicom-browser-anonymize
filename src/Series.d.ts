export default interface Series {
  instances: {
    imageId: string;
    image: any;
  }[];
  redactionBoxes?: any[];
  quarantined?: { imageId: string; reason?: string; remove?: boolean }[];
  userRemoved?: { imageId: string }[];
  reviewed?: Date;
}
