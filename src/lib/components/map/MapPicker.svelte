<script lang="ts">
  import { browser } from '$app/environment';

  interface Props {
    latitude?: number;
    longitude?: number;
    searchQuery?: string;
    onPinMoved?: (lat: number, lng: number) => void;
  }

  let { latitude = $bindable(-22.9068), longitude = $bindable(-43.1729), searchQuery = '', onPinMoved }: Props = $props();

  let mapContainer: HTMLDivElement | undefined = $state();
  let mapReady = $state(false);
  let geocoding = $state(false);
  let geocodeError = $state('');

  let map: any;
  let marker: any;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  function movePin(lat: number, lng: number) {
    marker?.setLatLng([lat, lng]);
    latitude = lat;
    longitude = lng;
    onPinMoved?.(lat, lng);
  }

  async function initMap() {
    if (!browser) return;

    const L = (await import('leaflet')).default;

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const startLat = Number(latitude) || -22.9068;
    const startLng = Number(longitude) || -43.1729;

        const el = document.createElement('div');
        el.style.cssText = 'position:relative;width:28px;height:40px;';
        el.appendChild(pulse);

        const pin = document.createElement('div');
        pin.style.cssText = 'position:absolute;top:0;left:0;width:28px;height:28px;background:#dc2626;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3);z-index:1;pointer-events:none;';
        el.appendChild(pin);

        // Inject pulse keyframes once
        if (!document.getElementById('map-pulse-style')) {
            const style = document.createElement('style');
            style.id = 'map-pulse-style';
            style.textContent = '@keyframes pulse{0%{transform:scale(0.8);opacity:0.6}50%{transform:scale(1.3);opacity:0.2}100%{transform:scale(0.8);opacity:0.6}}';
            document.head.appendChild(style);
        }

        marker = new maplibregl.Marker({ element: el })
            .setLngLat([startLng, startLat])
            .addTo(map);

        map.on('click', (e: any) => {
            ignoreSearchUntil = Date.now() + 4000;
            geocodeError = ''; // Limpa o erro se o usuário corrigiu na mão
            const lng = e.lngLat.lng;
            const lat = e.lngLat.lat;
            marker.setLngLat(e.lngLat);
            latitude = lat;
            longitude = lng;
            onPinMoved?.(lat, lng);
        });

        map.on('load', () => {
            mapReady = true;
        });
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const pinIcon = L.divIcon({
      html: `<div style="position:relative;width:28px;height:40px">
        <div style="position:absolute;top:0;left:0;width:28px;height:28px;background:#dc2626;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,0.3);z-index:1"></div>
      </div>`,
      className: '',
      iconSize: [28, 40],
      iconAnchor: [14, 40],
    });

    marker = L.marker([startLat, startLng], { icon: pinIcon, draggable: true }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      movePin(pos.lat, pos.lng);
    });

    map.on('click', (e: any) => {
      movePin(e.latlng.lat, e.latlng.lng);
    });

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    let ignoreSearchUntil = 0;

    // Função auxiliar para buscar no Nominatim
    async function fetchGeocode(query: string) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=pt`;
        const res = await fetch(url, { headers: { 'User-Agent': 'VouAli/1.0' } });
        return await res.json();
    }

    $effect(() => {
        const q = searchQuery?.trim();
        if (!q || q.length < 5 || !mapReady) return;

        // Se o usuário acabou de clicar no mapa, ignoramos buscas automáticas
        if (Date.now() < ignoreSearchUntil) {
            geocodeError = ''; // Garante que a mensagem suma
            return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            geocoding = true;
            geocodeError = '';
            try {
                let data = await fetchGeocode(q);

                // Fallback: se não achar com o número, tenta sem o número (caso tenha)
                // Assumindo que a query é "Rua, Numero, Bairro..."
                if ((!data || data.length === 0) && q.includes(',')) {
                    const parts = q.split(',').map(p => p.trim());
                    // Remove o segundo elemento (geralmente o número) se for curto
                    if (parts.length >= 3 && parts[1].length <= 5 && !isNaN(Number(parts[1]))) {
                        parts.splice(1, 1);
                        const fallbackQ = parts.join(', ');
                        data = await fetchGeocode(fallbackQ);
                        if (data && data.length > 0) {
                            geocodeError = 'Número não encontrado exatamente. O pino foi movido para a rua. Ajuste manualmente.';
                        }
                    }
                }

                if (data && data.length > 0) {
                    const lon = parseFloat(data[0].lon);
                    const lat = parseFloat(data[0].lat);
                    marker?.setLngLat([lon, lat]);
                    latitude = lat;
                    longitude = lon;

                    if (data[0].boundingbox) {
                        const [south, north, west, east] = data[0].boundingbox.map(parseFloat);
                        map?.fitBounds([[west, south], [east, north]], { padding: 60, maxZoom: 17 });
                    } else {
                        map?.setCenter([lon, lat]);
                        map?.setZoom(15);
                    }
                } else {
                    geocodeError = 'Local não encontrado automaticamente. Clique no mapa para posicionar o pin.';
                }
            } catch {
                geocodeError = 'Erro ao buscar local.';
            } finally {
                geocoding = false;
            }
        }, 800);
    });
  }

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
          marker?.setLatLng([lat, lon]);
          latitude = lat;
          longitude = lon;

          if (data[0].boundingbox) {
            const [south, north, west, east] = data[0].boundingbox.map(parseFloat);
            map?.fitBounds([[south, west], [north, east]], { padding: [60, 60], maxZoom: 17 });
          } else {
            map?.setView([lat, lon], 15);
          }
        } else {
          geocodeError = 'Local não encontrado. Clique no mapa para posicionar o pin.';
        }
      } catch {
        geocodeError = 'Erro ao buscar local.';
      } finally {
        geocoding = false;
      }
    }, 600);
  });

  $effect(() => {
    if (!browser || !mapContainer) return;
    initMap();
    return () => { map?.remove(); };
  });
</script>

<div class="space-y-2">
  {#if geocodeError}
    <p class="text-xs text-destructive">{geocodeError}</p>
  {/if}

  <div class="relative w-full h-72 md:h-80 rounded-lg overflow-hidden border border-border z-0">
    {#if browser}
      <div bind:this={mapContainer} class="w-full h-full"></div>
      {#if geocoding}
        <div class="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full shadow-sm z-[1000]">
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
      Clique ou arraste o pin no mapa
    </span>
  </div>
</div>
