import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { TipoUsuario } from '$lib/server/db/entities/Usuario';
import { SolicitacaoParceiro, StatusSolicitacao } from '$lib/server/db/entities/SolicitacaoParceiro';

export const load: PageServerLoad = async ({ locals, url }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
        throw error(403, 'Acesso restrito a administradores');
    }

    const activeTab = url.searchParams.get('tab') || 'destinos';

    // Load pending destinations
    const destinationRepo = AppDataSource.getRepository(Destination);
    const pendingDestinations = await destinationRepo.find({
        where: { status: 'pending' },
        relations: ['images', 'categories', 'createdBy'],
        order: { createdAt: 'ASC' },
    });

    // Load pending partners
    const partnerRepo = AppDataSource.getRepository(SolicitacaoParceiro);
    const pendingPartners = await partnerRepo.find({
        where: { status: StatusSolicitacao.PENDENTE },
        order: { dataSolicitacao: 'ASC' }
    });

    return { 
        destinations: structuredClone(pendingDestinations),
        partners: structuredClone(pendingPartners),
        activeTab 
    };
};

export const actions: Actions = {
    approveDestination: async ({ locals, request }) => {
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

    rejectDestination: async ({ locals, request }) => {
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

    approvePartner: async ({ locals, request }) => {
        const user = await locals.databaseUser();
        if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
            throw error(403, 'Acesso restrito');
        }

        const data = await request.formData();
        const id = parseInt(data.get('id') as string);

        const repo = AppDataSource.getRepository(SolicitacaoParceiro);
        await repo.update(id, { status: StatusSolicitacao.APROVADA, dataAprovaçao: new Date() });

        // Ideia: Aqui seria o lugar ideal para enviar email de aprovação e talvez já criar a conta do parceiro ou atualizar o papel de um usuário existente.

        return { success: true };
    },

    rejectPartner: async ({ locals, request }) => {
        const user = await locals.databaseUser();
        if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
            throw error(403, 'Acesso restrito');
        }

        const data = await request.formData();
        const id = parseInt(data.get('id') as string);
        const reason = (data.get('reason') as string)?.trim() || 'Motivo não informado';

        const repo = AppDataSource.getRepository(SolicitacaoParceiro);
        await repo.update(id, { status: StatusSolicitacao.REJEITADA, motivo: reason });

        return { success: true };
    }
};
