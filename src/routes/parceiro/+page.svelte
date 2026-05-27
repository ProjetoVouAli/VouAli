<script lang="ts">
    import { enhance } from "$app/forms";
    import { flash } from '$lib/stores/flash';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

    // Estados do formulário
    let loading = false;
    let formData = {
        nomeResponsavel: '',
        emailResponsavel: '',
        telefoneResponsavel: '',
        nomeEmpresa: '',
        razaoSocial: '',
        cnpj: '',
        segmentoAtuacao: '',
        descricaoNegocio: '',
        website: '',
        instagram: '',
        whatsapp: '',
        cidade: '',
        estado: '',
        endereco: '',
        aceiteTermos: false
    };

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const segmentos = [
        'Hospedagem',
        'Gastronomia',
        'Transporte',
        'Atividades e Lazer',
        'Guia Turístico',
        'Aluguel de Equipamentos',
        'Artesanato',
        'Eventos',
        'Outros'
    ];

    function formatarCNPJ(value: string): string {
        const v = value.replace(/\D/g, '');
        if (v.length <= 14) {
            return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
        }
        return value;
    }

    function formatarTelefone(value: string): string {
        const v = value.replace(/\D/g, '');
        if (v.length <= 11) {
            return v.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_, g1, g2, g3) => {
                if (!g2) return g1;
                if (!g3) return `(${g1}) ${g2}`;
                return `(${g1}) ${g2}-${g3}`;
            });
        }
        return value;
    }

    function handleCNPJChange(e: Event) {
        const input = e.target as HTMLInputElement;
        formData.cnpj = formatarCNPJ(input.value);
    }

    function handleTelefoneChange(e: Event) {
        const input = e.target as HTMLInputElement;
        formData.telefoneResponsavel = formatarTelefone(input.value);
    }

    function handleWhatsAppChange(e: Event) {
        const input = e.target as HTMLInputElement;
        formData.whatsapp = formatarTelefone(input.value);
    }
</script>

