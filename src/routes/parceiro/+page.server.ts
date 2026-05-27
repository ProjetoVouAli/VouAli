import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { saveSolicitacaoParceiro } from "$lib/server/auth/parceiro";
import {
    validateEmail,
    validateTelefone,
    validateCNPJ,
    validateCamposObrigatorios,
    validateEstado,
    validateDescricao
} from "$lib/server/utils/validators-parceiro";

/**
 * Página de Solicitação de Parceria
 * 
 * Padrão de mercado:
 * - Página pública (não requer autenticação)
 * - Usuário pode estar logado ou não (indiferente)
 * - Salva solicitação para revisão do admin
 * - Não cria conta imediata (fica PENDENTE)
 */
export const load: PageServerLoad = async () => {
    // Página aberta ao público, sem redirecionamentos
    return {
        title: 'Solicitação de Parceria'
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        // Extrair dados do formulário
        const nomeResponsavel = data.get('nomeResponsavel')?.toString().trim() ?? '';
        const emailResponsavel = data.get('emailResponsavel')?.toString().trim() ?? '';
        const telefoneResponsavel = data.get('telefoneResponsavel')?.toString().trim() ?? '';
        const nomeEmpresa = data.get('nomeEmpresa')?.toString().trim() ?? '';
        const razaoSocial = data.get('razaoSocial')?.toString().trim() ?? '';
        const cnpj = data.get('cnpj')?.toString().trim() ?? '';
        const segmentoAtuacao = data.get('segmentoAtuacao')?.toString().trim() ?? '';
        const descricaoNegocio = data.get('descricaoNegocio')?.toString().trim() ?? '';
        const website = data.get('website')?.toString().trim() ?? '';
        const instagram = data.get('instagram')?.toString().trim() ?? '';
        const whatsapp = data.get('whatsapp')?.toString().trim() ?? '';
        const cidade = data.get('cidade')?.toString().trim() ?? '';
        const estado = data.get('estado')?.toString().trim().toUpperCase() ?? '';
        const endereco = data.get('endereco')?.toString().trim() ?? '';
        const aceiteTermos = data.get('aceiteTermos') === 'on';

        // ===== VALIDAÇÕES =====

        // 1. Campos obrigatórios
        const validacaoCampos = validateCamposObrigatorios({
            nomeResponsavel,
            emailResponsavel,
            telefoneResponsavel,
            nomeEmpresa,
            cnpj,
            segmentoAtuacao,
            descricaoNegocio,
            cidade,
            estado,
            aceiteTermos
        });

        if (!validacaoCampos.valid) {
            return fail(400, {
                email: emailResponsavel,
                message: validacaoCampos.message
            });
        }

        // 2. Email válido
        const validacaoEmail = validateEmail(emailResponsavel);
        if (!validacaoEmail.valid) {
            return fail(400, {
                email: emailResponsavel,
                message: validacaoEmail.message
            });
        }

        // 3. Telefone válido
        const validacaoTelefone = validateTelefone(telefoneResponsavel);
        if (!validacaoTelefone.valid) {
            return fail(400, {
                email: emailResponsavel,
                message: validacaoTelefone.message
            });
        }

        // 4. CNPJ válido
        const validacaoCNPJ = validateCNPJ(cnpj);
        if (!validacaoCNPJ.valid) {
            return fail(400, {
                email: emailResponsavel,
                message: validacaoCNPJ.message
            });
        }

        // 5. Estado válido
        const validacaoEstado = validateEstado(estado);
        if (!validacaoEstado.valid) {
            return fail(400, {
                email: emailResponsavel,
                message: validacaoEstado.message
            });
        }

        // 6. Descrição com tamanho mínimo
        const validacaoDescricao = validateDescricao(descricaoNegocio, 20);
        if (!validacaoDescricao.valid) {
            return fail(400, {
                email: emailResponsavel,
                message: validacaoDescricao.message
            });
        }

        try {
            // Salvar solicitação no banco
            const solicitacao = await saveSolicitacaoParceiro({
                nomeResponsavel,
                emailResponsavel,
                telefoneResponsavel,
                nomeEmpresa,
                razaoSocial: razaoSocial || undefined,
                cnpj,
                segmentoAtuacao,
                descricaoNegocio,
                website: website || undefined,
                instagram: instagram || undefined,
                whatsapp: whatsapp || undefined,
                cidade,
                estado,
                endereco: endereco || undefined,
                aceiteTermos
            });

            console.log(`[PARCEIRO] Solicitação criada: ${solicitacao.id} (${emailResponsavel})`);

            // ✅ Retornar sucesso
            return {
                success: true,
                message: '✅ Solicitação de parceria enviada com sucesso! Analisaremos sua solicitação em breve.',
                solicitacaoId: solicitacao.id
            };

        } catch (error: any) {
            console.error('[PARCEIRO] Erro ao salvar solicitação:', error);

            // Tratar erros específicos
            if (error.message.includes('Email já possui')) {
                return fail(400, {
                    email: emailResponsavel,
                    message: error.message
                });
            }

            if (error.message.includes('CNPJ já possui')) {
                return fail(400, {
                    email: emailResponsavel,
                    message: error.message
                });
            }

            return fail(500, {
                email: emailResponsavel,
                message: 'Erro ao processar solicitação. Tente novamente mais tarde.'
            });
        }
    }
};
