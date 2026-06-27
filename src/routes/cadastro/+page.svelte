<script lang="ts">
    import { page } from "$app/state";
    import { enhance } from "$app/forms";
    import { user } from '$lib/stores/user';
    import { flash } from '$lib/stores/flash';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';

    import { googleProvider, auth } from '$lib/firebase';
    import { signInWithPopup, type UserCredential } from 'firebase/auth';

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

    let googleTokenInput: HTMLInputElement;
    let googleForm: HTMLFormElement;

    async function handleGoogleLogin() {
        try {
            loading = true;
            const result: UserCredential = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            
            // Submete o formulário oculto
            googleTokenInput.value = idToken;
            googleForm.requestSubmit();
        } catch (error) {
            console.error('Erro Google Auth:', error);
            flash.set('Erro ao autenticar com o Google.');
            loading = false;
        }
    }
</script>

<!-- Form oculto para submeter o token do Google pro SvelteKit action ?/google -->
<form 
    bind:this={googleForm} 
    action="?/google" 
    method="POST" 
    class="hidden"
    use:enhance={() => {
        return async ({ result }) => {
            loading = false;
            if (result.type === 'redirect') {
                await goto(result.location);
                return;
            }
            if (result.type === 'error') {
                flash.set('Erro interno ao validar Google Auth.');
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
    <input type="hidden" name="idToken" bind:this={googleTokenInput} />
</form>

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
        <div class="space-y-6">
            {#if registerWithGoogle}
            <Button
                type="button"
                variant="outline"
                disabled={loading}
                class="w-full flex items-center justify-center gap-2"
                onclick={handleGoogleLogin}
            >
                <svg viewBox="0 0 24 24" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                {loading ? 'Entrando...' : 'Criar conta com Google'}
            </Button>
            
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-border"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-background text-muted-foreground">ou</span>
                </div>
            </div>
            {/if}

            <form 
                action="?/register"
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
                <Input
                    id="nome"
                    type="text"
                    name="nome"
                    bind:value={nome}
                    required
                    disabled={loading}
                    placeholder="Seu nome"
                />
            </div>

            <!-- Email Input -->
            <div>
                <label for="email" class="block text-sm font-semibold mb-2">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    bind:value={email}
                    required
                    disabled={loading}
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
                    <Input
                        id="password"
                        type={mostrarSenha ? 'text' : 'password'}
                        name="password"
                        bind:value={password}
                        oninput={verificarSenha}
                        required
                        disabled={loading}
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
                    <Input
                        id="confirmPassword"
                        type={mostrarConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        bind:value={confirmPassword}
                        oninput={verificarSenha}
                        required
                        disabled={loading}
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
            <Button
                type="submit"
                disabled={loading || !senhaMatch}
                class="w-full"
            >
                {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
            </form>
        </div>

        <!-- Sign In Link -->
        <div class="mt-8 text-center">
            <p class="text-muted-foreground text-sm mb-4">
                Já tem uma conta?
            </p>
            <Button href="/login" variant="outline">
                Entrar
            </Button>
        </div>
    </div>
</div>