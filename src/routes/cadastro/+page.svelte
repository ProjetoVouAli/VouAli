<script lang="ts">

    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from '$lib/components/ui/input/index.js';
    import { page } from "$app/state";
    import { enhance } from "$app/forms";
    import { user } from '$lib/stores/user';
    import { flash } from '$lib/stores/flash';
    import { goto } from '$app/navigation';

    let email  = '';
    let password = '';
    let confirmPassword = '';
    let mostrarSenha = false;
    let loading = false;

        const { registerWithEmail, registerWithGoogle } = page.data;

</script>

<div class="min-h-screen bg-white dark:bg-slate-950 transition-colors">
    <div class="flex flex-col  items-center justify-center min-h-screen">
        <div class="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg dark:shadow-slate-800 w-full max-w-md border border-gray-200 dark:border-slate-700 ">
            <h2 class="text-2x1 font-bold mb-6 text-center text-gray-900 dark:text-white">
                Registrar-se
            </h2>



            <form
                method="POST"
                use:enhance={({ formData }) => {
                    loading = true;
                    return async ({ result }) => {
                        loading = false;
                        if (result.type === 'redirect') {
                            // Fallback: redirect do servidor
                            await goto(result.location);
                            return;
                        }

                        if (result.type === 'error') {
                            console.log('[CADASTRO ENHANCE] ❌ Erro inesperado:', result.error);
                            flash.set('Ocorreu um erro inesperado ao processar o cadastro.');
                            return;
                        }

                        const data = result.data as any;

                        // ✅ Se o cadastro foi bem-sucedido, atualizar store e depois redirecionar
                        if (result.type === 'success' && data?.success && data?.user) {
                            console.log('[CADASTRO ENHANCE] ✅ Cadastro bem-sucedido:', data.user.email);
                            user.set(data.user);
                            flash.set(data.message);
                            
                            // Redirecionar para home APÓS atualizar o store
                            await goto('/');
                        } else if (result.type === 'failure' && data?.message) {
                            console.log('[CADASTRO ENHANCE] ❌ Erro:', data.message);
                            flash.set(data.message);
                        }
                    };
                }}
                class="space-y-4"
            >
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        bind:value={email}
                        required
                        class="mt-1 block w-full dark:bg-slate-800 dark:text-white dark:border-slate-600"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Senha
                    </label>
                    <Input
                        id="password"
                        type={mostrarSenha ? 'text' : 'password'}
                        name="password"
                        bind:value={password}
                        required
                        class="mt-1 block w-full dark:bg-slate-800 dark:text-white dark:border-slate-600"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirmar Senha
                    </label>
                    <Input
                        id="confirmPassword"
                        type={mostrarSenha ? 'text' : 'password'}
                        name="confirmPassword"
                        bind:value={confirmPassword}
                        required
                        class="mt-1 block w-full dark:bg-slate-800 dark:text-white dark:border-slate-600"
                        disabled={loading}
                    />
                </div>

                <div class="flex items-center">
                    <input
                        id="mostrarSenha"
                        type="checkbox"
                        bind:checked={mostrarSenha}
                        disabled={loading}
                        class="mr-2 dark:accent-blue-500"
                    />
                    <label for="mostrarSenha" class="text-sm text-gray-700 dark:text-gray-300">
                        Mostrar senha
                    </label>
                </div>

                <Button type="submit" class="w-full dark:bg-blue-600 dark:hover:bg-blue-700" disabled={loading}>
                    {loading ? 'Criando conta...' : 'Registrar-se'}
                </Button>
            </form>

            <div class="mt-4 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Já tem uma conta?
                    <a href="/login" class="text-blue-500 dark:text-blue-400 hover:underline">
                        Entrar
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>