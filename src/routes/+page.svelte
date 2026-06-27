<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Clock, CircleDollarSign } from 'lucide-svelte';

	const { data }: { data: PageData } = $props();

	import HeroBanner from '$lib/components/hero/HeroBanner.svelte';
</script>

<!-- Nike: Hero Section com design moderno -->
<div class="min-h-screen bg-background">
	<!-- Dynamic Hero Banner -->
	<HeroBanner destinations={data.destinations} />

	<!-- Featured Destinations Section -->
	<section id="destinations" class="py-20 px-8 bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-950">
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
						<a href={`/destination/${destination.slug}`} class="group hover:no-underline">
							<Card class="overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
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
								<CardContent class="flex-1 flex flex-col">
									{#if destination.categories && destination.categories.length > 0}
										<span class="inline-block text-xs font-bold uppercase tracking-wide text-muted-foreground border border-border px-3 py-1 mb-3 w-fit">
											{destination.categories[0]}
										</span>
									{/if}

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
										{#if destination.price}
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

				<!-- View All Button -->
				<div class="mt-16 text-center">
					<Button href="/search" variant="outline">
						Ver Todos os Destinos
					</Button>
				</div>
			{:else}
				<div class="text-center py-16">
					<p class="text-lg text-muted-foreground">Nenhum destino disponível no momento.</p>
					<a href="/search" class="mt-4 inline-block text-foreground font-bold hover:underline">
						Voltar para busca
					</a>
				</div>
			{/if}
		</div>
	</section>

	<!-- Stats Section -->
	<section class="py-20 px-8">
		<div class="max-w-7xl mx-auto">
			<div class="grid grid-cols-2 lg:grid-cols-3 gap-12">
				<div class="text-center">
					<p class="text-5xl font-bold mb-2">{data.destinations?.length || 0}+</p>
					<p class="text-muted-foreground">Destinos</p>
				</div>
				<div class="text-center">
					<p class="text-5xl font-bold mb-2">1000+</p>
					<p class="text-muted-foreground">Viajantes</p>
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
