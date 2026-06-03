import { cpf } from 'cpf-cnpj-validator';

/**
 * Validadores centralizados para formulário de parceiro
 * Segue o mesmo padrão de src/lib/server/utils/validators.ts
 */

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Limites de caracteres por campo (segurança)
 */
export const CHAR_LIMITS = {
    NOME_RESPONSAVEL: { min: 3, max: 40 },
    EMAIL: { min: 5, max: 100 },
    TELEFONE: { min: 10, max: 20 },
    NOME_EMPRESA: { min: 3, max: 100 },
    RAZAO_SOCIAL: { min: 3, max: 100 },
    CNPJ: { min: 14, max: 14 },
    SEGMENTO: { min: 3, max: 50 },
    WEBSITE: { min: 7, max: 100 },
    INSTAGRAM: { min: 1, max: 30 },
    WHATSAPP: { min: 10, max: 20 },
    CIDADE: { min: 2, max: 50 },
    ENDERECO: { min: 5, max: 150 },
    DESCRICAO: { min: 20, max: 1000 },
    CEP: { min: 8, max: 8 }
};

/**
 * Valida se o email possui formato básico válido
 */
export function validateEmail(email: string): ValidationResult {
    if (!email.includes('@')) {
        return {
            valid: false,
            message: 'Email inválido'
        };
    }
    return { valid: true };
}

/**
 * Valida se o telefone tem pelo menos 10 dígitos (formato brasileiro)
 */
export function validateTelefone(telefone: string): ValidationResult {
    const digitosApenasNumeros = telefone.replace(/\D/g, '');
    
    if (digitosApenasNumeros.length < 10) {
        return {
            valid: false,
            message: 'Telefone inválido (mínimo 10 dígitos)'
        };
    }
    return { valid: true };
}

/**
 * Valida se o CNPJ é válido (básico - apenas formato)
 * CNPJ: 14 dígitos no formato XX.XXX.XXX/XXXX-XX
 */
export function validateCNPJ(cnpj: string): ValidationResult {
    const digitosApenasNumeros = cnpj.replace(/\D/g, '');
    
    if (digitosApenasNumeros.length !== 14) {
        return {
            valid: false,
            message: 'CNPJ inválido (deve ter 14 dígitos)'
        };
    }
    
    // Verificação simples: não pode ser todos números iguais
    if (/^(\d)\1+$/.test(digitosApenasNumeros)) {
        return {
            valid: false,
            message: 'CNPJ inválido'
        };
    }
    
    return { valid: true };
}

/**
 * Valida se os campos obrigatórios estão preenchidos
 */
export function validateCamposObrigatorios(dados: {
    nomeResponsavel: string;
    emailResponsavel: string;
    telefoneResponsavel: string;
    nomeEmpresa: string;
    cnpj: string;
    segmentoAtuacao: string;
    descricaoNegocio: string;
    cep: string;
    cidade: string;
    estado: string;
    aceiteTermos: boolean;
}): ValidationResult {
    const campos = [
        'nomeResponsavel',
        'emailResponsavel',
        'telefoneResponsavel',
        'nomeEmpresa',
        'cnpj',
        'segmentoAtuacao',
        'descricaoNegocio',
        'cep',
        'cidade',
        'estado'
    ];

    for (const campo of campos) {
        if (!dados[campo as keyof typeof dados]) {
            return {
                valid: false,
                message: 'Todos os campos obrigatórios devem ser preenchidos'
            };
        }
    }

    if (!dados.aceiteTermos) {
        return {
            valid: false,
            message: 'Você deve aceitar os termos e condições'
        };
    }

    return { valid: true };
}

/**
 * Valida se o estado é válido (UF brasileira)
 */
export function validateEstado(estado: string): ValidationResult {
    const estadosValidos = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    if (!estadosValidos.includes(estado.toUpperCase())) {
        return {
            valid: false,
            message: 'Estado inválido'
        };
    }

    return { valid: true };
}

/**
 * Valida se a descrição tem tamanho mínimo
 */
export function validateDescricao(descricao: string, minChars: number = 20): ValidationResult {
    if (descricao.trim().length < minChars) {
        return {
            valid: false,
            message: `Descrição deve ter pelo menos ${minChars} caracteres`
        };
    }

    return { valid: true };
}

/**
 * Valida limites de comprimento por campo
 * @param campo - Nome do campo
 * @param valor - Valor a validar
 * @returns Resultado da validação
 */
