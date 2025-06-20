// Barra de navegação inferior

<template>
    <nav class="h-16 bg-white dark:bg-zinc-800 px-4 py-2 flex justify-around items-center w-full">
        <!-- Botão Início (ativo) -->
        <button class="flex flex-col items-center gap-1 text-primary">
            <HomeIcone class="h-6 w-6" />
        <span class="text-xs font-medium">Início</span>
        </button>
        
        <!-- Botão Favoritos -->
        <button class="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <FovoritoIcone class="h-6 w-6" />
        <span class="text-xs">Favoritos</span>
        </button>
        
        <!-- Botão Notificações -->
        <button class="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <NotificacaoIcone class="h-6 w-6" />
        <span class="text-xs">Notificações</span>
        </button>
        
        <!-- Botão Rotas -->
        <button class="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <RotasIcone class="h-6 w-6" />
        <span class="text-xs">Rotas</span>
        </button>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeIcone from '~/components/ui/icons/HomeIcone.vue'
import FovoritoIcone from '~/components/ui/icons/FovoritoIcone.vue'
import NotificacaoIcone from '~/components/ui/icons/NotificacaoIcone.vue'
import RotasIcone from '~/components/ui/icons/RotasIcone.vue'

// Em uma implementação real, poderia vir de um estado global ou props
const activeTab = ref('inicio')

// Função para mudar de aba que poderia ser implementada
const changeTab = (tab: string) => {
    activeTab.value = tab
  // Lógica adicional de navegação pode ser adicionada aqui
}
</script>