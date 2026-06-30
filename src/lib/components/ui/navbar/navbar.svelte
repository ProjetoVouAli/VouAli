<script lang="ts">
	import { Button } from '../button';
	import ModeToggle from './mode-toggle.svelte';
	import type { Usuario } from '$lib/server/db/entities/Usuario';
	import { invalidateAll, goto } from '$app/navigation';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
import UserIcon from '@lucide/svelte/icons/user';
import SettingsIcon from '@lucide/svelte/icons/settings';

	let { initialUser: user }: { initialUser: Usuario | null } = $props();

	let destinoOpen = $state(false);
	let destinosTriggerRef = $state<HTMLButtonElement>(null!);

	let adminOpen = $state(false);
	let adminTriggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusDestinos() {
		destinoOpen = false;
		tick().then(() => destinosTriggerRef?.focus());
	}

	function irPara(path: string) {
		closeAndFocusDestinos();
		goto(path);
	}

	async function logout() {
		console.log('[LOGOUT] Iniciando logout...');
		const resp = await fetch('/logout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: ''
		});
		console.log('[LOGOUT] Resposta do backend:', resp.status);

		await invalidateAll();
		await goto('/');
	}
</script>

<header class="fixed w-full top-0 left-0 z-50 bg-background border-b border-border">
	<nav class="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
		<!-- Logo/Brand -->
		<a href="/" class="text-2xl font-bold tracking-tight hover:opacity-70 transition-opacity">
			VouAli
		</a>

		<!-- Navigation Links -->
		<div class="hidden md:flex items-center gap-12">
			<a href="/" class="text-sm font-medium hover:text-muted-foreground transition-colors">
				Home
			</a>
			{#if !user || (!user.papeis?.includes('ADMINISTRADOR' as any) && !user.papeis?.includes('PARCEIRO' as any))}
				<a href="/parceiro" class="text-sm font-medium hover:text-muted-foreground transition-colors">
					Parceria
				</a>
			{/if}
			<a href="/search" class="text-sm font-medium hover:text-muted-foreground transition-colors">
				Explorar
			</a>


			{#if user && user.papeis?.includes('ADMINISTRADOR' as any)}
				<a
					href="/admin/config"
					class="text-sm font-medium hover:text-muted-foreground transition-colors"
				>
					Configurações
				</a>
			{/if}

			{#if user && user.papeis?.includes('PARCEIRO' as any) && !user.papeis?.includes('ADMINISTRADOR' as any)}
				<a href="/inventory" class="text-sm font-medium hover:text-muted-foreground transition-colors">
					Destinos
				</a>
			{/if}

			{#if user && user.papeis?.includes('ADMINISTRADOR' as any)}
				<Popover.Root bind:open={adminOpen}>
					<Popover.Trigger bind:ref={adminTriggerRef}>
						{#snippet child({ props })}
							<button
								{...props}
								role="combobox"
								aria-expanded={adminOpen}
								class="text-sm font-medium hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
							>
								Admin
								<ChevronsUpDown class="size-4 opacity-50" />
							</button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-[200px] p-0" align="start">
						<Command.Root>
							<Command.List>
								<Command.Group>
									<Command.Item value="apuracoes" onSelect={() => irPara('/apuracoes')}>
										Apurações (Pendentes)
									</Command.Item>
									<Command.Item value="parceiros" onSelect={() => irPara('/admin/parceiros')}>
										Parceiros Cadastrados
									</Command.Item>
									<Command.Item value="destinos" onSelect={() => irPara('/inventory')}>
										Todos os Destinos
									</Command.Item>
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			{/if}
		</div>

		<!-- User & Theme -->
		<div class="flex items-center gap-6">
			{#if user}
				<div class="hidden sm:flex items-center gap-2">
					<a href="/settings" class="flex items-center gap-2 hover:opacity-70 transition-opacity" title="Configurações">
						{#if user.avatarUrl}
							<img src={user.avatarUrl} alt="" class="w-8 h-8 rounded-full object-cover border border-border" />
						{:else}
							<div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
								<UserIcon class="size-4 text-muted-foreground" />
							</div>
						{/if}
						<p class="text-sm font-semibold">{user.nome || user.email}</p>
					</a>
				</div>
				<button
					onclick={logout}
					class="px-6 py-2 text-xs font-bold uppercase tracking-wide border-2 border-primary text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
				>
					Logout
				</button>
			{:else}
				<a
					href="/login"
					class="px-6 py-2 text-xs font-bold uppercase tracking-wide bg-primary text-primary-foreground hover:opacity-80 transition-opacity"
				>
					Entrar
				</a>
			{/if}
			<ModeToggle />
		</div>
	</nav>
</header>
