import DicomDict2 from '../../DicomDict2';

export function removeTag(dicomDataset: DicomDict2, tag: string) {
  delete dicomDataset.dict[tag];
  return;
}

export function emptyTag(dicomDataset: DicomDict2, tag: string, vr: string) {
  dicomDataset.upsertTag(tag, vr, ['']);
  return;
}

export function replaceTag(dicomDataset: DicomDict2, tag: string, vr: string, value: any) {
  if (!Array.isArray(value)) {
    value = [value];
  }
  dicomDataset.upsertTag(tag, vr, value);
  return;
}
