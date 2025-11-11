import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// For Presentations:
	server: {
		allowedHosts:["bruno-aspire.tail84cca9.ts.net"],
		host: '0.0.0.0',
		port: 8443
	}
});
