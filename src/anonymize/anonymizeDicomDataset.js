import { removeTag } from './util/modifyTag';
import shouldPreserve from './util/shouldPreserveElement';
import isPrivateGroup from './util/isPrivateGroup';
import basicScript from './scripts/header-script.DICOM-PS3.15-Basic';
import processRule from './processRule';
import mergeScripts from './util/mergeScripts';

/**
 * @typedef { import("../DicomDict2").default } DicomDict2
 * @typedef { import("./Script").default} Script
 */

/**
 * Anonymize a parsed dicom dataset
 * @param {DicomDict2} dicomDataset
 * @param {Script} anonymizationScript
 * @returns {Promise<DicomDict2>}
 */
export default async function anonymizeDicomDataset(dicomDataset, anonymizationScript) {
  const script = mergeScripts(basicScript, anonymizationScript);

  // Loop through all element rules and execute
  for (const rule of script.rules) {
    processRule(rule, script, dicomDataset);
  }

  // Loop through all remaining elements and clean up
  const ruleTags = script.rules.map((r) => r.tag);
  for (const tag of Object.keys(dicomDataset.dict)) {
    const datasetElement = dicomDataset.dict[tag];

    // If already processed by rules in script, skip
    if (ruleTags.includes(tag)) {
      continue;
    }

    // Remove private groups if option set
    if (isPrivateGroup(tag) && script.options.removePrivateGroups) {
      removeTag(dicomDataset, tag);
      continue;
    }

    // Remove all sequences
    if (datasetElement.vr === 'SQ') {
      removeTag(dicomDataset, tag);
      continue;
    }

    if (!shouldPreserve(script.options, tag)) {
      removeTag(dicomDataset, tag);
      continue;
    }
  }

  return dicomDataset;
}
