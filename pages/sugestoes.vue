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
const { data: destinos, pending, error } = useFetch<Destino[]>('/api/destinos')

// Configuração de SEO
useHead({
    title: 'Sugestões de Destinos | VouAli',
    meta: [
        { name: 'description', content: 'Descubra os melhores destinos turísticos para sua próxima aventura.' }
    ]
})
</script>