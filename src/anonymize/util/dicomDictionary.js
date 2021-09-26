import dcmjs from 'dcmjs';

/**
 * @typedef {import("./Dictionary").Dictionary} Dictionary
 */

/** @type {Dictionary} */
const dictionary = dcmjs.data.DicomMetaDictionary.dictionary;

const punctuateTag = dcmjs.data.DicomMetaDictionary.punctuateTag;
const unpunctuateTag = dcmjs.data.DicomMetaDictionary.unpunctuateTag;

/**
 * Namify numeric DICOM tag
 * @param {string} tag Tag (unpunctuated) to namify
 * @returns {string}
 */
export function tagToName(tag) {
  const punctuatedTag = punctuateTag(tag);
  const entry = dictionary[punctuatedTag];
  return entry?.name;
}

/**
 * Change namified DICOM tag to numeric (unpunctuated) tag
 * @param {string} name DICOM tag name to change to numeric tag
 * @returns {string | undefined}
 */
export function nameToTag(name) {
  const entry = Object.values(dictionary).find((e) => e.name === name);
  if (!entry) return undefined;
  const unpunctuatedTag = unpunctuateTag(entry.tag);
  return unpunctuatedTag;
}

/**
 * Get value representation for a tag (numeric unpunctuated)
 * @param {string} tag Tag (unpunctuated) to get VR for
 * @returns {string}
 */
export function getTagVr(tag) {
  const punctuatedTag = punctuateTag(tag);
  const entry = dictionary[punctuatedTag];
  return entry.vr;
}
