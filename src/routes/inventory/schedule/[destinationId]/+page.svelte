<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { flash } from '$lib/stores/flash';
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  let { data }: { data: PageData } = $props();

  let loading = $state(false);

  const dayOptions = [
    { value: 'MON', label: 'Segunda-feira' },
    { value: 'TUE', label: 'Terça-feira' },
    { value: 'WED', label: 'Quarta-feira' },
    { value: 'THU', label: 'Quinta-feira' },
    { value: 'FRI', label: 'Sexta-feira' },
    { value: 'SAT', label: 'Sábado' },
    { value: 'SUN', label: 'Domingo' },
  ];

  // Group slots by day
  let groupedSlots = $derived.by(() => {
    const groups: Record<string, typeof data.slots> = {};
    for (const day of dayOptions) {
      groups[day.value] = [];
    }
    for (const slot of data.slots) {
      if (groups[slot.dayOfWeek]) {
        groups[slot.dayOfWeek].push(slot);
      }
    }
    return groups;
  });
</script>

<div class="min-h-screen bg-background">
  <section class="pt-32 pb-12 px-8 bg-gradient-to-b from-gray-50 to-background dark:from-gray-950 dark:to-background">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center gap-3 mb-4">
        <a href="/inventory" class="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          ← Voltar ao Inventário
        </a>
      </div>
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-4xl lg:text-5xl font-bold leading-tight mb-2">
            Agenda: {data.destination.name}
          </h1>
          <p class="text-muted-foreground">
            Defina os horários disponíveis para este destino
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Add slot form -->
  <section class="py-8 px-8">
    <div class="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Horário</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="POST" action="?/createSlot" use:enhance class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label for="dayOfWeek" class="block text-sm font-semibold mb-2">Dia da Semana</label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                required
                class="w-full px-3 py-2 border-2 border-primary bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione</option>
                {#each dayOptions as day}
                  <option value={day.value}>{day.label}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="startTime" class="block text-sm font-semibold mb-2">Início</label>
              <input
                id="startTime"
                type="time"
                name="startTime"
                required
                class="w-full px-3 py-2 border-2 border-primary bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label for="endTime" class="block text-sm font-semibold mb-2">Fim</label>
              <input
                id="endTime"
                type="time"
                name="endTime"
                required
                class="w-full px-3 py-2 border-2 border-primary bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label for="maxReservations" class="block text-sm font-semibold mb-2">Máx. Reservas</label>
              <input
                id="maxReservations"
                type="number"
                name="maxReservations"
                min="1"
                value="1"
                class="w-full px-3 py-2 border-2 border-primary bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <Button type="submit" class="w-full font-bold uppercase tracking-wide" disabled={loading}>
                Adicionar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </section>

  <!-- Slots list -->
  <section class="py-4 px-8 pb-24">
    <div class="max-w-5xl mx-auto">
      {#if data.slots && data.slots.length > 0}
        <div class="space-y-8">
          {#each dayOptions as day}
            {#if groupedSlots[day.value] && groupedSlots[day.value].length > 0}
              <div>
                <h3 class="text-lg font-bold mb-4 uppercase tracking-wide text-muted-foreground border-b border-border pb-2">
                  {day.label}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {#each groupedSlots[day.value] as slot (slot.id)}
                    <Card class={!slot.active ? 'opacity-50 border-dashed' : ''}>
                      <CardContent class="p-4">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="font-bold text-lg">
                              {slot.startTime} – {slot.endTime}
                            </p>
                            <p class="text-xs text-muted-foreground">
                              {slot.maxReservations} reserva{slot.maxReservations !== 1 ? 's' : ''} / slot
                            </p>
                            {#if !slot.active}
                              <span class="text-xs text-amber-600 font-semibold mt-1 block">Inativo</span>
                            {/if}
                          </div>
                          <div class="flex flex-col gap-2">
                            <form method="POST" action="?/toggleSlot" use:enhance>
                              <input type="hidden" name="slotId" value={slot.id} />
                              <Button type="submit" variant={slot.active ? 'outline' : 'default'} size="sm" class="w-full text-xs">
                                {slot.active ? 'Desativar' : 'Ativar'}
                              </Button>
                            </form>
                            <form method="POST" action="?/deleteSlot" use:enhance={() => {
                              return async ({ result }) => {
                                if (result.type === 'success') {
                                  flash.set('Horário removido.');
                                  await invalidateAll();
                                }
                              };
                            }}>
                              <input type="hidden" name="slotId" value={slot.id} />
                              <Button type="submit" variant="destructive" size="sm" class="w-full text-xs">
                                Remover
                              </Button>
                            </form>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  {/each}
                </div>
              </div>
            {/if}
          {/each}
        </div>
      {:else}
        <div class="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
          <p class="text-xl text-foreground font-medium mb-2">Nenhum horário cadastrado.</p>
          <p class="text-muted-foreground">Adicione horários para este destino usando o formulário acima.</p>
        </div>
      {/if}
    </div>
  </section>
</div>
