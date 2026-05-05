import { AppDataSource } from "$lib/server/db/data-source";
import { Destination } from "$lib/server/db/entities/Destination";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/**
 * Página de Destino - Pública
 * 
 * Padrão:
 * - Funciona com ou sem autenticação
 * - Mostra detalhes completos do destino
 * - Usuário é carregado do layout global
 */
export const load: PageServerLoad = async ({ params, locals }) => {
    // ✅ Lazy Loading: Carrega usuário se existir (opcional nesta página)
    const user = await locals.authUser();

    const destinationRepo = AppDataSource.getRepository(Destination);

    const result = await destinationRepo.findOne({
        where: { 
            slug: params.slug 
        },
        relations: {
            images: true,
            categories: true,
        }
    });

    if (!result) {
        throw error(404, "Destino não encontrado");
    }

    const formattedDestination = {
        ...result,
        categories: result.categories.map(c => c.name),
    };

    return {
        destination: structuredClone(formattedDestination),
        user,
    };
};