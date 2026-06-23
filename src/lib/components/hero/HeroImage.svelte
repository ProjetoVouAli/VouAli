<script lang="ts">
    import type { HeroTheme } from '$lib/config/hero-themes';

    let { src, alt, theme }: { src: string; alt: string; theme: HeroTheme } = $props();
</script>

<div class="absolute inset-0 z-0 overflow-hidden bg-black">
    <img
        {src}
        {alt}
        loading="lazy"
        class="w-full h-full object-cover opacity-60 transition-all duration-1000 scale-105"
        style="filter: drop-shadow(0 0 10px {theme.colors.primary});"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
</div>
