import 'reflect-metadata'; // <-- DEVE SER A PRIMEIRA LINHA
import type { Handle } from '@sveltejs/kit';
import { AppDataSource } from '$lib/server/db/data-source';
import { verifyIdToken, verifySessionCookie, initializeFirebaseAdmin } from '$lib/server/firebase-admin';
import { Usuario, TipoUsuario } from '$lib/server/db/entities/Usuario';
import { env } from '$env/dynamic/private';

// Inicializar banco de dados (apenas uma vez)
if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
}

// Debug: Log das variáveis de ambiente no startup
console.log('[STARTUP] Variáveis de ambiente:');
console.log('  FIREBASE_PROJECT_ID:', env.FIREBASE_PROJECT_ID ? '✅ Configurado' : '❌ NÃO CONFIGURADO');
console.log('  FIREBASE_CLIENT_EMAIL:', env.FIREBASE_CLIENT_EMAIL ? '✅ Configurado' : '❌ NÃO CONFIGURADO');
console.log('  FIREBASE_PRIVATE_KEY:', env.FIREBASE_PRIVATE_KEY ? `✅ Configurado (${env.FIREBASE_PRIVATE_KEY.length} chars)` : '❌ NÃO CONFIGURADO');

// Tenta inicializar Firebase Admin no startup
initializeFirebaseAdmin();

/**
 * Interface para dados do usuário autenticado (do Firebase)
 */
export interface AuthUser {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    emailVerified: boolean;
}

/**
 * Interface para usuário do banco de dados
 */
export interface DatabaseUser extends AuthUser {
    id: number;
    nome: string;
    sexo: 'M' | 'F' | 'O';
    estaAutenticado: boolean;
    papeis: TipoUsuario[];
    creationDate: Date;
}

/**
 * SvelteKit Handle para processar cada requisição
 * 
 * DESIGN PATTERN: Lazy Loading
 * - Não valida o token em TODA requisição
 * - O token é validado apenas quando necessário
 * - Usa cache para evitar validações repetidas
 * - Isso evita bottleneck de performance
 */
export const handle: Handle = async ({ event, resolve }) => {
    /**
     * Cache de Promises para validação nesta requisição
     * Evita a condição de corrida quando MÚLTIPLOS load servers (ex: layout e page)
     * chamam a função simultaneamente durante o SSR.
     */
    let authPromise: Promise<AuthUser | null> | null = null;
    let dbPromise: Promise<Usuario | null> | null = null;

    /**
     * Lazy Getter: Valida o token apenas quando acessado
     * Retorna a mesma Promise se chamada múltiplas vezes em paralelo.
     */
    const getAuthUser = (): Promise<AuthUser | null> => {
        if (authPromise) return authPromise;

        authPromise = (async () => {
            try {
                // 1. EXTRAIR TOKEN DO COOKIE
                const cookies = event.request.headers.get('cookie') || '';
                const authTokenMatch = cookies.match(/authToken=([^;]+)/);
                const authToken = authTokenMatch ? decodeURIComponent(authTokenMatch[1]) : null;

                if (!authToken) {
                    console.log('[Auth] Nenhum token encontrado no cookie');
                    return null;
                }

                console.log('[Auth] Token encontrado no cookie, validando...');

                // 2. VALIDAR TOKEN COM FIREBASE ADMIN
                let decodedToken = await verifyIdToken(authToken);
                
                // Se falhar, tenta como Session Cookie
                if (!decodedToken) {
                    console.log('[Auth] ID Token inválido, tentando Session Cookie...');
                    decodedToken = await verifySessionCookie(authToken);
                }

                // Se ambos falharem, token é inválido
                if (!decodedToken) {
                    console.warn('[Auth] Token inválido ou expirado');
                    event.cookies.delete('authToken', { path: '/' });
                    return null;
                }

                // 3. CONSTRUIR OBJETO AuthUser
                const authUser: AuthUser = {
                    uid: decodedToken.uid,
                    email: decodedToken.email,
                    displayName: decodedToken.name,
                    photoURL: decodedToken.picture,
                    emailVerified: decodedToken.email_verified || false,
                };

                console.log(`[Auth] ✓ Usuário autenticado: ${authUser.email}`);
                return authUser;

            } catch (error) {
                console.error('[Auth] Erro ao validar autenticação:', error);
                return null;
            }
        })();

        return authPromise;
    };

    /**
     * Função para buscar dados do usuário no banco de dados
     * Retorna a mesma Promise se chamada múltiplas vezes em paralelo.
     */
    const getDatabaseUser = (): Promise<Usuario | null> => {
        if (dbPromise) return dbPromise;

        dbPromise = (async () => {
            try {
                // Primeiro, valida no Firebase
                const authUser = await getAuthUser();
                if (!authUser) return null;

                // Busca usuário no banco pelo UID do Firebase
                const usuarioRepository = AppDataSource.getRepository(Usuario);
                const usuario = await usuarioRepository.findOne({
                    where: { uid: authUser.uid },
                });

                if (!usuario) {
                    console.warn(`[Auth] Usuário não encontrado no banco para UID: ${authUser.uid}`);
                    return null;
                }

                // Construir objeto DatabaseUser
                const databaseUser: Usuario = {
                    ...authUser,
                    ...usuario,
                };

                console.log(`[Auth] ✓ Dados do banco carregados para: ${usuario.email}`);
                return databaseUser;

            } catch (error) {
                console.error('[Auth] Erro ao buscar usuário no banco:', error);
                return null;
            }
        })();

        return dbPromise;
    };

    /**
     * Adicionar funções ao event.locals
     * Agora estão disponíveis em qualquer +page.server.ts ou +server.ts
     */
    event.locals.authUser = getAuthUser;
    event.locals.databaseUser = getDatabaseUser;

    // Continuar com a resolução da requisição
    const response = await resolve(event);

    return response;
};