/**
 * Validadores centralizados para formulários de autenticação
 * Evita duplicação de lógica de validação em múltiplos arquivos
 */

export interface ValidationResult {
    valid: boolean;
    message?: string;
}

/**
 * Valida se o email possui formato básico válido
 * @param email - Email a validar
 * @returns Objeto com status de validação e mensagem de erro (se houver)
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
 * Valida se a senha atende aos requisitos mínimos
 * @param password - Senha a validar
 * @returns Objeto com status de validação e mensagem de erro (se houver)
 */
export function validatePassword(password: string): ValidationResult {
    if (password.length < 6) {
        return {
            valid: false,
            message: 'Senha deve ter pelo menos 6 caracteres'
        };
    }
    return { valid: true };
}
