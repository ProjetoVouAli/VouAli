<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { heroTheme, initializeHeroBanner } from '$lib/stores/hero-banner';
    
    import HeroImage from './HeroImage.svelte';
    import HeroElements from './HeroElements.svelte';
    import HeroContent from './HeroContent.svelte';

    let { destinations } = $props();

    onMount(() => {
        initializeHeroBanner(destinations);
    });

    function handleExplore() {
        if ($heroTheme?.destinationSlug) {
            goto(`/destination/${$heroTheme.destinationSlug}`);
        } else {
            goto('/search');
        }
    }

    function handleLearnMore() {
        const el = document.getElementById('destinations');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
</script>

<section class="relative pt-40 pb-20 px-8 min-h-[80vh] flex items-center overflow-hidden">
    {#if $heroTheme}
        <HeroImage src={$heroTheme.image.url} alt={$heroTheme.image.alt} theme={$heroTheme} />
        <HeroElements theme={$heroTheme} />
        
        <div class="max-w-7xl mx-auto w-full relative z-20">
            <HeroContent 
                theme={$heroTheme}
                title={$heroTheme.destinationSlug ? $heroTheme.image.alt : "Descubra o mundo"}
                tagline={$heroTheme.destinationSlug ? "Confira os detalhes deste lugar incrível e planeje sua viagem." : "Explore os mais incríveis destinos turísticos. Planeje sua próxima aventura com VouAli."}
                exploreText={$heroTheme.destinationSlug ? "Ver Destino" : "Explorar Destinos"}
                onExplore={handleExplore}
                onLearnMore={handleLearnMore}
            />
        </div>
    {:else}
        <!-- Fallback Loading State -->
        <div class="max-w-7xl mx-auto w-full relative z-20">
            <div class="space-y-8 max-w-2xl animate-pulse">
                <div class="h-20 bg-muted rounded w-3/4"></div>
                <div class="h-6 bg-muted rounded w-full"></div>
                <div class="h-6 bg-muted rounded w-5/6"></div>
                <div class="flex gap-4 pt-4">
                    <div class="h-10 bg-muted rounded w-40"></div>
                    <div class="h-10 bg-muted rounded w-32"></div>
                </div>
            </div>
        </div>
    {/if}
</section>
