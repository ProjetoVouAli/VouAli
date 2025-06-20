// Cabeçalho de seção (título + link "Ver tudo")

<template>
    <div class="flex justify-between items-center mb-3 w-full">
        <!-- Título à esquerda usando slot -->
        <h2 class="font-bold text-lg">
            <slot />
        </h2>
        
        <!-- Botão "Ver tudo" à direita -->
        <button 
        v-if="showButton" 
        class="text-sm text-primary font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded" @click="$emit('click')">
        {{ buttonText }}
        </button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    buttonText: {
        type: String,
        default: 'Ver tudo'
    },
    showButton: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['click'])
</script>