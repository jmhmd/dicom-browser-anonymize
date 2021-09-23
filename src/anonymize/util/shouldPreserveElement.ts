import AnonymizerOptions from './AnonymizerOptions';
import { AnonymizationRule } from '../readAnonymizationScripts';
import isPrivateGroup from './isPrivateGroup';

export default function shouldPreserve(
  options: AnonymizerOptions,
  tag: string,
  rule?: AnonymizationRule
) {
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
