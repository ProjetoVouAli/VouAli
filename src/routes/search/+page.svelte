<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

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
<div class="min-h-screen bg-white dark:bg-black pt-32">
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
						<input
							id="search-input"
							type="text"
							bind:value={searchParam}
							onchange={updateSearch}
							placeholder="Nome do destino..."
							class="w-full px-4 py-3 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
						/>
					</div>

					<!-- Categories Filter -->
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
											class="w-4 h-4 cursor-pointer accent-black dark:accent-white"
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
						<button
							onclick={() => {
								searchParam = '';
								selectedCategories = [];
								updateSearch();
							}}
							class="w-full px-4 py-3 border-2 border-black dark:border-white text-black dark:text-white font-bold text-xs uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200"
						>
							Limpar Filtros
						</button>
					{/if}
				</div>
			</div>

			<!-- Main: Results -->
			<div class="lg:col-span-3">
				{#if data.destinations && data.destinations.length > 0}
					<!-- Results Count -->
					<div class="mb-8">
						<p class="text-sm text-muted-foreground font-medium">
							{data.destinations.length} resultado{data.destinations.length !== 1 ? 's' : ''} encontrado{data.destinations.length !== 1 ? 's' : ''}
						</p>
					</div>

					<!-- Destinations Grid -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
						{#each data.destinations as destination (destination.id)}
							<a href={`/destination/${destination.slug}`} class="group">
								<div class="bg-card dark:bg-card border border-border rounded-none overflow-hidden hover:shadow-2xl transition-all duration-300">
									<!-- Image -->
									<div class="h-56 bg-gray-200 dark:bg-gray-800 overflow-hidden">
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

									<!-- Content -->
									<div class="p-6 space-y-4">
										<!-- Category Badge -->
										{#if destination.categories && destination.categories.length > 0}
											<span class="inline-block text-xs font-bold uppercase tracking-wide text-muted-foreground border border-border px-3 py-1">
												{destination.categories[0]}
											</span>
										{/if}

										<!-- Title -->
										<h3 class="text-xl font-bold group-hover:underline transition-all">
											{destination.name}
										</h3>

										<!-- Description -->
										{#if destination.description}
											<p class="text-sm text-muted-foreground line-clamp-3">
												{destination.description}
											</p>
										{/if}

										<!-- Footer -->
										<div class="pt-4 border-t border-border flex items-center justify-between">
											<span class="text-xs font-bold uppercase tracking-wide">
												Saiba Mais
											</span>
											<span class="group-hover:translate-x-1 transition-transform">→</span>
										</div>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<!-- Empty State -->
					<div class="col-span-3 py-20 text-center space-y-6">
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
							<button
								onclick={() => {
									searchParam = '';
									selectedCategories = [];
									updateSearch();
								}}
								class="mt-4 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
							>
								Limpar Filtros
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
