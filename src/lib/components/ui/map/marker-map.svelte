<script lang="ts">
	import maplibregl from 'maplibre-gl';
	import { MapPin } from '@lucide/svelte';
	import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
	import { mode } from 'mode-watcher';
	
	interface MapMarker {
		name: string;
		slug: string;
		latitude: number | string;
		longitude: number | string;
	}

	const { destinations }: { destinations: MapMarker[] } = $props();

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

	const mapBounds = $derived.by(() => {
		const bounds = new maplibregl.LngLatBounds();
		for (const { latitude, longitude } of destinations) {
			bounds.extend([Number(longitude), Number(latitude)]);
		}
		return bounds;
	});
</script>

<MapLibre
	bounds={mapBounds}
	style={mapStyle}
	class="w-full h-full"
	fitBoundsOptions={{maxZoom:11}}
	maxPitch={85}
	attributionControl={false}
>
	{#each destinations as { name,slug, longitude, latitude, }}
		<Marker lnglat={[Number(longitude), Number(latitude)]}>
			{#snippet content()}
				<div class="items-center *:last:hidden hover:*:last:block leading-none ">
					<MapPin class="w-full" />
					<p>{name}</p>
				</div>
			{/snippet}
			<Popup class="text-center text-foreground w-36 h-36"   open={false} offset={offsets}>
				<p>{name}</p>
				<p>Clique para mais detalhes</p>
			</Popup>
		</Marker>
	{/each}
</MapLibre>
