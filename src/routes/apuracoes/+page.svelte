<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import DestinationsTab from './components/destinations-tab.svelte';
    import PartnersTab from './components/partners-tab.svelte';

    const { data }: { data: PageData } = $props();

    // Use local state for immediate UI feedback on click
    let activeTab = $state(page.url.searchParams.get('tab') || 'destinos');

    // Keep state in sync if URL changes externally (e.g. back button)
    $effect(() => {
        const tab = page.url.searchParams.get('tab') || 'destinos';
        if (tab !== activeTab) {
            activeTab = tab;
        }
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
                Central de Apurações
            </h1>
            <p class="text-lg text-muted-foreground max-w-2xl">
                Revise e aprove solicitações de parceiros e destinos recém cadastrados.
            </p>
        </div>
    </section>

    <section class="py-6 px-8">
        <div class="max-w-7xl mx-auto">
            <!-- Tabs Header -->
            <div class="flex gap-4 border-b border-border mb-8">
                <button 
                    type="button"
                    onclick={() => selectTab('destinos')}
                    class="pb-3 px-4 font-semibold text-sm transition-colors border-b-2 cursor-pointer {activeTab === 'destinos' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                >
                    Destinos
                    {#if data.destinations?.length > 0}
                        <span class="ml-2 inline-flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full h-5 px-2">
                            {data.destinations.length}
                        </span>
                    {/if}
                </button>
                <button 
                    type="button"
                    onclick={() => selectTab('parceiros')}
                    class="pb-3 px-4 font-semibold text-sm transition-colors border-b-2 cursor-pointer {activeTab === 'parceiros' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}"
                >
                    Parceiros
                    {#if data.partners?.length > 0}
                        <span class="ml-2 inline-flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full h-5 px-2">
                            {data.partners.length}
                        </span>
                    {/if}
                </button>
            </div>

            <!-- Tab Content -->
            {#if activeTab === 'destinos'}
                <DestinationsTab destinations={data.destinations} />
            {:else if activeTab === 'parceiros'}
                <PartnersTab partners={data.partners} />
            {/if}
        </div>
    </section>
</div>

<style>
    :global(body) { overflow-x: hidden; }
</style>
