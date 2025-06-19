<!-- <template>
  <div>
    <h3 class="text-4xl font-bold pb-4">Vou Ali</h3>
    <Button onclick="alert('https://www.shadcn-vue.com/docs/components/button.html')">Botão do ShadCn</Button>  </div>
</template> -->


<template>
  <div class="p-6 space-y-4">
    <h3 class="text-4xl font-bold">Vou Ali</h3>

    <Button @click="$router.push('/Sugestoes')">Ir para Sugestões de Destino</Button>
  </div>
</template>
