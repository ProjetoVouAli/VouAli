<script lang="ts">
    import { page } from '$app/state';
    import { enhance } from '$app/forms';
    import { user } from '$lib/stores/user';
    import { flash } from '$lib/stores/flash';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';

    let email = '';
    let password = '';
    let mostrarSenha = false;
    let loading = false;

    const { loginWithEmail, loginWithGoogle } = page.data;
</script>

<!-- Nike: Design minimalista, preto/branco -->
<div class="min-h-screen bg-background pt-32 pb-16">
    <div class="max-w-md mx-auto px-8">
        <!-- Header -->
        <div class="mb-12">
            <h1 class="text-4xl font-bold mb-2">
                Bem-vindo de volta
            </h1>
            <p class="text-muted-foreground text-lg">
                Faça login na sua conta para continuar
            </p>
        </div>

        <!-- Form Container -->
        <div class="space-y-8">
            <!-- Email/Password Form -->
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
                            flash.set('Ocorreu um erro inesperado ao processar o login.');
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

                <!-- Submit Button -->
                <Button
                    type="submit"
                    disabled={loading}
                    class="w-full"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </Button>
            </form>
            
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-border"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-background text-muted-foreground">ou</span>
                </div>
            </div>

            <!-- Sign Up Link -->
            <div class="text-center">
                <p class="text-muted-foreground text-sm mb-4">
                    Não tem uma conta?
                </p>
                <Button href="/cadastro" variant="outline">
                    Criar conta
                </Button>
            </div>
        </div>
    </div>
</div>
