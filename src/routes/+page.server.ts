import type { PageServerLoad } from './$types';
import { Destination } from '$lib/server/db/entities/Destination';
import { AppDataSource } from '$lib/server/db/data-source';

export const load: PageServerLoad = async ({ url }) => {
    const searchParams = url.searchParams;

    const results = await AppDataSource.getRepository(Destination).find();
    return {
        destinations: structuredClone(results),
    };
};