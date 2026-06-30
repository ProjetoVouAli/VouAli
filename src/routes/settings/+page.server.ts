import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Usuario } from '$lib/server/db/entities/Usuario';
import { getFirebaseAdmin } from '$lib/server/firebase-admin';
import { uploadImage } from '$lib/server/cloudinary';

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = await locals.databaseUser();
  if (!user) throw error(401, 'Faça login para acessar configurações.');
  const activeTab = url.searchParams.get('tab') || 'profile';
  return { activeTab };
};

export const actions: Actions = {
  updateProfile: async ({ locals, request }) => {
    const dbUser = await locals.databaseUser();
    if (!dbUser) return fail(401);

    const data = await request.formData();
    const nome = data.get('nome')?.toString().trim();
    const bio = data.get('bio')?.toString().trim() || null;
    const avatarFile = data.get('avatar') as File | null;

    if (!nome || nome.length < 2) return fail(400, { message: 'Nome deve ter pelo menos 2 caracteres.' });

    const repo = AppDataSource.getRepository(Usuario);
    const user = await repo.findOne({ where: { id: dbUser.id } });
    if (!user) return fail(404);

    user.nome = nome;
    user.bio = bio;

    if (avatarFile && avatarFile.size > 0 && avatarFile.type.startsWith('image/')) {
      try {
        const result = await uploadImage(avatarFile, 'vouali/avatars');
        user.avatarUrl = result.url;
      } catch (e: any) {
        console.error('[SETTINGS] Avatar upload failed:', e.message);
        return fail(500, { message: 'Erro ao fazer upload da imagem.' });
      }
    }

    await repo.save(user);
    return { success: true, message: 'Perfil atualizado com sucesso!' };
  },

  sendResetPassword: async ({ locals }) => {
    const dbUser = await locals.databaseUser();
    if (!dbUser) return fail(401);

    try {
      const app = getFirebaseAdmin();
      if (!app) return fail(500, { message: 'Firebase não configurado.' });

      // Firebase envia e-mail automaticamente com o link de redefinição
      await app.auth().generatePasswordResetLink(dbUser.email);
      return { success: true, message: 'Link de redefinição enviado para seu e-mail.' };
    } catch (e: any) {
      console.error('[SETTINGS] Reset password error:', e.message);
      return fail(500, { message: 'Erro ao enviar link de redefinição.' });
    }
  },
};
