import { fail, redirect, type Actions } from '@sveltejs/kit';

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
