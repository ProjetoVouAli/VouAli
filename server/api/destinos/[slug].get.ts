import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { destinos } from '../../db/schema';

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({
        statusCode: 400,
        message: 'Slug é obrigatório'
        });
    }

    try {
        // Consulta com o slug
        const destino = await db.query.destinos.findFirst({
        where: eq(destinos.slug, slug)
        });

        if (!destino) {
        throw createError({
            statusCode: 404,
            message: `Destino com slug ${slug} não encontrado`
        });
        }

        return destino;
    } catch (error) {
        console.error(`Erro ao buscar destino ${slug}:`, error);
        throw createError({
        statusCode: 500,
        message: `Erro ao buscar destino ${slug}`
        });
    }
});