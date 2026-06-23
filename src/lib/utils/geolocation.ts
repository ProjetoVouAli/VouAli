// src/lib/utils/geolocation.ts

import { getThemeByKey } from '$lib/config/hero-themes';

export interface GeoLocation {
	latitude: number;
	longitude: number;
	accuracy: number;
	timestamp: number;
}

export type Region = 'coastal' | 'mountain' | 'urban' | 'rural';

export interface GeoResult {
	region: Region | null;
	location: GeoLocation | null;
	error?: string;
}

export async function getUserLocation(): Promise<GeoLocation> {
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined' || !navigator.geolocation) {
			reject(new Error('Geolocation is not supported by this environment.'));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
					timestamp: position.timestamp
				});
			},
			(error) => {
				reject(new Error(error.message));
			},
			{
				enableHighAccuracy: false,
				timeout: 5000,
				maximumAge: 3600000 // 1 hour cache at browser level
			}
		);
	});
}

export function classifyLocation(latitude: number, longitude: number): Region {
	const absLat = Math.abs(latitude);

	if (absLat > 45) {
		return 'mountain';
	} else if (absLat >= 40 && absLat <= 45) {
		return 'urban';
	} else if (absLat < 30) {
		return 'coastal';
	} else {
		return 'rural';
	}
}

export function getThemeForRegion(region: Region): string {
	switch (region) {
		case 'coastal':
			return 'beach_summer';
		case 'mountain':
			return 'mountain_winter';
		case 'urban':
			return 'urban';
		case 'rural':
			return 'rural';
		default:
			return 'default';
	}
}
