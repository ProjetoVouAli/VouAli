<script lang="ts">
	import Combobox from '$lib/components/ui/combobox/combobox.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { PageData } from './$types';
	import { Input } from '$lib/components/ui/input/index.js';
	import { page } from '$app/state';
	import { Frown } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	const searchParams = $state(page.url.searchParams);

	let searchParam = $state(searchParams.get('search')!);

	let selectedCategories: string[] = $state([]);

	let { data }: { data: PageData } = $props();

	function updateSearch() {
		let params = new URLSearchParams(page.url.searchParams);

		setParam(params, 'tags', selectedCategories.join(','));

		setParam(params, 'search', searchParam);
		console.log(params.toString());
		goto(`?${params.toString()}`, { replaceState: true });
	}

	function setParam(params: URLSearchParams, key: string, value: string) {
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
	}
</script>

<nav class="flex md:flex-row  flex-col mb-5 items-baseline space-x-4 overflow-hidden">
	<div class="flex w-full pb-3 mb:pb-none">
		<h1 class="pr-3">Pesquisa:</h1>
		<Input
			type="text"
			bind:value={searchParam}
			onchange={updateSearch}
			placeholder="Qual será seu próximo destino?"
		/>
	</div>
	<div class="flex max-w-full">
		<h1 class="pr-3 md:pl-3">Categorias:</h1>
		<Combobox
			onclose={updateSearch}
			bind:selected={selectedCategories}
			class="md:w-full"
			items={data.categories.map(({ name }) => ({ value: name, label: name }))}
			notFoundLabel="Nenhuma Tag encontrada"
			selectLabel="Escolha uma Tag"
			askSelectLabel="Selecione as Tags"
		/>
	</div>
</nav>
<section class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
	{#each data.destinations as { name, images, slug, summary }}
		<a href="/destination/{slug}">
			<Card.Root
				class="transform transition-transform duration-300 
            hover:scale-105 pt-5 items-center"
			>
				<Card.Title>{name}</Card.Title>
				<Card.Content>
					<img class="rounded-lg w-60 h-40 object-cover" alt={`${name} image`} src={images[0].url} />
				</Card.Content>
				<Card.Footer>
					<description class=" text-left">{summary}</description>
				</Card.Footer>
			</Card.Root>
		</a>
	{/each}
</section>
{#if data.destinations.length == 0}
	<Card.Root class="pt-5 items-center p-5">
		<Card.Title>
			<h1 class="text-3xl">Não encontramos um destino</h1>
		</Card.Title>
		<Card.Content>
			<Frown class="w-15 h-15" />
		</Card.Content>
	</Card.Root>
{/if}
