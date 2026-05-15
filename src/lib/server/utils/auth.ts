import type { Cookies } from '@sveltejs/kit';

/**
 * Define o cookie de autenticação com configurações de segurança
 * Centraliza a lógica para evitar duplicação entre login e cadastro
 * 
 * @param cookies - Objeto de cookies do SvelteKit
 * @param token - Token JWT a armazenar no cookie
 */
export function setAuthCookie(cookies: Cookies, token: string): void {
    cookies.set('authToken', token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7  // 7 dias
    });
}
