import { format } from 'date-fns';

/**
 * Print current date
 * @param {string} separator
 * @returns {string}
 */
export default function date(separator) {
  separator = separator || '';
  const dateString = format(new Date(), `yyyy${separator}MM${separator}dd`);
  return dateString;
}
