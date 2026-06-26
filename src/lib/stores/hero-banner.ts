// src/lib/stores/hero-banner.ts

import { writable } from 'svelte/store';
import { getThemeByKey, type HeroTheme } from '$lib/config/hero-themes';
import { getUserLocation, classifyLocation, calculateDistance, type GeoLocation, type Region } from '$lib/utils/geolocation';
import { getCurrentSeason, getSeasonalTheme, type Season } from '$lib/utils/season';

export const heroTheme = writable<HeroTheme | null>(null);
export const userLocation = writable<GeoLocation | null>(null);
export const currentSeason = writable<Season | null>(null);

export async function initializeHeroBanner(destinations?: any[]): Promise<void> {
    try {
        const season = getCurrentSeason();
        currentSeason.set(season);

        let geo: GeoLocation | null = null;
        try {
            geo = await getUserLocation();
            userLocation.set(geo);
        } catch (error) {
            console.warn('Geolocation failed or denied, using season fallback. Reason:', error);
        }

        let region: Region | null = null;
        if (geo) {
            region = classifyLocation(geo.latitude, geo.longitude);
        }

        const themeKey = getSeasonalTheme(region, season);
        const theme = structuredClone(getThemeByKey(themeKey));
        
        // Injeção da imagem do Banco de Dados
        if (destinations && destinations.length > 0) {
            let bestDest = null;
            const validDests = destinations.filter(d => d.images && d.images.length > 0);
            
            if (validDests.length > 0) {
                if (geo) {
                    // Pega o destino mais próximo usando a distância Haversine
                    bestDest = validDests.reduce((prev, curr) => {
                        const distPrev = calculateDistance(geo.latitude, geo.longitude, prev.latitude, prev.longitude);
                        const distCurr = calculateDistance(geo.latitude, geo.longitude, curr.latitude, curr.longitude);
                        return (distCurr < distPrev) ? curr : prev;
                    });
                } else {
                    // Se não tiver geo, pega o primeiro válido
                    bestDest = validDests[0];
                }
            }

            if (bestDest) {
                theme.image.url = bestDest.images[0].url;
                theme.image.alt = bestDest.name;
                theme.destinationSlug = bestDest.slug;
            }
        }
        
        heroTheme.set(theme);
    } catch (error) {
        console.error('Failed to initialize Hero Banner:', error);
        // Fallback
        heroTheme.set(getThemeByKey('default'));
    }
}

export function updateThemeManually(themeKey: string): void {
    const theme = getThemeByKey(themeKey);
    heroTheme.set(theme);
}
