import DicomDict2 from './DicomDict2';

export default function (dicomDataset: DicomDict2) {
  const photoMetricInterpretation = dicomDataset.dict['00280004'].Value[0];
  return (
    photoMetricInterpretation === 'RGB' ||
    photoMetricInterpretation === 'PALETTE COLOR' ||
    photoMetricInterpretation === 'YBR_FULL' ||
    photoMetricInterpretation === 'YBR_FULL_422' ||
    photoMetricInterpretation === 'YBR_PARTIAL_422' ||
    photoMetricInterpretation === 'YBR_PARTIAL_420' ||
    photoMetricInterpretation === 'YBR_RCT' ||
    photoMetricInterpretation === 'YBR_ICT'
  );
}
