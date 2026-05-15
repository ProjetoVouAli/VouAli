import { fail } from '@sveltejs/kit';
import type { Usuario } from '../db/entities/Usuario';

/**
 * Interface padrão para respostas de autenticação
 * Centraliza a estrutura { success, user, message }
 */
export interface AuthSuccessResponse {
    success: true;
    user: {
        id: number;
        nome: string;
        email: string;
        sexo: 'M' | 'F' | 'O';
        eAdministrador: boolean;
        eParceiro: boolean;
        eViajante: boolean;
    };
    message: string;
}

/**
 * Constrói resposta de sucesso com dados do usuário
 * Evita duplicação da estrutura { success, user, message }
 * 
 * @param usuario - Entidade Usuario do banco
 * @param message - Mensagem de sucesso a exibir
 * @returns Objeto com sucesso e dados do usuário
 */
export function buildAuthSuccessResponse(
    usuario: Usuario,
    message: string
): AuthSuccessResponse {
    return {
        success: true,
        user: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            sexo: usuario.sexo,
            eAdministrador: usuario.eAdministrador,
            eParceiro: usuario.eParceiro,
            eViajante: usuario.eViajante,
        },
        message
    };
}
