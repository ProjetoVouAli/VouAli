import type { PageServerLoad, Actions } from "./$types";
import { fail } from "@sveltejs/kit";
import { saveSolicitacaoParceiro } from "$lib/server/auth/parceiro";
import {
    validateEmail,
    validateTelefone,
    validateCamposObrigatorios,
    validateEstado,
    validateDescricao,
    validateComprimento,
    validateCNPJComDigito,
    validateCPFComDigito,
    validateEmailDuplicadoRecente,
    sanitizarEntrada,
} from "$lib/server/utils/validators-parceiro";
import {
    verificarRateLimitingIP,
    verificarEmailDuplicado,
    verificarCNPJDuplicado,
    registrarTentativa
} from "$lib/server/utils/rate-limit-parceiro";

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
    default: async ({ request, getClientAddress }) => {
        const enderecoIP = getClientAddress();

        // ===== RATE LIMITING =====
        const rateLimitCheck = await verificarRateLimitingIP(enderecoIP);
        if (!rateLimitCheck.permitido) {
            return fail(429, {
                message: rateLimitCheck.mensagem
            });
        }

        const data = await request.formData();

        // Extrair e sanitizar dados do formulário
        const nomeResponsavel = sanitizarEntrada(data.get('nomeResponsavel')?.toString() ?? '', 'nome');
        const emailResponsavel = sanitizarEntrada(data.get('emailResponsavel')?.toString() ?? '', 'email');
        const telefoneResponsavel = (data.get('telefoneResponsavel')?.toString() ?? '').replace(/\D/g, '');
        const nomeEmpresa = sanitizarEntrada(data.get('nomeEmpresa')?.toString() ?? '', 'nome');
        const razaoSocial = sanitizarEntrada(data.get('razaoSocial')?.toString() ?? '', 'texto');
        const cnpj = (data.get('cnpj')?.toString() ?? '').replace(/\D/g, '');
        const segmentoAtuacao = sanitizarEntrada(data.get('segmentoAtuacao')?.toString() ?? '', 'texto');
        const descricaoNegocio = sanitizarEntrada(data.get('descricaoNegocio')?.toString() ?? '', 'texto');
        const website = sanitizarEntrada(data.get('website')?.toString() ?? '', 'url');
        const instagram = sanitizarEntrada(data.get('instagram')?.toString() ?? '', 'texto');
        const whatsapp = (data.get('whatsapp')?.toString() ?? '').replace(/\D/g, '');
        const cep = (data.get('cep')?.toString() ?? '').replace(/\D/g, '');
        const cidade = sanitizarEntrada(data.get('cidade')?.toString() ?? '', 'nome');
        const estado = (data.get('estado')?.toString() ?? '').toUpperCase();
        const endereco = sanitizarEntrada(data.get('endereco')?.toString() ?? '', 'texto');
        const aceiteTermos = data.get('aceiteTermos') === 'on';

        // ===== VALIDAÇÕES CRÍTICAS DE SEGURANÇA =====

        // 1. Validar comprimento de CADA CAMPO
        const validacaoComprimentoNome = validateComprimento('NOME_RESPONSAVEL', nomeResponsavel);
        if (!validacaoComprimentoNome.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoComprimentoNome.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoComprimentoNome.message
            });
        }

        const validacaoComprimentoEmail = validateComprimento('EMAIL', emailResponsavel);
        if (!validacaoComprimentoEmail.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoComprimentoEmail.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoComprimentoEmail.message
            });
        }

        const validacaoComprimentoEmpresa = validateComprimento('NOME_EMPRESA', nomeEmpresa);
        if (!validacaoComprimentoEmpresa.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoComprimentoEmpresa.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoComprimentoEmpresa.message
            });
        }

        const validacaoComprimentoCidade = validateComprimento('CIDADE', cidade);
        if (!validacaoComprimentoCidade.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoComprimentoCidade.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoComprimentoCidade.message
            });
        }

        const validacaoComprimentoDescricao = validateComprimento('DESCRICAO', descricaoNegocio);
        if (!validacaoComprimentoDescricao.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoComprimentoDescricao.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoComprimentoDescricao.message
            });
        }

        // 2. Campos obrigatórios
        const validacaoCampos = validateCamposObrigatorios({
            nomeResponsavel,
            emailResponsavel,
            telefoneResponsavel,
            nomeEmpresa,
            cnpj,
            segmentoAtuacao,
            descricaoNegocio,
            cep,
            cidade,
            estado,
            aceiteTermos
        });

        if (!validacaoCampos.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoCampos.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoCampos.message
            });
        }

        // 3. Email válido
        const validacaoEmail = validateEmail(emailResponsavel);
        if (!validacaoEmail.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoEmail.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoEmail.message
            });
        }

        // 4. Telefone válido
        const validacaoTelefone = validateTelefone(telefoneResponsavel);
        if (!validacaoTelefone.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoTelefone.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoTelefone.message
            });
        }

        // 5. CNPJ com validação de dígito verificador
        // 5. CPF ou CNPJ com validação de dígito verificador
        let validacaoDocumento;
        
        if (cnpj.length === 11) {
            validacaoDocumento = validateCPFComDigito(cnpj);
        } else if (cnpj.length === 14) {
            validacaoDocumento = validateCNPJComDigito(cnpj);
        } else {
            validacaoDocumento = { valid: false, message: 'O documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos válidos.' };
        }

        if (!validacaoDocumento.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                cnpj,
                sucesso: false,
                motivo: validacaoDocumento.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoDocumento.message
            });
        }

        // 6. Estado válido
        const validacaoEstado = validateEstado(estado);
        if (!validacaoEstado.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoEstado.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoEstado.message
            });
        }

        // 7. Descrição com tamanho mínimo
        const validacaoDescricao = validateDescricao(descricaoNegocio, 20);
        if (!validacaoDescricao.valid) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                sucesso: false,
                motivo: validacaoDescricao.message
            });
            return fail(400, {
                email: emailResponsavel,
                message: validacaoDescricao.message
            });
        }

        // ===== VALIDAÇÕES DE DUPLICAÇÃO =====

        // 8. Email duplicado em 24h
        const checkEmailDuplicado = await verificarEmailDuplicado(emailResponsavel);
        if (checkEmailDuplicado.existe) {
            const validacaoEmailRecente = validateEmailDuplicadoRecente(checkEmailDuplicado.ultimaSolicitacao ?? null);
            if (!validacaoEmailRecente.valid) {
                await registrarTentativa({
                    enderecoIP,
                    email: emailResponsavel,
                    sucesso: false,
                    motivo: validacaoEmailRecente.message
                });
                return fail(400, {
                    email: emailResponsavel,
                    message: validacaoEmailRecente.message
                });
            }
        }

        // 9. CNPJ duplicado (sem limite de tempo)
        const checkCNPJDuplicado = await verificarCNPJDuplicado(cnpj);
        if (checkCNPJDuplicado.existe) {
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                cnpj,
                sucesso: false,
                motivo: 'CNPJ já possui solicitação'
            });
            return fail(400, {
                email: emailResponsavel,
                message: 'CNPJ já possui solicitação de parceria'
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
                cep,
                cidade,
                estado,
                endereco: endereco || undefined,
                aceiteTermos
            });

            // Registrar tentativa bem-sucedida
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                cnpj,
                sucesso: true
            });

            console.log(`[PARCEIRO] Solicitação criada: ${solicitacao.id} (${emailResponsavel})`);

            return {
                success: true,
                message: '✅ Solicitação de parceria enviada com sucesso! Analisaremos sua solicitação em breve.',
                solicitacaoId: solicitacao.id
            };

        } catch (error: any) {
            console.error('[PARCEIRO] Erro ao salvar solicitação:', error);

            // Registrar tentativa com erro
            await registrarTentativa({
                enderecoIP,
                email: emailResponsavel,
                cnpj,
                sucesso: false,
                motivo: error.message
            });

            return fail(500, {
                email: emailResponsavel,
                message: 'Erro ao processar solicitação. Tente novamente mais tarde.'
            });
        }
    }
};
