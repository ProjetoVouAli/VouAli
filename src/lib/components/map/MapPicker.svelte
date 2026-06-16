<script lang="ts">
    import { browser } from '$app/environment';

    interface Props {
        latitude?: number;
        longitude?: number;
        searchQuery?: string;
    }

    let { latitude = $bindable(-22.9068), longitude = $bindable(-43.1729), searchQuery = '' }: Props = $props();

    let mapContainer: HTMLDivElement;
    let mapReady = $state(false);
    let geocoding = $state(false);
    let geocodeError = $state('');

    let map: any;
    let marker: any;

    async function initMap() {
        if (!browser) return;

        const maplibregl = await import('maplibre-gl');
        // CSS is auto-loaded by maplibre-gl when using import

        map = new maplibregl.Map({
            container: mapContainer,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [longitude || -43.1729, latitude || -22.9068],
            zoom: 12,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        const el = document.createElement('div');
        el.style.cssText = 'width:28px;height:28px;background:#dc2626;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:grab;';

        marker = new maplibregl.Marker({ element: el, draggable: true })
            .setLngLat([longitude || -43.1729, latitude || -22.9068])
            .addTo(map);

        marker.on('dragend', () => {
            const lngLat = marker.getLngLat();
            latitude = lngLat.lat;
            longitude = lngLat.lng;
        });

        map.on('click', (e: any) => {
            marker.setLngLat(e.lngLat);
            latitude = e.lngLat.lat;
            longitude = e.lngLat.lng;
        });

        map.on('load', () => {
            mapReady = true;
        });
    }

    $effect(() => {
        if (!browser || !mapContainer) return;

        initMap();

        return () => {
            map?.remove();
        };
    });

    // Atualiza marcador quando lat/lng muda externamente
    $effect(() => {
        if (!marker || latitude == null || longitude == null) return;
        marker.setLngLat([longitude, latitude]);
        map?.setCenter([longitude, latitude]);
    });

    // Geocoding
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    $effect(() => {
        const q = searchQuery?.trim();
        if (!q || q.length < 5 || !mapReady) return;

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
                    marker?.setLngLat([lon, lat]);
                    map?.setCenter([lon, lat]);
                    map?.setZoom(15);
                    latitude = lat;
                    longitude = lon;
                } else {
                    geocodeError = 'Local não encontrado. Ajuste o pin no mapa.';
                }
            } catch {
                geocodeError = 'Erro ao buscar local.';
            } finally {
                geocoding = false;
            }
        }, 600);
    });
</script>

<div class="space-y-2">
    {#if geocodeError}
        <p class="text-xs text-destructive">{geocodeError}</p>
    {/if}

    <div class="relative w-full h-72 md:h-80 rounded-lg overflow-hidden border border-border">
        {#if browser}
            <div bind:this={mapContainer} class="w-full h-full"></div>
            {#if geocoding}
                <div class="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full shadow-sm z-10">
                    Buscando local...
                </div>
            {/if}
        {:else}
            <div class="w-full h-full flex items-center justify-center bg-muted text-sm text-muted-foreground">
                Carregando mapa...
            </div>
        {/if}
    </div>

    <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>
            {latitude?.toFixed(6) ?? '--'}, {longitude?.toFixed(6) ?? '--'}
        </span>
        <span class="flex items-center gap-1">
            <svg class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Arraste o pin ou clique no mapa
        </span>
    </div>
</div>
