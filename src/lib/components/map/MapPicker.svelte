<script lang="ts">
    import MapLibre from 'svelte-maplibre-gl';
    import { Marker, NavigationControl } from 'svelte-maplibre-gl';
    import maplibregl from 'maplibre-gl';

    interface Props {
        latitude?: number;
        longitude?: number;
        searchQuery?: string;
    }

    let { latitude = $bindable(-22.9068), longitude = $bindable(-43.1729), searchQuery = '' }: Props = $props();

    const defaultStyle = 'https://demotiles.maplibre.org/style.json';
    const tileStyle = 'https://tiles.openfreemap.org/styles/liberty';

    let map: maplibregl.Map;
    let zoom = $state(12);
    let center: [number, number] = $state([longitude || -43.1729, latitude || -22.9068]);
    let markerLngLat: { lng: number; lat: number } = $state({ lng: longitude || -43.1729, lat: latitude || -22.9068 });
    let geocoding = $state(false);
    let geocodeError = $state('');

    // Sync marker when lat/lng props change from outside
    $effect(() => {
        if (latitude != null && longitude != null) {
            markerLngLat = { lng: longitude, lat: latitude };
            center = [longitude, latitude];
        }
    });

    // Sync external props when marker is dragged
    $effect(() => {
        latitude = markerLngLat.lat;
        longitude = markerLngLat.lng;
    });

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    $effect(() => {
        const q = searchQuery?.trim();
        if (!q || q.length < 5) return;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            geocoding = true;
            geocodeError = '';
            try {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&accept-language=pt`;
                const res = await fetch(url, { headers: { 'User-Agent': 'VouAli/1.0' } });
                const data = await res.json();
                if (data && data.length > 0) {
                    const lon = parseFloat(data[0].lon);
                    const lat = parseFloat(data[0].lat);
                    markerLngLat = { lng: lon, lat: lat };
                    center = [lon, lat];
                    zoom = 15;
                    latitude = lat;
                    longitude = lon;
                } else {
                    geocodeError = 'Local não encontrado. Ajuste o pin no mapa.';
                }
            } catch (e) {
                geocodeError = 'Erro ao buscar local.';
            } finally {
                geocoding = false;
            }
        }, 600);
    });

    function onDragEnd() {
        latitude = markerLngLat.lat;
        longitude = markerLngLat.lng;
    }
</script>

<div class="space-y-2">
    {#if geocodeError}
        <p class="text-xs text-destructive">{geocodeError}</p>
    {/if}

    <div class="relative w-full h-72 md:h-80 rounded-lg overflow-hidden border border-border">
        <MapLibre
            bind:this={map}
            style={tileStyle}
            bind:center
            bind:zoom
            autoloadGlobalCss={true}
            class="w-full h-full"
        >
            <NavigationControl position="top-right" />
            <Marker lnglat={markerLngLat} draggable={true} ondragend={onDragEnd}>
                {#snippet children()}
                    <div style="
                        width: 28px; height: 28px;
                        background: #dc2626;
                        border: 3px solid white;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        cursor: grab;
                    "></div>
                {/snippet}
            </Marker>
        </MapLibre>

        {#if geocoding}
            <div class="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full shadow-sm z-10">
                Buscando local...
            </div>
        {/if}
    </div>

    <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>
            {markerLngLat.lat.toFixed(6)}, {markerLngLat.lng.toFixed(6)}
        </span>
        <span class="flex items-center gap-1">
            <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Arraste o pin para ajustar
        </span>
    </div>
</div>
