import { AppDataSource } from '../db/data-source';
import { SolicitacaoParceiro, StatusSolicitacao } from '../db/entities/SolicitacaoParceiro';

export async function saveSolicitacaoParceiro(dados: {
    nomeResponsavel: string;
    emailResponsavel: string;
    telefoneResponsavel: string;
    nomeEmpresa: string;
    razaoSocial?: string;
    cnpj: string;
    segmentoAtuacao: string;
    descricaoNegocio: string;
    website?: string;
    instagram?: string;
    whatsapp?: string;
    cep: string;
    cidade: string;
    estado: string;
    endereco?: string;
    street?: string;
    number?: string;
    complement?: string;
    aceiteTermos: boolean;
}) {
    const solicitacaoRepository = AppDataSource.getRepository(SolicitacaoParceiro);

    // Verificar se email já existe
    const emailExistente = await solicitacaoRepository.findOne({
        where: { emailResponsavel: dados.emailResponsavel }
    });
    
    if (emailExistente) {
        throw new Error('Email já possui solicitação de parceria');
    }

    // Verificar se CNPJ já existe
    const cnpjExistente = await solicitacaoRepository.findOne({
        where: { cnpj: dados.cnpj }
    });
    
    if (cnpjExistente) {
        throw new Error('CNPJ já possui solicitação de parceria');
    }

    // Criar nova solicitação
    const solicitacao = solicitacaoRepository.create({
        nomeResponsavel: dados.nomeResponsavel,
        emailResponsavel: dados.emailResponsavel,
        telefoneResponsavel: dados.telefoneResponsavel,
        nomeEmpresa: dados.nomeEmpresa,
        razaoSocial: dados.razaoSocial,
        cnpj: dados.cnpj,
        segmentoAtuacao: dados.segmentoAtuacao,
        descricaoNegocio: dados.descricaoNegocio,
        website: dados.website,
        instagram: dados.instagram,
        whatsapp: dados.whatsapp,
        cep: dados.cep,
        cidade: dados.cidade,
        estado: dados.estado,
        endereco: dados.endereco,
        street: dados.street,
        number: dados.number,
        complement: dados.complement,
        aceiteTermos: dados.aceiteTermos,
        status: StatusSolicitacao.PENDENTE
    });

    await solicitacaoRepository.save(solicitacao);
    return solicitacao;
}
