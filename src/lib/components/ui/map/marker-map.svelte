<script lang="ts">
  import L from 'leaflet';
  import { onMount } from 'svelte';
  import type { Destination } from '$lib/server/db/entities/Destination';

  const { destinations }: { destinations: Destination[] } = $props();

  let mapContainer: HTMLDivElement;
  let map: L.Map;

  onMount(() => {
    map = L.map(mapContainer, {
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const bounds = L.latLngBounds();
    const pinIcon = L.divIcon({
      html: `<div style="width:24px;height:24px;background:#dc2626;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    for (const dest of destinations) {
      const lat = Number(dest.latitude);
      const lng = Number(dest.longitude);
      if (isNaN(lat) || isNaN(lng)) continue;

      const marker = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
      marker.bindPopup(`<b>${dest.name}</b><br/><a href="/destination/${dest.slug}">Clique para mais detalhes</a>`);
      bounds.extend([lat, lng]);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
    } else {
      map.setView([-22.9068, -43.1729], 11);
    }

    const observer = new MutationObserver(() => map.invalidateSize());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      map.remove();
    };
  });
</script>

<div bind:this={mapContainer} class="w-full h-full rounded-lg overflow-hidden"></div>
