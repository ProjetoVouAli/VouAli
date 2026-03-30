import type { PageServerLoad } from "../$types";
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { registerWithEmail } from "$lib/auth";
import { resourceLimits } from "worker_threads";

export const load: PageServerLoad = async () => {
    return {
        registerWithEmail: true,
        registerWithGoogle: true
    };
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email =  data.get('email')?.toString().trim()  ??  '';
        const password = data.get('password')?.toString().trim() ?? '';
        const confirmPassword = data.get('confirmPassword')?.toString().trim() ?? '';

        //  VALIDAÇÃO
        if (!email || !password || !confirmPassword) {
            return  fail(400, {
                email,
                message: 'Todos os campos são obrigatórios'
            });
        }

        if (!email.includes('@')) {
            return fail(400, {
                email,
                message: 'Email inválido'
            });
        }

        if (password.length <6) {
            return fail(400, {
                email,
                message: 'Senha deve ter pelo menos6 caracteres'
            });
        }

        if (password !== confirmPassword) {
            return fail(400, {
                email,
                message: 'Senhas não  coincidem'
            });
        }

        try {
            // CADASTRO COM FIREBASE
            const result =  await registerWithEmail(email, password);
            
            if (!result.success) {
                return fail(401, {
                    email,
                    message: result.message
                });
            }

            if (!result.token) {
                return fail(500, {
                    email,
                    message: 'Token de autenticação inválido'
                });
            }

            // GUARDAR TOKEN NOS COOKIES
            cookies.set('authToken', result.token, {
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 7 dias
            });

            // REDIRECIONAR 
            throw redirect(303, '/search');

        } catch (error: any) {
            if (error.location) throw error;

            console.error('Erro ao cadastrar:', error);
            return fail(500, {
                email,
                message: 'Erro ao processar cadastro'
            })
        }
    }
};