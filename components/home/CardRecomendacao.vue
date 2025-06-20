// Card para recomendações (vertical)

<template>
    <div class="bg-white dark:bg-zinc-800 rounded-xl shadow-sm overflow-hidden flex border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
        <!-- Imagem à esquerda -->
        <div class="h-24 w-24 relative shrink-0">
        <img 
            :src="item.imagem" 
            :alt="item.nome"
            class="h-full w-full object-cover"
            @error="handleImageError"
        />
        </div>
        
        <!-- Conteúdo à direita -->
        <div class="p-3 flex flex-col justify-between flex-grow">
        <div>
            <!-- Tag do tipo do local -->
            <span class="inline-block text-xs bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded mb-1">
            {{ item.tipo }}
            </span>
            
            <!-- Nome do local -->
            <h3 class="font-medium text-sm line-clamp-1">{{ item.nome }}</h3>
            
            <!-- Localização -->
            <div class="flex items-center gap-1 mt-0.5">
            <span class="text-xs text-muted-foreground">
                {{ formatarLocalizacao(item.localizacao) }}
            </span>
            </div>
        </div>
        
        <!-- Avaliação -->
        <div class="flex items-center gap-1 mt-1">
            <EstrelaIcone class="w-4 h-4 text-yellow-400" />
            <span class="text-xs font-medium">{{ item.avaliacao.toFixed(1) }}</span>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import EstrelaIcone from '~/components/ui/icons/EstrelaIcone.vue'

interface Localizacao {
    bairro: string
    cidade: string
}

interface LocalRecomendado {
    id: number
    nome: string
    tipo: string
    imagem: string
    localizacao: Localizacao
    avaliacao: number
}

const props = defineProps<{
    item: LocalRecomendado
}>()

// Função para formatar a localização
const formatarLocalizacao = (loc: Localizacao) => {
    if (loc.bairro) {
        return `${loc.bairro}, ${loc.cidade}`
    }
    return loc.cidade
}

// Lidar com erro de carregamento de imagem
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = '/images/placeholder.jpg'
}
</script>