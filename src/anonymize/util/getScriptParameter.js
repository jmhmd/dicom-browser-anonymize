/**
 * @typedef {import("../Script").default} Script
 */

/**
 * Get value of a parameter defined in the anonymization script
 * @param {string} parameter Name of an anonymization script parameter: "@UIDROOT"
 * @param {Script["variables"]} variables Script variables
 * @returns {string}
 */
export default function getScriptParameter(parameter, variables) {
  if (parameter.substr(0, 1) !== '@') {
    throw new Error(`Parameter ${parameter} must start with '@'`);
  }
  const matchedParam = variables.find((r) => r.name === parameter.substr(1));
  if (!matchedParam || !matchedParam.value) {
    throw new Error(`No defined parameter value found for ${parameter}`);
  }
  return matchedParam.value;
}
