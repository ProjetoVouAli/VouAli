import type { PageServerLoad } from './$types';
import { Destination } from '$lib/server/db/entities/Destination';
import { AppDataSource } from '$lib/server/db/data-source';

/**
 * Home - Página Pública
 * 
 * Padrão de Lazy Loading:
 * - Funciona com ou sem autenticação
 * - Usuário já carregado do layout global (não recarregar aqui)
 * - Mostra conteúdo diferente se logado
 * 
 * Performance: Valida autenticação UMA VEZ (no layout)
 */
export const load: PageServerLoad = async ({ url, parent }) => {
    // ✅ Usar parent() para pegar dados do layout (zero validações extras)
    const { user } = await parent();
    
    // Debug: Mostrar apenas uma vez para clareza
    console.log('[HOME PAGE] Carregando destinos. Usuário:', user ? `${user.nome} (${user.email})` : 'Anônimo');

    const searchParams = url.searchParams;
    const results = await AppDataSource.getRepository(Destination).find({
        where: { status: 'approved' },
        relations: ['images', 'categories'],
    });

    const formattedDestinations = results.map(dest => ({
        ...dest,
        categories: dest.categories.map(c => c.name),
    }));

    return {
        destinations: structuredClone(formattedDestinations),
        // Usuário vem do layout, não precisa recarregar aqui!
    };
};