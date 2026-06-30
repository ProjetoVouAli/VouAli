import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AppDataSource } from '$lib/server/db/data-source';
import { Destination } from '$lib/server/db/entities/Destination';
import { AvailabilitySlot, DayOfWeek } from '$lib/server/db/entities/AvailabilitySlot';
import { TipoUsuario } from '$lib/server/db/entities/Usuario';

const DAY_LABELS: Record<string, string> = {
  MON: 'Segunda-feira',
  TUE: 'Terça-feira',
  WED: 'Quarta-feira',
  THU: 'Quinta-feira',
  FRI: 'Sexta-feira',
  SAT: 'Sábado',
  SUN: 'Domingo',
};

export const load: PageServerLoad = async ({ locals, params }) => {
  const user = await locals.databaseUser();
  if (!user || (!user.papeis.includes(TipoUsuario.PARCEIRO) && !user.papeis.includes(TipoUsuario.ADMINISTRADOR))) {
    throw error(403, 'Acesso negado. Apenas Parceiros ou Administradores podem gerenciar agendas.');
  }

  const destinationRepo = AppDataSource.getRepository(Destination);
  const destId = parseInt(params.destinationId);
  const destination = await destinationRepo.findOne({
    where: { id: destId },
    relations: ['images'],
  });

  if (!destination) {
    throw error(404, 'Destino não encontrado');
  }

  const slotRepo = AppDataSource.getRepository(AvailabilitySlot);
  const slots = await slotRepo.find({
    where: { destination: { id: destId } },
    order: { dayOfWeek: 'ASC', startTime: 'ASC' },
  });

  return {
    destination: structuredClone(destination),
    slots: structuredClone(slots),
    dayLabels: DAY_LABELS,
  };
};

export const actions: Actions = {
  createSlot: async ({ locals, request, params }) => {
    const user = await locals.databaseUser();
    if (!user || (!user.papeis.includes(TipoUsuario.PARCEIRO) && !user.papeis.includes(TipoUsuario.ADMINISTRADOR))) {
      return fail(403, { message: 'Acesso negado.' });
    }

    const data = await request.formData();
    const dayOfWeek = data.get('dayOfWeek') as string;
    const startTime = data.get('startTime') as string;
    const endTime = data.get('endTime') as string;
    const maxReservations = parseInt(data.get('maxReservations') as string) || 1;

    if (!dayOfWeek || !startTime || !endTime) {
      return fail(400, { message: 'Dia da semana, hora de início e hora de fim são obrigatórios.' });
    }

    if (!Object.values(DayOfWeek).includes(dayOfWeek as DayOfWeek)) {
      return fail(400, { message: 'Dia da semana inválido.' });
    }

    if (startTime >= endTime) {
      return fail(400, { message: 'Hora de início deve ser anterior à hora de fim.' });
    }

    const destId = parseInt(params.destinationId);
    const destinationRepo = AppDataSource.getRepository(Destination);
    const destination = await destinationRepo.findOne({ where: { id: destId } });
    if (!destination) return fail(404, { message: 'Destino não encontrado.' });

    const slotRepo = AppDataSource.getRepository(AvailabilitySlot);
    const slot = slotRepo.create({
      destination,
      dayOfWeek: dayOfWeek as DayOfWeek,
      startTime,
      endTime,
      maxReservations,
    });
    await slotRepo.save(slot);

    return { success: true };
  },

  deleteSlot: async ({ locals, request, params }) => {
    const user = await locals.databaseUser();
    if (!user || (!user.papeis.includes(TipoUsuario.PARCEIRO) && !user.papeis.includes(TipoUsuario.ADMINISTRADOR))) {
      return fail(403, { message: 'Acesso negado.' });
    }

    const data = await request.formData();
    const slotId = parseInt(data.get('slotId') as string);
    if (!slotId) return fail(400, { message: 'ID do slot inválido.' });

    const slotRepo = AppDataSource.getRepository(AvailabilitySlot);
    const slot = await slotRepo.findOne({
      where: { id: slotId, destination: { id: parseInt(params.destinationId) } },
    });
    if (!slot) return fail(404, { message: 'Slot não encontrado.' });

    await slotRepo.remove(slot);
    return { success: true };
  },

  toggleSlot: async ({ locals, request, params }) => {
    const user = await locals.databaseUser();
    if (!user || (!user.papeis.includes(TipoUsuario.PARCEIRO) && !user.papeis.includes(TipoUsuario.ADMINISTRADOR))) {
      return fail(403, { message: 'Acesso negado.' });
    }

    const data = await request.formData();
    const slotId = parseInt(data.get('slotId') as string);
    if (!slotId) return fail(400, { message: 'ID do slot inválido.' });

    const slotRepo = AppDataSource.getRepository(AvailabilitySlot);
    const slot = await slotRepo.findOne({
      where: { id: slotId, destination: { id: parseInt(params.destinationId) } },
    });
    if (!slot) return fail(404, { message: 'Slot não encontrado.' });

    slot.active = !slot.active;
    await slotRepo.save(slot);
    return { success: true };
  },
};
