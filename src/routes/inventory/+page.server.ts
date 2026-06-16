import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import type { PageServerLoad } from './$types';
// Adjust these imports based on your project's structure


export const load: PageServerLoad = async ({ parent }) => {
    // 1. Get the user from the parent layout
    const { user } = await parent();

    // 2. If there is no user (e.g., not authenticated), return an empty array
    if (!user) {
        return {
            destinations: []
        };
    }

    // 3. Get the TypeORM repository for Destination
    const destinationRepo = AppDataSource.getRepository(Destination);

    // 4. Find all destinations where the 'createdBy' relation matches the user's ID
    const userDestinations = await destinationRepo.find({
        where: {
            createdBy: {
                id: user.id
            }
        },
        // Optional: Include relations if you need to display images/categories on the page
        relations: {
            images: true,
            categories: true
        },
        // Optional: Order by most recently created
        order: {
            createdAt: 'DESC'
        }
    });

    // 5. Return the destinations to your +page.svelte
    return {
        destinations: structuredClone(userDestinations)
    };
};