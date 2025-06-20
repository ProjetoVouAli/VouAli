// Nova página inicial

<template>
    <!-- Container principal com layout mobile-first -->
    <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Cabeçalho com localização -->
        <LocalizacaoHeader class="px-4 py-3" />
        
        <!-- Campo de pesquisa -->
        <BarraPesquisa class="px-4 mb-3" />
        
        <!-- Conteúdo principal com scroll -->
        <main class="flex-1 overflow-y-auto pb-20">
        <!-- Seção "Popular nas proximidades" -->
        <ProxSecao class="px-4 mb-6" />
        
        <!-- Seção "Recomendado" -->
        <SecaoRecomendacao class="px-4" />
        </main>

        <!-- Barra de navegação inferior (fixada) -->
        <NavegacaoInferior class="fixed bottom-0 left-0 w-full border-t border-gray-200 dark:border-gray-800" />
    </div>
</template>

<script setup lang="ts">
import LocalizacaoHeader from '~/components/home/LocalizacaoHeader.vue'
import BarraPesquisa from '~/components/home/BarraPesquisa.vue'
import ProxSecao from '~/components/home/ProxSecao.vue'
import SecaoRecomendacao from '~/components/home/SecaoRecomendacao.vue'
import NavegacaoInferior from '~/components/home/NavegacaoInferior.vue'

// Configuração de SEO
useHead({
    title: 'VouAli - Descubra lugares incríveis',
    meta: [
        { name: 'description', content: 'Encontre os melhores lugares para visitar, comer e se hospedar perto de você.' }
    ]
})
</script>