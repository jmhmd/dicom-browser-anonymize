import { fetchHeaderAnonymizationRules } from './readAnonymizationScripts';
import { emptyTag, removeTag, replaceTag } from './util/modifyTag';
import parseParams from './util/parseParams';
import anonFunctions from './functions';
import getOptionsFromScript from './util/getOptionsFromScript';
import shouldPreserve from './util/shouldPreserveElement';
import { getTagVr } from './util/dictionary.js';
import isPrivateGroup from './util/isPrivateGroup';

/**
 * @typedef { import("../DicomDict2").default } DicomDict2
 * @typedef { import("./util/AnonymizerOptions").default } AnonymizerOptions
 */

/**
 * Anonymize a parsed dicom dataset
 * @param {DicomDict2} dicomDataset
 * @param {string} anonymizationScriptUrl
 * @param {AnonymizerOptions} passedOptions
 * @returns {Promise<DicomDict2>}
 */
export default async function anonymizeDicomDataset(
  dicomDataset,
  anonymizationScriptUrl,
  passedOptions = {
    removeUnchecked: false,
    removePrivateGroups: true,
    removeOverlays: true,
    removeCurves: true,
    keepGroup0018: true,
    keepGroup0020: true,
    keepGroup0028: true,
  }
) {
  const anonymizationRules = await fetchHeaderAnonymizationRules(anonymizationScriptUrl);

  // Options from script
  const scriptOptions = getOptionsFromScript(anonymizationRules);
  // Set final options
  const options = Object.assign(scriptOptions, passedOptions);

  // Loop through all element rules and execute
  const elementRules = anonymizationRules.filter((r) => r.type === 'e');
  for (const rule of elementRules) {
    let datasetElement = dicomDataset.dict[rule.tag];

    // If rule not enabled (unchecked), remove or skip depending on option setting
    if (rule.en !== 'T') {
      if (options.removeUnchecked === true && !shouldPreserve(options, rule.tag, rule)) {
        removeTag(dicomDataset, rule.tag);
      } else {
        continue;
      }
    }

    // Get function name (i.e. 'hashuid' from '@hashuid($UIDROOT, this)')
    const anonFunctionNameMatch = rule?.value?.match(/@(\S+)\(/);
    const anonFunctionName = anonFunctionNameMatch ? anonFunctionNameMatch[1] : undefined;
    // const anonFunction = anonFunctionName
    //   ? (anonFunctions as { [key: string]: Function })[anonFunctionName]
    //   : undefined;

    // If rule exists but no function defined, leave alone
    if (!anonFunctionName || !rule.value || rule.value === '') {
      console.warn(`Rule for tag ${rule.tag} has no function defined, skipping.`);
      continue;
    }

    // TODO: Implement @require to add elements that don't exist
    if (!datasetElement && ['append', 'require', 'always']) {
      console.log(`Tag ${rule.tag} not contained in dicom dataset.`);
      continue;
    }
    const datasetValue =
      datasetElement.Value.length === 1 ? datasetElement.Value[0] : datasetElement.Value;

    if (anonFunctionName) {
      // Process function
      try {
        const resolvedAnonFunctionParams = parseParams(rule, anonymizationRules, dicomDataset);

        if (anonFunctionName === 'empty') {
          emptyTag(dicomDataset, rule.tag, datasetElement.vr);
          continue;
        }

        if (anonFunctionName === 'keep') {
          continue;
        }

        if (anonFunctionName === 'remove') {
          removeTag(dicomDataset, rule.tag);
          continue;
        }

        if (anonFunctionName === 'hashuid') {
          if (!datasetValue) {
            emptyTag(dicomDataset, rule.tag, datasetElement.vr);
            continue;
          }
          const [root, value] = resolvedAnonFunctionParams;
          const newValue = anonFunctions.hashuid(root, value);
          replaceTag(dicomDataset, rule.tag, datasetElement.vr, newValue);
          continue;
        }

        if (anonFunctionName === 'hash') {
          if (!datasetValue) {
            emptyTag(dicomDataset, rule.tag, datasetElement.vr);
            continue;
          }
          const [value, maxChars] = resolvedAnonFunctionParams;
          const newValue = anonFunctions.hash(value, maxChars);
          replaceTag(dicomDataset, rule.tag, datasetElement.vr, newValue);
          continue;
        }

        if (anonFunctionName === 'hashdate') {
          if (!datasetValue) {
            emptyTag(dicomDataset, rule.tag, datasetElement.vr);
            continue;
          }
          const [dateValue, hashDateValue] = resolvedAnonFunctionParams;
          const newValue = anonFunctions.hashdate(dateValue, hashDateValue);
          replaceTag(dicomDataset, rule.tag, datasetElement.vr, newValue);
          continue;
        }

        if (anonFunctionName === 'require') {
          const [valueIfNotExists, defaultValue] = resolvedAnonFunctionParams;
          const existingElement = dicomDataset.dict[rule.tag];
          if (existingElement) {
            continue;
          }
          const newElementVr = getTagVr(rule.tag);
          const newElementValue = valueIfNotExists || defaultValue || '';
          replaceTag(dicomDataset, rule.tag, newElementVr, newElementValue);
        }

        if (anonFunctionName === 'append') {
        }

        console.warn(
          `Function ${rule.value} is not yet supported. Emptying tag for safety. Use '@keep()' if you would like to keep this field value.`
        );
        emptyTag(dicomDataset, rule.tag, datasetElement.vr);
      } catch (error) {
        console.warn(`Error processing tag '${rule.tag}, emptying for safety.\n${error}`);
        emptyTag(dicomDataset, rule.tag, datasetElement.vr);
      }
    }
  }

  // Loop through all remaining elements and clean up
  const ruleTags = anonymizationRules.map((r) => r.tag);
  for (const tag of Object.keys(dicomDataset.dict)) {
    const datasetElement = dicomDataset.dict[tag];

    // If already processed by rules in script, skip
    if (ruleTags.includes(tag)) {
      continue;
    }

    // Remove private groups if option set
    if (isPrivateGroup(tag) && options.removePrivateGroups) {
      removeTag(dicomDataset, tag);
      continue;
    }

    // Remove all sequences
    if (datasetElement.vr === 'SQ') {
      removeTag(dicomDataset, tag);
      continue;
    }

    if (!shouldPreserve(options, tag)) {
      removeTag(dicomDataset, tag);
      continue;
    }
  }

  return dicomDataset;
}
