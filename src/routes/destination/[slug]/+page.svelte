<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const destination = $derived(data.destination);
	const images = $derived(destination?.images || []);
	let currentImageIndex = $state(0);

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % images.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
	}
</script>

<!-- Nike: Destination Detail Page -->
{#if destination}
	<div class="min-h-screen bg-white dark:bg-black">
		<!-- Hero Image Section -->
		<div class="relative w-full h-screen pt-32">
			<!-- Main Image -->
			{#if images.length > 0}
				<div class="w-full h-full relative overflow-hidden">
					<img
						src={images[currentImageIndex].url}
						alt={destination.nome}
						class="w-full h-full object-cover"
					/>

					<!-- Image Navigation -->
					<div class="absolute inset-0 flex items-center justify-between px-8 z-10">
						<button
							onclick={prevImage}
							class="px-4 py-3 bg-black/70 dark:bg-white/70 text-white dark:text-black font-bold hover:bg-black dark:hover:bg-white transition-all duration-200"
						>
							←
						</button>
						<button
							onclick={nextImage}
							class="px-4 py-3 bg-black/70 dark:bg-white/70 text-white dark:text-black font-bold hover:bg-black dark:hover:bg-white transition-all duration-200"
						>
							→
						</button>
					</div>

					<!-- Image Counter -->
					<div class="absolute bottom-8 left-8 px-4 py-2 bg-black/70 dark:bg-white/70 text-white dark:text-black text-sm font-bold">
						{currentImageIndex + 1} / {images.length}
					</div>
				</div>
			{:else}
				<div class="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
					<span class="text-muted-foreground">Sem imagens disponíveis</span>
				</div>
			{/if}
		</div>

		<!-- Content Section -->
		<section class="bg-white dark:bg-black">
			<div class="max-w-4xl mx-auto px-8 py-20 space-y-16">
				<!-- Header -->
				<div class="space-y-6">
					<!-- Category Badge -->
					{#if destination.category}
						<span class="inline-block text-xs font-bold uppercase tracking-wide text-muted-foreground border border-border px-4 py-2">
							{destination.category.nome}
						</span>
					{/if}

					<!-- Title -->
					<div>
						<h1 class="text-6xl font-bold mb-4 leading-tight">
							{destination.nome}
						</h1>
						<p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
							{destination.descricao || 'Conheça este incrível destino.'}
						</p>
					</div>

					<!-- Actions -->
					<div class="flex gap-4 flex-wrap pt-4">
						<a
							href="/search"
							class="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
						>
							Voltar para Busca
						</a>
						<a
							href="/"
							class="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200"
						>
							Home
						</a>
					</div>
				</div>

				<!-- Divider -->
				<div class="border-t border-border"></div>

				<!-- Info Grid -->
				{#if destination.complementos || destination.servicos}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
						{#if destination.complementos}
							<div>
								<h3 class="text-xl font-bold mb-4 uppercase tracking-wide">
									Complementos
								</h3>
								<p class="text-muted-foreground leading-relaxed">
									{destination.complementos}
								</p>
							</div>
						{/if}

						{#if destination.servicos}
							<div>
								<h3 class="text-xl font-bold mb-4 uppercase tracking-wide">
									Serviços
								</h3>
								<p class="text-muted-foreground leading-relaxed">
									{destination.servicos}
								</p>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Image Gallery -->
				{#if images.length > 1}
					<div>
						<h3 class="text-xl font-bold mb-8 uppercase tracking-wide">
							Galeria
						</h3>
						<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
						{#each images as image, index (image.url)}
								<button
									onclick={() => currentImageIndex = index}
									class="relative h-40 overflow-hidden border-2 {currentImageIndex === index ? 'border-black dark:border-white' : 'border-border'} hover:border-black dark:hover:border-white transition-all duration-200"
								>
									<img
										src={image.url}
										alt={`${destination.nome} ${index + 1}`}
										class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
									/>
									{#if currentImageIndex === index}
										<div class="absolute inset-0 bg-black/20"></div>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- CTA Section -->
				<div class="border-t border-border pt-16 text-center space-y-6">
					<h3 class="text-2xl font-bold">
						Pronto para explorar?
					</h3>
					<a
						href="/search"
						class="inline-block px-12 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
					>
						Ver Mais Destinos
					</a>
				</div>
			</div>
		</section>
	</div>
{:else}
	<!-- 404 State -->
	<div class="min-h-screen bg-white dark:bg-black flex items-center justify-center pt-32">
		<div class="max-w-md mx-auto px-8 text-center space-y-6">
			<div class="text-6xl mb-4">😕</div>
			<h1 class="text-3xl font-bold">
				Destino não encontrado
			</h1>
			<p class="text-muted-foreground text-lg">
				O destino que você procura não existe ou foi removido.
			</p>
			<a
				href="/"
				class="inline-block px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
			>
				Voltar para Home
			</a>
		</div>
	</div>
{/if}
