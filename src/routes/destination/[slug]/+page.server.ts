import { AppDataSource } from "$lib/server/db/data-source";
import { Destination } from "$lib/server/db/entities/Destination";
import { Review } from "$lib/server/db/entities/Review";
import { Usuario } from "$lib/server/db/entities/Usuario";
import { error, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

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
            reviews: {
                usuario: true
            }
        }
    });

    if (!result) {
        throw error(404, "Destino não encontrado");
    }

    const formattedDestination = {
        ...result,
        categories: result.categories.map(c => c.name),
        // Simplificando o usuário da review para não expor dados sensíveis
        reviews: result.reviews?.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            usuario: {
                nome: r.usuario.nome
            }
        })) || []
    };

    return {
        destination: structuredClone(formattedDestination),
        user,
    };
};

export const actions: Actions = {
    submitReview: async ({ request, locals, params }) => {
        const user = await locals.authUser();
        if (!user) {
            return fail(401, { message: "Você precisa estar logado para avaliar." });
        }

        const usuarioRepo = AppDataSource.getRepository(Usuario);
        const dbUser = await usuarioRepo.findOne({ where: { uid: user.uid } });

        if (!dbUser) {
            return fail(401, { message: "Usuário não encontrado no banco de dados." });
        }

        const formData = await request.formData();
        const ratingStr = formData.get('rating');
        const comment = formData.get('comment');

        if (!ratingStr) {
            return fail(400, { message: "A nota é obrigatória." });
        }

        const rating = parseInt(ratingStr.toString());
        if (isNaN(rating) || rating < 1 || rating > 5) {
            return fail(400, { message: "Nota inválida. Deve ser entre 1 e 5." });
        }

        const destinationRepo = AppDataSource.getRepository(Destination);
        const destination = await destinationRepo.findOne({ where: { slug: params.slug } });

        if (!destination) {
            return fail(404, { message: "Destino não encontrado." });
        }

        const reviewRepo = AppDataSource.getRepository(Review);
        const review = new Review();
        review.rating = rating;
        review.comment = comment ? comment.toString() : '';
        review.destination = destination;
        review.usuario = dbUser;

        await reviewRepo.save(review);

        return { success: true };
    }
};