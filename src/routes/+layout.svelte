
<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from "mode-watcher";

	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	import { flash } from '$lib/stores/flash';

	import Footer from '$lib/components/ui/footer/footer.svelte';

	let { data, children } = $props();

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

<Navbar initialUser={data.user }/>

{#if $flash}
	<div class="notificacao sucesso">
		{$flash}
	</div>
{/if}

<div class="flex flex-col min-h-screen">
	<main class="flex-grow *:pl-5 *:pr-5 max-w-content-width overflow-clip w-full pt-20 m-auto">
		{@render children?.()}
	</main>

	<Footer />
</div>