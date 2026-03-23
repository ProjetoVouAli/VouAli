<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';

	type Item = {
		value: string;
		label: string;
	};

	let {
		class: className,
		items,
		notFoundLabel,
		selectLabel,
		askSelectLabel,
		selected = $bindable([]),
		onclose
	}: {
		onclose: () => void;
		items: Item[];
		askSelectLabel: string;
		notFoundLabel: string;
		selectLabel: string;
		class: string;
		selected: string[];
	} = $props();

	let open = $state(false);

	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(selected.join(', '));

	function toggleValue(val: string) {
		if (selected.includes(val)) {
			selected = selected.filter((v) => v !== val);
		} else {
			selected = [...selected, val];
		}
	}
</script>

<Popover.Root
	onOpenChange={(v) => {
		if (!v) {
			onclose();
		}
	}}
	bind:open
>
	<Popover.Trigger 
		bind:ref={triggerRef}
		class={cn(
			'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50',
			'bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border',
			'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
			'h-9 px-4 py-2 flex justify-between',
			className
		)}
		role="combobox"
		aria-expanded={open}
	>
		<p class="overflow-hidden whitespace-nowrap text-ellipsis">
			{selectedValue || selectLabel}
		</p>
		<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
	</Popover.Trigger>
	<Popover.Content class="w-fit p-0">
		<Command.Root>
			<Command.Input placeholder={askSelectLabel} />
			<Command.List>
				<Command.Empty>{notFoundLabel}</Command.Empty>
				<Command.Group>
					{#each items as item}
						{@const isSelected = selected.includes(item.value)}
						<Command.Item value={item.value} onSelect={() => toggleValue(item.value)}>
							<CheckIcon class={cn('mr-2 size-4', !isSelected && 'text-transparent')} />
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
