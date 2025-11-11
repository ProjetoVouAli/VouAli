<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card/index';
	import MarkerMap from '$lib/components/ui/map/marker-map.svelte';
	import { ChevronLeft } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	const { data }: { data: PageData } = $props();
	const { name, description, images, latitude, longitude, categoriesRelations } = data.destination;
</script>

<nav>
	<Button class="p-3 mb-3" href="/search">
		<ChevronLeft />
		Voltar
	</Button>
</nav>
<section>
	<Card.Root class="mb-5 shadow-2xl relative">
		<Card.Content class="flex flex-col md:flex-row gap-4 relative">
			<section class="flex-1 md:sticky top-3 h-full w-full flex flex-col">
				<Carousel.Root>
					<Carousel.Content>
						{#each images as {url}, idx}
							<Carousel.Item>
								<img class="rounded-lg w-full object-cover" alt={`${name} image ${idx}`} src={url} />
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous class="-left-5" />
					<Carousel.Next class="-right-5" />
				</Carousel.Root>
			</section>
			<section class="flex-1">
				<h1 class="text-2xl font-bold">{name}</h1>
				<section>
					<h1 class="pb-2 font-bold">Descrição:</h1>
					<span class="text-wrap">
						{description}
					</span>
				</section>
				<section class="flex items-center">
					<h1 class="pr-3">Tags:</h1>
					<ul class="flex gap-3 mt-2">
						{#each categoriesRelations as { category }}
							<li class="p-1 rounded-md bg-secondary"><p>{category.name}</p></li>
						{/each}
					</ul>
				</section>
			</section>
		</Card.Content>
	</Card.Root>

	<Card.Root class="inset-shadow-sm/30 m-0">
		<Card.Content>
			<section class="flex flex-col w-full h-90">
				<div class="flex justify-between pb-2">
					<h2 class="pb-2 text-center font-bold">Localize seu Destino:</h2>
					<Button href={`https://www.google.com/maps/search/?api=1&query=${latitude} ${longitude}`}
						>Ver no mapa</Button
					>
				</div>
				<MarkerMap destinations={[data.destination]} />
			</section>
		</Card.Content>
	</Card.Root>
</section>
