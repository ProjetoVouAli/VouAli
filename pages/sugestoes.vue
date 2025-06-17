<template>
    <div class="container py-8">
        <h1 class="text-4xl font-bold mb-8">Sugestões de Destino</h1>
        
        <!-- Seção principal de sugestões -->
        <div v-if="pending" class="flex justify-center items-center my-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            Erro ao carregar destinos. Tente novamente mais tarde.
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardDestino 
                v-for="destino in destinos" 
                :key="destino.id" 
                :destino="destino"
                @click="navigateTo(`/destinos/${destino.slug}`)" 
            />
        </div>
    </div>
</template>

<script setup lang="ts">
// Definição de tipos
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

// Busca os dados da API
// const { data: destinos, pending, error } = useFetch<Destino[]>('/api/destinos')

// Mock de teste, apagar apos concluir banco de dados.0
const destinos = ref<Destino[]>([
    {
        id: 1,
        nome: 'Arraial do Cabo',
        slug: 'arraial-do-cabo',
        resumo: 'Belezas naturais e praias paradisíacas.',
        descricao: 'Localizado na Região dos Lagos, Arraial do Cabo é conhecido por suas águas cristalinas e rica vida marinha.',
        imagem: 'https://source.unsplash.com/600x400/?beach,ocean',
        destaque: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        nome: 'Saquarema',
        slug: 'saquarema',
        resumo: 'A capital brasileira do surf.',
        descricao: 'Saquarema é um dos principais pontos turísticos do Rio de Janeiro, com cultura vibrante e paisagens incríveis.',
        imagem: 'https://source.unsplash.com/600x400/?surf,beach',
        destaque: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
])

const pending = ref(false)
const error = ref(null)


// Configuração de SEO
useHead({
    title: 'Sugestões de Destinos | VouAli',
    meta: [
        { name: 'description', content: 'Descubra os melhores destinos turísticos para sua próxima aventura.' }
    ]
})
</script>