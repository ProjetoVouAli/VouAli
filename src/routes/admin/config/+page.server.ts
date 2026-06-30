import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { DestinationCategory } from '$lib/server/db/entities/DestinationCategory';
import { City } from '$lib/server/db/entities/City';
import { TipoUsuario } from '$lib/server/db/entities/Usuario';

export const load: PageServerLoad = async ({ locals, url }) => {
  const user = await locals.databaseUser();
  if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) {
    throw error(403, 'Acesso restrito a administradores');
  }

  const activeTab = url.searchParams.get('tab') || 'categories';

  const categoryRepo = AppDataSource.getRepository(DestinationCategory);
  const categories = await categoryRepo.find({
    relations: ['destinations'],
    order: { name: 'ASC' },
  });

  const cityRepo = AppDataSource.getRepository(City);
  const cities = await cityRepo.find({ order: { name: 'ASC' } });



  return {
    activeTab,
    categories: structuredClone(categories.map(c => ({
      id: c.id,
      name: c.name,
      destinationCount: c.destinations?.length || 0,
    }))),
    cities: structuredClone(cities)
  };
};

export const actions: Actions = {
  // --- Categories ---
  createCategory: async ({ locals, request }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) return fail(403);

    const data = await request.formData();
    const name = (data.get('name') as string)?.trim();
    if (!name || name.length < 2) return fail(400, { message: 'Nome da categoria deve ter pelo menos 2 caracteres.' });

    const repo = AppDataSource.getRepository(DestinationCategory);
    const existing = await repo.findOne({ where: { name } });
    if (existing) return fail(400, { message: 'Categoria já existe.' });

    const cat = repo.create({ name });
    await repo.save(cat);
    return { success: true };
  },

  updateCategory: async ({ locals, request }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) return fail(403);

    const data = await request.formData();
    const id = parseInt(data.get('id') as string);
    const name = (data.get('name') as string)?.trim();
    if (!name || name.length < 2) return fail(400, { message: 'Nome deve ter pelo menos 2 caracteres.' });

    const repo = AppDataSource.getRepository(DestinationCategory);
    await repo.update(id, { name });
    return { success: true };
  },

  deleteCategory: async ({ locals, request }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) return fail(403);

    const data = await request.formData();
    const id = parseInt(data.get('id') as string);

    const repo = AppDataSource.getRepository(DestinationCategory);
    const cat = await repo.findOne({ where: { id }, relations: ['destinations'] });
    if (!cat) return fail(404);
    if (cat.destinations?.length > 0) return fail(400, { message: 'Não é possível excluir: há destinos vinculados a esta categoria.' });

    await repo.remove(cat);
    return { success: true };
  },

  // --- Cities ---
  createCity: async ({ locals, request }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) return fail(403);

    const data = await request.formData();
    const name = (data.get('name') as string)?.trim();
    const state = (data.get('state') as string)?.trim().toUpperCase();
    if (!name || name.length < 2) return fail(400, { message: 'Nome da cidade deve ter pelo menos 2 caracteres.' });
    if (!state || state.length !== 2) return fail(400, { message: 'Estado deve ter 2 letras (ex: RJ).' });

    const slug = `${name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}-${state.toLowerCase()}`;

    const repo = AppDataSource.getRepository(City);
    const existing = await repo.findOne({ where: { slug } });
    if (existing) return fail(400, { message: 'Cidade já cadastrada.' });

    const city = repo.create({ name, state, slug });
    await repo.save(city);
    return { success: true };
  },

  updateCity: async ({ locals, request }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) return fail(403);

    const data = await request.formData();
    const id = parseInt(data.get('id') as string);
    const name = (data.get('name') as string)?.trim();
    const state = (data.get('state') as string)?.trim().toUpperCase();
    if (!name || name.length < 2) return fail(400, { message: 'Nome deve ter pelo menos 2 caracteres.' });
    if (!state || state.length !== 2) return fail(400, { message: 'Estado deve ter 2 letras (ex: RJ).' });

    const slug = `${name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}-${state.toLowerCase()}`;

    const repo = AppDataSource.getRepository(City);
    await repo.update(id, { name, state, slug });
    return { success: true };
  },

  deleteCity: async ({ locals, request }) => {
    const user = await locals.databaseUser();
    if (!user || !user.papeis?.includes(TipoUsuario.ADMINISTRADOR)) return fail(403);

    const data = await request.formData();
    const id = parseInt(data.get('id') as string);

    const repo = AppDataSource.getRepository(City);
    await repo.delete(id);
    return { success: true };
  },

};
