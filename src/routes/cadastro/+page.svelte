<script lang="ts">
    import { page } from "$app/state";
    import { enhance } from "$app/forms";
    import { user } from '$lib/stores/user';
    import { flash } from '$lib/stores/flash';
    import { goto } from '$app/navigation';

    let nome = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let sexo = '';
    let mostrarSenha = false;
    let mostrarConfirm = false;
    let loading = false;
    let senhaMatch = true;

    function verificarSenha() {
        senhaMatch = password === confirmPassword;
    }

    const { registerWithEmail, registerWithGoogle } = page.data;
</script>

<!-- Nike: Design minimalista, preto/branco -->
<div class="min-h-screen bg-background pt-32 pb-16">
    <div class="max-w-md mx-auto px-8">
        <!-- Header -->
        <div class="mb-12">
            <h1 class="text-4xl font-bold mb-2">
                Criar conta
            </h1>
            <p class="text-muted-foreground text-lg">
                Junte-se ao VouAli e comece suas viagens
            </p>
        </div>

        <!-- Form Container -->
        <form 
            method="POST"
            class="space-y-6"
            use:enhance={({ formData }) => {
                loading = true;
                return async ({ result }) => {
                    loading = false;
                    if (result.type === 'redirect') {
                        await goto(result.location);
                        return;
                    }

                    if (result.type === 'error') {
                        flash.set('Ocorreu um erro inesperado ao criar a conta.');
                        return;
                    }

                    const data = result.data as any;
                    if (result.type === 'success' && data?.success && data?.user) {
                        user.set(data.user);
                        flash.set(data.message);
                        await goto('/');
                    } else if (result.type === 'failure' && data?.message) {
                        flash.set(data.message);
                    }
                };
            }}
        >
            <!-- Nome Input -->
            <div>
                <label for="nome" class="block text-sm font-semibold mb-2">
                    Nome completo
                </label>
                <input
                    id="nome"
                    type="text"
                    name="nome"
                    bind:value={nome}
                    required
                    disabled={loading}
                    class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Seu nome"
                />
            </div>

            <!-- Email Input -->
            <div>
                <label for="email" class="block text-sm font-semibold mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    bind:value={email}
                    required
                    disabled={loading}
                    class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="seu@email.com"
                />
            </div>

            <!-- Gender Select -->
            <div>
                <label for="sexo" class="block text-sm font-semibold mb-2">
                    Gênero
                </label>
                <select
                    id="sexo"
                    name="sexo"
                    bind:value={sexo}
                    required
                    disabled={loading}
                    class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer"
                >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                </select>
            </div>

            <!-- Password Input -->
            <div>
                <label for="password" class="block text-sm font-semibold mb-2">
                    Senha
                </label>
                <div class="relative">
                    <input
                        id="password"
                        type={mostrarSenha ? 'text' : 'password'}
                        name="password"
                        bind:value={password}
                        oninput={verificarSenha}
                        required
                        disabled={loading}
                        class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onclick={() => mostrarSenha = !mostrarSenha}
                        disabled={loading}
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                    </button>
                </div>
            </div>

            <!-- Confirm Password Input -->
            <div>
                <label for="confirmPassword" class="block text-sm font-semibold mb-2">
                    Confirmar senha
                </label>
                <div class="relative">
                    <input
                        id="confirmPassword"
                        type={mostrarConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        bind:value={confirmPassword}
                        oninput={verificarSenha}
                        required
                        disabled={loading}
                        class="w-full px-4 py-3 border-2 {senhaMatch ? 'border-primary' : 'border-destructive'} bg-background text-foreground font-medium focus:outline-none focus:ring-2 {senhaMatch ? 'focus:ring-ring' : 'focus:ring-destructive'} transition-all"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onclick={() => mostrarConfirm = !mostrarConfirm}
                        disabled={loading}
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {mostrarConfirm ? 'Ocultar' : 'Mostrar'}
                    </button>
                </div>
                {#if !senhaMatch}
                    <p class="text-red-500 text-xs font-semibold mt-1">As senhas não coincidem</p>
                {/if}
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                disabled={loading || !senhaMatch}
                class="w-full px-8 py-4 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wide hover:opacity-80 disabled:opacity-50 transition-all duration-200"
            >
                {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
        </form>

        <!-- Sign In Link -->
        <div class="mt-8 text-center">
            <p class="text-muted-foreground text-sm mb-4">
                Já tem uma conta?
            </p>
            <a
                href="/login"
                class="inline-block px-8 py-4 border-2 border-primary text-foreground font-bold text-sm uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
                Entrar
            </a>
        </div>
    </div>
</div>