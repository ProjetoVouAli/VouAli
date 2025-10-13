<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import { MapPin } from '@lucide/svelte';
	import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
	import { mode } from 'mode-watcher';

	const {
		latitude,
		longitude,
		popupStr
	}: { latitude: number; longitude: number; popupStr: string } = $props();

	let lnglat = $derived({ lng: longitude, lat: latitude });
	let offset = $state(24);

	let offsets: maplibregl.Offset = $derived({
		top: [0, offset],
		bottom: [0, -offset],
		left: [offset + 12, 0],
		right: [-offset - 12, 0],
		center: [0, 0],
		'top-left': [offset, offset],
		'top-right': [-offset, offset],
		'bottom-left': [offset, -offset],
		'bottom-right': [-offset, -offset]
	});

	const mapStyle = $derived(
		mode.current == 'dark'
			? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
			: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
	);
</script>

<MapLibre
	style={mapStyle}
	class="w-full min-h-[300px]"
	zoom={10}
	center={[longitude, latitude]}
	maxPitch={85}
	attributionControl={false}
>
	<Marker bind:lnglat >
		{#snippet content()}
			<div class="items-center leading-none">
				<MapPin class="w-full" />
			</div>
		{/snippet}
		<Popup class="text-black" open={true} offset={offsets}>
			<span class="text-lg">{popupStr}</span>
		</Popup>
	</Marker>
</MapLibre>
