<template>
    <Card class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div class="relative aspect-[16/9] w-full">
        <img
            :src="imagemSrc"
            :alt="destino.nome"
            class="object-cover w-full h-full"
            @error="handleImageError"
        />
        <div
            v-if="destino.destaque"
            class="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium"
        >
            Destaque
        </div>
        </div>

        <CardCabecalho>
        <CardTitulo>{{ destino.nome }}</CardTitulo>
        <CardDescricao class="line-clamp-2">{{ destino.resumo }}</CardDescricao>
        </CardCabecalho>

        <CardConteudo class="flex-grow">
        <p class="text-sm text-muted-foreground line-clamp-3">
            {{ destino.descricao }}
        </p>
        </CardConteudo>

        <CardRodape>
        <Button class="w-full">Ver detalhes</Button>
        </CardRodape>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CardCabecalho from './CardCabecalho.vue'
import CardDescricao from './CardDescricao.vue'
import CardRodape from './CardRodape.vue'

interface Destino {
    id: number
    nome: string
    slug: string
    resumo: string
    descricao: string
    imagem: string
    destaque: boolean
    createdAt: string
    updatedAt: string
}

const props = defineProps<{
    destino: Destino
}>()

// Usar computed para garantir reatividade
const imagemSrc = computed(() => {
    // Verificar se temos uma imagem válida
    if (props.destino?.imagem) {
        // Se o caminho da imagem contém 'http', é uma URL externa
        if (props.destino.imagem.includes('http')) {
            return props.destino.imagem
        }
        // Caso contrário, é um caminho local
        return props.destino.imagem
    }
    
    // Fallback para uma imagem existente baseada no slug
    return `/images/${props.destino.slug}.jpg`
})

// Função aprimorada para lidar com erros de carregamento da imagem
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    console.log('Erro ao carregar imagem:', target.src)
    
    // Verifica se a imagem corresponde ao slug do destino
    const slugImage = `/images/${props.destino.slug}.jpg`
    
    // Se já estamos tentando usar a imagem do slug e falhou,
    // usamos qualquer uma das imagens existentes como fallback
    if (target.src.includes(props.destino.slug)) {
        // Usamos uma imagem existente como fallback
        target.src = '/images/arraial-do-cabo.jpg'
    } else {
        // Tentamos usar a imagem baseada no slug
        target.src = slugImage
    }
}
</script>
