import { getTagVr } from './dicomDictionary';
import DicomDict2 from '../../DicomDict2';

/**
 * Remove a tag from the DICOM dataset
 * @param {DicomDict2} dicomDataset Parsed DICOM dataset
 * @param {string} tag Numeric unpunctuated DICOM tag
 * @returns {void}
 */
export function removeTag(dicomDataset: DicomDict2, tag: string) {
  delete dicomDataset.dict[tag];
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
  dicomDataset.upsertTag(tag, vr, ['']);
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
  dicomDataset.upsertTag(tag, vr, value);
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
