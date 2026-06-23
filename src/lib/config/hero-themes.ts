// src/lib/config/hero-themes.ts

export interface ThemeColors {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	text: string;
}

export interface ThemeImage {
	url: string;
	srcset?: string;
	alt: string;
}

export interface ThemeElements {
	iconColor: string;
	opacity: number;
}

export interface ThemeTypography {
	font: string;
	sizes: {
		title: string;
		subtitle: string;
	};
}

export interface HeroTheme {
	id: string;
	name: string;
	colors: ThemeColors;
	image: ThemeImage;
	elements: ThemeElements;
	typography: ThemeTypography;
}

export const AVAILABLE_THEMES: Record<string, HeroTheme> = {
	default: {
		id: 'default',
		name: 'Default Theme',
		colors: {
			primary: '#000000',
			secondary: '#333333',
			accent: '#888888',
			background: 'linear-gradient(to bottom right, #e5e7eb, #d1d5db)',
			text: '#ffffff'
		},
		image: {
			url: 'https://images.unsplash.com/photo-1488646953014-c8bf75d4754b?q=80&w=2560&auto=format&fit=crop',
			alt: 'Destino Hero'
		},
		elements: {
			iconColor: '#000000',
			opacity: 0.1
		},
		typography: {
			font: 'sans-serif',
			sizes: {
				title: 'text-6xl lg:text-7xl',
				subtitle: 'text-xl'
			}
		}
	},
	beach_summer: {
		id: 'beach_summer',
		name: 'Beach Summer',
		colors: {
			primary: '#FF6B35',
			secondary: '#F7931E',
			accent: '#FFD700',
			background: 'linear-gradient(to bottom right, #FFEDD5, #FED7AA)',
			text: '#FFFFFF'
		},
		image: {
			url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2560&auto=format&fit=crop',
			alt: 'Praia ao pôr do sol'
		},
		elements: {
			iconColor: '#FF6B35',
			opacity: 0.15
		},
		typography: {
			font: 'sans-serif',
			sizes: {
				title: 'text-6xl lg:text-7xl',
				subtitle: 'text-xl'
			}
		}
	},
	mountain_winter: {
		id: 'mountain_winter',
		name: 'Mountain Winter',
		colors: {
			primary: '#3B82F6',
			secondary: '#60A5FA',
			accent: '#93C5FD',
			background: 'linear-gradient(to bottom right, #DBEAFE, #BFDBFE)',
			text: '#1E3A8A'
		},
		image: {
			url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop',
			alt: 'Serra coberta por neblina no inverno'
		},
		elements: {
			iconColor: '#3B82F6',
			opacity: 0.15
		},
		typography: {
			font: 'sans-serif',
			sizes: {
				title: 'text-6xl lg:text-7xl',
				subtitle: 'text-xl'
			}
		}
	},
	urban: {
		id: 'urban',
		name: 'Urban City',
		colors: {
			primary: '#111827',
			secondary: '#374151',
			accent: '#9CA3AF',
			background: 'linear-gradient(to bottom right, #E5E7EB, #9CA3AF)',
			text: '#000000'
		},
		image: {
			url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2560&auto=format&fit=crop',
			alt: 'Cidade cosmopolita'
		},
		elements: {
			iconColor: '#111827',
			opacity: 0.1
		},
		typography: {
			font: 'sans-serif',
			sizes: {
				title: 'text-6xl lg:text-7xl',
				subtitle: 'text-xl'
			}
		}
	},
	rural: {
		id: 'rural',
		name: 'Rural Countryside',
		colors: {
			primary: '#166534',
			secondary: '#22C55E',
			accent: '#86EFAC',
			background: 'linear-gradient(to bottom right, #DCFCE7, #86EFAC)',
			text: '#14532D'
		},
		image: {
			url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2560&auto=format&fit=crop',
			alt: 'Paisagem rural'
		},
		elements: {
			iconColor: '#166534',
			opacity: 0.15
		},
		typography: {
			font: 'sans-serif',
			sizes: {
				title: 'text-6xl lg:text-7xl',
				subtitle: 'text-xl'
			}
		}
	}
};

export function getThemeByKey(key: string): HeroTheme {
	return AVAILABLE_THEMES[key] || AVAILABLE_THEMES['default'];
}

export function getAllThemes(): HeroTheme[] {
	return Object.values(AVAILABLE_THEMES);
}
