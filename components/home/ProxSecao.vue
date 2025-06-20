// Seção "Popular nas proximidades"  

<template>
    <section class="w-full">
        <!-- Cabeçalho da seção -->
        <div class="flex justify-between items-center mb-3">
        <h2 class="font-bold text-lg">Popular nas proximidades</h2>
        <button class="text-sm text-primary font-medium">Ver tudo</button>
        </div>
        
        <!-- Container com scroll horizontal -->
        <div class="flex overflow-x-auto snap-x gap-3 pb-4 -mx-4 px-4 scrollbar-hide">
        <!-- Cards de locais próximos -->
        <ProxCard
            v-for="(local, index) in locaisProximos"
            :key="index"
            :item="local"
            class="min-w-[250px] w-[250px] snap-start"
        />
        </div>
    </section>
</template>

<script setup lang="ts">
import ProxCard from './ProxCard.vue'
import { ref } from 'vue'

// Interface para locais próximos
interface LocalProximo {
    id: number
    nome: string
    categoria: string
    imagem: string
    localizacao: {
    bairro: string
    cidade: string
    }
    avaliacao?: number
}

// Dados mockados para teste
const locaisProximos = ref<LocalProximo[]>([
    {
    id: 1,
    nome: 'VIVER Pousada Club',
    categoria: 'Pousada',
    imagem: '/images/pousada-viver.jpg',
    localizacao: {
    bairro: 'Itaúna',
    cidade: 'Saquarema'
    },
    avaliacao: 4.8
    },
    {
    id: 2,
    nome: 'Praia da Vila',
    categoria: 'Praia',
    imagem: '/images/praia-da-vila.jpg',
    localizacao: {
    bairro: '',
    cidade: 'Saquarema-RJ'
    },
    avaliacao: 4.5
    },
    {
    id: 3,
    nome: 'Pousada Mar e Sol',
    categoria: 'Pousada',
    imagem: '/images/pousada-mar-e-sol.jpg',
    localizacao: {
    bairro: 'Centro',
    cidade: 'Saquarema'
    },
    avaliacao: 4.3
    },
    {
    id: 4,
    nome: 'Praia de Itaúna',
    categoria: 'Praia',
    imagem: '/images/praia-itauna.jpg',
    localizacao: {
    bairro: '',
    cidade: 'Saquarema-RJ'
    },
    avaliacao: 4.9
    }
])

// Para uma implementação real do Banco de dados  para carregar dados da API
// const { data: locaisProximos } = await useFetch('/api/locais/proximos')
</script>

<style scoped>
/* Esconde a barra de rolagem mas mantém a funcionalidade */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>