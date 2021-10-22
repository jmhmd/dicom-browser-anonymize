import { format } from 'date-fns';

export default function date(separator: string) {
  separator = separator || '';
  const dateString = format(new Date(), `yyyy${separator}MM${separator}dd`);
  return dateString;
}
