import { formatWithLeadingZero } from './formatLeadingZero';

export type TFormatOption = 'hours' | 'minutes' | 'day' | 'month' | 'year';

const conversion1 = (date: Date): Record<TFormatOption, string> => ({
  hours: formatWithLeadingZero(date.getHours()),
  minutes: formatWithLeadingZero(date.getMinutes()),
  day: formatWithLeadingZero(date.getDate()),
  month: formatWithLeadingZero(date.getMonth()),
  year: formatWithLeadingZero(date.getFullYear()),
});
const conversion2: Record<TFormatOption, string> = {
  hours: ':',
  minutes: ' ',
  day: ' ',
  month: '/',
  year: '/',
};

export const formatDay = (
  date: Date,
  what: Array<TFormatOption> = ['hours', 'minutes', 'day', 'month', 'year']
): string => {
  let result = '';
  what.reduce((prev, curr) => {
    result = result.concat(conversion1(date)[prev]).concat(conversion2[prev]).concat(conversion1(date)[curr]);
    return curr;
  });
  return result;
};
