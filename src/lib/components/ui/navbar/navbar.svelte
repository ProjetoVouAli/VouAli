<script>
	import path from 'path';
	import { Button } from '../button';
	import ModeToggle from './mode-toggle.svelte';

	const navButtons = [
		{ slug: 'Home', path: '/' },
		{ slug: 'Entrar', path: '/login' },
	];
</script>

<header style="view-transition-name: navbar;" class="fixed z-1 flex w-full justify-center">
	<nav class="flex w-full content-center justify-between bg-transparent p-2 pr-10 pl-10">
		<section>
			{#each navButtons as button}
				<Button variant="ghost" href={button.path}>{button.slug}</Button>
			{/each}
		</section>
		<section>
			<ModeToggle></ModeToggle>
		</section>
	</nav>
</header>
