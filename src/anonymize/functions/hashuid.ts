import md5 from 'md5';
import convertBase from '../util/convertBase';

export default function hashuid(root: string = '', value: string) {
  // Append period to root if not already there.
  if (root.length > 0 && root.substr(-1) !== '.') {
    root += '.';
  }
  root = root.trim();

  // Generate new uid
  if (!value) {
    throw new Error(`Element for hashUID requires an existing value.`);
  }
  const hashedUID = md5(value);
  const hashBase10 = convertBase(hashedUID, 64, 10);
  const finalHash = (root + hashBase10).substr(0, 64);
  if (!finalHash || finalHash.length < 5) {
    throw new Error(`Error hashing the current UID. Current: ${value}, hashed: ${finalHash}`);
  }
  return finalHash;
}
