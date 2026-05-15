<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	const { data }: { data: PageData } = $props();
</script>

<!-- Nike: Hero Section com design moderno -->
<div class="min-h-screen bg-background">
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
						<Button href="/search">
							Explorar Destinos
						</Button>
						<Button href="#destinations" variant="outline">
							Saiba Mais
						</Button>
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
										<p class="text-sm text-muted-foreground line-clamp-3 mb-4 cursor-help flex-1" title={destination.description}>
											{destination.description}
										</p>
									{/if}

									<div class="pt-4 border-t border-border mt-auto">
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
