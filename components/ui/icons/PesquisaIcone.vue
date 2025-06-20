// Ícone de lupa

<template>
    <svg
        :width="size"
        :height="size"
        :stroke-width="strokeWidth"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        style="vertical-align: middle; line-height: 1;"
        :class="className"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
</template>

<script setup lang="ts">
defineProps({
    size: {
        type: [Number, String],
        default: 16  // Reduzido de 24 para 16
    },
    strokeWidth: {
        type: [Number, String],
        default: 1.5  // Reduzido de 2 para 1.5 para linhas mais finas
    },
    className: {
        type: String,
        default: ''
    }
})
</script>