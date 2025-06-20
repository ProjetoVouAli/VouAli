// Exibe localização (bairro, cidade)

<template>
    <div class="flex items-center gap-1.5" :class="containerClass">
        <!-- Ícone de localização -->
        <svg 
        :width="iconSize" 
        :height="iconSize" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        class="shrink-0"
        :class="iconClass"
        >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
        </svg>
        
        <!-- Texto de localização -->
        <span class="text-xs line-clamp-1" :class="textClass">
            {{ localizacaoFormatada }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    bairro?: string
    cidade: string
    iconSize?: number
    containerClass?: string
    textClass?: string
    iconClass?: string
}

// Definição das props com valores padrão
const props = withDefaults(defineProps<Props>(), {
    bairro: '',
    iconSize: 14,
    containerClass: '',
    textClass: 'text-muted-foreground',
    iconClass: 'text-muted-foreground'
})

// Formatar texto de localização (bairro + cidade)
const localizacaoFormatada = computed(() => {
    if (props.bairro && props.bairro.trim() !== '') {
        return `${props.bairro}, ${props.cidade}`
    }
    return props.cidade
})
</script>