import { format } from 'date-fns';

/**
 * Print current time
 * @param {string} separator
 * @returns {string}
 */
export default function time(separator) {
  separator = separator || '';
  const timeString = format(new Date(), `HH${separator}mm${separator}ss`);
  return timeString;
}
