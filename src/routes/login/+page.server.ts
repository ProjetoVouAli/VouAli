import type { PageServerLoad, Actions } from "../$types";
import { fail, redirect } from "@sveltejs/kit";
import { loginWithEmail } from "$lib/auth";
import { AppDataSource } from '$lib/server/db/data-source';
import { Usuario } from '$lib/server/db/entities/Usuario';

export const load: PageServerLoad = async () => {
    return {
        loginWithEmail: true,
        loginWithGoogle: true
    };
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString().trim() ?? '';
        const password = data.get('password')?.toString().trim() ?? '';

        //VALIDAÇÃO
        if (!email || !password) {
            return fail(400, {
                email,
                message: 'Email e senha são obrigatórios'
            });
        }

        if (!email.includes('@')) {
            return fail(400, {
                email,
                message: 'Email inválido'
            });
        }

        if (password.length < 6) {
            return fail(400, {
                email,
                message: 'Senha deve ter pelo menos 6 caracteres'
            });
        }

        try {
            // LOGIN COM FIREBASE
            const result = await loginWithEmail(email, password);

            if (!result.success) {
                return fail(401, {
                    email,
                    message: result.message
                });
            }

            // GUARDAR TOKEN NOS COOKIES
            if (!result.token) {
                return fail(500, {
                    email,
                    message: 'Token de autenticação inválido'
                });
            }

            cookies.set('authToken', result.token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 dias
            });

            // Buscar usuário no banco pelo email
            const userRepository = AppDataSource.getRepository(Usuario);
            const usuario = await userRepository.findOne({ where: { email } });

            // Retornar dados do usuário para o frontend
            return {
                success: true,
                user: usuario ? { nome: usuario.nome, email: usuario.email } : null,
                message: 'Login realizado com sucesso!'
            };

        } catch (error: any) {
            if (error.location) throw error; //Redirecionar para outro lugar

            console.error('Erro ao fazer Login:', error);
            return fail(500, {
                message: 'Erro interno ao fazer login.'
            })
        }
    }
};
