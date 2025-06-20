// Barra superior com localização e ícone de configurações

<template>
    <div class="flex justify-between items-center w-full">
        <!-- Lado esquerdo - Informações de localização -->
        <div class="flex flex-col">
        <span class="text-xs text-muted-foreground">Sua localização</span>
        <span class="text-lg font-semibold">Saquarema-RJ</span>
        </div>

        <!-- Lado direito - Ícones de ação -->
        <div class="flex items-center gap-3">
        <!-- Ícone de notificação com badge -->
        <div class="relative">
            <NotificacaoIcone class="h-6 w-6 text-gray-700 dark:text-gray-300" />
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
            </span>
        </div>
        
        <!-- Ícone de engrenagem/configurações -->
        <EngrenagemIcone class="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </div>
    </div>
</template>

<script setup lang="ts">
import EngrenagemIcone from '~/components/ui/icons/EngrenagemIcone.vue'
import NotificacaoIcone from '~/components/ui/icons/NotificacaoIcone.vue'

// Para uma implementação real, a localização poderia vir de um store ou props
const localizacao = ref('Saquarema-RJ')
</script>