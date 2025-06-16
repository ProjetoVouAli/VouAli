<template>
    <Card class="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div class="relative aspect-[16/9] w-full">
        <img
            :src="destino.imagem || '/images/placeholder.jpg'"
            :alt="destino.nome"
            class="object-cover w-full h-full"
        />
        <div v-if="destino.destaque" class="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
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
import { Card, CardCabecalho, CardTitulo, CardDescricao, CardConteudo, CardRodape } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

// Definição de props
defineProps({
    destino: {
        type: Object,
        required: true
    }
})
</script>