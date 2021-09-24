import md5 from 'md5';

/**
 * Get numeric string hash of a value
 * @param {string} value Value to hash
 * @returns {string}
 */
export default function getMD5HashBase10(value) {
  // Calculate md5 hash of uid
  const hashedUID = md5(value);
  // Convert md5 hex string to base 10 numeric string
  const bi = BigInt(`0x${hashedUID}`);
  return bi.toString(10);
}
