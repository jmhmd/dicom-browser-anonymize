import Instance from './Instance';

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
