import type { PageServerLoad } from "../$types";
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { registerWithEmail } from "$lib/auth";
import { setAuthCookie } from '$lib/server/utils/auth';
import { buildAuthSuccessResponse } from '$lib/server/utils/responses';
import { saveUserToDatabase } from "$lib/server/auth/cadastro";

/**
 * Página de Cadastro - Protegida com redirecionamento
 * 
 * Padrão de mercado:
 * - Se já está logado, redireciona para home
 * - Se não está logado, mostra formulário de cadastro
 */
export const load: PageServerLoad = async ({ locals }) => {
    // ✅ Lazy Loading: Verifica apenas se está logado
    const user = await locals.authUser();

    // Se já está logado, redireciona para home
    if (user) {
        throw redirect(303, '/');
    }

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
        const nome = data.get('nome')?.toString().trim() ?? '';
        const sexo = (data.get('sexo')?.toString() ?? 'O') as 'M' | 'F' | 'O';

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
            // 1. CADASTRO COM FIREBASE
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

            // 2. SALVAR NO  BANCO DE  DADOS COM UID DO FIREBASE
            const firebaseUid = result.user?.uid;

            if (!firebaseUid) {
                return fail(500, {
                    email,
                    message: 'Erro ao obter UID do Firebase'
                });
            }
            

            const usuario = await saveUserToDatabase(firebaseUid, email, nome, sexo);

            // 3. GUARDAR TOKEN NOS COOKIES
            // ✅ Usar função centralizada para definir cookie
            setAuthCookie(cookies, result.token);

            // ✅ Usar função centralizada para construir response
            // O frontend vai fazer o redirect após atualizar o store
            return buildAuthSuccessResponse(usuario, '✅ Cadastro realizado com sucesso!');

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
