<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Label } from "$lib/components/ui/label";
	import { Separator } from "$lib/components/ui/separator";
	import * as Carousel from "$lib/components/ui/carousel";
	import { MapPin, Clock, CircleDollarSign, Heart, Share, Star, Home, Search } from 'lucide-svelte';
	import MarkerMap from '$lib/components/ui/map/marker-map.svelte';

	let { data, form }: { data: PageData, form: ActionData } = $props();
	const destination = $derived(data.destination);
	const images = $derived(destination?.images || []);
	
	let ratingHover = $state(0);
	let ratingSelected = $state(0);
</script>

{#if destination}
	<div class="min-h-screen bg-background pb-20 pt-16">
		<!-- Navigation Breadcrumb & Actions -->
		<div class="sticky top-[64px] z-50 bg-background/80 backdrop-blur-md border-b">
			<div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
				<div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<a href="/" class="hover:text-primary transition-colors flex items-center gap-1"><Home class="w-4 h-4"/> Início</a>
					<span>/</span>
					<a href="/search" class="hover:text-primary transition-colors flex items-center gap-1"><Search class="w-4 h-4"/> Explorar</a>
					<span>/</span>
					<span class="text-foreground line-clamp-1">{destination.name}</span>
				</div>
				<div class="flex gap-2">
					<Button variant="ghost" size="icon" class="rounded-full hover:bg-primary/10 hover:text-primary"><Share class="w-5 h-5"/></Button>
					<Button variant="ghost" size="icon" class="rounded-full hover:bg-primary/10 hover:text-primary"><Heart class="w-5 h-5"/></Button>
				</div>
			</div>
		</div>

		<!-- Title Section -->
		<div class="max-w-7xl mx-auto px-6 py-8">
			<h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{destination.name}</h1>
			<div class="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
				{#if destination.totalReviews > 0}
					<div class="flex items-center text-primary font-bold">
						<Star class="w-5 h-5 fill-primary mr-1" />
						{destination.averageRating} <span class="text-muted-foreground ml-1 underline cursor-pointer hover:text-foreground">({destination.totalReviews} avaliações)</span>
					</div>
					<span>•</span>
				{/if}
				<div class="flex items-center">
					<MapPin class="w-4 h-4 mr-1" />
					{destination.city}, {destination.state}
				</div>
			</div>
		</div>

		<!-- Hero Carousel -->
		<div class="max-w-7xl mx-auto px-6 mb-12">
			{#if images.length > 0}
				<Carousel.Root class="w-full relative rounded-2xl overflow-hidden group shadow-lg">
					<Carousel.Content>
						{#each images as image}
							<Carousel.Item>
								<div class="w-full aspect-video md:aspect-[21/9] bg-muted">
									<img src={image.url} alt={destination.name} class="w-full h-full object-cover" />
								</div>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<div class="absolute top-1/2 -translate-y-1/2 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
						<Carousel.Previous class="bg-background/80 hover:bg-background border-none shadow-md" />
					</div>
					<div class="absolute top-1/2 -translate-y-1/2 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
						<Carousel.Next class="bg-background/80 hover:bg-background border-none shadow-md" />
					</div>
				</Carousel.Root>
			{:else}
				<div class="w-full aspect-video md:aspect-[21/9] bg-muted rounded-2xl flex items-center justify-center text-muted-foreground shadow-lg border">
					Nenhuma imagem disponível
				</div>
			{/if}
		</div>

		<!-- Main Layout (2 Columns) -->
		<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
			
			<!-- Left Column (Content) -->
			<div class="lg:col-span-2 space-y-12">
				
				<!-- Description -->
				<section>
					<h2 class="text-2xl font-bold mb-4">Sobre o destino</h2>
					{#if destination.categories && destination.categories.length > 0}
						<div class="flex gap-2 mb-4 flex-wrap">
							{#each destination.categories as cat}
								<span class="bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">{cat}</span>
							{/each}
						</div>
					{/if}
					<p class="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
						{destination.description}
					</p>
				</section>

				<Separator />

				<!-- Map -->
				<section>
					<h2 class="text-2xl font-bold mb-6">Onde você estará</h2>
					<p class="text-muted-foreground mb-4 flex items-center gap-2">
						<MapPin class="w-5 h-5 text-primary" />
						{destination.address ? `${destination.address}, ` : ''}{destination.neighborhood ? `${destination.neighborhood} - ` : ''}{destination.city} / {destination.state}
					</p>
					<div class="w-full h-[400px] rounded-2xl overflow-hidden border shadow-sm relative z-0 bg-muted">
						{#if destination.latitude && destination.longitude}
							<MarkerMap destinations={[destination]} />
						{:else}
							<div class="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
								<MapPin class="w-10 h-10 mb-2 opacity-50" />
								<span>Coordenadas indisponíveis para exibir o mapa</span>
							</div>
						{/if}
					</div>
				</section>

				<Separator />

				<!-- Reviews Section -->
				<section>
					<div class="flex items-center justify-between mb-8">
						<h2 class="text-2xl font-bold">Avaliações</h2>
					</div>

					{#if destination.reviews && destination.reviews.length > 0}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							{#each destination.reviews as review}
								<Card.Root class="shadow-sm border-border hover:shadow-md transition-shadow">
									<Card.Header>
										<div class="flex items-center gap-4">
											<div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
												{review.usuario.nome.charAt(0).toUpperCase()}
											</div>
											<div>
												<h4 class="font-bold">{review.usuario.nome}</h4>
												<div class="flex text-primary text-sm mt-0.5">
													{'★'.repeat(review.rating)}<span class="text-muted-foreground/30">{'★'.repeat(5 - review.rating)}</span>
												</div>
											</div>
										</div>
									</Card.Header>
									<Card.Content>
										<p class="text-muted-foreground leading-relaxed">
											{review.comment || 'Nenhum comentário deixado.'}
										</p>
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					{:else}
						<div class="bg-muted/50 p-8 rounded-xl text-center border-dashed border-2">
							<p class="text-muted-foreground">Seja o primeiro a avaliar este destino!</p>
						</div>
					{/if}
				</section>
			</div>

			<!-- Right Column (Sticky Sidebar) -->
			<div class="lg:col-span-1 relative z-10">
				<div class="sticky top-32">
					<Card.Root class="shadow-2xl border-primary/20">
						<Card.Content class="p-8">
							<!-- Price & Hours -->
							<div class="space-y-6 mb-6">
								<div>
									<span class="text-muted-foreground text-xs font-bold uppercase tracking-widest">Valor</span>
									<div class="flex items-center text-2xl font-black mt-1 text-foreground">
										<CircleDollarSign class="w-6 h-6 mr-2 text-primary shrink-0" />
										{destination.price || 'Não informado'}
									</div>
								</div>
								<Separator />
								<div>
									<span class="text-muted-foreground text-xs font-bold uppercase tracking-widest">Funcionamento</span>
									<div class="flex items-center text-lg font-medium mt-1 text-foreground">
										<Clock class="w-5 h-5 mr-2 text-primary shrink-0" />
										<span>{destination.openingHours || 'Não informado'}</span>
									</div>
								</div>
							</div>

							<Separator class="my-6" />

							<!-- Review Form Container -->
							{#if data.user}
								<div class="space-y-4">
									<h4 class="font-bold text-lg">Gostou? Deixe sua nota</h4>
									{#if form?.success}
										<div class="p-3 bg-green-100 text-green-800 text-sm font-medium rounded-lg border border-green-200 text-center">
											Avaliação enviada com sucesso!
										</div>
									{/if}
									{#if form?.message && !form?.success}
										<div class="p-3 bg-red-100 text-red-800 text-sm font-medium rounded-lg border border-red-200 text-center">
											{form.message}
										</div>
									{/if}

									<form method="POST" action="?/submitReview" use:enhance class="space-y-4 bg-muted/30 p-4 rounded-xl border">
										<div class="flex justify-center gap-1 py-2">
											{#each [1, 2, 3, 4, 5] as star}
												<button
													type="button"
													class="text-4xl transition-transform hover:scale-125 focus:outline-none {star <= (ratingHover || ratingSelected) ? 'text-primary drop-shadow-sm' : 'text-muted-foreground/20'}"
													onmouseenter={() => ratingHover = star}
													onmouseleave={() => ratingHover = 0}
													onclick={() => ratingSelected = star}
												>
													★
												</button>
											{/each}
										</div>
										<input type="hidden" name="rating" value={ratingSelected} required />
										
										<div class="space-y-1">
											<Textarea 
												id="comment" 
												name="comment" 
												rows={3} 
												placeholder="Conte sobre sua experiência (opcional)"
												class="resize-none bg-background"
											/>
										</div>

										<Button type="submit" disabled={ratingSelected === 0} class="w-full font-bold h-12 text-md mt-2">
											Enviar Avaliação
										</Button>
									</form>
								</div>
							{:else}
								<div class="text-center space-y-4 py-4 bg-muted/30 p-6 rounded-xl border">
									<p class="text-muted-foreground text-sm">Faça login para poder avaliar este local e ajudar outros viajantes.</p>
									<Button href="/login" class="w-full font-bold" variant="outline">
										Fazer Login
									</Button>
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				</div>
			</div>

		</div>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-background">
		<div class="text-center space-y-4">
			<div class="text-6xl mb-4">😕</div>
			<h1 class="text-3xl font-bold">Destino não encontrado</h1>
			<p class="text-muted-foreground text-lg">O destino que você procura não existe ou foi removido.</p>
			<Button href="/">Voltar para Home</Button>
		</div>
	</div>
{/if}
