import DicomDict2 from './DicomDict2';
import { nameToTag } from './anonymize/util/dicomDictionary';

function elementFromName(dicomDataset: DicomDict2, tagName: string) {
  const tag = nameToTag(tagName);
  if (!tag) return undefined;
  return dicomDataset.dict[tag];
}

function tagContainsIgnoreCase(tag: DicomDict2['dict'][0] | undefined, value: string) {
  if (!tag) return false;
  let tagString = tag.Value.map((t) => t.toString().toLowerCase()).join(' ');
  return tagString.includes(value.toLowerCase());
}

function tagIsSet(tag: DicomDict2['dict'][0] | undefined) {
  if (!tag?.Value[0] || tag.Value[0].toString().toLowerCase() === '') return false;
  return true;
}

function hasPHIRisk(dicomDataset: DicomDict2) {
  if (
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'BurnedInAnnotation'), 'YES') ||
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'ImageType'), 'SAVE') ||
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'SeriesDescription'), 'SAVE') ||
    tagIsSet(elementFromName(dicomDataset, 'DateOfSecondaryCapture')) ||
    tagIsSet(elementFromName(dicomDataset, 'SecondaryCaptureDeviceManufacturer')) ||
    tagIsSet(elementFromName(dicomDataset, 'SecondaryCaptureDeviceManufacturerModelName')) ||
    tagIsSet(elementFromName(dicomDataset, 'SecondaryCaptureDeviceSoftwareVersions')) ||
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'ConversionType'), 'SI') ||
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'ConversionType'), 'SD') ||
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'ConversionType'), 'WSD') ||
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'Modality'), 'OT')
  ) {
    return true;
  }
  return false;
}

function isDisallowed(dicomDataset: DicomDict2) {
  if (
    tagContainsIgnoreCase(
      elementFromName(dicomDataset, 'SOPClassUID'),
      '1.2.840.10008.5.1.4.1.1.3.1'
    ) // UltrasoundMultiframeImageStorage
  ) {
    return 'SOPClass UltrasoundMultiframeImageStorage not supported at this time.';
  } else if (
    tagContainsIgnoreCase(elementFromName(dicomDataset, 'ImageType'), 'SBI') // Spectral Base Image
  ) {
    return 'ImageType SBI (Spectral Base Image) not supported at this time.';
  }
  return false;
}

export default function shouldQuarantine(dicomDataset: DicomDict2) {
  const disallowed = isDisallowed(dicomDataset);
  if (disallowed) {
    return {
      action: 'fail',
      reason: disallowed,
    };
  }

  if (hasPHIRisk(dicomDataset)) {
    return {
      action: 'quarantine',
      reason: 'Image has DICOM headers that flagged the image for risk of burned in PHI',
    };
  }

  return false;
}
