// src/lib/stores/hero-banner.ts

import { writable } from 'svelte/store';
import { getThemeByKey, type HeroTheme } from '$lib/config/hero-themes';
import { getUserLocation, classifyLocation, type GeoLocation, type Region } from '$lib/utils/geolocation';
import { getCurrentSeason, getSeasonalTheme, type Season } from '$lib/utils/season';

export const heroTheme = writable<HeroTheme | null>(null);
export const userLocation = writable<GeoLocation | null>(null);
export const currentSeason = writable<Season | null>(null);

export async function initializeHeroBanner(): Promise<void> {
    try {
        const season = getCurrentSeason();
        currentSeason.set(season);

        let geo: GeoLocation | null = null;
        try {
            geo = await getUserLocation();
            userLocation.set(geo);
        } catch (error) {
            console.warn('Geolocation failed or denied, using season fallback.');
        }

        let region: Region | null = null;
        if (geo) {
            region = classifyLocation(geo.latitude, geo.longitude);
        }

        const themeKey = getSeasonalTheme(region, season);
        const theme = getThemeByKey(themeKey);
        
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
