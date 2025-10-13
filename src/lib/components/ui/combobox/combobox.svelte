<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
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
	<Popover.Trigger bind:ref={triggerRef}>
		<Button
			class={cn('flex justify-between', className)}
			variant="outline"
			role="combobox"
			aria-expanded={open}
		>
			<p class="overflow-hidden whitespace-nowrap text-ellipsis">
				{selectedValue || selectLabel}
			</p>
			<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
		</Button>
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
