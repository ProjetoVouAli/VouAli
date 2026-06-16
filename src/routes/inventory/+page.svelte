<script lang="ts">
    import type { PageData } from './$types';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent } from '$lib/components/ui/card';

    const { data }: { data: PageData } = $props();

    let totalDestinos = $derived((data.pending?.length || 0) + (data.approved?.length || 0) + (data.rejected?.length || 0));
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

    <!-- Seção: Aguardando Aprovação -->
    {#if data.pending && data.pending.length > 0}
    <section class="py-8 px-8">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center gap-3 mb-8">
                <span class="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                <h2 class="text-2xl font-bold">Aguardando Aprovação</h2>
                <span class="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {data.pending.length}
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each data.pending as destination (destination.id)}
                    {@const totalImagens = destination.images?.length || 0}
                    <Card class="relative overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group border-yellow-500/30">
                        <a href={`/destination/${destination.slug}`} class="h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden block relative">
                            {#if totalImagens > 0}
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
                            <span class="absolute top-3 right-3 text-xs font-bold uppercase tracking-wide bg-yellow-500 text-black px-3 py-1 rounded-full">
                                Pendente
                            </span>
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
        </div>
    </section>
    {/if}

    <!-- Seção: Online -->
    {#if data.approved && data.approved.length > 0}
    <section class="py-8 px-8">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center gap-3 mb-8">
                <span class="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <h2 class="text-2xl font-bold">Online</h2>
                <span class="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {data.approved.length}
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each data.approved as destination (destination.id)}
                    {@const totalImagens = destination.images?.length || 0}
                    <Card class="relative overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group">
                        <a href={`/destination/${destination.slug}`} class="h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden block">
                            {#if totalImagens > 0}
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
        </div>
    </section>
    {/if}

    <!-- Empty State -->
    {#if totalDestinos === 0}
    <section class="py-12 px-8">
        <div class="max-w-7xl mx-auto">
            <div class="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                <p class="text-xl text-foreground font-medium mb-2">Você ainda não cadastrou nenhum destino.</p>
                <p class="text-muted-foreground mb-6">Comece a compartilhar seus lugares favoritos com o mundo.</p>
                <Button href="/destination/create" size="lg">
                    Criar Meu Primeiro Destino
                </Button>
            </div>
        </div>
    </section>
    {/if}

    <!-- Seção: Recusados -->
    {#if data.rejected && data.rejected.length > 0}
    <section class="py-8 px-8">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-center gap-3 mb-8">
                <span class="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                <h2 class="text-2xl font-bold">Recusados</h2>
                <span class="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {data.rejected.length}
                </span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each data.rejected as destination (destination.id)}
                    {@const totalImagens = destination.images?.length || 0}
                    <Card class="relative overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col group border-red-500/30">
                        <a href={`/destination/${destination.slug}`} class="h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden block relative">
                            {#if totalImagens > 0}
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
                            <span class="absolute top-3 right-3 text-xs font-bold uppercase tracking-wide bg-red-500 text-white px-3 py-1 rounded-full">
                                Recusado
                            </span>
                        </a>

                        <CardContent class="flex-1 flex flex-col pt-6">
                            {#if destination.categories?.length}
                                <span class="inline-block text-xs font-bold uppercase tracking-wide text-muted-foreground border border-border px-3 py-1 mb-3 w-fit">
                                    {destination.categories[0].name || destination.categories[0]}
                                </span>
                            {/if}

                            <a href={`/destination/${destination.slug}`} class="hover:underline">
                                <h3 class="text-xl font-bold line-clamp-1 mb-2" title={destination.name}>
                                    {destination.name}
                                </h3>
                            </a>

                            {#if destination.rejectionReason}
                                <div class="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md p-3 mb-4">
                                    <p class="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400 mb-1">Motivo da recusa:</p>
                                    <p class="text-sm text-red-700 dark:text-red-300">{destination.rejectionReason}</p>
                                </div>
                            {/if}

                            <div class="pt-4 border-t border-border mt-auto flex items-center justify-between">
                                <Button
                                    href={`/destination/create/${destination.id}`}
                                    variant="default"
                                    size="sm"
                                >
                                    Editar e Reenviar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                {/each}
            </div>
        </div>
    </section>
    {/if}

    <section class="py-12 px-8 border-t border-border/50">
        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-12">
                <div class="text-center">
                    <p class="text-5xl font-bold mb-2">{totalDestinos}</p>
                    <p class="text-muted-foreground">Destinos Registrados</p>
                </div>
                <div class="text-center">
                    <p class="text-5xl font-bold mb-2">{data.pending?.length || 0}</p>
                    <p class="text-muted-foreground">Pendentes</p>
                </div>
                <div class="text-center">
                    <p class="text-5xl font-bold mb-2">{data.approved?.length || 0}</p>
                    <p class="text-muted-foreground">Online</p>
                </div>
                <div class="text-center">
                    <p class="text-5xl font-bold mb-2">{data.rejected?.length || 0}</p>
                    <p class="text-muted-foreground">Recusados</p>
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
