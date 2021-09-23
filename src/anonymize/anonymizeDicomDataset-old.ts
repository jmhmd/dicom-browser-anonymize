import DicomDict2 from '../DicomDict2';
import hash from './functions/hash';
import hashdate from './functions/hashdate';
import hashuid from './functions/hashuid';
import { getHeaderAnonymizationRules } from './readAnonymizationScripts';
import { emptyTag, removeTag, replaceTag } from './util/modifyTag';
import parseParams from './util/parseParams';

const implementedFunctions = ['keep', 'remove', 'empty', 'hashuid', 'hash', 'hashdate'];

function functionIsImplemented(functionName?: string | null) {
  if (!functionName) return false;
  return implementedFunctions.includes(functionName);
}

function isPrivateGroup(tag: string) {
  return parseInt(tag.substr(3, 1), 10) % 2;
}

export default async function anonymizeDicomDataset(
  dicomDataset: DicomDict2,
  anonymizationScriptUrl: string
) {
  const headerAnonymizationRules = await getHeaderAnonymizationRules(anonymizationScriptUrl);

  // Default global options
  const options = {
    removeUnchecked: false,
    removePrivateGroups: true,
    removeOverlays: true,
    removeCurves: true,
    keepGroup0018: true,
    keepGroup0020: true,
    keepGroup0028: true,
  };

  // Override global options if set
  const keepGroup0018 = headerAnonymizationRules.find((r) => r.tag === '0018');
  if (keepGroup0018) {
    options.keepGroup0018 = keepGroup0018.en === 'T';
  }
  const keepGroup0020 = headerAnonymizationRules.find((r) => r.tag === '0020');
  if (keepGroup0020) {
    options.keepGroup0020 = keepGroup0020.en === 'T';
  }
  const keepGroup0028 = headerAnonymizationRules.find((r) => r.tag === '0028');
  if (keepGroup0028) {
    options.keepGroup0028 = keepGroup0028.en === 'T';
  }
  const removeUnchecked = headerAnonymizationRules.find((r) => r.tag === 'unspecifiedelements');
  if (removeUnchecked) {
    options.removeUnchecked = removeUnchecked.en === 'T';
  }
  const removePrivateGroups = headerAnonymizationRules.find((r) => r.tag === 'privategroups');
  if (removePrivateGroups) {
    options.removePrivateGroups = removePrivateGroups.en === 'T';
  }
  const removeOverlays = headerAnonymizationRules.find((r) => r.tag === 'overlays');
  if (removeOverlays) {
    options.removeOverlays = removeOverlays.en === 'T';
  }
  const removeCurves = headerAnonymizationRules.find((r) => r.tag === 'curves');
  if (removeCurves) {
    options.removeCurves = removeCurves.en === 'T';
  }

  function shouldPreserve(tag: string, rule?: typeof headerAnonymizationRules[0]) {
    if (rule?.value === '@keep()') return true;
    // The SOP Class UID: 00080016
    // The SOP Instance UID: 00080018
    // The Study Instance UID: 0020000D
    // Group 28 (the parameters describing the pixels)
    // Groups 60xx (overlays)
    if (['00080016', '00080018', '0020000D'].includes(tag)) return true;
    if (tag.substr(0, 4) === '0028' && options.keepGroup0028) return true;
    if (tag.substr(0, 2) === '60' && !options.removeOverlays) return true;
    if (isPrivateGroup(tag) && !options.removePrivateGroups) return true;
    return false;
  }

  // Loop through all elements and execute rules
  for (const tag of Object.keys(dicomDataset.dict)) {
    const { Value, vr: elementVr } = dicomDataset.dict[tag];
    const elementValue: any | any[] = Value.length === 1 ? Value[0] : Value;

    // Find matching rule
    const rule = headerAnonymizationRules.find((r) => r.tag === tag);

    // Get function name (i.e. 'hashuid' from '@hashuid($UIDROOT, this)')
    const functionNameMatch = rule?.value?.match(/@(\S+)\(/);
    const functionName = functionNameMatch && functionNameMatch[1];

    // If rule defined but not implemented, warn and empty tag
    if (rule?.value && !functionIsImplemented(functionName)) {
      console.warn(
        `Function ${rule.value} is not yet supported. Emptying tag for safety. Use '@keep()' if you would like to keep this field value.`
      );
      rule.value = '@empty()';
    }

    // If no rule defined, delete element
    if (!rule && !shouldPreserve(tag, rule)) {
      delete dicomDataset.dict[tag];
    }

    // If rule disabled and removeUnchecked true, delete element
    if (rule?.en === 'F' && !shouldPreserve(tag, rule)) {
      delete dicomDataset.dict[tag];
    }

    // If rule enabled and value empty, leave alone
    if (rule?.en === 'T' && !rule.value) {
      console.log(`Rule for tag ${tag} has no function defined, skipping.`);
      continue;
    }

    // Remove all sequences
    if (elementVr === 'SQ' && !shouldPreserve(tag, rule)) {
      delete dicomDataset.dict[tag];
    }

    // If rule enabled and function implemented, process
    if (rule?.en === 'T' && rule.value) {
      switch (functionName) {
        case 'remove': {
          removeTag(dicomDataset, tag);
          break;
        }
        case 'keep': {
          break;
        }
        case 'empty': {
          emptyTag(dicomDataset, tag, elementVr);
          break;
        }
        case 'hashuid': {
          try {
            const params = parseParams(
              rule.value,
              [, 'ElementName'],
              elementValue,
              headerAnonymizationRules,
              dicomDataset
            );
            const value = hashuid(params[0], params[1]);
            replaceTag(dicomDataset, tag, elementVr, value);
          } catch (error) {
            console.warn(`Could not @hashuid value. Tag: ${rule.tag}. Error ${error}`);
          }
          break;
        }
        case 'hash': {
          if (!elementValue) {
            emptyTag(dicomDataset, tag, elementVr);
            break;
          }
          try {
            const params = parseParams(
              rule.value,
              ['ElementName', 'Integer'],
              elementValue,
              headerAnonymizationRules,
              dicomDataset
            );
            const value = hash(params[0], params[1]);
            replaceTag(dicomDataset, tag, elementVr, value);
          } catch (error) {
            console.warn(`Could not @hash value. Tag: ${rule.tag}. Error: ${error}`);
          }
          break;
        }
        case 'hashdate': {
          if (!elementValue) {
            emptyTag(dicomDataset, tag, elementVr);
            break;
          }
          try {
            const [dateString, hashDateString] = parseParams(
              rule.value,
              ['ElementName', 'ElementName'],
              elementValue,
              headerAnonymizationRules,
              dicomDataset
            );
            if (!dateString || !hashDateString) {
              console.warn(
                `Date in header '${tag}' not set (${dateString}), or hash string not set (${hashDateString}), removing.`
              );
              delete dicomDataset.dict[tag];
              break;
            }
            if (dateString.length < 8) {
              console.warn(
                `Date in header '${tag}' less than 8 characters/malformed (${dateString}), emptying.`
              );
              emptyTag(dicomDataset, tag, elementVr);
              break;
            }
            const value = hashdate(dateString, hashDateString);
            replaceTag(dicomDataset, tag, elementVr, value);
          } catch (error) {
            console.warn(`Could not @hash value. Tag: ${rule.tag}. Error: ${error}`);
          }
          break;
        }
        case 'require': {
          const [valueIfNotExists, defaultValue] = parseParams(
            rule.value,
            ['ElementName'],
            elementValue,
            headerAnonymizationRules,
            dicomDataset
          );
          const existingElement = dicomDataset.dict[tag];
          break;
        }

        default:
          break;
      }
    }
  }

  return dicomDataset;
}
