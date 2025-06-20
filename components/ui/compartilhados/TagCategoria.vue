// Tag para categorias (Pousada, Praia, etc)

<template>
    <span 
        class="inline-block text-xs px-2 py-0.5 rounded font-medium"
        :class="[
            variant === 'default' ? 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200' : '',
            variant === 'overlay' ? 'bg-white/80 dark:bg-zinc-800/80 text-gray-800 dark:text-zinc-200' : '',
            customClass
        ]"
    >
        {{ texto }}
    </span>
</template>

<script setup lang="ts">
interface Props {
    /**
   * Texto da categoria a ser exibido
   */
    texto: string;

    /**
   * Variante visual da tag
   * - default: fundo sólido claro
   * - overlay: fundo semi-transparente (para uso sobre imagens)
   */
    variant?: 'default' | 'overlay';

    /**
   * Classes CSS adicionais
   */
    customClass?: string;
}

// Valores padrão para as props
const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    customClass: ''
});
</script>