import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'process.env': process.env
	},
	resolve: {
		alias: {
			$components: resolve('./src/components'),
			$stores: resolve('./src/lib/stores')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
