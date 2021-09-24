import md5 from 'md5';

export default function getMD5HashBase10(value: string) {
  // Calculate md5 hash of uid
  const hashedUID = md5(value);
  // Convert md5 hex string to base 10 numeric string
  const bi = BigInt(`0x${hashedUID}`);
  return bi.toString(10);
}
