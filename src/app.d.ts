// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { AuthUser, DatabaseUser } from './hooks.server';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/**
			 * Função LAZY para obter dados de autenticação do Firebase
			 * 
			 * Uso em +page.server.ts:
			 * ```typescript
			 * const user = await locals.authUser();
			 * if (!user) {
			 *     throw redirect(303, '/login');
			 * }
			 * ```
			 * 
			 * IMPORTANTE: Não trava a requisição - só valida quando chamado
			 */
			authUser: () => Promise<AuthUser | null>;

			/**
			 * Função LAZY para obter dados completos do usuário (Firebase + Banco PostgreSQL)
			 * 
			 * Uso em +page.server.ts:
			 * ```typescript
			 * const user = await locals.databaseUser();
			 * if (!user) {
			 *     throw redirect(303, '/login');
			 * }
			 * 
			 * console.log(user.nome, user.eAdministrador);
			 * ```
			 * 
			 * IMPORTANTE: Mais pesado que authUser() pois consulta o banco
			 */
			databaseUser: () => Promise<DatabaseUser | null>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
