/**
 * @typedef {import("../AnonymizationRule").AnonymizationRule} AnonymizationRule
 * @typedef {import("./AnonymizerOptions").default} AnonymizerOptions
 */

/**
 *
 * @param {AnonymizationRule[]} rules List of anonymization rules parsed from script
 * @returns {AnonymizerOptions}
 */
export default function getOptionsFromScript(rules) {
  const keepGroup0018 = rules.find((r) => r.tag === '0018');
  const keepGroup0020 = rules.find((r) => r.tag === '0020');
  const keepGroup0028 = rules.find((r) => r.tag === '0028');
  const removeUnchecked = rules.find((r) => r.tag === 'unspecifiedelements');
  const removePrivateGroups = rules.find((r) => r.tag === 'privategroups');
  const removeOverlays = rules.find((r) => r.tag === 'overlays');
  const removeCurves = rules.find((r) => r.tag === 'curves');

  return {
    keepGroup0018: keepGroup0018?.en === 'T',
    keepGroup0020: keepGroup0020?.en === 'T',
    keepGroup0028: keepGroup0028?.en === 'T',
    removeUnchecked: removeUnchecked?.en === 'T',
    removeCurves: removeCurves?.en === 'T',
    removeOverlays: removeOverlays?.en === 'T',
    removePrivateGroups: removePrivateGroups?.en === 'T',
  };
}
