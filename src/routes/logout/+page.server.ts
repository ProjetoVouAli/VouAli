import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Página de Logout - Rota Protegida
 * 
 * Padrão de mercado:
 * - Redireciona se não está autenticado
 * - Remove token e redireciona para home se está autenticado
 */
export const load: PageServerLoad = async ({ locals, redirect: svelteRedirect }) => {
    // ✅ Lazy Loading: Verifica autenticação
    const user = await locals.authUser();

    // Se não está logado, redireciona para home (não tem sentido acessar logout sem estar logado)
    if (!user) {
        throw svelteRedirect(303, '/');
    }

    return {};
};

export const actions: Actions = {
    default: async ({ cookies }) => {
        console.log('[LOGOUT] Removendo cookie authToken...');
        // Remove o cookie de autenticação
        cookies.set('authToken', '', {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 0
        });
        console.log('[LOGOUT] Cookie removido. Redirecionando para home.');
        // Redireciona para a tela inicial
        throw redirect(303, '/');
    }
};
