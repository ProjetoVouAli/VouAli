<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index';
	import MarkerMap from '$lib/components/ui/map/marker-map.svelte';
	import { ChevronLeft } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	const { data }: { data: PageData } = $props();
	const { name, summary, description, image, latitude, longitude, categoriesRelations } =
		data.destination;
</script>

<nav>
	<Button class="p-3 mb-3" href="/">
		<ChevronLeft />
		Voltar
	</Button>
</nav>
<section>
	<Card.Root class="mb-5">
		<Card.Header>
			<h1 class="text-4xl font-bold mb-4">{name}</h1>
		</Card.Header>
		<Card.Content>
			<figure class="w-full flex flex-col">
				<img class="rounded-lg w-full max-h-130 object-cover" alt={`${name} image`} src={image} />
				<figurecaption class="pt-4">
					{summary}
				</figurecaption>
			</figure>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Content>
			<section>
				<h1 class="pb-2 font-bold">Descrição:</h1>
				<span>
					{description}
				</span>
			</section>
			<section class="flex items-center">
				<h1 class="pr-3 font-bold">Tags:</h1>
				<ul class="flex gap-3 mt-2">
					{#each categoriesRelations as { category }}
						<li class="p-1 rounded-md bg-secondary"><p>{category.name}</p></li>
					{/each}
				</ul>
			</section>
		</Card.Content>
		<Card.Footer>
			<section class="flex flex-col w-full">
				<h2 class="pb-2 font-bold">Localização:</h2>
				<MarkerMap popupStr={name} latitude={Number(latitude)} longitude={Number(longitude)} />
			</section>
		</Card.Footer>
	</Card.Root>
</section>
