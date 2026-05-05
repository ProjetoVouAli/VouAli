
<script lang="ts">
	import { Button } from '../button';
	import ModeToggle from './mode-toggle.svelte';
	import { user } from '$lib/stores/user';

	let { initialUser = null } = $props();

	let displayUser = $derived.by(() => {
		return $user ?? initialUser;
	});

	async function logout() {
		console.log('[LOGOUT] Iniciando logout...');
		const resp = await fetch('/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: ''
		});
		console.log('[LOGOUT] Resposta do backend:', resp.status);
		user.set(null);
		window.location.href = '/';
	}
</script>

<!-- Nike: Navbar minimalista, preto/branco -->
<header class="fixed w-full top-0 left-0 z-50 bg-white dark:bg-black border-b border-border dark:border-border">
	<nav class="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
		<!-- Logo/Brand -->
		<a href="/" class="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity">
			VouAli
		</a>

		<!-- Navigation Links -->
		<div class="hidden md:flex items-center gap-12">
			<a href="/search" class="text-sm font-medium hover:text-muted-foreground transition-colors">
				Explorar
			</a>
			<a href="/" class="text-sm font-medium hover:text-muted-foreground transition-colors">
				Home
			</a>
		</div>

		<!-- User & Theme -->
		<div class="flex items-center gap-6">
			{#if displayUser}
				<div class="hidden sm:block">
					<p class="text-sm font-semibold">{displayUser.nome || displayUser.email}</p>
				</div>
				<button
					onclick={logout}
					class="px-6 py-2 text-xs font-bold uppercase tracking-wide border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200"
				>
					Logout
				</button>
			{:else}
				<a
					href="/login"
					class="px-6 py-2 text-xs font-bold uppercase tracking-wide bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
				>
					Entrar
				</a>
			{/if}
			<ModeToggle />
		</div>
	</nav>
</header>
