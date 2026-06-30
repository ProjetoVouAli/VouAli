<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { flash } from '$lib/stores/flash';
  import { invalidateAll } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  let { data }: { data: PageData } = $props();

  let activeTab = $state(page.url.searchParams.get('tab') || 'categories');
  let loading = $state(false);

  $effect(() => {
    const tab = page.url.searchParams.get('tab') || 'categories';
    if (tab !== activeTab) activeTab = tab;
  });

  function selectTab(tab: string) {
    activeTab = tab;
    goto(`?tab=${tab}`, { replaceState: true, noScroll: true, keepFocus: true });
  }
</script>

<div class="min-h-screen bg-background">
  <section class="pt-32 pb-12 px-8 bg-gradient-to-b from-gray-50 to-background dark:from-gray-950 dark:to-background">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
        Configurações da Plataforma
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl">
        Gerencie categorias, cidades atendidas e parâmetros globais da VouAli.
      </p>
    </div>
  </section>

  <section class="py-6 px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Tabs -->
      <div class="flex gap-4 border-b border-border mb-8">
        <button on:click={() => selectTab('categories')}
          class="pb-3 px-4 font-semibold text-sm transition-colors border-b-2 cursor-pointer {activeTab === 'categories' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}">
          Categorias ({data.categories.length})
        </button>
        <button on:click={() => selectTab('cities')}
          class="pb-3 px-4 font-semibold text-sm transition-colors border-b-2 cursor-pointer {activeTab === 'cities' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}">
          Cidades ({data.cities.length})
        </button>

      </div>

      <!-- TAB: Categorias -->
      {#if activeTab === 'categories'}
        <div class="space-y-8">
          <!-- Add form -->
          <Card>
            <CardHeader><CardTitle>Nova Categoria</CardTitle></CardHeader>
            <CardContent>
              <form method="POST" action="?/createCategory" use:enhance class="flex gap-3 items-end">
                <div class="flex-1">
                  <label for="catName" class="block text-sm font-semibold mb-2">Nome</label>
                  <Input id="catName" name="name" placeholder="Ex: Praia, Trilha, Museu" required minlength="2" />
                </div>
                <Button type="submit" disabled={loading}>Adicionar</Button>
              </form>
            </CardContent>
          </Card>

          <!-- List -->
          <div class="space-y-3">
            {#each data.categories as cat (cat.id)}
              <Card>
                <CardContent class="p-4 flex items-center justify-between">
                  <div>
                    <span class="font-semibold">{cat.name}</span>
                    <span class="text-sm text-muted-foreground ml-3">({cat.destinationCount} destino{cat.destinationCount !== 1 ? 's' : ''})</span>
                  </div>
                  <div class="flex gap-2">
                    <form method="POST" action="?/updateCategory" use:enhance class="flex gap-2 items-center">
                      <input type="hidden" name="id" value={cat.id} />
                      <Input name="name" value={cat.name} class="w-40" required />
                      <Button type="submit" variant="outline" size="sm">Salvar</Button>
                    </form>
                    <form method="POST" action="?/deleteCategory" use:enhance={() => {
                      return async ({ result }) => {
                        if (result.type === 'success') await invalidateAll();
                      };
                    }}>
                      <input type="hidden" name="id" value={cat.id} />
                      <Button type="submit" variant="destructive" size="sm"
                        disabled={cat.destinationCount > 0}
                        title={cat.destinationCount > 0 ? 'Remova os destinos vinculados primeiro' : ''}>
                        Excluir
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            {/each}
            {#if data.categories.length === 0}
              <p class="text-center text-muted-foreground py-8">Nenhuma categoria cadastrada.</p>
            {/if}
          </div>
        </div>
      {/if}

      <!-- TAB: Cidades -->
      {#if activeTab === 'cities'}
        <div class="space-y-8">
          <Card>
            <CardHeader><CardTitle>Nova Cidade</CardTitle></CardHeader>
            <CardContent>
              <form method="POST" action="?/createCity" use:enhance class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label for="cityName" class="block text-sm font-semibold mb-2">Nome</label>
                  <Input id="cityName" name="name" placeholder="Ex: Saquarema" required />
                </div>
                <div>
                  <label for="cityState" class="block text-sm font-semibold mb-2">UF</label>
                  <Input id="cityState" name="state" placeholder="RJ" required minlength="2" maxlength="2" class="uppercase" />
                </div>
                <Button type="submit" disabled={loading}>Adicionar Cidade</Button>
              </form>
            </CardContent>
          </Card>

          <div class="space-y-3">
            {#each data.cities as city (city.id)}
              <Card>
                <CardContent class="p-4">
                  <div class="flex flex-wrap gap-3 items-end">
                    <form method="POST" action="?/updateCity" use:enhance class="flex flex-wrap gap-3 items-end">
                      <input type="hidden" name="id" value={city.id} />
                      <div>
                        <label class="block text-xs text-muted-foreground mb-1">Nome</label>
                        <Input name="name" value={city.name} required />
                      </div>
                      <div>
                        <label class="block text-xs text-muted-foreground mb-1">UF</label>
                        <Input name="state" value={city.state} required maxlength="2" class="uppercase w-20" />
                      </div>
                      <div class="text-xs text-muted-foreground font-mono">/{city.slug}</div>
                      <Button type="submit" variant="outline" size="sm">Salvar</Button>
                    </form>
                    <form method="POST" action="?/deleteCity" use:enhance>
                      <input type="hidden" name="id" value={city.id} />
                      <Button type="submit" variant="destructive" size="sm">Excluir</Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            {/each}
            {#if data.cities.length === 0}
              <p class="text-center text-muted-foreground py-8">Nenhuma cidade cadastrada.</p>
            {/if}
          </div>
        </div>
      {/if}


    </div>
  </section>
</div>