export function validateComprimento(campo: keyof typeof CHAR_LIMITS, valor: string): ValidationResult {
    const limits = CHAR_LIMITS[campo];
    const comprimento = valor.trim().length;

    if (comprimento < limits.min) {
        return {
            valid: false,
            message: `Este campo deve ter pelo menos ${limits.min} caracteres`
        };
    }

    if (comprimento > limits.max) {
        return {
            valid: false,
            message: `Este campo não pode ter mais de ${limits.max} caracteres`
        };
    }

    return { valid: true };
}

/**
 * Sanitiza entrada para remover caracteres perigosos
 * Mantém apenas caracteres seguros para cada tipo de campo
 */
export function sanitizarEntrada(valor: string, tipo: 'nome' | 'email' | 'url' | 'texto' = 'texto'): string {
    let sanitizado = valor.trim();

    switch (tipo) {
        case 'email':
            // Email: apenas caracteres alfanuméricos, @, ponto, hífen
            sanitizado = sanitizado.toLowerCase();
            sanitizado = sanitizado.replace(/[^a-z0-9@.\-_+]/g, '');
            break;

        case 'url':
            // URL: permitir caracteres padrão de URL
            sanitizado = sanitizado.replace(/[<>"{}|\\^`[\]]/g, '');
            break;

        case 'nome':
            // Nome: apenas letras, números, espaço, hífen, apóstrofo
            sanitizado = sanitizado.replace(/[^a-záàâãéèêíïóôõöúçñA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ0-9\s\-']/g, '');
            break;

        case 'texto':
            // Texto: remover tags HTML e caracteres de controle
            sanitizado = sanitizado.replace(/[<>{}|\\^`[\]]/g, '');
            sanitizado = sanitizado.replace(/\s+/g, ' '); // Remover espaços duplos
            break;
    }

    return sanitizado.trim();
}

/**
 * Valida CNPJ usando algoritmo de dígito verificador (Lei 11.191/2005)
 * @param cnpj - CNPJ com ou sem formatação
 * @returns Resultado da validação
 */
export function validateCNPJComDigito(cnpj: string): ValidationResult {
    const digitosApenasNumeros = cnpj.replace(/\D/g, '');

    // Verificar comprimento
    if (digitosApenasNumeros.length !== 14) {
        return {
            valid: false,
            message: 'CNPJ inválido (deve ter 14 dígitos)'
        };
    }

    // Verificação simples: não pode ser todos números iguais
    if (/^(\d)\1+$/.test(digitosApenasNumeros)) {
        return {
            valid: false,
            message: 'CNPJ inválido'
        };
    }

    // Cálculo do primeiro dígito verificador
    let soma = 0;
    let multiplicador = 5;
    for (let i = 0; i < 8; i++) {
        soma += parseInt(digitosApenasNumeros.charAt(i)) * multiplicador;
        multiplicador -= 1;
    }
    let resto = soma % 11;
    const primeiroDigito = resto < 2 ? 0 : 11 - resto;

    // Cálculo do segundo dígito verificador
    soma = 0;
    multiplicador = 6;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(digitosApenasNumeros.charAt(i)) * multiplicador;
        multiplicador -= 1;
    }
    resto = soma % 11;
    const segundoDigito = resto < 2 ? 0 : 11 - resto;

    // Validar dígitos
    if (
        primeiroDigito !== parseInt(digitosApenasNumeros.charAt(12)) ||
        segundoDigito !== parseInt(digitosApenasNumeros.charAt(13))
    ) {
        return {
            valid: false,
            message: 'CNPJ inválido'
        };
    }

    return { valid: true };
}

/**
 * Valida se email não foi solicitado nos últimas 24h
 * @param email - Email a verificar
 * @param ultimaSolicitacao - Data da última solicitação (se existir)
 * @returns Resultado da validação
 */
export function validateEmailDuplicadoRecente(ultimaSolicitacao: Date | null): ValidationResult {
    if (!ultimaSolicitacao) {
        return { valid: true };
    }

    const agora = new Date();
    const diferenca = agora.getTime() - ultimaSolicitacao.getTime();
    const horasPassadas = diferenca / (1000 * 60 * 60);

    if (horasPassadas < 24) {
        const horasRestantes = Math.ceil(24 - horasPassadas);
        return {
            valid: false,
            message: `Você já possui uma solicitação em análise. Tente novamente em ${horasRestantes} hora(s).`
        };
    }

    return { valid: true };
}

export function validateCPFComDigito(valor: string) {
    const cleanCPF = valor.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) {
        return { valid: false, message: 'O CPF deve conter 11 dígitos.' };
    }
    
    if (!cpf.isValid(cleanCPF)) {
        return { valid: false, message: 'O CPF informado é matematicamente inválido.' };
    }
    
    return { valid: true, message: 'CPF válido.' };
}