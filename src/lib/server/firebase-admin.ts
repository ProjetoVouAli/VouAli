import admin from 'firebase-admin';
import { env } from '$env/dynamic/private';

let adminApp: any = null;
let initialized = false;

/**
 * Inicializa Firebase Admin SDK
 * Deve ser chamado apenas uma vez na aplicação
 */
export function initializeFirebaseAdmin() {
    if (initialized) {
        return adminApp;
    }

    // Verifica se as variáveis de ambiente estão configuradas
    if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_PRIVATE_KEY || !env.FIREBASE_CLIENT_EMAIL) {
        console.warn('[Firebase Admin] ⚠️ Variáveis de ambiente não configuradas.');
        console.warn('Esperando: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
        initialized = true;
        return null;
    }

    try {
        console.log('[Firebase Admin] 🔧 Inicializando com projeto:', env.FIREBASE_PROJECT_ID);
        
        // Tenta obter app existente primeiro
        try {
            adminApp = admin.app();
            console.log('[Firebase Admin] ✅ Reutilizando app existente');
            initialized = true;
            return adminApp;
        } catch {
            // App não existe, vamos criar
        }

        // Inicializar com variáveis de ambiente
        adminApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: env.FIREBASE_PROJECT_ID,
                privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                clientEmail: env.FIREBASE_CLIENT_EMAIL,
            }),
        });

        console.log('[Firebase Admin] ✅ Inicializado com sucesso!');
        initialized = true;
        return adminApp;
    } catch (error) {
        console.error('[Firebase Admin] ❌ Erro ao inicializar:', error);
        initialized = true;
        return null;
    }
}

/**
 * Obtem a instância do Firebase Admin
 */
export function getFirebaseAdmin() {
    if (!initialized) {
        return initializeFirebaseAdmin();
    }
    return adminApp;
}

/**
 * Valida um ID Token do Firebase
 * @param token - ID Token do Firebase
 * @returns Dados do usuário decodificados ou null
 */
export async function verifyIdToken(token: string) {
    try {
        const app = initializeFirebaseAdmin();
        if (!app) {
            console.warn('[Firebase Admin] Admin não inicializado');
            return null;
        }

        const decodedToken = await app.auth().verifyIdToken(token);
        console.log('[Firebase Admin] ID Token validado para:', decodedToken.email);
        return decodedToken;
    } catch (error: any) {
        console.error('[Firebase Admin] Erro ao verificar token:', error.message);
        return null;
    }
}

/**
 * Valida uma Session Cookie do Firebase
 * @param sessionCookie - Session Cookie
 * @returns Dados do usuário decodificados ou null
 */
export async function verifySessionCookie(sessionCookie: string) {
    try {
        const app = initializeFirebaseAdmin();
        if (!app) {
            console.warn('[Firebase Admin] Admin não inicializado');
            return null;
        }

        const decodedClaims = await app.auth().verifySessionCookie(sessionCookie, true);
        console.log('[Firebase Admin] Session Cookie validado para:', decodedClaims.email);
        return decodedClaims;
    } catch (error: any) {
        console.error('[Firebase Admin] Erro ao verificar session cookie:', error.message);
        return null;
    }
}

/**
 * Obtém dados do usuário do Firebase pelo UID
 * @param uid - UID do Firebase
 * @returns Dados do usuário ou null
 */
export async function getUserByUid(uid: string) {
    try {
        const app = initializeFirebaseAdmin();
        if (!app) {
            return null;
        }

        const userRecord = await app.auth().getUser(uid);
        return userRecord;
    } catch (error: any) {
        console.error('[Firebase Admin] Erro ao obter usuário:', error.message);
        return null;
    }
}

/**
 * Cria uma session cookie a partir de um ID Token
 * @param idToken - ID Token do Firebase
 * @returns Session cookie ou null
 */
export async function createSessionCookie(idToken: string, expiresIn: number = 60 * 60 * 24 * 7) {
    try {
        const app = initializeFirebaseAdmin();
        if (!app) {
            return null;
        }

        const sessionCookie = await app.auth().createSessionCookie(idToken, { expiresIn });
        return sessionCookie;
    } catch (error: any) {
        console.error('[Firebase Admin] Erro ao criar session cookie:', error.message);
        return null;
    }
}
