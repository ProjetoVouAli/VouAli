<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Clock, CircleDollarSign } from 'lucide-svelte';

	const searchParams = $state(page.url.searchParams);
	let searchParam = $state(searchParams.get('search') || '');
	let selectedCategories: string[] = $state(
		searchParams.get('tags') ? searchParams.get('tags')!.split(',') : []
	);

	let { data }: { data: PageData } = $props();

	function updateSearch() {
		const params = new URLSearchParams(page.url.searchParams);

		if (selectedCategories.length > 0) {
			params.set('tags', selectedCategories.join(','));
		} else {
			params.delete('tags');
		}

		if (searchParam) {
			params.set('search', searchParam);
		} else {
			params.delete('search');
		}

		goto(`?${params.toString()}`, { replaceState: true });
	}

	function toggleCategory(categoryName: string) {
		const categoryNameStr = String(categoryName);
		if (selectedCategories.includes(categoryNameStr)) {
			selectedCategories = selectedCategories.filter(c => c !== categoryNameStr);
		} else {
			selectedCategories = [...selectedCategories, categoryNameStr];
		}
		updateSearch();
	}
</script>

<!-- Nike: Search Page com filtros e grid -->
<div class="min-h-screen bg-background pt-32">
	<div class="max-w-7xl mx-auto px-8">
		<!-- Page Header -->
		<div class="mb-16">
			<h1 class="text-5xl font-bold mb-4">
				Explore Destinos
			</h1>
			<p class="text-lg text-muted-foreground">
				Encontre o destino perfeito para suas aventuras
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
			<!-- Sidebar: Filtros -->
			<div class="lg:col-span-1">
				<div class="sticky top-32 space-y-8">
					<!-- Search Input -->
					<div>
						<label for="search-input" class="block text-sm font-bold mb-4 uppercase tracking-wide">
							Buscar
						</label>
						<Input
							id="search-input"
							type="text"
							bind:value={searchParam}
							onchange={updateSearch}
							placeholder="Nome do destino..."
						/>
					</div>

					{#if data.categories && data.categories.length > 0}
						<div>
							<div class="text-sm font-bold mb-4 uppercase tracking-wide">
								Categorias
							</div>
							<div class="space-y-3">
								{#each data.categories as category (category.name)}
									<label class="flex items-center gap-3 cursor-pointer hover:text-foreground transition-colors group">
										<input
											type="checkbox"
											id="category-{category.name}"
											checked={selectedCategories.includes(category.name)}
											onchange={() => toggleCategory(category.name)}
											class="w-4 h-4 cursor-pointer accent-primary"
										/>
										<span class="text-sm font-medium group-hover:font-bold transition-all">
											{category.name}
										</span>
									</label>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Clear Filters -->
					{#if searchParam || selectedCategories.length > 0}
						<Button
							onclick={() => {
								searchParam = '';
								selectedCategories = [];
								updateSearch();
							}}
							variant="outline"
							class="w-full"
						>
							Limpar Filtros
						</Button>
					{/if}
				</div>
			</div>

			<!-- Main: Results -->
			<div class="lg:col-span-3">
				{#if data.destinations && data.destinations.length > 0}
					<div class="mb-8">
						<p class="text-sm text-muted-foreground font-medium">
							{data.destinations.length} resultado{data.destinations.length !== 1 ? 's' : ''} encontrado{data.destinations.length !== 1 ? 's' : ''}
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						{#each data.destinations as destination (destination.id)}
							<a href={`/destination/${destination.slug}`} class="group">
								<Card class="rounded-none overflow-hidden hover:shadow-2xl transition-all duration-300 border-border flex flex-col h-full">
									<div class="h-56 bg-muted overflow-hidden shrink-0">
										{#if destination.images && destination.images.length > 0}
											<img
												src={destination.images[0].url}
												alt={destination.name}
												class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
											/>
										{:else}
											<div class="w-full h-full flex items-center justify-center text-muted-foreground">
												Sem imagem
											</div>
										{/if}
									</div>

									<CardContent class="p-6 flex-1 flex flex-col">
										<div class="flex gap-2 flex-wrap mb-3">
											<span class="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-1 {destination.isPublic ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}">
												{destination.isPublic ? 'Público' : 'Privado'}
											</span>
											{#if destination.categories && destination.categories.length > 0}
												<span class="inline-block text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border px-2 py-1">
													{destination.categories[0]}
												</span>
											{/if}
										</div>

										<h3 class="text-xl font-bold group-hover:underline transition-all line-clamp-1 mb-2 cursor-help" title={destination.name}>
											{destination.name}
										</h3>

										{#if destination.description}
											<p class="text-sm text-muted-foreground line-clamp-2 mb-4 cursor-help flex-1" title={destination.description}>
												{destination.description}
											</p>
										{/if}

										<div class="flex flex-col gap-1 mb-4 mt-auto">
											{#if destination.openingHours}
												<div class="flex items-center text-xs text-muted-foreground gap-1.5">
													<Clock class="w-3.5 h-3.5" />
													<span class="truncate">{destination.openingHours}</span>
												</div>
											{/if}
											{#if !destination.isPublic && destination.price}
												<div class="flex items-center text-xs text-muted-foreground gap-1.5">
													<CircleDollarSign class="w-3.5 h-3.5" />
													<span class="truncate">{destination.price}</span>
												</div>
											{/if}
										</div>

										<div class="pt-4 border-t border-border">
											<span class="text-xs font-bold uppercase tracking-wide text-foreground group-hover:gap-2 flex items-center transition-all">
												Saiba Mais
												<span class="ml-2">→</span>
											</span>
										</div>
									</CardContent>
								</Card>
							</a>
						{/each}
					</div>

				{:else}
					<div class="py-20 text-center space-y-6">
						<div class="text-6xl mb-4">🔍</div>
						<h3 class="text-2xl font-bold">
							Nenhum destino encontrado
						</h3>
						<p class="text-muted-foreground text-lg">
							{#if searchParam || selectedCategories.length > 0}
								Tente ajustar seus filtros de busca
							{:else}
								Comece buscando por um destino
							{/if}
						</p>
						{#if searchParam || selectedCategories.length > 0}
							<Button
								onclick={() => {
									searchParam = '';
									selectedCategories = [];
									updateSearch();
								}}
							>
								Limpar Filtros
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
