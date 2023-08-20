import { join } from 'path';
import forms from '@tailwindcss/forms';
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Telegraf', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: [forms, ...skeleton()]
};
