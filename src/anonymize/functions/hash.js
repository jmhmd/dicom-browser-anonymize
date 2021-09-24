import getMD5HashBase10 from '../util/getMD5HashBase10.js';

/**
 * Hash a string
 * @param {string} value Value to be hashed
 * @param {string} maxCharsOutput Max characters of output
 * @returns {string}
 */
export default function hash(value, maxCharsOutput) {
  const maxChars = maxCharsOutput ? parseInt(maxCharsOutput, 10) : 64;
  // Generate hash
  if (!value) {
    throw new Error(`Hash requires an existing value.`);
  }

  const hashBase10 = getMD5HashBase10(value);
  if (!hashBase10) {
    throw new Error(`Hash returned null.`);
  }
  const finalHash = hashBase10.substr(0, maxChars);
  if (!finalHash || finalHash.length < 5) {
    throw new Error(`Error hashing the current UID. Current: ${value}, hashed: ${finalHash}`);
  }
  return finalHash;
}
