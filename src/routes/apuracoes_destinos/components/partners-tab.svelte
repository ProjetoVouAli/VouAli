<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button } from '$lib/components/ui/button';
    import { Card, CardContent } from '$lib/components/ui/card';
    import { flash } from '$lib/stores/flash';
    import { invalidateAll } from '$app/navigation';

    let { partners } = $props();

    let loading = $state(false);

    function formatDate(dateStr: Date | string): string {
        const d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
</script>

{#if partners && partners.length > 0}
    <div class="space-y-6">
        {#each partners as partner (partner.id)}
            <Card class="overflow-hidden">
                <CardContent class="p-6">
                    <div class="flex flex-col lg:flex-row gap-6">
                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-4 mb-2">
                                <div>
                                    <h3 class="text-xl font-bold line-clamp-1">{partner.nomeEmpresa}</h3>
                                    <p class="text-sm text-muted-foreground">
                                        Responsável: {partner.nomeResponsavel} ({partner.emailResponsavel})
                                    </p>
                                </div>
                                <span class="text-xs font-bold uppercase tracking-wide bg-yellow-500 text-black px-3 py-1 rounded-full flex-shrink-0">
                                    Pendente
                                </span>
                            </div>

                            {#if partner.descricaoNegocio}
                                <p class="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {partner.descricaoNegocio}
                                </p>
                            {/if}

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground mb-4 mt-2">
                                <div><span class="font-semibold">CNPJ:</span> {partner.cnpj}</div>
                                <div><span class="font-semibold">Telefone:</span> {partner.telefoneResponsavel}</div>
                                <div><span class="font-semibold">Segmento:</span> {partner.segmentoAtuacao}</div>
                                <div><span class="font-semibold">Local:</span> {partner.cidade} - {partner.estado}</div>
                                <div><span class="font-semibold">Criado em:</span> {formatDate(partner.dataSolicitacao)}</div>
                            </div>

                            <!-- Aprovar -->
                            <div class="border-t border-border pt-4 mt-4">
                                <div class="flex items-center justify-between">
                                    <form method="POST" action="?/approvePartner" use:enhance={() => {
                                        return async ({ result }) => {
                                            if (result.type === 'success') {
                                                flash.set('Parceiro aprovado com sucesso!');
                                                await invalidateAll();
                                            }
                                        };
                                    }}>
                                        <input type="hidden" name="id" value={partner.id} />
                                        <Button type="submit" variant="default" size="sm">
                                            Aprovar Parceiro
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            <!-- Recusar -->
                            <div class="border-t border-destructive/20 pt-4 mt-2">
                                <form method="POST" action="?/rejectPartner" use:enhance={(formData) => {
                                    loading = true;
                                    return async ({ result }) => {
                                        loading = false;
                                        if (result.type === 'success') {
                                            flash.set('Solicitação de parceiro recusada.');
                                            await invalidateAll();
                                        }
                                    };
                                }}>
                                    <input type="hidden" name="id" value={partner.id} />
                                    <label for="reason-{partner.id}" class="block text-xs font-bold uppercase tracking-wide text-destructive mb-2">
                                        Motivo da recusa
                                    </label>
                                    <div class="flex gap-2">
                                        <textarea
                                            id="reason-{partner.id}"
                                            name="reason"
                                            placeholder="Descreva o motivo da recusa..."
                                            required
                                            class="flex-1 px-3 py-2 text-sm border-2 border-destructive/30 bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-destructive resize-none"
                                            rows="2"
                                        ></textarea>
                                        <Button type="submit" variant="destructive" size="default" class="self-end" disabled={loading}>
                                            Recusar Parceiro
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
        <p class="text-xl text-foreground font-medium mb-2">Nenhum parceiro pendente.</p>
        <p class="text-muted-foreground mb-6">Todas as solicitações de parceria já foram analisadas.</p>
    </div>
{/if}
