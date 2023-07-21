export function getInitials(name: string | null) {
	if (!name) return '';
	const nameString = name.toUpperCase().split(' ');
	if (nameString.length === 1) {
		return nameString[0].charAt(0);
	}
	return nameString[0].charAt(0) + nameString[1].charAt(0);
}

const TW_COLOR_NAME_LIST = [
	'red',
	'orange',
	'yellow',
	'green',
	'teal',
	'blue',
	'indigo',
	'purple',
	'pink'
];

export function getAvatarTailwindColor(name: string | null, prefix = 'bg', suffix = '400') {
	// returns a color based on the name
	// this is a deterministic function
	// so the same name will always return the same color
	if (!name) return 'bg-gray-400';
	// get the sum of all the characters in the name
	const sum = name.split('').reduce((acc, char) => {
		return acc + char.charCodeAt(0);
	}, 0);

	// get the index of the color from the list
	const index = sum % TW_COLOR_NAME_LIST.length;
	return prefix + '-' + TW_COLOR_NAME_LIST[index] + '-' + suffix;
}
