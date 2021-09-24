import { nameToTag } from './dictionary.js';
import getScriptParameter from './getScriptParameter.js';

/** @type {string[]} */
let elementNames;

/**
 * @typedef {import("../readAnonymizationScripts.js").AnonymizationRule} AnonymizationRule
 * @typedef {import("../../DicomDict2").default} DicomDict2
 */

/**
 * Resolve parameters from a function string/script in the anonymization script
 * @param {AnonymizationRule} rule Anonymization rule
 * @param {AnonymizationRule[]} anonymizationRules All parsed anonymization rules (for looking up script parameters)
 * @param {DicomDict2} dicomDataset Parsed dicom dataset
 * @returns {string[]}
 */
function resolveParams(rule, anonymizationRules, dicomDataset) {
  if (!rule.value) {
    return [];
  }

  // Capture up to 4 parameters from function string
  const paramMatch = rule.value.match(/\(([^,]+)(?:,([^,]+))?(?:,([^,]+))?(?:,([^,]+))?\)/);
  if (!paramMatch) {
    return [];
  }

  let [, ...params] = paramMatch;
  params = params.filter((p) => p); // Unmatched extra capturing groups in regex will return 'undefined'

  // Resolve any variables, i.e. 'this', '@UIDROOT', 'PatientID'
  const resolvedParams = params.map((param) => {
    // If root is a script parameter, retrieve it
    if (param.substr(0, 1) === '@') {
      return getScriptParameter(param, anonymizationRules);
    }

    if (param === 'this') {
      const thisValue = dicomDataset.dict[rule.tag].Value;
      return thisValue.length === 1 ? thisValue[0] : thisValue;
    }

    if (elementNames.includes(param)) {
      const tag = nameToTag(param);
      if (!tag) {
        throw new Error(`Element ${param} has no corresponding numeric tag.`);
      }
      const element = dicomDataset.dict[tag];
      if (!element) {
        throw new Error(`Element ${param} not found in DICOM dataset.`);
      }
      return element.Value;
    }

    return param;
  });
  return resolvedParams;
}

// function resolveScripts(
//   rule: AnonymizationRule,
//   anonymizationRules: AnonymizationRule[],
//   dicomDataset: DicomDict2
// ) {
//   if (!rule.value) {
//     return null;
//   }
//   // Get any script contents
//   const scriptMatch = rule.value.match(/{(.+)}/);
//   if (!scriptMatch) {
//     return null;
//   }

//   // Resolve any functions/variables in script
// }

/**
 * Resolve parameters from a function string/script in the anonymization script
 * @param {AnonymizationRule} rule Anonymization rule
 * @param {AnonymizationRule[]} anonymizationRules All parsed anonymization rules (for looking up script parameters)
 * @param {DicomDict2} dicomDataset Parsed dicom dataset
 * @returns {string[]}
 */
export default function parseParams(rule, anonymizationRules, dicomDataset) {
  if (!rule.value) {
    throw new Error(`No function string defined for rule ${rule}`);
  }

  if (!elementNames) {
    elementNames = anonymizationRules.reduce(
      (names, rule) => {
        if (rule.name) {
          names.push(rule.name);
          return names;
        }
        return names;
      },
      /** @type {string[]} */ []
    );
  }

  // const resolvedScripts = resolveScripts(rule, anonymizationRules, dicomDataset);

  const resolvedParams = resolveParams(rule, anonymizationRules, dicomDataset);

  return resolvedParams;
}
