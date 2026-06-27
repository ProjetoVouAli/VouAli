<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '$lib/components/ui/card';
    import { Separator } from '$lib/components/ui/separator';
    import { flash } from '$lib/stores/flash';
    import { MapPin, Plus, Edit, Power, CheckCircle, Clock, XCircle, Users } from 'lucide-svelte';
    import type { PageData } from './$types';

    let { data } = $props<{ data: PageData }>();
    
    // Usamos $derived no Svelte 5 para manter a reatividade quando o `data` mudar
    let destinations = $derived(data.destinations);

    // Estatísticas Rápidas
    let totalDestinos = $derived(destinations.length);
    let aprovados = $derived(destinations.filter((d: any) => d.status === 'approved').length);
    let pendentes = $derived(destinations.filter((d: any) => d.status === 'pending').length);
    let rejeitados = $derived(destinations.filter((d: any) => d.status === 'rejected').length);

    function getStatusBadgeClass(status: string) {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
        }
    }

    function getStatusLabel(status: string) {
        switch (status) {
            case 'approved': return 'Aprovado';
            case 'pending': return 'Pendente';
            case 'rejected': return 'Rejeitado';
            default: return 'Desconhecido';
        }
    }
</script>

<div class="min-h-screen bg-background pt-28 pb-16 px-4 md:px-8">
    <div class="max-w-7xl mx-auto space-y-8">
        
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 class="text-4xl font-bold tracking-tight">Meu Painel</h1>
                <p class="text-muted-foreground mt-2 text-lg">
                    Gerencie os seus destinos, acompanhe status e edite informações.
                </p>
            </div>
            <Button href="/destination/create" class="flex items-center gap-2">
                <Plus size={20} />
                Novo Destino
            </Button>
        </div>

        <Separator />

        <!-- Estatísticas (Cards) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Total de Destinos</CardTitle>
                    <MapPin class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-3xl font-bold">{totalDestinos}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Aprovados</CardTitle>
                    <CheckCircle class="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-3xl font-bold text-green-500">{aprovados}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Em Análise</CardTitle>
                    <Clock class="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-3xl font-bold text-yellow-500">{pendentes}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Rejeitados</CardTitle>
                    <XCircle class="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div class="text-3xl font-bold text-red-500">{rejeitados}</div>
                </CardContent>
            </Card>
        </div>

        <!-- Lista de Destinos -->
        <h2 class="text-2xl font-bold mt-12 mb-6">Seus Destinos</h2>
        
        {#if destinations.length === 0}
            <div class="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/30">
                <MapPin size={48} class="mx-auto text-muted-foreground/50 mb-4" />
                <h3 class="text-xl font-semibold mb-2">Nenhum destino cadastrado</h3>
                <p class="text-muted-foreground mb-6">Você ainda não enviou nenhum local para a nossa plataforma.</p>
                <Button href="/destination/create">Criar meu primeiro destino</Button>
            </div>
        {:else}
            <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {#each destinations as dest}
                    <Card class="flex flex-col overflow-hidden transition-all hover:shadow-md">
                        <!-- Imagem do Destino -->
                        <div class="h-48 w-full bg-muted relative">
                            {#if dest.images && dest.images.length > 0}
                                <img src={dest.images[0].url} alt={dest.name} class="w-full h-full object-cover" />
                            {:else}
                                <div class="w-full h-full flex items-center justify-center bg-secondary">
                                    <span class="text-muted-foreground font-medium">Sem imagem</span>
                                </div>
                            {/if}
                            
                            <!-- Badges Absolutos -->
                            <div class="absolute top-3 left-3 flex gap-2 flex-wrap">
                                <span class="px-2.5 py-1 rounded-full text-xs font-semibold {getStatusBadgeClass(dest.status)}">
                                    {getStatusLabel(dest.status)}
                                </span>
                                {#if !dest.active}
                                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800 text-white dark:bg-gray-200 dark:text-black">
                                        Pausado
                                    </span>
                                {/if}
                            </div>
                        </div>

                        <CardHeader>
                            <CardTitle class="truncate">{dest.name}</CardTitle>
                            <CardDescription class="truncate">{dest.state} - {dest.slug}</CardDescription>
                        </CardHeader>
                        
                        <CardContent class="flex-grow">
                            {#if dest.status === 'rejected' && dest.rejectionReason}
                                <div class="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm mb-4 border border-red-200 dark:border-red-900/50">
                                    <strong>Motivo da rejeição:</strong><br>
                                    {dest.rejectionReason}
                                </div>
                            {/if}
                            
                            <div class="flex flex-wrap gap-1">
                                {#each dest.categories || [] as cat}
                                    <span class="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                                        {cat.name}
                                    </span>
                                {/each}
                            </div>
                        </CardContent>
                        
                        <Separator />
                        
                        <CardFooter class="p-4 flex gap-2 justify-end bg-muted/10">
                            <!-- Ação de Pausar / Ativar -->
                            <form 
                                action="?/toggleActive" 
                                method="POST"
                                use:enhance={() => {
                                    return async ({ update }) => {
                                        flash.set(dest.active ? 'Destino pausado.' : 'Destino ativado.');
                                        update();
                                    };
                                }}
                            >
                                <input type="hidden" name="id" value={dest.id} />
                                <input type="hidden" name="active" value={!dest.active ? 'true' : 'false'} />
                                <Button 
                                    type="submit" 
                                    variant={dest.active ? "secondary" : "default"}
                                    class="gap-2"
                                >
                                    <Power size={16} />
                                    {dest.active ? 'Pausar' : 'Ativar'}
                                </Button>
                            </form>

                            <!-- Ação de Editar -->
                            <Button href="/destination/create/{dest.slug}" variant="outline" class="gap-2">
                                <Edit size={16} />
                                Editar
                            </Button>
                        </CardFooter>
                    </Card>
                {/each}
            </div>
        {/if}
    </div>
</div>
