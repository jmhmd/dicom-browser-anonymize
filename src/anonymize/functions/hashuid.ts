import getMD5HashBase10 from '../util/getMD5hashBase10';

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

  let hashBase10 = getMD5HashBase10(value);
  // Add prefix of 9 if numeric string starts with 0
  if (hashBase10?.substring(0, 1) === '0') {
    hashBase10 = '9' + hashBase10;
  }
  const finalHash = (root + hashBase10).substr(0, 64);
  if (!finalHash || finalHash.length < 5) {
    throw new Error(`Error hashing the current UID. Current: ${value}, hashed: ${finalHash}`);
  }
  return finalHash;
}
