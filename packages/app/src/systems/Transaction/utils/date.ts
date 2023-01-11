type DateDifference = {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
};

export const dateDiff = (date1: Date, date2: Date): DateDifference => {
  const seconds = Math.floor(
    Math.abs(date1.getTime() - date2.getTime()) / 1000
  );
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return { seconds, minutes, hours, days };
};

export const dateDiffRelative = (date1: Date, date2: Date): DateDifference => {
  let seconds = Math.floor(Math.abs(date1.getTime() - date2.getTime()) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  hours -= days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  return { seconds, minutes, hours, days };
};

export const getTextForRelativeTimeDifference = (dateDiff: DateDifference) => {
  const text: string[] = [];

  if (dateDiff.days > 0) text.push(`${dateDiff.days} days`);
  if (dateDiff.hours > 0) text.push(`${dateDiff.hours} hrs`);
  if (dateDiff.minutes > 0) text.push(`${dateDiff.minutes} min`);
  if (dateDiff.seconds > 0) text.push(`${dateDiff.seconds} sec`);

  return `${text.slice(0, 2).join(' ')} ago`;
};

export const getTextForTimeDifference = (dateDiff: DateDifference) => {
  if (dateDiff.days > 0) return `${dateDiff.days} days ago`;
  if (dateDiff.hours > 0) return `${dateDiff.hours} hours ago`;
  if (dateDiff.minutes > 0) return `${dateDiff.minutes} minutes ago`;
  if (dateDiff.seconds > 0) return `${dateDiff.seconds} seconds ago`;

  return '';
};

export const getTimeFromNow = (date: Date) => {
  const dateDiff = dateDiffRelative(date, new Date());
  return getTextForTimeDifference(dateDiff);
};

export const getTimeTillNow = (date: Date) => {
  const dateDiff = dateDiffRelative(new Date(), date);
  return getTextForTimeDifference(dateDiff);
};
