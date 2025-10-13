<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
  	import { ModeWatcher } from "mode-watcher";
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Navbar/>

<main class="flex flex-col *:pl-5 *:pr-5 min-h-screen max-w-content-width overflow-clip w-full pt-20 m-auto">
	{@render children?.()}
</main> 