
<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '../button';
	import ModeToggle from './mode-toggle.svelte';
	import { user } from '$lib/stores/user';

	let { initialUser = null } = $props();

	// Renderiza com initialUser durante SSR, depois sincroniza store no cliente
	let displayUser = $derived.by(() => {
		return $user ?? initialUser;
	});

	async function logout() {
		console.log('[LOGOUT] Iniciando logout...');
		// Faz POST para /logout com body form-urlencoded vazio (padrão SvelteKit)
		const resp = await fetch('/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: ''
		});
		console.log('[LOGOUT] Resposta do backend:', resp.status);
		user.set(null);
		console.log('[LOGOUT] Store user limpo, redirecionando para home');
		window.location.href = '/';
	}
</script>

<header style="view-transition-name: navbar;" class="fixed z-1 flex w-full justify-center">
	<nav class="flex w-full content-center justify-between bg-transparent p-2 pr-10 pl-10">
		<section>
			<Button variant="ghost" href="/">Home</Button>
			{#if displayUser}
				{console.log('[NAVBAR] Usuário autenticado:', displayUser)}
				<span class="ml-4">{displayUser.nome}</span>
			   <button class="bg-transparent hover:bg-accent rounded-md px-4 py-2 text-sm font-medium" onclick={logout}>Logout</button>
			{:else}
				{console.log('[NAVBAR] Usuário não autenticado')}
				<Button variant="ghost" href="/login">Entrar</Button>
			{/if}
		</section>
		<section>
			<ModeToggle></ModeToggle>
		</section>
	</nav>
</header>
