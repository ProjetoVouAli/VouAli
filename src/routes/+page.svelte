<script lang="ts">
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
</script>

<!-- Nike: Hero Section com design moderno -->
<div class="min-h-screen bg-white dark:bg-black">
	<!-- Hero Section -->
	<section class="pt-40 pb-20 px-8">
		<div class="max-w-7xl mx-auto">
			<!-- Hero Content -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
				<!-- Left: Text -->
				<div class="space-y-8">
					<div>
						<h1 class="text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4">
							Descubra o mundo
						</h1>
						<p class="text-xl text-muted-foreground leading-relaxed max-w-lg">
							Explore os mais incríveis destinos turísticos. Planeje sua próxima aventura com VouAli.
						</p>
					</div>

					<!-- CTA Button -->
					<div class="flex gap-4 flex-wrap">
						<a
							href="/search"
							class="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
						>
							Explorar Destinos
						</a>
						<a
							href="#destinations"
							class="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200"
						>
							Saiba Mais
						</a>
					</div>
				</div>

				<!-- Right: Image -->
				<div class="h-96 lg:h-full rounded-none overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
					<img
						src="/home-background.jpeg"
						alt="Destino Hero"
						class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured Destinations Section -->
	<section id="destinations" class="py-20 px-8 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
		<div class="max-w-7xl mx-auto">
			<!-- Section Header -->
			<div class="mb-16">
				<h2 class="text-5xl font-bold mb-4">
					Destinos em Destaque
				</h2>
				<p class="text-lg text-muted-foreground max-w-2xl">
					Confira alguns dos destinos mais populares e visitados.
				</p>
			</div>

			<!-- Destinations Grid -->
			{#if data.destinations && data.destinations.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{#each data.destinations.slice(0, 6) as destination (destination.id)}
						<a href={`/destination/${destination.slug}`} class="group">
							<div class="bg-card dark:bg-card border border-border rounded-none overflow-hidden hover:shadow-2xl transition-shadow duration-300">
								<!-- Image -->
								<div class="h-64 bg-gray-200 dark:bg-gray-800 overflow-hidden">
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
										<p class="text-sm text-muted-foreground line-clamp-2">
											{destination.description}
										</p>
									{/if}

									<!-- Learn More -->
									<div class="pt-4 border-t border-border">
										<span class="text-xs font-bold uppercase tracking-wide text-foreground group-hover:gap-2 flex items-center transition-all">
											Saiba Mais
											<span class="ml-2">→</span>
										</span>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>

				<!-- View All Button -->
				<div class="mt-16 text-center">
					<a
						href="/search"
						class="inline-block px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200"
					>
						Ver Todos os Destinos
					</a>
				</div>
			{:else}
				<div class="text-center py-16">
					<p class="text-lg text-muted-foreground">Nenhum destino disponível no momento.</p>
					<a href="/search" class="mt-4 inline-block text-black dark:text-white font-bold hover:underline">
						Voltar para busca
					</a>
				</div>
			{/if}
		</div>
	</section>

	<!-- Stats Section -->
	<section class="py-20 px-8">
		<div class="max-w-7xl mx-auto">
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-12">
				<div class="text-center">
					<p class="text-5xl font-bold mb-2">{data.destinations?.length || 0}+</p>
					<p class="text-muted-foreground">Destinos</p>
				</div>
				<div class="text-center">
					<p class="text-5xl font-bold mb-2">1000+</p>
					<p class="text-muted-foreground">Viajantes</p>
				</div>
				<div class="text-center">
					<p class="text-5xl font-bold mb-2">50+</p>
					<p class="text-muted-foreground">Cidades</p>
				</div>
				<div class="text-center">
					<p class="text-5xl font-bold mb-2">⭐ 4.9</p>
					<p class="text-muted-foreground">Avaliação</p>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
