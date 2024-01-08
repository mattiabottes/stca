import { FormattedDate, Hours, Minutes } from './stores';

let now = new Date().setSeconds(0, 0);
let formattedDate = '';
let formattedTime = '';

let oldDate = null;

let dateTimeInterval = null;

export const getDateTime = () => {
	now = new Date().setSeconds(0, 0);

	if (now !== oldDate) {
		formattedDate = new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(now);
		formattedTime = new Intl.DateTimeFormat('it-IT', { timeStyle: 'short' }).format(now);

		FormattedDate.set(formattedDate);
		Hours.set(formattedTime.split(':')[0]);
		Minutes.set(formattedTime.split(':')[1]);

		oldDate = now;
	}

	if (!dateTimeInterval) {
		console.log('start dateTime service');
		dateTimeInterval = setInterval(getDateTime, 1000);
	}
};
