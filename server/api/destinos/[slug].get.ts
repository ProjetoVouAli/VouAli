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


// Teste para mock 
/* import { destinosMock } from '../../mocks/destinos'

export default defineEventHandler(async (event) => {
    try {
        const slug = getRouterParam(event, 'slug')
        
        // Use dados mockados em vez de consultar o banco de dados
        const destino = destinosMock.find(d => d.slug === slug)
        
        if (!destino) {
        throw createError({
            statusCode: 404,
            message: `Destino com slug ${slug} não encontrado`
        })
        }
        
        return destino
    } catch (error) {
        console.error(`Erro ao buscar destino: ${error}`)
        throw createError({
        statusCode: 500,
        message: 'Erro ao carregar dados do destino'
        })
    }
}) */