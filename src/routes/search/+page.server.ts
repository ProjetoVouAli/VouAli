import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { DestinationCategory } from '$lib/server/db/entities/DestinationCategory';
import type { PageServerLoad } from './$types';

/**
 * Página de Busca - Pública
 * 
 * Padrão:
 * - Funciona com ou sem autenticação
 * - Usuário é carregado do layout global se disponível
 * - Suporta filtros de pesquisa e categorias
 */
export const load: PageServerLoad = async ({ url, locals }) => {
    // ✅ Lazy Loading: Carrega usuário se existir (opcional nesta página)
    const user = await locals.authUser();

    const searchParams = url.searchParams;
    const searchParam = searchParams.get("search");
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;

    const destinationRepo = AppDataSource.getRepository(Destination);
    const categoryRepo = AppDataSource.getRepository(DestinationCategory);

    // 1. Query builder com relacionamentos
    const qb = destinationRepo.createQueryBuilder("destination")
        .leftJoinAndSelect("destination.images", "image")
        .leftJoinAndSelect("destination.categories", "category")
        .andWhere("destination.status = :status", { status: 'approved' }); 

    // 2. Filtro de pesquisa
    if (searchParam) {
        qb.andWhere("destination.name ILIKE :search", { search: `%${searchParam}%` });
    }

    // 3. Filtro de Tags (Subquery)
    if (tags && tags.length > 0) {
        qb.andWhere(sub => {
            const subQuery = sub.subQuery()
                .select("d.id")
                .from(Destination, "d")
                .innerJoin("d.categories", "c")
                .where("c.name IN (:...tags)")
                .groupBy("d.id")
                .having("COUNT(DISTINCT c.name) = :tagCount")
                .getQuery();
            
            return `destination.id IN ${subQuery}`;
        });
        
        qb.setParameter("tags", tags);
        qb.setParameter("tagCount", tags.length);
    }

    const rawDestinations = await qb.getMany();

    // 4. Formatação
    const formattedDestinations = rawDestinations.map(dest => {
        return {
            ...dest,
            categories: dest.categories.map(c => c.name),
            images: dest.images
        };
    });

    const allCategories = await categoryRepo.find({
        select: ["id", "name"],
        order: { name: "ASC" }
    });

    return {
        destinations: structuredClone(formattedDestinations),
        categories: structuredClone(allCategories),
        user,
    };
};