/**
 * Validadores centralizados para formulário de parceiro
 * Segue o mesmo padrão de src/lib/server/utils/validators.ts
 */

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

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
