import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import unocss from "unocss/vite"
import { presetUno, presetAttributify, presetIcons, extractorSvelte } from "unocss"

export default defineConfig({
	plugins: [unocss({
		presets: [
			presetUno(), presetAttributify(),
			presetIcons({
				collections: {
					carbon: async () => {
						return await (await import('@iconify-json/carbon')).icons
					}
				}
			})
		],
		extractors: [extractorSvelte]
	}), sveltekit()]
});
