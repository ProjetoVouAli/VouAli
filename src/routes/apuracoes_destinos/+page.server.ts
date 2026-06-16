import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { TipoUsuario } from '$lib/server/db/entities/Usuario';

export const load: PageServerLoad = async ({ locals }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
        throw error(403, 'Acesso restrito a administradores');
    }

    const repo = AppDataSource.getRepository(Destination);
    const pending = await repo.find({
        where: { status: 'pending' },
        relations: ['images', 'categories', 'createdBy'],
        order: { createdAt: 'ASC' },
    });

    return { destinations: structuredClone(pending) };
};

export const actions: Actions = {
    approve: async ({ locals, request }) => {
        const user = await locals.databaseUser();
        if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
            throw error(403, 'Acesso restrito');
        }

        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        const repo = AppDataSource.getRepository(Destination);
        await repo.update(id, { status: 'approved' });

        return { success: true };
    },

    reject: async ({ locals, request }) => {
        const user = await locals.databaseUser();
        if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
            throw error(403, 'Acesso restrito');
        }

        const data = await request.formData();
        const id = parseInt(data.get('id') as string);
        const reason = (data.get('reason') as string)?.trim() || 'Motivo não informado';

        const repo = AppDataSource.getRepository(Destination);
        await repo.update(id, { status: 'rejected', rejectionReason: reason });

        return { success: true };
    },
};
