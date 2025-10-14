import { db } from '$lib/server/db';
import { destinations, destinationsCategories, destinationsCategoriesRelation } from '$lib/server/db/schema';
import { and, ilike, eq, inArray, SQL, sql, getTableColumns } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const searchParams = url.searchParams;

    const results = await db.query.destinations.findMany({columns:{id: false}});
    return {
        destinations: results,
    };
};