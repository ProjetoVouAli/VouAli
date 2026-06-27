import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { TipoUsuario, Usuario } from '$lib/server/db/entities/Usuario';
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
        const solicitacao = await repo.findOne({ where: { id } });
        if (!solicitacao) {
            throw error(404, 'Solicitação não encontrada');
        }

        solicitacao.status = StatusSolicitacao.APROVADA;
        solicitacao.dataAprovaçao = new Date();
        await repo.save(solicitacao);

        // O "Pulo do Gato": Procurar o usuário pelo email
        const userRepo = AppDataSource.getRepository(Usuario);
        const parceiroUser = await userRepo.findOne({ where: { email: solicitacao.emailResponsavel } });
        let jaPossuiConta = false;

        if (parceiroUser) {
            jaPossuiConta = true;
            // Se o usuário existir, adiciona o cargo de Parceiro se ele ainda não tiver
            if (!parceiroUser.papeis.includes(TipoUsuario.PARCEIRO)) {
                parceiroUser.papeis.push(TipoUsuario.PARCEIRO);
                await userRepo.save(parceiroUser);
            }
        }

        // Extrai a URL base do request para que o link do email se adapte automaticamente (localhost, produção, porta customizada, etc)
        const baseUrl = new URL(request.url).origin;

        // Dispara o email assincronamente (não precisa dar await para não travar a UI)
        import('$lib/server/services/email.server').then(({ sendPartnerApprovalEmail }) => {
            sendPartnerApprovalEmail(solicitacao.emailResponsavel, solicitacao.nomeEmpresa, jaPossuiConta, baseUrl);
        });

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
