import anonymizeDicomDataset from './anonymize/anonymizeDicomDataset';
import defaultScript from './anonymize/scripts/header-script.default';
import logToDiv from './logToDiv';
import Instance from './Instance';

export default function anonymizeInstance(instance: Instance): Instance {
  const { dicomDataset } = instance.image;

  if (!dicomDataset) {
    throw new Error(`No dicom dataset found for instance with imageId: ${instance.imageId}`);
  }

  console.time('anon');
  const { dicomDataset: anonymizedDicomData, logs } = anonymizeDicomDataset(
    dicomDataset,
    defaultScript
  );
  instance.image.anonymizedDicomData = anonymizedDicomData;
  instance.anonymizationLogs = logs;
  console.timeEnd('anon');
  logToDiv('Anonymized headers');
  return instance;
}
