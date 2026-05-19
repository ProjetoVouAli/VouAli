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
     * Cache de usuários validados nesta requisição
     * Evita múltiplas validações do mesmo token
     */
    let cachedAuthUser: AuthUser | null = null;
    let cachedDatabaseUser: DatabaseUser | null = null;
    let authValidationAttempted = false;
    let dbValidationAttempted = false;

    /**
     * Lazy Getter: Valida o token apenas quando acessado
     * 
     * Fluxo:
     * 1. Tenta extrair o token do cookie
     * 2. Valida o token com Firebase Admin
     * 3. Cacheia o resultado para evitar re-validação
     * 
     * IMPORTANTE: Esta função é assíncrona e deve ser AWAIT'ED
     */
    const getAuthUser = async (): Promise<AuthUser | null> => {
        // Se já foi validado nesta requisição, retorna do cache
        if (authValidationAttempted) {
            return cachedAuthUser;
        }

        authValidationAttempted = true;

        try {
            // 1. EXTRAIR TOKEN DO COOKIE
            const cookies = event.request.headers.get('cookie') || '';
            const authTokenMatch = cookies.match(/authToken=([^;]+)/);
            const authToken = authTokenMatch ? decodeURIComponent(authTokenMatch[1]) : null;

            if (!authToken) {
                console.log('[Auth] Nenhum token encontrado no cookie');
                cachedAuthUser = null;
                return null;
            }

            console.log('[Auth] Token encontrado no cookie, validando...');

            // 2. VALIDAR TOKEN COM FIREBASE ADMIN
            // Tenta primeiro como ID Token
            let decodedToken = await verifyIdToken(authToken);
            
            // Se falhar, tenta como Session Cookie
            if (!decodedToken) {
                console.log('[Auth] ID Token inválido, tentando Session Cookie...');
                decodedToken = await verifySessionCookie(authToken);
            }

            // Se ambos falharem, token é inválido
            if (!decodedToken) {
                console.warn('[Auth] Token inválido ou expirado');
                // Limpar cookie inválido
                event.cookies.delete('authToken', { path: '/' });
                cachedAuthUser = null;
                return null;
            }

            // 3. CONSTRUIR OBJETO AuthUser (do Firebase)
            const authUser: AuthUser = {
                uid: decodedToken.uid,
                email: decodedToken.email,
                displayName: decodedToken.name,
                photoURL: decodedToken.picture,
                emailVerified: decodedToken.email_verified || false,
            };

            console.log(`[Auth] ✓ Usuário autenticado: ${authUser.email}`);
            cachedAuthUser = authUser;
            return authUser;

        } catch (error) {
            console.error('[Auth] Erro ao validar autenticação:', error);
            cachedAuthUser = null;
            return null;
        }
    };

    /**
     * Função para buscar dados do usuário no banco de dados
     * Deve ser chamada apenas quando necessário
     * 
     * IMPORTANTE: Esta função é assíncrona e deve ser AWAIT'ED
     */
    const getDatabaseUser = async (): Promise<DatabaseUser | null> => {
        // Se já foi validado nesta requisição, retorna do cache
        if (dbValidationAttempted) {
            return cachedDatabaseUser;
        }

        dbValidationAttempted = true;

        try {
            // Primeiro, valida no Firebase
            const authUser = await getAuthUser();
            if (!authUser) {
                cachedDatabaseUser = null;
                return null;
            }

            // Busca usuário no banco pelo UID do Firebase
            const usuarioRepository = AppDataSource.getRepository(Usuario);
            const usuario = await usuarioRepository.findOne({
                where: { uid: authUser.uid },
            });

            if (!usuario) {
                console.warn(`[Auth] Usuário não encontrado no banco para UID: ${authUser.uid}`);
                cachedDatabaseUser = null;
                return null;
            }

            // Construir objeto DatabaseUser
            const databaseUser: DatabaseUser = {
                ...authUser,
                id: usuario.id,
                nome: usuario.nome,
                sexo: usuario.sexo,
                estaAutenticado: usuario.estaAutenticado,
                papeis: usuario.papeis,
                creationDate: usuario.creationDate,
            };

            console.log(`[Auth] ✓ Dados do banco carregados para: ${usuario.email}`);
            cachedDatabaseUser = databaseUser;
            return databaseUser;

        } catch (error) {
            console.error('[Auth] Erro ao buscar usuário no banco:', error);
            cachedDatabaseUser = null;
            return null;
        }
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