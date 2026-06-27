import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Usuario, TipoUsuario } from '$lib/server/db/entities/Usuario';

export const load: PageServerLoad = async ({ locals }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
        throw error(403, 'Acesso restrito a administradores');
    }

    const userRepository = AppDataSource.getRepository(Usuario);
    
    // Buscar todos os usuários que têm a role PARCEIRO
    const partners = await userRepository
        .createQueryBuilder('usuario')
        .where(':role = ANY(usuario.papeis)', { role: TipoUsuario.PARCEIRO })
        .orderBy('usuario.creationDate', 'DESC')
        .getMany();

    return { 
        partners: structuredClone(partners)
    };
};

export const actions: Actions = {
    revoke: async ({ locals, request }) => {
        const user = await locals.databaseUser();
        if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
            throw error(403, 'Acesso restrito');
        }

        const data = await request.formData();
        const partnerId = parseInt(data.get('id') as string);
        if (!partnerId) {
            return { success: false, message: 'ID do parceiro não informado' };
        }

        const userRepository = AppDataSource.getRepository(Usuario);
        const partner = await userRepository.findOne({ where: { id: partnerId } });

        if (!partner) {
            return { success: false, message: 'Parceiro não encontrado' };
        }

        // Remover a permissão de Parceiro
        partner.papeis = partner.papeis.filter(p => p !== TipoUsuario.PARCEIRO);
        await userRepository.save(partner);

        return { success: true, message: 'Permissão de parceiro revogada com sucesso' };
    }
};
