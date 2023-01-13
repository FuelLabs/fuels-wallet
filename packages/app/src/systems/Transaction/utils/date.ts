import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getTimeFromNow = (date: Date) => {
  return dayjs().from(dayjs(date));
};

export const getTimeTillNow = (date: Date) => {
  return dayjs().to(dayjs(date));
};
