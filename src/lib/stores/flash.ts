import { writable } from 'svelte/store';

export const flash = writable<string | null>(null);
