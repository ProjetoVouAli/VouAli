// Ícone de casa

// filepath: c:\Projetos\VouAli\components\ui\icons\HomeIcone.vue
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
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
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