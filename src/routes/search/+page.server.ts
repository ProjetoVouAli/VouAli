import { db } from '$lib/server/db';
import { destinations, destinationsCategories, destinationsCategoriesRelation } from '$lib/server/db/schema';
import { and, ilike, eq, inArray, SQL, sql, getTableColumns } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const searchParams = url.searchParams;

	const searchParam = searchParams.get("search");
	const tags = searchParams.get("tags")?.split(",");

	const { id: _, ...destinationColumns } = getTableColumns(destinations);

	const results = await db
		.select({
			...destinationColumns,
			categories: sql<string[]>`array_agg(${destinationsCategories.name})`
		})
		.from(destinations)
		.innerJoin(
			destinationsCategoriesRelation,
			eq(destinationsCategoriesRelation.destinationId, destinations.id)
		)
		.innerJoin(
			destinationsCategories,
			eq(destinationsCategories.id, destinationsCategoriesRelation.destinationCategoryId)
		)
		.groupBy(destinations.id, destinations.name)
		.having(tags ?
			sql`${sql.join(
				tags.map((tag) => sql`bool_or(${destinationsCategories.name} = ${tag})`),
				sql` AND `
			)}` : undefined)
		.where(searchParam ? ilike(destinations.name, `%${searchParam}%`) : undefined);

	return {
		destinations: results,
		categories: await db.query.destinationsCategories.findMany({
			columns: {
				name: true
			}
		})
	};
};