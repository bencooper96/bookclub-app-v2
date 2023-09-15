export const AVATAR_COLORS = ['bg-primary-400', 'bg-secondary-400', 'bg-tertiary-400'];
export const getAvatarColor = (name) => {
	const charCode = name.charCodeAt(0);
	const index = charCode % AVATAR_COLORS.length;
	return AVATAR_COLORS[index];
};
