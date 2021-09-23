import DicomDict2 from '../../DicomDict2';
import { nameToTag } from './dictionary';
import { AnonymizationRule } from '../readAnonymizationScripts';
import getScriptParameter from './getScriptParameter';

let elementNames: string[];

export default function parseParams(
  rule: AnonymizationRule,
  anonymizationRules: AnonymizationRule[],
  dicomDataset: DicomDict2
) {
  if (!rule.value) {
    throw new Error(`No function string defined for rule ${rule}`);
  }
  const functionString = rule.value;

  if (!elementNames) {
    elementNames = anonymizationRules.reduce((names, rule) => {
      if (rule.name) {
        names.push(rule.name);
        return names;
      }
      return names;
    }, [] as string[]);
  }

  // Capture up to 4 parameters from function string
  const paramMatch = functionString.match(/\(([^,]+)(?:,([^,]+))?(?:,([^,]+))?(?:,([^,]+))?\)/);
  if (!paramMatch) {
    return [];
  }
  let [, ...params] = paramMatch;
  params = params.filter((p) => p); // Unmatched extra capturing groups in regex will return 'undefined'

  // Resolve any variables, i.e. 'this', '@UIDROOT', 'PatientID'
  const resolvedParams = params.map((param, i) => {
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
