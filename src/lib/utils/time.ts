import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const getTimezoneOffset = () => {
	return dayjs().utcOffset();
};

const dateFormat = 'ddd, MMM D';
export const formatTime = (time: string | number | Date, format = dateFormat) => {
	return dayjs(time).format(format);
};

export const getDate = (time: string | number | Date, format = dateFormat) => {
	return dayjs(time).format(format);
};
