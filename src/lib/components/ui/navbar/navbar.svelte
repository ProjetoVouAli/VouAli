
<script lang="ts">
	import path from 'path';
	import { Button } from '../button';
	import ModeToggle from './mode-toggle.svelte';
	import { user } from '$lib/stores/user';

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
			{#if $user}
				{console.log('[NAVBAR] Usuário autenticado:', $user)}
				<span class="ml-4">{$user.nome}</span>
				   <button class="bg-transparent hover:bg-accent rounded-md px-4 py-2 text-sm font-medium" on:click={logout}>Logout</button>
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
