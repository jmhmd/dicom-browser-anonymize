import md5 from 'md5';
import convertBase from '../util/convertBase';

export default function hash(value: string, maxCharsOutput: string) {
  const maxChars = maxCharsOutput ? parseInt(maxCharsOutput, 10) : 64;
  // Generate hash
  if (!value) {
    throw new Error(`Hash requires an existing value.`);
  }
  const hashedUID = md5(value);
  const hashBase10 = convertBase(hashedUID, 64, 10);
  if (!hashBase10) {
    throw new Error(`Hash returned null.`);
  }
  const finalHash = hashBase10.substr(0, maxChars);
  if (!finalHash || finalHash.length < 5) {
    throw new Error(`Error hashing the current UID. Current: ${value}, hashed: ${finalHash}`);
  }
  return finalHash;
}
