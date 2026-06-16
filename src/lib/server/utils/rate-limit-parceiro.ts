import { AppDataSource } from '../db/data-source';
import { SolicitacaoParceiro } from '../db/entities/SolicitacaoParceiro';
import { TentativaSolicitacaoParceiro } from '../db/entities/TentativaSolicitacaoParceiro';

/**
 * Verifica rate limiting por IP
 * Máximo 5 tentativas falhadas em 1 hora
 */
export async function verificarRateLimitingIP(enderecoIP: string): Promise<{ permitido: boolean; mensagem?: string }> {
    const tentativaRepository = AppDataSource.getRepository(TentativaSolicitacaoParceiro);

    // Buscar tentativas falhadas da última 1 hora
    const umAtrásemMinutos = new Date(Date.now() - 60 * 60 * 1000);
    
    const tentativasFalhadas = await tentativaRepository.count({
        where: [
            {
                enderecoIP,
                sucesso: false,
                dataTentativa: new Date(umAtrásemMinutos)
            }
        ]
    });

    if (tentativasFalhadas >= 5) {
        return {
            permitido: false,
            mensagem: 'Muitas tentativas. Tente novamente em 1 hora.'
        };
    }

    return { permitido: true };
}

/**
 * Verifica se email já possui solicitação pendente/em revisão nos últimas 24h
 */
export async function verificarEmailDuplicado(email: string): Promise<{ existe: boolean; ultimaSolicitacao?: Date }> {
    const solicitacaoRepository = AppDataSource.getRepository(SolicitacaoParceiro);

    // Buscar solicitação mais recente (independente do status)
    const solicitacao = await solicitacaoRepository.findOne({
        where: { emailResponsavel: email },
        order: { dataSolicitacao: 'DESC' }
    });

    if (!solicitacao) {
        return { existe: false };
    }

    return {
        existe: true,
        ultimaSolicitacao: solicitacao.dataSolicitacao
    };
}

/**
 * Verifica se CNPJ já possui solicitação
 */
export async function verificarCNPJDuplicado(cnpj: string): Promise<{ existe: boolean }> {
    const solicitacaoRepository = AppDataSource.getRepository(SolicitacaoParceiro);

    const solicitacao = await solicitacaoRepository.findOne({
        where: { cnpj }
    });

    return { existe: !!solicitacao };
}

/**
 * Registra tentativa de solicitação (sucesso ou falha)
 */
export async function registrarTentativa(dados: {
    enderecoIP: string;
    email?: string;
    cnpj?: string;
    sucesso: boolean;
    motivo?: string;
}): Promise<void> {
    const tentativaRepository = AppDataSource.getRepository(TentativaSolicitacaoParceiro);

    const tentativa = tentativaRepository.create({
        enderecoIP: dados.enderecoIP,
        email: dados.email,
        cnpj: dados.cnpj,
        sucesso: dados.sucesso,
        motivo: dados.motivo
    });

    await tentativaRepository.save(tentativa);
}

/**
 * Limpa tentativas antigas (> 1 dia)
 * Executar periodicamente via cron ou background job
 */
export async function limparTentativasAntigas(): Promise<number> {
    const tentativaRepository = AppDataSource.getRepository(TentativaSolicitacaoParceiro);

    const umDiaAtrás = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const resultado = await tentativaRepository.delete({
        dataTentativa: new Date(umDiaAtrás)
    });

    return resultado.affected ?? 0;
}
