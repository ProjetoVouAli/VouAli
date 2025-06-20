// Card para itens próximos (horizontal)

<template>
    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
        <!-- Imagem com tag da categoria -->
        <div class="relative aspect-[4/3]">
        <img 
            :src="item.imagem" 
            :alt="item.nome"
            class="w-full h-full object-cover"
            @error="handleImageError"
        />
        <div class="absolute top-2 left-2 bg-white/80 dark:bg-zinc-800/80 px-2 py-1 rounded text-xs font-medium">
            {{ item.categoria }}
        </div>
        </div>
        
        <!-- Informações do local -->
        <div class="p-3">
        <!-- Nome do destino -->
        <h3 class="font-medium text-base line-clamp-1">{{ item.nome }}</h3>
        
        <!-- Localização -->
        <div class="flex items-center mt-1">
            <span class="text-xs text-muted-foreground line-clamp-1">
            {{ formatarLocalizacao(item.localizacao) }}
            </span>
        </div>
        
        <!-- Avaliação com estrela -->
        <div class="flex items-center gap-1 mt-2" v-if="item.avaliacao">
            <EstrelaIcone class="w-4 h-4 text-yellow-400" />
            <span class="text-xs font-medium">{{ item.avaliacao.toFixed(1) }}</span>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import EstrelaIcone from '~/components/ui/icons/EstrelaIcone.vue'

interface Localizacao {
    bairro: string
    cidade: string
}

interface LocalProximo {
    id: number
    nome: string
    categoria: string
    imagem: string
    localizacao: Localizacao
    avaliacao?: number
}

const props = defineProps<{
    item: LocalProximo
}>()

// Função para formatar a localização
const formatarLocalizacao = (loc: Localizacao) => {
    if (loc.bairro) {
        return `${loc.bairro}, ${loc.cidade}`
    }
    return loc.cidade
}

// Tratamento de erro para imagens que não carregam
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
  // Fallback para uma imagem padrão
    target.src = '/images/placeholder.jpg'
}
</script>