<script lang="ts">
    import Button from '$lib/components/ui/button/button.svelte';
    import { Input } from '$lib/components/ui/input/index.js';
    import { page } from '$app/state';
    import { enhance } from '$app/forms';
    import { user } from '$lib/stores/user';
    import { flash } from '$lib/stores/flash';
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let mostrarSenha = false;
    let loading = false;

    const { loginWithEmail, loginWithGoogle } = page.data;
    const { form } = page;

    $: {
        console.log('[LOGIN] Valor de form:', form);
        if (form?.success) {
            console.log('[LOGIN] Login bem-sucedido, redirecionando para home...');
            user.set(form.user);
            flash.set(form.message);
            if (typeof window !== 'undefined') {
                window.location.href = '/'; // reload completo para hidratação SSR
            }
        }
    }

</script>

<div class="min-h-screen bg-white dark:bg-slate-950 transition-colors">
    <div class="flex flex-col items-center justify-center min-h-screen">
        <div class="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-lg dark:inset-shadow-slate-800 w-full max-w-md border">
            <h2 class="text-2x1 font-bold mb-6 text-center text-gray-900 dark:text-white">
                Login
            </h2>
            
            {#if form?.message}
                <div class="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                    {form.message}
                </div>
            {/if}

            <form 
                method="POST"
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
                    <label for="password" class="block text-sm font-medium   text-gray-700 dark:text-gray-300">
                        Senha
                    </label>
                    <Input
                        id="password"
                        type={mostrarSenha ? 'text' : 'password'}
                        name="password"
                        bind:value={password}
                        required
                        class="mt-1 block w-full dark:bg-slate-800 dark:text-white dark:borders-slate-600"
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
                    {loading ? 'Entrando...' :  'Entrar'}
                </Button>
            </form>

            <div class="mt-4 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Não tem uma conta?
                    <a href="/cadastro" class="text-blue-500 dark:text-blue-400 hover:underline">
                        Registre-se
                    </a>
                </p>

            </div>

        </div>

    </div>
</div>
