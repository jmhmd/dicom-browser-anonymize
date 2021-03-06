import anonymizeDicomDataset from './anonymize/anonymizeDicomDataset';
import defaultScript from './anonymize/scripts/header-script.default';
import Instance from './Instance';

export default function anonymizeInstance(instance: Instance): Instance {
  const { dicomDataset } = instance.image;

  if (!dicomDataset) {
    throw new Error(`No dicom dataset found for instance with imageId: ${instance.imageId}`);
  }

  const { dicomDataset: anonymizedDicomData, logs } = anonymizeDicomDataset(
    dicomDataset,
    defaultScript
  );
  instance.image.anonymizedDicomData = anonymizedDicomData;
  instance.anonymizationLogs = logs;
  return instance;
}
