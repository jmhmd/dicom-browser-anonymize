import DicomDict2 from '../../DicomDict2';
import md5 from 'md5';
import convertBase from '../util/convertBase';
import { nameToTag } from '../dictionary';

export default function hashuid(
  [root, elementName]: [string, string],
  elementValue: string,
  dicomDataset: DicomDict2
) {
  // Append period to root if not already there.
  if (root.substr(-1) !== '.') {
    root += '.';
  }

  // If not using current element for hash, look up other element
  if (elementName !== 'this') {
    const tag = nameToTag(elementName);
    if (!tag) {
      throw new Error(`Element ${elementName} has no corresponding numeric tag.`);
    }
    const element = dicomDataset.dict[tag];
    if (!element) {
      throw new Error(`Element ${elementName} not found in DICOM dataset.`);
    }
    elementValue = element.Value;
  }

  if (!elementValue) {
    throw new Error(`Element for hashUID requires an existing value.`);
  }
  const hashedUID = md5(elementValue);
  const hashBase10 = convertBase(hashedUID, 64, 10);
  if (!hashBase10 || hashBase10.length < 5) {
    throw new Error(
      `Error hashing the current UID. Current: ${elementValue}, hashed: ${hashBase10}`
    );
  }
  return root + hashBase10;
}
