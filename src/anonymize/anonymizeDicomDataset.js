import { removeTag } from './util/modifyTag';
import shouldPreserve from './util/shouldPreserveElement';
import isPrivateGroup from './util/isPrivateGroup';
import basicScript from './scripts/header-script.DICOM-PS3.15-Basic';
import processRule from './processRule';
import mergeScripts from './util/mergeScripts';
import { clearLogs, getLogs, log } from './util/logger';

/**
 * @typedef { import("../DicomDict2").default } DicomDict2
 * @typedef { import("./Script").default} Script
 */

/**
 * Anonymize a parsed dicom dataset
 * @param {DicomDict2} dicomDataset
 * @param {Script} anonymizationScript
 */
export default function anonymizeDicomDataset(dicomDataset, anonymizationScript) {
  const script = mergeScripts(basicScript, anonymizationScript);

  // Loop through all element rules and execute
  for (const rule of script.rules) {
    try {
      processRule(rule, script, dicomDataset);
    } catch (error) {
      log('error', `Failed to process rule: ${JSON.stringify(rule)}`);
      // console.error(`Failed to process rule: ${JSON.stringify(rule)}`);
      throw error;
    }
  }

  // Loop through all remaining elements and clean up
  const ruleTags = script.rules.map((r) => r.tag);
  for (const tag of Object.keys(dicomDataset.dict)) {
    const datasetElement = dicomDataset.dict[tag] || dicomDataset.meta[tag];

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
    if (datasetElement.vr === 'SQ' && script.options.sequenceAction === 'remove') {
      removeTag(dicomDataset, tag);
      continue;
    }

    if (!shouldPreserve(script.options, tag)) {
      removeTag(dicomDataset, tag);
      continue;
    }
  }

  const logs = JSON.parse(JSON.stringify(getLogs()));
  clearLogs();
  return { dicomDataset, logs };
}
