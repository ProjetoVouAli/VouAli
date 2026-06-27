import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { TipoUsuario } from '$lib/server/db/entities/Usuario';

export const load: PageServerLoad = async ({ locals }) => {
    const user = await locals.databaseUser();
    
    // Proteção rigorosa de rota
    if (!user || (!user.papeis?.includes(TipoUsuario.PARCEIRO) && !user.papeis?.includes(TipoUsuario.ADMINISTRADOR))) {
        throw error(403, 'Acesso restrito. Área exclusiva para parceiros.');
    }

    const destinationRepo = AppDataSource.getRepository(Destination);
    
    // Busca os destinos criados por ESTE parceiro, trazendo as categorias e as imagens
    const destinations = await destinationRepo.find({
        where: { createdBy: { id: user.id } },
        relations: ['images', 'categories'],
        order: { createdAt: 'DESC' }
    });

    return { 
        destinations: structuredClone(destinations) 
    };
};

export const actions: Actions = {
    toggleActive: async ({ request, locals }) => {
        const user = await locals.databaseUser();
        if (!user || (!user.papeis?.includes(TipoUsuario.PARCEIRO) && !user.papeis?.includes(TipoUsuario.ADMINISTRADOR))) {
            throw error(403, 'Acesso restrito.');
        }

        const data = await request.formData();
        const destId = parseInt(data.get('id') as string);
        const newActiveState = data.get('active') === 'true';

        const destinationRepo = AppDataSource.getRepository(Destination);
        const destination = await destinationRepo.findOne({
            where: { id: destId, createdBy: { id: user.id } } // Garante que o usuário só mexe nos próprios destinos
        });

        if (!destination) {
            throw error(404, 'Destino não encontrado ou você não tem permissão para editá-lo.');
        }

        destination.active = newActiveState;
        await destinationRepo.save(destination);

        return { success: true };
    }
};
