<script lang="ts">
	import type { HeroTheme } from '$lib/config/hero-themes';
	import Compass from '@lucide/svelte/icons/compass';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Plane from '@lucide/svelte/icons/plane';

	let { theme }: { theme: HeroTheme } = $props();
</script>

<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
	<!-- Decorações animadas -->
	<div
		class="absolute top-20 right-20 opacity-30 animate-float"
		style="color: {theme.elements.iconColor}; transition: color 0.6s ease;"
	>
		<Compass size={64} />
	</div>
	<div
		class="absolute bottom-20 right-40 opacity-30 animate-float-delayed"
		style="color: {theme.elements.iconColor}; transition: color 0.6s ease;"
	>
		<MapPin size={48} />
	</div>
	<div
		class="absolute top-40 right-1/3 opacity-20 animate-fly"
		style="color: {theme.elements.iconColor}; transition: color 0.6s ease;"
	>
		<Plane size={80} class="transform rotate-45" />
	</div>
</div>

<style>
	@keyframes float {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-15px);
		}
		100% {
			transform: translateY(0px);
		}
	}
	@keyframes fly {
		0% {
			transform: translate(0px, 0px);
		}
		50% {
			transform: translate(30px, -30px);
		}
		100% {
			transform: translate(0px, 0px);
		}
	}
	.animate-float {
		animation: float 6s ease-in-out infinite;
	}
	.animate-float-delayed {
		animation: float 4s ease-in-out infinite 2s;
	}
	.animate-fly {
		animation: fly 10s ease-in-out infinite;
	}
</style>
