<template>
    <div v-if="pending" class="container py-12 flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
    
    <div v-else-if="error" class="container py-12">
        <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            Destino não encontrado ou erro ao carregar dados.
        </div>
        <Button class="mt-4" @click="navigateTo('/Sugestoes')">
            Voltar para sugestões
        </Button>
    </div>
  
    <div v-else-if="destino" class="container py-8">
        <div class="flex flex-col md:flex-row gap-6">
        <!-- Imagem principal -->
        <div class="w-full md:w-1/2">
            <img 
            :src="destino.imagem || '/images/placeholder.jpg'" 
            :alt="destino.nome"
            class="w-full h-auto rounded-lg object-cover aspect-video"
            />
        </div>
        
        <!-- Informações do destino -->
        <div class="w-full md:w-1/2">
            <h1 class="text-4xl font-bold mb-2">{{ destino.nome }}</h1>
            <p class="text-lg font-medium text-muted-foreground mb-6">{{ destino.resumo }}</p>
            
            <div class="prose max-w-none">
            <p>{{ destino.descricao }}</p>
            </div>
            
            <Button class="mt-8" @click="navigateTo('/Sugestoes')">
                Voltar para sugestões
            </Button>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

const route = useRoute()
const slug = route.params.slug as string

// Busca os detalhes do destino pela API
const { data: destino, pending, error } = await useFetch(`/api/destinos/${slug}`)

// Configuração de SEO
useHead({
    title: destino.value ? `${destino.value.nome} | VouAli` : 'Destino | VouAli',
    meta: [
        { 
        name: 'description', 
        content: destino.value ? destino.value.resumo : 'Detalhes do destino turístico' 
        }
    ]
})
</script>