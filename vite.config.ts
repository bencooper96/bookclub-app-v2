import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'development',
			scope: '/',
			base: '/',
			selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
			manifest: {
				short_name: 'Reading Group',
				name: 'Reading Group',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: '/logo-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/logo-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/logo-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/'
			}
		})
	],
	define: {
		'process.env': process.env,
		__DATE__: `'${new Date().toISOString()}'`
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
