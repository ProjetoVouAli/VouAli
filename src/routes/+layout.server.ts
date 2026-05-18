import type { LayoutServerLoad } from './$types';

/**
 * Layout Global - Carrega usuário para SSR
 * 
 * Padrão de mercado:
 * - Valida autenticação UMA VEZ por request (no hooks.server.ts)
 * - Carrega dados do usuário via lazy loading
 * - Passa para todas as sub-rotas
 */
export const load: LayoutServerLoad = async ({ locals }) => {
    // ✅ Lazy Loading: Valida APENAS se necessário
    // Esta chamada usa o cache do hooks.server.ts
    const user = await locals.databaseUser();

    console.log('[LAYOUT SERVER] user obtido:', user ? `${user.email}` : null);

    return {
        user: user ? {
            id: user.id,
            nome: user.nome,
            email: user.email,
            sexo: user.sexo,
            papeis: user.papeis,
        } : null,
    };
};
