import type { PageServerLoad, Actions } from "../$types";
import { fail, redirect } from "@sveltejs/kit";
import { loginWithEmail } from "$lib/auth";
import { setAuthCookie } from '$lib/server/utils/auth';
import { buildAuthSuccessResponse } from '$lib/server/utils/responses';
import { AppDataSource } from '$lib/server/db/data-source';
import { Usuario } from '$lib/server/db/entities/Usuario';

/**
 * Página de Login - Protegida com redirecionamento
 * 
 * Padrão de mercado:
 * - Se já está logado, redireciona para home
 * - Se não está logado, mostra formulário
 */
export const load: PageServerLoad = async ({ locals, parent }) => {

    // ✅ Lazy Loading: Verifica apenas se está logado
    const user = await locals.authUser();

    // Se já está logado, redireciona para home
    if (user) {
        throw redirect(303, '/');
    }

    return {
        loginWithEmail: true,
        loginWithGoogle: true
    };
};

export const actions: Actions = {
    login: async ({ request, cookies }) => {
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

            // ✅ Usar função centralizada para definir cookie
            setAuthCookie(cookies, result.token);

            // Buscar usuário no banco pelo email
            const userRepository = AppDataSource.getRepository(Usuario);
            const usuario = await userRepository.findOne({ where: { email } });

            if (!usuario) {
                return fail(500, {
                    email,
                    message: 'Usuário não encontrado no banco de dados'
                });
            }

            // ✅ Usar função centralizada para construir response
            // O frontend vai fazer o redirect após atualizar o store
            return buildAuthSuccessResponse(usuario, '✅ Login realizado com sucesso!');

        } catch (error: any) {
            if (error.location) throw error; //Redirecionar para outro lugar

            console.error('Erro ao fazer Login:', error);
            return fail(500, {
                message: 'Erro interno ao fazer login.'
            })
        }
    },

    google: async ({ request, cookies }) => {
        const data = await request.formData();
        const idToken = data.get('idToken')?.toString().trim();

        if (!idToken) {
            return fail(400, { message: 'Token do Google ausente' });
        }

        try {
            // No servidor, usaremos o admin do Firebase para validar o token
            // Como importar o firebase-admin? 
            // O ideal seria que ele fosse injetado no Locals ou temos import do server
            const { verifyIdToken } = await import('$lib/server/firebase-admin');
            const decodedToken = await verifyIdToken(idToken);

            if (!decodedToken) {
                return fail(401, { message: 'Token do Google inválido ou expirado' });
            }

            const email = decodedToken.email;
            if (!email) {
                return fail(400, { message: 'Conta do Google sem email associado' });
            }

            // GUARDA O TOKEN NO COOKIE SVELTE (Para a sessão)
            setAuthCookie(cookies, idToken);

            const userRepository = AppDataSource.getRepository(Usuario);
            let usuario = await userRepository.findOne({ where: { email } });

            // Se o usuário não existir no banco relacional, criamos ele!
            if (!usuario) {
                // Aqui nós injetamos a verificação de aprovação de parceiro
                const { SolicitacaoParceiro, StatusSolicitacao } = await import('$lib/server/db/entities/SolicitacaoParceiro');
                const solicitacaoRepository = AppDataSource.getRepository(SolicitacaoParceiro);
                const solicitacao = await solicitacaoRepository.findOne({
                    where: { emailResponsavel: email, status: StatusSolicitacao.APROVADA }
                });

                // Define os papeis básicos, ou adiciona PARCEIRO se tiver solicitação aprovada
                const { TipoUsuario } = await import('$lib/server/db/entities/Usuario');
                const papeis = [TipoUsuario.VIAJANTE];
                if (solicitacao) {
                    papeis.push(TipoUsuario.PARCEIRO);
                }

                usuario = userRepository.create({
                    uid: decodedToken.uid,
                    email: email,
                    nome: decodedToken.name || email.split('@')[0],
                    sexo: 'O', // Default
                    estaAutenticado: true,
                    papeis: papeis
                });

                await userRepository.save(usuario);
            }

            return buildAuthSuccessResponse(usuario, '✅ Login com Google realizado com sucesso!');
        } catch (error: any) {
            console.error('Erro no Login com Google:', error);
            return fail(500, { message: 'Erro ao validar token do Google.' });
        }
    }
};
