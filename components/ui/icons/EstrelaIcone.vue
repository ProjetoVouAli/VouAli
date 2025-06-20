// Ícone de estrela

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
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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