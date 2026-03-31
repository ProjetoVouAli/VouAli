import { AppDataSource } from "$lib/server/db/data-source";
import { Destination } from "$lib/server/db/entities/Destination";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
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

    return {
        destination: structuredClone(result)
    };
};