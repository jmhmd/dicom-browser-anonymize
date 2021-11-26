import { getTagVr } from './dicomDictionary';
import DicomDict2 from '../../DicomDict2';

function isMetaGroup(tag: string) {
  return tag.substr(0, 4) === '0002';
}

/**
 * Remove a tag from the DICOM dataset
 * @param {DicomDict2} dicomDataset Parsed DICOM dataset
 * @param {string} tag Numeric unpunctuated DICOM tag
 * @returns {void}
 */
export function removeTag(dicomDataset: DicomDict2, tag: string) {
  if (dicomDataset.dict[tag]) {
    delete dicomDataset.dict[tag];
  } else if (dicomDataset.meta[tag]) {
    delete dicomDataset.meta[tag];
  } else {
    throw new Error(`Unable to remove tag ${tag}, not found in dataset dict or meta.`);
  }
  return;
}

/**
 * Empty a tag in the DICOM dataset
 * @param {DicomDict2} dicomDataset Parsed DICOM dataset
 * @param {string} tag Numeric unpunctuated DICOM tag
 * @param {string} vr Valur representation of the tag
 * @returns {void}
 */
export function emptyTag(dicomDataset: DicomDict2, tag: string, vr: string) {
  if (isMetaGroup(tag)) {
    if (dicomDataset.meta[tag]) {
      dicomDataset.meta[tag].Value = [''];
    } else {
      const vr = getTagVr(tag);
      dicomDataset.meta[tag] = { vr, Value: [''] };
    }
  } else {
    dicomDataset.upsertTag(tag, vr, ['']);
  }
  return;
}

/**
 * Replace or create a tag in the DICOM dataset
 * @param {DicomDict2} dicomDataset Parsed DICOM dataset
 * @param {string} tag Numeric unpunctuated DICOM tag
 * @param {string} vr Valur representation of the tag
 * @param {any} value Value to set for the tag
 * @returns {void}
 */
export function replaceTag(dicomDataset: DicomDict2, tag: string, vr: string, value: any) {
  if (!Array.isArray(value)) {
    value = [value];
  }
  if (isMetaGroup(tag)) {
    if (dicomDataset.meta[tag]) {
      dicomDataset.meta[tag].Value = value;
    } else {
      const vr = getTagVr(tag);
      dicomDataset.meta[tag] = { vr, Value: value };
    }
  } else {
    dicomDataset.upsertTag(tag, vr, value);
  }
  return;
}

/**
 *
 * @param {DicomDict2} dicomDataset
 * @param {string} tag
 * @param {any} value
 * @returns {void}
 */
export function addTag(dicomDataset: DicomDict2, tag: string, value: any) {
  const vr = getTagVr(tag);
  if (!vr) {
    throw new Error(`Could not find matching entry in dictionary for tag ${tag}`);
  }
  replaceTag(dicomDataset, tag, vr, value);
}
