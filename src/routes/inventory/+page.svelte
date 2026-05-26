<script lang="ts">
    import type { PageData } from './$types';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent } from '$lib/components/ui/card';

    const { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-background">
    <section class="pt-32 pb-12 px-8 bg-gradient-to-b from-gray-50 to-background dark:from-gray-950 dark:to-background">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 class="text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
                    Meus Destinos
                </h1>
                <p class="text-lg text-muted-foreground max-w-2xl">
                    Gerencie os locais que você compartilhou na plataforma. Edite informações ou adicione novas aventuras.
                </p>
            </div>
            
            <div class="flex-shrink-0">
                <Button href="/destination/create" size="lg">
                    + Novo Destino
                </Button>
            </div>
        </div>
    </section>

    <section id="destinations" class="py-12 px-8">
        <div class="max-w-7xl mx-auto">
            {#if data.destinations && data.destinations.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {#each data.destinations as destination (destination.id)}
                        <Card class="relative overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group">
                            
                            <a href={`/destination/${destination.slug}`} class="h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden block">
                                {#if destination.images && destination.images.length > 0}
                                    <img
                                        src={destination.images[0].url}
                                        alt={destination.name}
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center text-muted-foreground">
                                        Sem imagem
                                    </div>
                                {/if}
                            </a>

                            <CardContent class="flex-1 flex flex-col pt-6">
                                {#if destination.categories && destination.categories.length > 0}
                                    <span class="inline-block text-xs font-bold uppercase tracking-wide text-muted-foreground border border-border px-3 py-1 mb-3 w-fit">
                                        {destination.categories[0].name || destination.categories[0]}
                                    </span>
                                {/if}

                                <a href={`/destination/${destination.slug}`} class="hover:underline">
                                    <h3 class="text-xl font-bold line-clamp-1 mb-2" title={destination.name}>
                                        {destination.name}
                                    </h3>
                                </a>

                                {#if destination.description}
                                    <p class="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1" title={destination.description}>
                                        {destination.description}
                                    </p>
                                {/if}

                                <div class="pt-4 border-t border-border mt-auto flex items-center justify-between">
                                    <a 
                                        href={`/destination/${destination.slug}`} 
                                        class="text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary flex items-center transition-all"
                                    >
                                        Visualizar
                                        <span class="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                    </a>
                                    
                                    <Button 
                                        href={`/destination/create/${destination.id}`} 
                                        variant="secondary" 
                                        size="sm"
                                    >
                                        Editar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                    <p class="text-xl text-foreground font-medium mb-2">Você ainda não cadastrou nenhum destino.</p>
                    <p class="text-muted-foreground mb-6">Comece a compartilhar seus lugares favoritos com o mundo.</p>
                    <Button href="/destination/create" size="lg">
                        Criar Meu Primeiro Destino
                    </Button>
                </div>
            {/if}
        </div>
    </section>

    <section class="py-12 px-8 border-t border-border/50">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-12">
                <div class="text-center">
                    <p class="text-5xl font-bold mb-2">{data.destinations?.length || 0}</p>
                    <p class="text-muted-foreground">Destinos Registrados</p>
                </div>
                <div class="text-center">
                    <p class="text-5xl font-bold mb-2">Ativo</p> 
                    <p class="text-muted-foreground">Status da Conta</p>
                </div>
                <div class="text-center col-span-2 lg:col-span-1">
                    <p class="text-5xl font-bold mb-2">⭐ 5.0</p>
                    <p class="text-muted-foreground">Avaliação Média</p>
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    :global(body) {
        overflow-x: hidden;
    }
</style>