<!-- Nike: Página de Solicitação de Parceria -->
<div class="min-h-screen bg-background pt-32 pb-16">
    <div class="max-w-3xl mx-auto px-8">
        <!-- Header -->
        <div class="mb-12">
            <h1 class="text-4xl font-bold mb-2">
                Torne-se Parceiro
            </h1>
            <p class="text-muted-foreground text-lg">
                Junte-se à VouAli e amplie seu negócio turístico
            </p>
        </div>

        <!-- Form Container -->
        <form 
            method="POST"
            class="space-y-8"
            use:enhance={({ formData: fd }) => {
                loading = true;
                return async ({ result }) => {
                    loading = false;

                    if (result.type === 'redirect') {
                        await goto(result.location);
                        return;
                    }

                    if (result.type === 'error') {
                        flash.set('Ocorreu um erro inesperado ao processar sua solicitação.');
                        return;
                    }

                    const data = result.data as any;
                    if (result.type === 'success' && data?.success) {
                        flash.set(data.message);
                        // Redirecionar para página de confirmação
                        await goto('/');
                    } else if (result.type === 'failure' && data?.message) {
                        flash.set(data.message);
                    }
                };
            }}
        >
            <!-- SEÇÃO 1: Dados do Responsável -->
            <Card>
                <CardHeader>
                    <CardTitle>
                        1. Dados do Responsável
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                    <!-- Nome Completo -->
                    <div>
                        <label for="nomeResponsavel" class="block text-sm font-semibold mb-2">
                            Nome Completo *
                        </label>
                        <Input
                            id="nomeResponsavel"
                            type="text"
                            name="nomeResponsavel"
                            bind:value={formData.nomeResponsavel}
                            required
                            disabled={loading}
                            placeholder="Seu nome completo"
                        />
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="emailResponsavel" class="block text-sm font-semibold mb-2">
                            Email *
                        </label>
                        <Input
                            id="emailResponsavel"
                            type="email"
                            name="emailResponsavel"
                            bind:value={formData.emailResponsavel}
                            required
                            disabled={loading}
                            placeholder="seu@email.com"
                        />
                    </div>

                    <!-- Telefone -->
                    <div>
                        <label for="telefoneResponsavel" class="block text-sm font-semibold mb-2">
                            Telefone/WhatsApp *
                        </label>
                        <Input
                            id="telefoneResponsavel"
                            type="tel"
                            name="telefoneResponsavel"
                            bind:value={formData.telefoneResponsavel}
                            onchange={handleTelefoneChange}
                            required
                            disabled={loading}
                            placeholder="(11) 9XXXX-XXXX"
                        />
                    </div>
                </CardContent>
            </Card>

            <!-- SEÇÃO 2: Dados da Empresa -->
            <Card>
                <CardHeader>
                    <CardTitle>
                        2. Dados da Empresa
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                    <!-- Nome da Empresa -->
                    <div>
                        <label for="nomeEmpresa" class="block text-sm font-semibold mb-2">
                            Nome da Empresa/Negócio *
                        </label>
                        <Input
                            id="nomeEmpresa"
                            type="text"
                            name="nomeEmpresa"
                            bind:value={formData.nomeEmpresa}
                            required
                            disabled={loading}
                            placeholder="Ex: Pousada Praia Dourada"
                        />
                    </div>

                    <!-- Razão Social -->
                    <div>
                        <label for="razaoSocial" class="block text-sm font-semibold mb-2">
                            Razão Social
                        </label>
                        <Input
                            id="razaoSocial"
                            type="text"
                            name="razaoSocial"
                            bind:value={formData.razaoSocial}
                            disabled={loading}
                            placeholder="Ex: Pousada Praia Dourada LTDA"
                        />
                    </div>

                    <!-- CNPJ -->
                    <div>
                        <label for="cnpj" class="block text-sm font-semibold mb-2">
                            CNPJ *
                        </label>
                        <Input
                            id="cnpj"
                            type="text"
                            name="cnpj"
                            bind:value={formData.cnpj}
                            onchange={handleCNPJChange}
                            required
                            disabled={loading}
                            placeholder="XX.XXX.XXX/XXXX-XX"
                        />
                    </div>

                    <!-- Segmento de Atuação -->
                    <div>
                        <label for="segmentoAtuacao" class="block text-sm font-semibold mb-2">
                            Segmento de Atuação *
                        </label>
                        <select
                            id="segmentoAtuacao"
                            name="segmentoAtuacao"
                            bind:value={formData.segmentoAtuacao}
                            required
                            disabled={loading}
                            class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Selecione</option>
                            {#each segmentos as segmento}
                                <option value={segmento}>{segmento}</option>
                            {/each}
                        </select>
                    </div>
                </CardContent>
            </Card>

            <!-- SEÇÃO 3: Contato e Operação -->
            <Card>
                <CardHeader>
                    <CardTitle>
                        3. Contato e Localização
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                    <!-- Website -->
                    <div>
                        <label for="website" class="block text-sm font-semibold mb-2">
                            Website
                        </label>
                        <Input
                            id="website"
                            type="url"
                            name="website"
                            bind:value={formData.website}
                            disabled={loading}
                            placeholder="https://seusite.com.br"
                        />
                    </div>

                    <!-- Instagram -->
                    <div>
                        <label for="instagram" class="block text-sm font-semibold mb-2">
                            Instagram
                        </label>
                        <Input
                            id="instagram"
                            type="text"
                            name="instagram"
                            bind:value={formData.instagram}
                            disabled={loading}
                            placeholder="@seuinstagram"
                        />
                    </div>

                    <!-- WhatsApp -->
                    <div>
                        <label for="whatsapp" class="block text-sm font-semibold mb-2">
                            WhatsApp
                        </label>
                        <Input
                            id="whatsapp"
                            type="tel"
                            name="whatsapp"
                            bind:value={formData.whatsapp}
                            onchange={handleWhatsAppChange}
                            disabled={loading}
                            placeholder="(11) 9XXXX-XXXX"
                        />
                    </div>

                    <!-- Cidade -->
                    <div>
                        <label for="cidade" class="block text-sm font-semibold mb-2">
                            Cidade *
                        </label>
                        <Input
                            id="cidade"
                            type="text"
                            name="cidade"
                            bind:value={formData.cidade}
                            required
                            disabled={loading}
                            placeholder="Ex: São Paulo"
                        />
                    </div>

                    <!-- Estado -->
                    <div>
                        <label for="estado" class="block text-sm font-semibold mb-2">
                            Estado *
                        </label>
                        <select
                            id="estado"
                            name="estado"
                            bind:value={formData.estado}
                            required
                            disabled={loading}
                            class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Selecione</option>
                            {#each estados as estado}
                                <option value={estado}>{estado}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- Endereço -->
                    <div>
                        <label for="endereco" class="block text-sm font-semibold mb-2">
                            Endereço Completo
                        </label>
                        <Input
                            id="endereco"
                            type="text"
                            name="endereco"
                            bind:value={formData.endereco}
                            disabled={loading}
                            placeholder="Rua, número, complemento"
                        />
                    </div>
                </CardContent>
            </Card>

            <!-- SEÇÃO 4: Sobre o Negócio -->
            <Card>
                <CardHeader>
                    <CardTitle>4. Descrição do Negócio</CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                    <div>
                        <label for="descricaoNegocio" class="block text-sm font-semibold mb-2">
                            Conte-nos sobre seu negócio *
                        </label>
                        <textarea
                            id="descricaoNegocio"
                            name="descricaoNegocio"
                            bind:value={formData.descricaoNegocio}
                            required
                            disabled={loading}
                            placeholder="Descreva seu negócio, diferenciais, público-alvo, etc. (mínimo 20 caracteres)"
                            class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all rounded-md resize-none"
                            rows="5"
                        ></textarea>
                        <p class="text-xs text-muted-foreground mt-2">
                            {formData.descricaoNegocio.length} caracteres
                        </p>
                    </div>
                </CardContent>
            </Card>

            <!-- SEÇÃO 5: Aceite de Termos -->
            <Card>
                <CardHeader>
                    <CardTitle>5. Termos e Condições</CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="aceiteTermos"
                            bind:checked={formData.aceiteTermos}
                            disabled={loading}
                            class="w-5 h-5 mt-1 cursor-pointer accent-primary"
                        />
                        <span class="text-sm text-muted-foreground">
                            Concordo com os <a href="/termos" class="underline hover:text-foreground">termos e condições</a> e 
                            com a <a href="/privacidade" class="underline hover:text-foreground">política de privacidade</a> da VouAli.
                        </span>
                    </label>
                </CardContent>
            </Card>

            <!-- Submit Button -->
            <div class="space-y-4">
                <Button
                    type="submit"
                    disabled={loading || !formData.aceiteTermos}
                    class="w-full"
                >
                    {loading ? 'Enviando solicitação...' : 'Enviar Solicitação'}
                </Button>

                <Button
                    href="/"
                    variant="outline"
                    class="w-full"
                >
                    Voltar
                </Button>
            </div>
        </form>

        <!-- Info Box -->
        <div class="mt-16 p-6 bg-secondary rounded-lg border border-border">
            <h3 class="font-semibold mb-3">ℹ️ Como funciona</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Sua solicitação será analisada pela equipe VouAli</li>
                <li>• Você receberá um email com a resposta em até 5 dias úteis</li>
                <li>• Após aprovação, você poderá gerenciar seus serviços na plataforma</li>
                <li>• Todos os dados fornecidos são protegidos conforme nossa política de privacidade</li>
            </ul>
        </div>
    </div>
</div>

<style>
    textarea {
        font-family: inherit;
    }
</style>
