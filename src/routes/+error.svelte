<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Compass, Home, Search, Map } from 'lucide-svelte';
</script>

<div class="min-h-[80vh] flex items-center justify-center bg-background px-4 py-10">
	<div class="max-w-2xl text-center">
		<div class="relative w-32 h-32 mx-auto flex items-center justify-center mb-4">
			<div class="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-50"></div>
			<div
				class="relative bg-background w-full h-full flex items-center justify-center rounded-full border-4 border-primary shadow-xl"
			>
				<Compass class="w-16 h-16 text-primary" />
			</div>

			<Map class="absolute -top-2 -left-6 w-12 h-12 text-muted-foreground/30 -rotate-12" />
		</div>

		<div class="relative z-10 space-y-2">
			<h1
				class="font-black text-primary drop-shadow-md tracking-tighter"
				style="font-size: clamp(6rem, 20vw, 15rem); line-height: 1;"
			>
				{$page.status}
			</h1>
			<h2 class="text-4xl font-bold tracking-tight text-foreground">
				{#if $page.status === 404}
					Ops! Nos perdemos no mapa.
				{:else}
					Ocorreu um problema inesperado.
				{/if}
			</h2>
			<p class="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed pb-8">
				{#if $page.status === 404}
					Parece que o destino que você procurava tirou férias e não deixou endereço. Verifique o
					link ou comece uma nova busca.
				{:else}
					{$page.error?.message ||
						'A bússola do nosso sistema falhou momentaneamente. Tente novamente em breve!'}
				{/if}
			</p>
		</div>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 relative z-10">
			<Button
				href="/"
				size="lg"
				class="w-full sm:w-auto h-16 px-10 flex items-center gap-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
			>
				<Home class="w-6 h-6" />
				Voltar para o Início
			</Button>
			<Button
				href="/search"
				variant="outline"
				size="lg"
				class="w-full sm:w-auto h-16 px-10 flex items-center gap-3 text-lg font-semibold rounded-full border-2 hover:bg-muted transition-all"
			>
				<Search class="w-6 h-6" />
				Explorar Destinos
			</Button>
		</div>
	</div>
</div>
