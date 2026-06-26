<script lang="ts">
    import type { HeroTheme } from '$lib/config/hero-themes';
    import { Button } from '$lib/components/ui/button';

    let { theme, title, tagline, exploreText, onExplore, onLearnMore }: { 
        theme: HeroTheme; 
        title: string; 
        tagline: string; 
        exploreText?: string;
        onExplore: () => void; 
        onLearnMore: () => void; 
    } = $props();
</script>

<div class="relative z-20 space-y-8 max-w-2xl">
    <div>
        <h1 
            class="{theme.typography.sizes.title} font-bold leading-tight tracking-tight mb-4 transition-colors duration-500"
            style="color: {theme.colors.primary}; font-family: {theme.typography.font};"
        >
            {title}
        </h1>
        <p 
            class="{theme.typography.sizes.subtitle} leading-relaxed transition-colors duration-500"
            style="color: {theme.colors.secondary};"
        >
            {tagline}
        </p>
    </div>

    <div class="flex gap-4 flex-wrap">
        <Button onclick={onExplore} class="text-white hover:opacity-90 hover:scale-105 transition-all duration-300 border-none" style="background-color: {theme.colors.primary};">
            {exploreText || 'Explorar Destinos'}
        </Button>
        <Button onclick={onLearnMore} variant="outline" class="hover:bg-background/20 hover:scale-105 transition-all duration-300" style="color: {theme.colors.primary}; border-color: {theme.colors.primary};">
            Saiba Mais
        </Button>
    </div>
</div>
