<template>
<div class="space-y-1">
    <label class="block text-sm font-medium">{{ label }}</label>
    <input
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
</div>
</template>

<script setup lang="ts">
defineProps({
label: String,
type: { type: String, default: 'text' },
placeholder: String,
modelValue: String
})
defineEmits(['update:modelValue'])
</script>
