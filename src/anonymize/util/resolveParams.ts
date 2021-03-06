import DicomDict2 from '../../DicomDict2';
import Script, { OperationParameter, ScriptRule } from '../Script';
import { nameToTag } from './dicomDictionary';
import getScriptParameter from './getScriptParameter';
import { log } from './logger';
import resolveOperation from './resolveOperation';

function resolveParam(
  param: OperationParameter,
  rule: ScriptRule,
  script: Script,
  dicomDataset: DicomDict2
) {
  if (typeof param === 'object') {
    return resolveOperation(rule, script, dicomDataset);
  }
  // If param is a script parameter, retrieve it
  if (param.substr(0, 1) === '@') {
    return getScriptParameter(param, script.variables);
  }

  if (param === 'this') {
    const datasetElement = dicomDataset.dict[rule.tag] || dicomDataset.meta[rule.tag];
    if (!datasetElement) {
      log('error', `Tag reference by 'this' not found in dataset. Rule: ${rule}`);
      throw new Error(`Tag reference by 'this' not found in dataset. Rule: ${rule}`);
      // console.error(`Tag not found in dataset: ${rule.tag}`);
    }
    const thisValue = datasetElement.Value;
    return thisValue.length === 1 ? thisValue[0] : thisValue;
  }

  // Try to look up string as a tag name
  const tagFromName = nameToTag(param);
  if (tagFromName) {
    const datasetElement = dicomDataset.dict[tagFromName] || dicomDataset.meta[tagFromName];
    if (!datasetElement) {
      throw new Error(`Element ${param} not found in DICOM dataset.`);
    }
    return datasetElement.Value.length === 1 ? datasetElement.Value[0] : datasetElement.Value;
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
export function resolveParams(
  rule: ScriptRule,
  script: Script,
  dicomDataset: DicomDict2
): (string | number | string[])[] {
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
