/**
 * Check if a tag is a private group
 * @param {string} tag Numeric unpunctuated DICOM tag to check
 * @returns {boolean}
 */
export default function isPrivateGroup(tag: string) {
  return parseInt(tag.substr(3, 1), 10) % 2 === 1;
}
