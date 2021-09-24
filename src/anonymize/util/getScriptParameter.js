/**
 * @typedef {import("../AnonymizationRule").AnonymizationRule} AnonymizationRule
 */

/**
 * Get value of a parameter defined in the anonymization script
 * @param {string} parameter Name of an anonymization script parameter: "@UIDROOT"
 * @param {AnonymizationRule[]} rules All anonymization rules parsed from script for lookup
 * @returns {string}
 */
export default function getScriptParameter(parameter, rules) {
  if (parameter.substr(0, 1) !== '@') {
    throw new Error(`Parameter ${parameter} must start with '@'`);
  }
  const matchedParam = rules.find((r) => r.type === 'p' && r.tag === parameter.substr(1));
  if (!matchedParam || !matchedParam.value) {
    throw new Error(`No defined parameter value found for ${parameter}`);
  }
  return matchedParam.value;
}
