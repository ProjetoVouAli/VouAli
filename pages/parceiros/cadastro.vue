<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Cadastro de Parceiro</h1>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <!-- Nome da empresa -->
      <div>
        <label for="empresa" class="block mb-1 font-medium">Nome da Empresa</label>
        <input
          id="empresa"
          v-model="form.empresa"
          type="text"
          placeholder="Digite o nome"
          class="w-full border rounded px-3 py-2"
        />
        <p v-if="errors.empresa" class="text-red-600 text-sm">{{ errors.empresa }}</p>
      </div>

      <!-- E-mail de contato -->
      <div>
        <label for="email" class="block mb-1 font-medium">E-mail de Contato</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="email@exemplo.com"
          class="w-full border rounded px-3 py-2"
        />
        <p v-if="errors.email" class="text-red-600 text-sm">{{ errors.email }}</p>
      </div>

      <!-- Telefone -->
      <div>
        <label for="telefone" class="block mb-1 font-medium">Telefone</label>
        <input
          id="telefone"
          v-model="form.telefone"
          type="tel"
          placeholder="(99) 99999‑9999"
          class="w-full border rounded px-3 py-2"
        />
        <p v-if="errors.telefone" class="text-red-600 text-sm">{{ errors.telefone }}</p>
      </div>

      <!-- Descrição da empresa -->
      <div>
        <label for="descricao" class="block mb-1 font-medium">Descrição da Empresa</label>
        <textarea
          id="descricao"
          v-model="form.descricao"
          rows="5"
          maxlength="1000"
          placeholder="Descreva sua empresa (até 1000 caracteres)"
          class="w-full border rounded px-3 py-2"
        ></textarea>
        <p class="text-sm text-gray-600">{{ form.descricao.length }} / 1000 caracteres</p>
        <p v-if="errors.descricao" class="text-red-600 text-sm">{{ errors.descricao }}</p>
      </div>

      <!-- Preço mínimo -->
      <div>
        <label for="preco" class="block mb-1 font-medium">Preço Mínimo (“A partir de”)</label>
        <input
          id="preco"
          v-model.number="form.preco"
          type="number"
          min="0"
          step="0.01"
          placeholder="A partir de R$ 0,00"
          class="w-full border rounded px-3 py-2"
        />
        <p v-if="errors.preco" class="text-red-600 text-sm">{{ errors.preco }}</p>
      </div>

      <!-- Imagens do local -->
      <div>
        <label class="block mb-1 font-medium">Imagens do Local (até 3)</label>
        <div class="flex space-x-2">
          <input
            v-for="i in 3"
            :key="i"
            type="file"
            accept="image/*"
            @change="onFileChange($event, i - 1)"
            class="border rounded px-2 py-1"
          />
        </div>
        <p v-if="errors.imagens" class="text-red-600 text-sm mt-1">{{ errors.imagens }}</p>
      </div>

      <!-- Botão de enviar -->
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Cadastrar Parceiro
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

interface FormData {
  empresa: string
  email: string
  telefone: string
  descricao: string
  preco: number | null
  imagens: (File | null)[]
}

// Estado do formulário
const form = reactive<FormData>({
  empresa: '',
  email: '',
  telefone: '',
  descricao: '',
  preco: null,
  imagens: [null, null, null]
})

// Erros de validação
const errors = reactive<{ [key: string]: string }>({})

const router = useRouter()

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.empresa.trim()) errors.empresa = 'O nome da empresa é obrigatório.'
  if (!form.email.trim()) {
    errors.email = 'O e‑mail é obrigatório.'
  } else if (!/.+@.+.\.+.+/.test(form.email)) {
    errors.email = 'Insira um e‑mail válido.'
  }
  if (!form.telefone.trim()) errors.telefone = 'O telefone é obrigatório.'
  if (!form.descricao.trim()) {
    errors.descricao = 'A descrição é obrigatória.'
  } else if (form.descricao.length > 1000) {
    errors.descricao = 'Descrição deve ter até 1000 caracteres.'
  }
  if (form.preco === null || form.preco < 0) errors.preco = 'Informe um preço mínimo válido.'

  const imgs = form.imagens.filter(Boolean)
  if (imgs.length === 0) {
    errors.imagens = 'Adicione ao menos uma imagem.'
  } else if (imgs.length > 3) {
    errors.imagens = 'Você pode adicionar até 3 imagens.'
  }

  return Object.keys(errors).length === 0
}

function onFileChange(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  form.imagens[index] = target.files?.[0] ?? null
}

async function onSubmit() {
  if (!validate()) return

  try {
    const payload = new FormData()
    payload.append('empresa', form.empresa)
    payload.append('email', form.email)
    payload.append('telefone', form.telefone)
    payload.append('descricao', form.descricao)
    payload.append('preco', String(form.preco))
    form.imagens.forEach((img, i) => {
      if (img) payload.append(`imagem_${img.name}`, img)
    })

    // Exemplo: await fetch('/api/parceiros', { method: 'POST', body: payload })
    console.log('Enviando dados:', form)

    alert('Parceiro cadastrado com sucesso!')
    router.push('/')
  } catch (e) {
    console.error(e)
    alert('Erro ao cadastrar parceiro. Tente novamente.')
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>

