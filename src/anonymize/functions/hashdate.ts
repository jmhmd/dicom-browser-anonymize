import { parse, addDays, format } from 'date-fns';
import getMD5HashBase10 from '../util/getMD5HashBase10';

/**
 * Shift a date
 * @param {string} dateValue Date to be hashed
 * @param {string} hashDateValue Value to use to create date offset
 * @returns {string}
 */
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

  let hashBase10 = getMD5HashBase10(hashDateValue);
  if (!hashBase10) {
    throw new Error(`Hash returned null.`);
  }

  if (hashBase10.length > 4) {
    hashBase10 = hashBase10.substring(hashBase10.length - 4);
  }

  let inc = parseInt(hashBase10, 10);
  inc = -1 * (inc % (10 * 365));

  const date = parse(dateValue, 'yyyyMMdd', new Date());
  const shiftedDate = addDays(date, inc);
  const shiftedDateString = format(shiftedDate, 'yyyyMMdd');

  return shiftedDateString;
}
