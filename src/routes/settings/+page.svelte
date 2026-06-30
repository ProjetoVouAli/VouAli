<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import { flash } from '$lib/stores/flash';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

  let { data }: { data: PageData } = $props();
  let activeTab = $state(page.url.searchParams.get('tab') || 'profile');

  $effect(() => {
    const t = page.url.searchParams.get('tab') || 'profile';
    if (t !== activeTab) activeTab = t;
  });

  function selectTab(tab: string) {
    activeTab = tab;
    goto('?tab=' + tab, { replaceState: true, noScroll: true, keepFocus: true });
  }
</script>

<div class="min-h-screen bg-background pt-32 pb-16">
  <div class="max-w-3xl mx-auto px-8">
    <h1 class="text-4xl font-bold mb-8">Configurações</h1>

    <div class="flex gap-4 border-b border-border mb-8">
      <button onclick={() => selectTab('profile')}
        class="pb-3 px-4 font-semibold text-sm transition-colors border-b-2 cursor-pointer {activeTab === 'profile' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}">
        Perfil
      </button>
      <button onclick={() => selectTab('security')}
        class="pb-3 px-4 font-semibold text-sm transition-colors border-b-2 cursor-pointer {activeTab === 'security' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground'}">
        Segurança
      </button>
    </div>

    {#if activeTab === 'profile'}
      <Card>
        <CardHeader><CardTitle>Editar Perfil</CardTitle></CardHeader>
        <CardContent>
          <form method="POST" action="?/updateProfile" use:enhance enctype="multipart/form-data" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold mb-2">Nome</label>
              <Input name="nome" value={data.user?.nome || ''} required minlength="2" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Bio</label>
              <textarea name="bio" class="w-full px-3 py-2 border-2 border-primary bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring" rows="4">{data.user?.bio || ''}</textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2">Foto de Perfil</label>
              <input type="file" name="avatar" accept="image/*" class="w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-2 file:border-primary file:bg-background file:text-foreground file:font-semibold file:cursor-pointer hover:file:bg-accent" />
            </div>
            <Button type="submit">Salvar</Button>
          </form>
        </CardContent>
      </Card>
    {/if}

    {#if activeTab === 'security'}
      <Card>
        <CardHeader><CardTitle>Alterar Senha</CardTitle></CardHeader>
        <CardContent>
          <p class="text-muted-foreground mb-4">Um link de redefinição será enviado para seu e-mail cadastrado.</p>
          <form method="POST" action="?/sendResetPassword" use:enhance class="space-y-4">
            <Button type="submit" variant="outline">Enviar Link de Redefinição</Button>
          </form>
        </CardContent>
      </Card>
    {/if}
  </div>
</div>
