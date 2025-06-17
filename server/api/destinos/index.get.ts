// import { db } from '../../db';

// export default defineEventHandler(async () => {
//     try {
//         // Agora db.destinos estará disponível corretamente
//         const destinos = await db.query.destinos.findMany();
//         return destinos;
//     } catch (error) {
//         console.error('Erro ao buscar destinos:', error);
//         throw createError({
//         statusCode: 500,
//         message: 'Erro ao buscar destinos'
//         });
//     }
// });

// teste mock

import { destinosMock } from '../../mocks/destinos'

export default defineEventHandler(async () => {
    try {
        // Retorna todos os destinos mockados
        return destinosMock
    } catch (error) {
        console.error('Erro ao buscar destinos:', error)
        throw createError({
        statusCode: 500,
        message: 'Erro ao buscar destinos'
        })
    }
})