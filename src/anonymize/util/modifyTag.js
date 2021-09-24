/**
 * @typedef {import("../../DicomDict2").default} DicomDict2
 */

/**
 * Remove a tag from the DICOM dataset
 * @param {DicomDict2} dicomDataset Parsed DICOM dataset
 * @param {string} tag Numeric unpunctuated DICOM tag
 * @returns {void}
 */
export function removeTag(dicomDataset, tag) {
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
export function emptyTag(dicomDataset, tag, vr) {
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
export function replaceTag(dicomDataset, tag, vr, value) {
  if (!Array.isArray(value)) {
    value = [value];
  }
  dicomDataset.upsertTag(tag, vr, value);
  return;
}
