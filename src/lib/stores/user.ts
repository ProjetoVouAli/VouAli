import { writable } from 'svelte/store';

export type User = {
  nome: string;
  email: string;
  // Adicione outros campos se necessário
};

export const user = writable<User | null>(null);