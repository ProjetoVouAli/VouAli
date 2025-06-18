<template>
<Card class="max-w-md w-full mx-auto p-6 rounded-xl shadow-lg space-y-6 bg-white">
    <h1 class="text-2xl font-bold">
    {{ tipo === 'login' ? 'Entrar' : 'Inscrever-se' }}
    </h1>
    <p class="text-sm text-gray-500">
    {{ tipo === 'login' ? 'Por favor, insira uma conta válida' : 'Crie uma conta, é grátis' }}
    </p>

    <form @submit.prevent="enviarFormulario" class="space-y-4">
    <CampoEntrada
        v-if="tipo === 'cadastro'"
        v-model="form.nome"
        label="Nome"
        placeholder="Seu nome"
    />
    <CampoEntrada
        v-model="form.email"
        label="E-mail"
        type="email"
        placeholder="email@exemplo.com"
    />
    <CampoEntrada
        v-model="form.senha"
        label="Senha"
        type="password"
        placeholder="••••••••"
    />

    <div class="flex justify-between text-sm" v-if="tipo === 'login'">
        <span></span>
        <a href="#" class="text-blue-700 hover:underline">Esqueceu a senha</a>
    </div>

    <Button type="submit" class="w-full bg-blue-800 hover:bg-blue-900 text-white rounded-full">
        {{ tipo === 'login' ? 'Entrar' : 'Inscrever-se' }}
    </Button>
    </form>

    <div class="flex items-center gap-2">
    <div class="flex-grow h-px bg-gray-300" />
    <span class="text-sm text-gray-500">OU</span>
    <div class="flex-grow h-px bg-gray-300" />
    </div>

    <BotoesLoginSocial />

    <div class="text-center text-sm mt-4">
    <span>{{ tipo === 'login' ? 'Não tem conta?' : 'Tem conta?' }}</span>
    <NuxtLink
        :to="tipo === 'login' ? '/autenticacao/cadastro' : '/autenticacao/login'"
        class="text-blue-700 font-semibold ml-1 hover:underline"
    >
        {{ tipo === 'login' ? 'Inscrever-se' : 'Entrar' }}
    </NuxtLink>
    </div>
</Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CampoEntrada from './CampoEntrada.vue'
import BotoesLoginSocial from './BotoesLoginSocial.vue'
import { Button } from '@/components/ui/button'
import { useAutenticacao } from '@/composables/useAutenticacao'

const props = defineProps<{ tipo: 'login' | 'cadastro' }>()
const router = useRouter()
const { login, cadastrar } = useAutenticacao()

const form = ref({
nome: '',
email: '',
senha: ''
})

const enviarFormulario = async () => {
try {
    if (props.tipo === 'login') {
    await login(form.value.email, form.value.senha)
      router.push('/dashboard') // página pós-login
    } else {
    await cadastrar(form.value.nome, form.value.email, form.value.senha)
    router.push('/dashboard')
    }
} catch (erro) {
    alert('Erro: ' + erro)
}
}
</script>
