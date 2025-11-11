import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { destinations } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
    const result = await db.query.destinations.findFirst({
        where: eq(destinations.slug, params.slug),
        with: {
            images: true,
            categoriesRelations: {
                columns: {},
                with: {
                    category: { columns: { name: true } },
                }
            }
        }
    });

    if (!result) {
        return error(404);
    }

    return {
        destination: result
    };
};