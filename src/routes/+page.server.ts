import type { PageServerLoad } from './$types';
import { Destination } from '$lib/server/db/entities/Destination';
import { AppDataSource } from '$lib/server/db/data-source';

/**
 * Home - Página Pública
 * 
 * Padrão:
 * - Funciona com ou sem autenticação
 * - Usuário já carregado do layout global
 * - Mostra conteúdo diferente se logado
 */
export const load: PageServerLoad = async ({ url, locals }) => {
    // Usuário é carregado pelo layout, mas podemos acessar novamente se precisar
    const user = await locals.authUser();

    const searchParams = url.searchParams;
    const results = await AppDataSource.getRepository(Destination).find({
        relations: ['images', 'categories'],
    });

    return {
        destinations: structuredClone(results),
        user, // Passar para frontend se necessário
    };
};