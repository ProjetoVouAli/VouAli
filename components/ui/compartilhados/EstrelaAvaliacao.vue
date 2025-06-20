// Componente de avaliação com estrelas

<template>
    <div class="flex items-center" :class="containerClass">
        <!-- Valor numérico da avaliação -->
        <span v-if="showValue" class="text-xs font-medium mr-1" :class="textClass">{{ rating.toFixed(1) }}</span>
        
        <!-- Container de estrelas -->
        <div class="flex">
        <!-- Loop pelas 5 estrelas -->
        <div v-for="index in 5" :key="index" class="relative" :class="{ 'mr-0.5': index < 5 }">
            <!-- Estrela de fundo (vazia) -->
            <EstrelaIcone 
                :size="size" 
                :class="emptyClass" 
                stroke-width="1.5"
            />
            
            <!-- Estrela preenchida com largura baseada na avaliação -->
            <div class="absolute top-0 left-0 overflow-hidden" :style="{ width: getStarWidth(index) + '%' }">
                <EstrelaIcone 
                    :size="size" 
                    :class="filledClass" 
                    stroke-width="1.5"
                />
            </div>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EstrelaIcone from '~/components/ui/icons/EstrelaIcone.vue'

interface Props {
    rating: number
    size?: number | string
    showValue?: boolean
    containerClass?: string
    textClass?: string
    filledClass?: string
    emptyClass?: string
}

// Definição de props com valores padrão
const props = withDefaults(defineProps<Props>(), {
    size: 16,
    showValue: true,
    containerClass: '',
    textClass: 'text-gray-700 dark:text-gray-300',
    filledClass: 'text-yellow-400 fill-yellow-400',
    emptyClass: 'text-gray-300 dark:text-gray-600',
})

// Função para calcular a largura percentual de cada estrela
const getStarWidth = (position: number) => {
    const rating = Math.min(5, Math.max(0, props.rating)) // Limita rating entre 0 e 5
    
    if (position <= Math.floor(rating)) {
        // Estrela totalmente preenchida
        return 100
    } else if (position === Math.ceil(rating) && rating % 1 !== 0) {
        // Estrela parcialmente preenchida
        return (rating % 1) * 100
    } else {
        // Estrela vazia
        return 0
    }
}
</script>