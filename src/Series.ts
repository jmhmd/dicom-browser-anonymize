import Instance from './Instance';

export default interface Series {
  seriesInstanceUID: string;
  seriesDescription?: string;
  modality?: string;
  instances: Instance[];
  redactionBoxes?: any[];
  userRemoved?: { imageId: string }[];
  reviewed?: Date;
}
