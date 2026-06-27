<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
    import { Search, UserX } from 'lucide-svelte';
    import * as Dialog from '$lib/components/ui/dialog';

    let { data, form } = $props<{ data: PageData; form: ActionData }>();

    let searchTerm = $state('');
    let isRevoking = $state<number | null>(null);

    let filteredPartners = $derived(
        data.partners?.filter((p: { nome: string; email: string }) => 
            p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []
    );
</script>

<div class="min-h-screen bg-background">
    <!-- Header -->
    <section class="pt-32 pb-8 px-8 bg-gradient-to-b from-gray-50 to-background dark:from-gray-950 dark:to-background">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-4xl font-bold tracking-tight mb-2">Parceiros Cadastrados</h1>
            <p class="text-muted-foreground">Gerencie todos os parceiros ativos na plataforma.</p>
        </div>
    </section>

    <!-- Content -->
    <section class="px-8 pb-16">
        <div class="max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Lista de Parceiros</CardTitle>
                            <CardDescription>
                                Total de {data.partners?.length || 0} parceiros ativos
                            </CardDescription>
                        </div>
                        <div class="relative w-full sm:w-72">
                            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar por nome ou e-mail..."
                                class="pl-9"
                                bind:value={searchTerm}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {#if form?.message}
                        <div class="mb-4 p-4 rounded-md {form.success ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}">
                            {form.message}
                        </div>
                    {/if}

                    <div class="rounded-md border overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                <tr>
                                    <th scope="col" class="px-6 py-3 font-medium">Nome</th>
                                    <th scope="col" class="px-6 py-3 font-medium">E-mail</th>
                                    <th scope="col" class="px-6 py-3 font-medium">Cadastrado em</th>
                                    <th scope="col" class="px-6 py-3 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each filteredPartners as partner}
                                    <tr class="bg-background border-b hover:bg-muted/50 transition-colors last:border-0">
                                        <td class="px-6 py-4 font-medium text-foreground">
                                            {partner.nome}
                                        </td>
                                        <td class="px-6 py-4 text-muted-foreground">
                                            {partner.email}
                                        </td>
                                        <td class="px-6 py-4 text-muted-foreground">
                                            {new Date(partner.creationDate).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <Dialog.Root>
                                                <Dialog.Trigger>
                                                    {#snippet child({ props })}
                                                        <Button 
                                                            {...props}
                                                            variant="destructive" 
                                                            size="sm"
                                                            disabled={isRevoking === partner.id}
                                                        >
                                                            {#if isRevoking === partner.id}
                                                                Aguarde...
                                                            {:else}
                                                                <UserX class="w-4 h-4 mr-2" />
                                                                Revogar Parceiro
                                                            {/if}
                                                        </Button>
                                                    {/snippet}
                                                </Dialog.Trigger>
                                                <Dialog.Content>
                                                    <Dialog.Header>
                                                        <Dialog.Title>Revogar Acesso</Dialog.Title>
                                                        <Dialog.Description>
                                                            Tem certeza que deseja revogar o acesso de <strong>{partner.nome}</strong>? Ele não poderá mais acessar o painel B2B.
                                                        </Dialog.Description>
                                                    </Dialog.Header>
                                                    
                                                    <form 
                                                        action="?/revoke" 
                                                        method="POST"
                                                        use:enhance={() => {
                                                            isRevoking = partner.id;
                                                            return async ({ update }) => {
                                                                await update();
                                                                isRevoking = null;
                                                            };
                                                        }}
                                                        class="flex justify-end gap-3 mt-4"
                                                    >
                                                        <input type="hidden" name="id" value={partner.id} />
                                                        
                                                        <Dialog.Close>
                                                            {#snippet child({ props })}
                                                                <Button {...props} variant="outline" type="button">Cancelar</Button>
                                                            {/snippet}
                                                        </Dialog.Close>
                                                        
                                                        <Button type="submit" variant="destructive" disabled={isRevoking === partner.id}>
                                                            Sim, Revogar
                                                        </Button>
                                                    </form>
                                                </Dialog.Content>
                                            </Dialog.Root>
                                        </td>
                                    </tr>
                                {:else}
                                    <tr>
                                        <td colspan="4" class="px-6 py-8 text-center text-muted-foreground">
                                            Nenhum parceiro encontrado.
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    </section>
</div>
