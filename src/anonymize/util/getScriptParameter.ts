import { AnonymizationRule } from '../readAnonymizationScripts';

export default function getScriptParameter(parameter: string, rules: AnonymizationRule[]) {
  if (parameter.substr(0, 1) !== '@') {
    throw new Error(`Parameter ${parameter} must start with '@'`);
  }
  const matchedParam = rules.find((r) => r.type === 'p' && r.tag === parameter.substr(1));
  if (!matchedParam || !matchedParam.value) {
    throw new Error(`No defined parameter value found for ${parameter}`);
  }
  return matchedParam.value;
}
