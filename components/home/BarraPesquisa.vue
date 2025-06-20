// Campo de pesquisa

<template>
    <div class="relative w-full">
        <!-- Container do ícone com posicionamento ajustado - aumentado espaçamento -->
        <div class="absolute inset-y-0 left-8 flex items-center justify-center pointer-events-none" style="line-height: 0;">
            <PesquisaIcone class="text-gray-400" />
        </div>
        
        <!-- Campo de pesquisa com padding ajustado -->
        <input
            type="text"
            placeholder="Pesquisar"
            class="w-full h-10 pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-zinc-200"
            @input="handleSearch"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PesquisaIcone from '~/components/ui/icons/PesquisaIcone.vue'

// Valor do campo de busca
const searchQuery = ref('')

// Método para lidar com a entrada de texto
const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement
    searchQuery.value = target.value
    
  // Aqui você pode adicionar lógica para busca em tempo real
  // ou emitir um evento para o componente pai
}

// Opcionalmente, emitir evento quando o usuário envia a pesquisa
const emit = defineEmits(['search'])

// Método para submeter a busca (pode ser usado com enter key press)
const submitSearch = () => {
    emit('search', searchQuery.value)
}
</script>