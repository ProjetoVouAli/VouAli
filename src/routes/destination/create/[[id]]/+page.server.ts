import { error, redirect, fail } from '@sveltejs/kit';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { TipoUsuario } from '$lib/server/db/entities/Usuario';
import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { destinationSchema } from './schema';
import { DestinationCategory } from '$lib/server/db/entities/DestinationCategory';
import { DestinationImage } from '$lib/server/db/entities/DestinationImage';
import { In } from 'typeorm';
import fs from 'fs';
import path from 'path';

export const load: PageServerLoad = async ({ locals, parent, params }) => {
    const { user } = await parent();

    if (
        !user ||
        (!user.papeis.includes(TipoUsuario.PARCEIRO) &&
            !user.papeis.includes(TipoUsuario.ADMINISTRADOR))
    ) {
        throw error(403, {
            message: 'Acesso negado. Apenas Parceiros ou Administradores podem gerenciar destinos.'
        });
    }

    let initialData: Record<string, unknown> = {
        state: 'RJ',
        active: true,
        latitude: -22.9068,
        longitude: -43.1729,
        categories: [],
        images: [],
        imagesToDelete: [], // Adicionado fallback para deleção
        price: '',
        openingHours: '',
        isPublic: true,
        street: 'Atualizar rua',
        number: 'S/N',
        complement: ''
    };

    let destinationStatus: string | null = null;
    let existingImages: DestinationImage[] = [];

    if (params.id) {
        const destId = parseInt(params.id);
        const whereCondition = isNaN(destId) ? { slug: params.id } : { id: destId };
        
        const destinationRepo = AppDataSource.getRepository(Destination);
        const destination = await destinationRepo.findOne({
            where: whereCondition,
            relations: ['categories', 'images'] // Traz as imagens vinculadas do banco
        });

        if (!destination) {
            throw error(404, 'Destino não encontrado');
        }

        existingImages = destination.images || [];

        initialData = {
            ...destination,
            street: destination.street ?? '',
            number: destination.number ?? '',
            complement: destination.complement ?? '',
            categories: destination.categories?.map(category => category.name) ?? [],
            images: [],
            imagesToDelete: []
        };

        destinationStatus = destination.status;
    }

    const form = await superValidate(initialData, zod(destinationSchema));

    const categories = (await AppDataSource.getRepository(DestinationCategory).find({ order: { name: 'ASC' } })).map(
        (category) => ({
            id: category.id,
            name: category.name
        })
    );
    
    // CORREÇÃO: Agora enviamos o ID da imagem junto com a URL para o frontend poder referenciá-la na hora de apagar
    const imagesData = existingImages.map((image) => ({
        id: image.id, 
        url: image.url
    }));

    return {
        form,
        isEdit: !!params.id,
        categories,
        existingImages: imagesData,
        destinationStatus
    };
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        const user = await locals.databaseUser();
        if (!user || (!user.papeis.includes(TipoUsuario.PARCEIRO) && !user.papeis.includes(TipoUsuario.ADMINISTRADOR))) {
            throw error(403, { message: 'Acesso negado.' });
        }

        const form = await superValidate(request, zod(destinationSchema));

        if (!form.valid) {
            console.error('Validation failed!', JSON.stringify(form.errors, null, 2));
            return fail(400, { form });
        }

        const destinationRepo = AppDataSource.getRepository(Destination);
        const categoryRepo = AppDataSource.getRepository(DestinationCategory);
        const imageRepo = AppDataSource.getRepository(DestinationImage);

        // Separação de arquivos para upload, ids para deleção e dados comuns
        const { categories: inputCategoryNames, images: uploadedFiles, imagesToDelete, ...destinationData } = form.data;

        // 1. Processamento das Tags/Categorias
        let finalCategories: DestinationCategory[] = [];

        if (inputCategoryNames && inputCategoryNames.length > 0) {
            const existingCategories = await categoryRepo.findBy({
                name: In(inputCategoryNames)
            });

            const existingNames = existingCategories.map(c => c.name.toLowerCase());
            
            const newNamesToCreate = inputCategoryNames.filter(
                name => !existingNames.includes(name.toLowerCase())
            );

            let savedNewCategories: DestinationCategory[] = [];
            if (newNamesToCreate.length > 0) {
                const newCategoryEntities = newNamesToCreate.map(name => 
                    categoryRepo.create({ name: name.trim() })
                );
                savedNewCategories = await categoryRepo.save(newCategoryEntities);
            }

            finalCategories = [...existingCategories, ...savedNewCategories];
        }

        let destinationId: number;

        // 2. Persistência da Entidade Principal (Destination)
        if (params.id) {
            const destId = parseInt(params.id);
            const whereCondition = isNaN(destId) ? { slug: params.id } : { id: destId };

            const existingDestination = await destinationRepo.findOne({
                where: whereCondition,
                relations: ['categories']
            });

            if (!existingDestination) {
                throw error(404, 'Destino não encontrado para atualização.');
            }

            destinationRepo.merge(existingDestination, destinationData);
            existingDestination.categories = finalCategories;

            if (existingDestination.status === 'rejected') {
                existingDestination.status = 'pending';
                existingDestination.rejectionReason = null;
            }

            await destinationRepo.save(existingDestination);
            destinationId = existingDestination.id;
        } else {
            const isAdmin = user.papeis.includes(TipoUsuario.ADMINISTRADOR);

            const newDestination = destinationRepo.create({
                ...destinationData,
                categories: finalCategories,
                createdBy: user,
                status: isAdmin ? 'approved' : 'pending',
            });

            const createdDestination = await destinationRepo.save(newDestination);
            destinationId = createdDestination.id;
        }

        // 3. Exclusão de Imagens Antigas (Arquivos Locais + Banco de Dados)
        if (imagesToDelete && imagesToDelete.length > 0) {
            const imagesToRemove = await imageRepo.findBy({
                id: In(imagesToDelete),
                destinationId: destinationId // Garante que a imagem pertence a este destino
            });

            for (const img of imagesToRemove) {
                try {
                    // O path.join com process.cwd() vai apontar certinho para a pasta do projeto
                    // Exemplo: process.cwd() + 'static' + '/upload/arquivo.png'
                    const filePath = path.join(process.cwd(), 'static', img.url);
                    
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath); // Apaga o arquivo físico do HD
                    }
                } catch (err) {
                    console.error(`Erro ao apagar arquivo de imagem (${img.url}):`, err);
                }
            }

            if (imagesToRemove.length > 0) {
                await imageRepo.remove(imagesToRemove); // Remove os registros da tabela relacional
            }
        }

        // 4. Processamento e Upload de Novas Imagens
        if (uploadedFiles && uploadedFiles.length > 0) {
            const uploadDir = path.join(process.cwd(), 'static', 'upload');
            
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            for (const file of uploadedFiles) {
                if (file instanceof File && file.size > 0 && file.name !== 'undefined') {
                    const timestamp = Date.now();
                    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                    const fileName = `${timestamp}-${sanitizedName}`;
                    const filePath = path.join(uploadDir, fileName);

                    // Escrita do buffer em disco
                    const buffer = Buffer.from(await file.arrayBuffer());
                    fs.writeFileSync(filePath, buffer);

                    // Geração da URL estática e vinculo com o ID na tabela
                    const publicUrl = `/upload/${fileName}`;
                    const destinationImage = imageRepo.create({
                        url: publicUrl,
                        destinationId: destinationId
                    });
                    
                    await imageRepo.save(destinationImage);
                }
            }
        }

        throw redirect(303, `/destination/create/${destinationId}`);
    }
};