// Seção "Recomendado"

<template>
    <section class="w-full">
        <!-- Cabeçalho da seção -->
        <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold text-lg">Recomendado</h2>
        <button class="text-sm text-primary font-medium">Ver tudo</button>
        </div>
        
        <!-- Lista vertical de cards de recomendações -->
        <div class="flex flex-col gap-3">
        <CardRecomendacao
            v-for="(local, index) in locaisRecomendados"
            :key="index"
            :item="local"
            class="w-full"
        />
        </div>
    </section>
</template>

<script setup lang="ts">
import CardRecomendacao from './CardRecomendacao.vue'
import { ref } from 'vue'

// Interface para locais recomendados
interface LocalRecomendado {
    id: number
    nome: string
    tipo: string
    imagem: string
    localizacao: {
    bairro: string
    cidade: string
    }
    avaliacao: number
}

// Dados mockados para teste
const locaisRecomendados = ref<LocalRecomendado[]>([
    {
    id: 1,
    nome: 'Igreja Nossa Senhora de Nazareth',
    tipo: 'Ponto Turístico',
    imagem: '/images/igreja-nazareth.jpg',
    localizacao: {
    bairro: 'Centro',
    cidade: 'Saquarema'
    },
    avaliacao: 4.3
    },
    {
    id: 2,
    nome: 'Mr. Burguer',
    tipo: 'Restaurante / Lanchonete',
    imagem: '/images/mr-burguer.jpg',
    localizacao: {
    bairro: 'Centro',
    cidade: 'Bacaxá'
    },
    avaliacao: 4.6
    },
    {
    id: 3,
    nome: 'Prainha',
    tipo: 'Praia',
    imagem: '/images/prainha.jpg',
    localizacao: {
    bairro: 'Barra Nova',
    cidade: 'Saquarema'
    },
    avaliacao: 4.7
    }
])

// Para uma implementação real do Banco de dados  para carregar dados da API
// const { data: locaisRecomendados } = await useFetch('/api/locais/recomendados')
</script>