import { nameToTag } from './dictionary.js';
import getScriptParameter from './getScriptParameter.js';
import resolveOperation from './resolveOperation.js';

/**
 * @typedef {import('../Script').default} Script
 * @typedef {import('../Script').ScriptRule} Rule
 * @typedef {import("../../DicomDict2").default} DicomDict2
 */

/**
 *
 * @param {import('../Script').OperationParameter} param
 * @param {Rule} rule
 * @param {Script} script
 * @param {DicomDict2} dicomDataset
 */
function resolveParam(param, rule, script, dicomDataset) {
  if (typeof param === 'object') {
    return resolveOperation(rule, script, dicomDataset);
  }
  // If param is a script parameter, retrieve it
  if (param.substr(0, 1) === '@') {
    return getScriptParameter(param, script.variables);
  }

  if (param === 'this') {
    const thisValue = dicomDataset.dict[rule.tag].Value;
    return thisValue.length === 1 ? thisValue[0] : thisValue;
  }

  // Try to look up string as a tag name
  const tagFromName = nameToTag(param);
  if (tagFromName) {
    const element = dicomDataset.dict[tagFromName];
    if (!element) {
      throw new Error(`Element ${param} not found in DICOM dataset.`);
    }
    return element.Value;
  }

  // Not a script, variable, 'this', or tag name, so just return param to be interpolated literally
  return param;
}

/**
 * Resolve parameters from a function string/script in the anonymization script
 * @param {Rule} rule Anonymization rule
 * @param {Script} script All parsed anonymization rules (for looking up script parameters)
 * @param {DicomDict2} dicomDataset Parsed dicom dataset
 * @returns {(string | number | string[])[]}
 */
export function resolveParams(rule, script, dicomDataset) {
  const { operationParameters } = rule.operation;
  if (!operationParameters || !Array.isArray(operationParameters)) {
    return [];
  }
  if (operationParameters.length === 0) {
    return [];
  }

  const resolvedParams = operationParameters.map((param) =>
    resolveParam(param, rule, script, dicomDataset)
  );

  return resolvedParams;
}
