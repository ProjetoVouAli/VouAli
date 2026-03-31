import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { DestinationCategory } from '$lib/server/db/entities/DestinationCategory';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const searchParams = url.searchParams;
    const searchParam = searchParams.get("search");
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : undefined;

    const destinationRepo = AppDataSource.getRepository(Destination);
    const categoryRepo = AppDataSource.getRepository(DestinationCategory);

    // 1. Joins simplificados: chamamos apenas 'categories' agora!
    const qb = destinationRepo.createQueryBuilder("destination")
        .leftJoinAndSelect("destination.images", "image")
        .leftJoinAndSelect("destination.categories", "category"); 

    // 2. Filtro de pesquisa
    if (searchParam) {
        qb.andWhere("destination.name ILIKE :search", { search: `%${searchParam}%` });
    }

    // 3. Filtro de Tags (Subquery atualizada para usar a relação ManyToMany)
    if (tags && tags.length > 0) {
        qb.andWhere(sub => {
            const subQuery = sub.subQuery()
                .select("d.id")
                .from(Destination, "d")
                .innerJoin("d.categories", "c") // Usa a relação direta criada pelo TypeORM
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

    // 4. Formatação: pegamos o array de objetos 'categories' e transformamos em array de strings
    const formattedDestinations = rawDestinations.map(dest => {
        return {
            ...dest,
            categories: dest.categories.map(c => c.name), // Extrai apenas o nome
            images: dest.images
        };
    });

    const allCategories = await categoryRepo.find({
        select: ["name"],
        order: { name: "ASC" }
    });

    return {
        destinations: structuredClone(formattedDestinations),
        categories: structuredClone(allCategories)
    };
};