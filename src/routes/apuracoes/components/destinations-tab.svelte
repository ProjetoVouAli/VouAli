<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent } from '$lib/components/ui/card';
    import { flash } from '$lib/stores/flash';
    import { invalidateAll } from '$app/navigation';

    let { destinations } = $props();

    let loading = $state(false);

    function formatDate(dateStr: Date | string): string {
        const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
</script>

{#if destinations && destinations.length > 0}
    <div class="space-y-6">
        {#each destinations as destination (destination.id)}
            <Card class="overflow-hidden">
                <CardContent class="p-6">
                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- Thumbnail -->
                        <div class="w-full lg:w-48 h-32 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                            {#if destination.images && destination.images.length > 0}
                                <img
                                    src={destination.images[0].url}
                                    alt={destination.name}
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <div class="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                                    Sem imagem
                                </div>
                            {/if}
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <h3 class="text-xl font-bold line-clamp-1">{destination.name}</h3>
                                    <p class="text-sm text-muted-foreground">
                                        Por {destination.createdBy?.nome || destination.createdBy?.email || 'Desconhecido'}
                                    </p>
                                </div>
                                <span class="text-xs font-bold uppercase tracking-wide bg-yellow-500 text-black px-3 py-1 rounded-full flex-shrink-0">
                                    Pendente
                                </span>
                            </div>

                            {#if destination.description}
                                <p class="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {destination.description}
                                </p>
                            {/if}

                            <div class="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                                <span>Criado em: {formatDate(destination.createdAt)}</span>
                                {#if destination.categories?.length}
                                    <span>Categorias: {destination.categories.map((c: any) => c.name).join(', ')}</span>
                                {/if}
                            </div>

                            <!-- Aprovar -->
                            <div class="border-t border-border pt-4 mt-4">
                                <div class="flex items-center justify-between">
                                    <form method="POST" action="?/approveDestination" use:enhance={() => {
                                        return async ({ result }) => {
                                            if (result.type === 'success') {
                                                flash.set('Destino aprovado com sucesso!');
                                                await invalidateAll();
                                            }
                                        };
                                    }}>
                                        <input type="hidden" name="id" value={destination.id} />
                                        <Button type="submit" variant="default" size="sm">
                                            Aprovar
                                        </Button>
                                    </form>

                                    <a href={`/destination/create/${destination.id}`}
                                       class="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                                        Editar →
                                    </a>
                                </div>
                            </div>

                            <!-- Recusar -->
                            <div class="border-t border-destructive/20 pt-4 mt-2">
                                <form method="POST" action="?/rejectDestination" use:enhance={(formData) => {
                                    loading = true;
                                    return async ({ result }) => {
                                        loading = false;
                                        if (result.type === 'success') {
                                            flash.set('Destino recusado.');
                                            await invalidateAll();
                                        }
                                    };
                                }}>
                                    <input type="hidden" name="id" value={destination.id} />
                                    <label for="reason-{destination.id}" class="block text-xs font-bold uppercase tracking-wide text-destructive mb-2">
                                        Motivo da recusa
                                    </label>
                                    <div class="flex gap-2">
                                        <textarea
                                            id="reason-{destination.id}"
                                            name="reason"
                                            placeholder="Descreva o motivo da recusa..."
                                            required
                                            class="flex-1 px-3 py-2 text-sm border-2 border-destructive/30 bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-destructive resize-none"
                                            rows="2"
                                        ></textarea>
                                        <Button type="submit" variant="destructive" size="default" class="self-end" disabled={loading}>
                                            Recusar
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        {/each}
    </div>
{:else}
    <div class="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
        <p class="text-xl text-foreground font-medium mb-2">Nenhum destino pendente.</p>
        <p class="text-muted-foreground mb-6">Todos os destinos cadastrados já foram analisados.</p>
        <Button href="/inventory" variant="outline">
            Ver Meus Destinos
        </Button>
    </div>
{/if}
