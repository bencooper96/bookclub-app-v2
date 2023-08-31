export function getNextDayOfWeekAtTime(dayOfWeek: number, hour: number, minute: number) {
	// dayOfWeek: 0 = Sunday, 1 = Monday, etc.
	// hours: 0-23
	// minutes: 0-59

	const now = new Date();
	const today = now.getDay();
	const daysUntilNextDayOfWeek = (dayOfWeek + 7 - today) % 7;
	const nextDayOfWeek = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + daysUntilNextDayOfWeek
	);
	nextDayOfWeek.setHours(hour);
	nextDayOfWeek.setMinutes(minute);
	nextDayOfWeek.setSeconds(0);
	nextDayOfWeek.setMilliseconds(0);
	return nextDayOfWeek;
}
