
<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from "mode-watcher";

	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	import { flash } from '$lib/stores/flash';
	import { user } from '$lib/stores/user';

	let { data, children } = $props();

	// ✅ Effect.pre() dispara ANTES de outras renderizações (fix race condition de SSR)
	// IMPORTANTE: Não usar if(window) aqui - deixar rodar na hydration
	$effect.pre(() => {
		if (data?.user) {
			user.set({ ...data.user, email: data.user.email ?? '' });
		} else {
			user.set(null);
		}
	});

	$effect(() => {
		if ($flash) {
			const timeout = setTimeout(() => flash.set(null), 3000);
			return () => clearTimeout(timeout);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Navbar initialUser={data.user}/>

{#if $flash}
	<div class="notificacao sucesso">
		{$flash}
	</div>
{/if}

<main class="flex flex-col *:pl-5 *:pr-5 min-h-screen max-w-content-width overflow-clip w-full pt-20 m-auto">
	{@render children?.()}
</main>