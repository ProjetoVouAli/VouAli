import { db } from "~/server/db";


export default defineEventHandler(async () => {
    try {
        const destinos = await db.query.destinos.findMany();
        return destinos;
    } catch (error) {
        console.error('Erro ao buscar destinos:', error);
        throw createError({
            statusCode: 500,
            message: 'Erro ao buscar destinos'
        });
    }
});
