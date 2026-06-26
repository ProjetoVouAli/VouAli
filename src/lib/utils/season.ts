// src/lib/utils/season.ts

import { getThemeForRegion, type Region } from './geolocation';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export function getCurrentSeason(): Season {
	// Classificação para o Hemisfério Sul (Brasil)
	// Dez-Fev = Verão (Summer)
	// Mar-Mai = Outono (Autumn)
	// Jun-Ago = Inverno (Winter)
	// Set-Nov = Primavera (Spring)
	const month = new Date().getMonth(); // 0-11
	
	if (month === 11 || month <= 1) {
		return 'summer';
	} else if (month >= 2 && month <= 4) {
		return 'autumn';
	} else if (month >= 5 && month <= 7) {
		return 'winter';
	} else {
		return 'spring';
	}
}

export function getThemeForSeason(season: Season): string {
	switch (season) {
		case 'summer':
			return 'beach_summer';
		case 'winter':
			return 'mountain_winter';
		case 'spring':
			return 'rural';
		case 'autumn':
			return 'urban';
		default:
			return 'default';
	}
}

export function getSeasonalTheme(region: string | null, season: Season): string {
	// Combine region and season to resolve conflict
	// e.g., coastal + summer -> beach_summer
	
	if (region === 'coastal' && season === 'summer') {
		return 'beach_summer';
	}
	
	if (region === 'mountain' && season === 'winter') {
		return 'mountain_winter';
	}

	// Default fallbacks if no specific combined theme exists
	if (region) {
		// Priority to region mapping
		return getThemeForRegion(region as Region);
	}

	return getThemeForSeason(season);
}
