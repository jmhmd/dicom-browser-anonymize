import md5 from 'md5';
import convertBase from '../util/convertBase';
import { parse, addDays, format } from 'date-fns';

export default function hashdate(dateValue: string, hashDateValue: string) {
  // Generate hash
  if (!dateValue || !hashDateValue) {
    throw new Error(
      `Hash requires an existing value and value to hash: ${dateValue}, ${hashDateValue}.`
    );
  }
  if (dateValue.length < 8) {
    throw new Error(`Date in header less than 8 characters/malformed (${dateValue}).`);
  }
  const hashed = md5(hashDateValue);
  let hashBase10 = convertBase(hashed, 64, 10);
  if (!hashBase10) {
    throw new Error(`Hash returned null.`);
  }

  if (hashBase10.length > 4) {
    hashBase10 = hashBase10.substring(hashBase10.length - 4);
  }

  let inc = parseInt(hashBase10);
  inc = -1 * (inc % (10 * 365));

  const date = parse(dateValue, 'yyyyMMdd', new Date());
  const shiftedDate = addDays(date, inc);
  const shiftedDateString = format(shiftedDate, 'yyyyMMdd');

  return shiftedDateString;
}
