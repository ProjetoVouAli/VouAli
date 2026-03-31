import type { LayoutServerLoad } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Usuario } from '$lib/server/db/entities/Usuario';
import { getAuth } from 'firebase-admin/auth';
import { env } from '$env/dynamic/private';

// Inicialização do Firebase Admin SDK (garante singleton)
import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId: env.VITE_FIREBASE_PROJECT_ID,
  });
}

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('authToken');
  let user = null;

  console.log('[SSR] Cookie recebido authToken:', token);

  if (token) {
    try {
      // Valida o token JWT do Firebase
      const decoded = await getAuth().verifyIdToken(token);
      // Busca usuário no banco pelo UID do Firebase
      const repo = AppDataSource.getRepository(Usuario);
      const usuario = await repo.findOne({ where: { uid: decoded.uid } });
      console.log('[SSR] Usuário encontrado no banco:', usuario);
      if (usuario) {
        user = { nome: usuario.nome, email: usuario.email };
      }
    } catch (e) {
      console.log('[SSR] Erro ao validar token ou buscar usuário:', e);
      // Token inválido/expirado, ignora
      user = null;
    }
  }

  console.log('[SSR] Usuário retornado para o layout:', user);
  return { user };
};
