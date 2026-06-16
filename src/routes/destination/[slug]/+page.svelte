<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";

	let { data, form }: { data: PageData, form: ActionData } = $props();

	const destination = $derived(data.destination);
	const images = $derived(destination?.images || []);
	let currentImageIndex = $state(0);
	
	let ratingHover = $state(0);
	let ratingSelected = $state(0);

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % images.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
	}
</script>

<!-- Nike: Destination Detail Page -->
{#if destination}
	<div class="min-h-screen bg-background">
		<!-- Hero Image Section -->
		<div class="relative w-full h-screen pt-32">
			<!-- Main Image -->
			{#if images.length > 0}
				<div class="w-full h-full relative overflow-hidden">
					<img
						src={images[currentImageIndex].url}
						alt={destination.name}
						class="w-full h-full object-cover"
					/>

					<!-- Image Navigation -->
					<div class="absolute inset-0 flex items-center justify-between px-8 z-10">
						<button
							onclick={prevImage}
							class="px-4 py-3 bg-primary/70 text-primary-foreground font-bold hover:bg-primary transition-all duration-200"
						>
							←
						</button>
						<button
							onclick={nextImage}
							class="px-4 py-3 bg-primary/70 text-primary-foreground font-bold hover:bg-primary transition-all duration-200"
						>
							→
						</button>
					</div>

					<!-- Image Counter -->
					<div class="absolute bottom-8 left-8 px-4 py-2 bg-primary/70 text-primary-foreground text-sm font-bold">
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
	<section class="bg-background">
			<div class="max-w-4xl mx-auto px-8 py-20 space-y-16">
				<!-- Header -->
				<div class="space-y-6">
					<!-- Category Badge -->
					{#if destination.categories && destination.categories.length > 0}
						<span class="inline-block text-xs font-bold uppercase tracking-wide text-muted-foreground border border-border px-4 py-2">
							{destination.categories[0]}
						</span>
					{/if}

					<!-- Title -->
					<div>
						<h1 class="text-6xl font-bold mb-4 leading-tight">
							{destination.name}
						</h1>
						
						{#if destination.totalReviews > 0}
							<div class="flex items-center gap-2 mb-6">
								<div class="flex text-primary text-xl">
									{'★'.repeat(Math.round(destination.averageRating || 0))}{'☆'.repeat(5 - Math.round(destination.averageRating || 0))}
								</div>
								<span class="text-xl font-bold ml-2">{destination.averageRating}</span>
								<span class="text-muted-foreground text-sm mt-1">({destination.totalReviews} {destination.totalReviews === 1 ? 'avaliação' : 'avaliações'})</span>
							</div>
						{/if}

						<p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
							{destination.description || 'Conheça este incrível destino.'}
						</p>
					</div>

					<!-- Actions -->
					<div class="flex gap-4 flex-wrap pt-4">
						<a
							href="/search"
							class="px-8 py-4 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
						>
							Voltar para Busca
						</a>
						<a
							href="/"
							class="px-8 py-4 border-2 border-primary text-foreground font-bold text-sm uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-200"
						>
							Home
						</a>
					</div>
				</div>

				<!-- Divider -->
				<div class="border-t border-border"></div>

				<!-- Info Grid -->
			{#if destination.summary || destination.neighborhood}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
					{#if destination.summary}
						<div>
							<h3 class="text-xl font-bold mb-4 uppercase tracking-wide">
								Resumo
							</h3>
							<p class="text-muted-foreground leading-relaxed">
								{destination.summary}
							</p>
						</div>
					{/if}

					{#if destination.neighborhood}
						<div>
							<h3 class="text-xl font-bold mb-4 uppercase tracking-wide">
								Bairro
							</h3>
							<p class="text-muted-foreground leading-relaxed">
								{destination.neighborhood}
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
									class="relative h-40 overflow-hidden border-2 {currentImageIndex === index ? 'border-primary' : 'border-border'} hover:border-primary transition-all duration-200"
								>
									<img
										src={image.url}
									alt={`${destination.name} ${index + 1}`}
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

				<!-- Reviews Section -->
				<div class="border-t border-border pt-16 space-y-8">
					<h3 class="text-2xl font-bold uppercase tracking-wide text-center">
						Avaliações
					</h3>

					{#if destination.reviews && destination.reviews.length > 0}
						<div class="space-y-6">
							{#each destination.reviews as review}
								<Card.Root>
									<Card.Header class="pb-2">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg">{review.usuario.nome}</Card.Title>
											<div class="text-primary font-bold text-lg">
												{'★'.repeat(review.rating)}<span class="text-muted-foreground">{'☆'.repeat(5 - review.rating)}</span>
											</div>
										</div>
									</Card.Header>
									<Card.Content>
										<p class="text-muted-foreground whitespace-pre-line leading-relaxed">
											{review.comment || 'Nenhum comentário.'}
										</p>
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					{:else}
						<p class="text-center text-muted-foreground">Seja o primeiro a avaliar este destino!</p>
					{/if}

					<!-- Review Form -->
					{#if data.user}
						<Card.Root class="mt-12 border-2 border-primary bg-card/50">
							<Card.Header>
								<Card.Title class="text-xl uppercase tracking-wide">Deixe sua avaliação</Card.Title>
							</Card.Header>
							<Card.Content>
								{#if form?.success}
									<div class="p-4 mb-6 bg-green-100 text-green-800 border border-green-300 font-bold rounded-md">
										Avaliação enviada com sucesso! Obrigado.
									</div>
								{/if}
								{#if form?.message && !form?.success}
									<div class="p-4 mb-6 bg-red-100 text-red-800 border border-red-300 font-bold rounded-md">
										{form.message}
									</div>
								{/if}

								<form method="POST" action="?/submitReview" use:enhance class="space-y-6">
									<div class="space-y-2">
										<Label class="text-sm font-bold uppercase tracking-wide">Sua Nota</Label>
										<div class="flex gap-2">
											{#each [1, 2, 3, 4, 5] as star}
												<button
													type="button"
													class="text-3xl transition-colors focus:outline-none {star <= (ratingHover || ratingSelected) ? 'text-primary' : 'text-muted-foreground/30'}"
													onmouseenter={() => ratingHover = star}
													onmouseleave={() => ratingHover = 0}
													onclick={() => ratingSelected = star}
												>
													★
												</button>
											{/each}
										</div>
										<input type="hidden" name="rating" value={ratingSelected} required />
									</div>
									
									<div class="space-y-2">
										<Label for="comment" class="text-sm font-bold uppercase tracking-wide">Comentário (opcional)</Label>
										<Textarea 
											id="comment" 
											name="comment" 
											rows={4} 
											placeholder="Conte sobre sua experiência..."
										/>
									</div>

									<Button
										type="submit"
										disabled={ratingSelected === 0}
										class="w-full sm:w-auto px-8 py-6 font-bold text-sm uppercase tracking-wide"
									>
										Enviar Avaliação
									</Button>
								</form>
							</Card.Content>
						</Card.Root>
					{:else}
						<Card.Root class="mt-12 bg-muted/50 text-center border-dashed">
							<Card.Content class="pt-6 space-y-4">
								<p class="text-muted-foreground">Você precisa estar logado para avaliar este destino.</p>
								<Button href="/login" class="px-8 font-bold uppercase tracking-wide">
									Fazer Login
								</Button>
							</Card.Content>
						</Card.Root>
					{/if}
				</div>

				<!-- CTA Section -->
				<div class="border-t border-border pt-16 text-center space-y-6">
					<h3 class="text-2xl font-bold">
						Pronto para explorar?
					</h3>
					<a
						href="/search"
						class="px-8 py-4 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
					>
						Ver Mais Destinos
					</a>
				</div>
			</div>
		</section>
	</div>
{:else}
	<!-- 404 State -->
	<div class="min-h-screen bg-background flex items-center justify-center pt-32">
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
				class="inline-block px-8 py-4 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide hover:opacity-80 transition-opacity"
			>
				Voltar para Home
			</a>
		</div>
	</div>
{/if}
