// Ícone de rotas

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
        :class="className"
    >
        <circle cx="12" cy="5" r="3" />
        <line x1="12" y1="22" x2="12" y2="8" />
        <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
</template>

<script setup lang="ts">
defineProps({
    size: {
        type: [Number, String],
        default: 24
    },
    strokeWidth: {
        type: [Number, String],
        default: 2
    },
    className: {
        type: String,
        default: ''
    }
})
</script>