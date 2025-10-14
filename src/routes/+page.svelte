<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import MarkerMap from '$lib/components/ui/map/marker-map.svelte';
	import type { PageData } from './$types';

    const { data } : { data: PageData } = $props();
</script>

<section class="w-full h-full mb-10">
	<img  src="/home-background.jpeg" alt="home" />
</section>

<Card.Root class="mb-10">
	<Card.Title class="text-center text-xl">Encontre cada destino da cidade!</Card.Title>
    <Card.Content class="flex w-full h-90">
        <MarkerMap destinations={data.destinations}/>
    </Card.Content>
</Card.Root>

<Button href="/search/" class="w-full h-lg mb-10">Ver Mais</Button>