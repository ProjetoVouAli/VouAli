
import { z } from 'zod';

export const destinationSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    slug: z.string().min(3, 'Slug inválido'),
    description: z.string().min(20, 'A descrição precisa ser mais detalhada (min 20 chars)'),
    summary: z.string().min(10, 'O resumo deve ter pelo menos 10 caracteres'),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Use a sigla de 2 letras'),
    address: z.string().optional().default(''),
    latitude: z.coerce.number().min(-90).max(90, 'Latitude inválida'),
    longitude: z.coerce.number().min(-180).max(180, 'Longitude inválida'),
    active: z.boolean(),
    categories: z.array(z.string()).min(1, 'Adicione pelo menos uma categoria'),
    images: z.array(z.instanceof(File)).optional().default([]),
    imagesToDelete: z.array(z.number()).optional().default([])
});