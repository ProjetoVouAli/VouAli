<script lang="ts">
    import { enhance } from "$app/forms";
    import { flash } from '$lib/stores/flash';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
    import TelephoneInput from '$lib/components/ui/telephone-input/telephone-input.svelte';
    import DocumentInput from '$lib/components/ui/document-input/document-input.svelte';
    import { imask } from '@imask/svelte';
    import type { PageData } from './$types';
    import { untrack } from 'svelte';

    let { data } = $props<{ data: PageData }>();

    // Estados do formulário
    let docValido = $state<boolean | null>(null);
    let loading = $state(false);
    let loadingCep = $state(false);

    let formData = $state({
        nomeResponsavel: untrack(() => data.userNome) || '',
        emailResponsavel: untrack(() => data.userEmail) || '',
        telefoneResponsavel: '',
        nomeEmpresa: '',
        razaoSocial: '',
        cnpj: '',
        segmentoAtuacao: '',
        descricaoNegocio: '',
        website: '',
        instagram: '',
        whatsapp: '',
        cep: '',
        cidade: '',
        estado: '',
        endereco: '',
        aceiteTermos: false
    });

    // Objeto de validação reativa
    let erros: Record<string, string> = $state({});
    let camposInvalidos = $state(new Set<string>());

    // Limites de caracteres (do backend)
    const CHAR_LIMITS: Record<string, { min: number; max: number }> = {
        nomeResponsavel: { min: 3, max: 40 },
        emailResponsavel: { min: 5, max: 100 },
        telefoneResponsavel: { min: 10, max: 20 },
        nomeEmpresa: { min: 3, max: 100 },
        razaoSocial: { min: 0, max: 150 },
        cnpj: { min: 18, max: 18 },
        cidade: { min: 2, max: 50 },
        endereco: { min: 0, max: 255 },
        descricaoNegocio: { min: 20, max: 1000 }
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

    // ✅ Função para buscar o CEP na API
    async function buscarCep(cepLimpo: string) {
        if (cepLimpo.length !== 8) return;

        loadingCep = true;
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (!data.erro) {
                // Auto-preenche os campos com os dados da API
                formData.cidade = data.localidade;
                formData.estado = data.uf; 
                
                // Monta o endereço inicial (Rua + Bairro)
                formData.endereco = data.logradouro;
                if (data.bairro) {
                    formData.endereco += ` - ${data.bairro}`;
                }

                // Remove possíveis erros antigos da tela
                camposInvalidos.delete('cep');
                camposInvalidos.delete('cidade');
                camposInvalidos.delete('estado');
                camposInvalidos.delete('endereco');
                delete erros.cep;
                delete erros.cidade;
                delete erros.estado;
                delete erros.endereco;
            } else {
                erros.cep = 'CEP não encontrado.';
                camposInvalidos.add('cep');
            }
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
            erros.cep = 'Erro ao consultar CEP.';
            camposInvalidos.add('cep');
        } finally {
            loadingCep = false;
        }
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

    // ✅ Validação por campo
    function validarCampo(nomeCampo: string, valor: string): string | null {
        const limits = CHAR_LIMITS[nomeCampo];
        
        if (!limits) return null;

        // Verificar tamanho mínimo
        if (valor.trim().length < limits.min && valor.trim().length > 0) {
            return `Mínimo de ${limits.min} caracteres`;
        }

        // Verificar tamanho máximo
        if (valor.length > limits.max) {
            return `Máximo de ${limits.max} caracteres`;
        }

        // Validações específicas
        if (nomeCampo === 'emailResponsavel' && valor && !valor.includes('@')) {
            return 'Email inválido';
        }

        if (nomeCampo === 'cnpj' && valor && valor.replace(/\D/g, '').length !== 14) {
            return 'CNPJ deve conter 14 dígitos';
        }

        return null;
    }

    // ✅ Handler para validação em tempo real
    function handleValidarCampo(nomeCampo: string) {
        const valor = formData[nomeCampo as keyof typeof formData] || '';
        const erro = validarCampo(nomeCampo, String(valor));

        if (erro) {
            erros[nomeCampo] = erro;
            camposInvalidos.add(nomeCampo);
        } else {
            delete erros[nomeCampo];
            camposInvalidos.delete(nomeCampo);
        }

        // Disparar reatividade
        erros = erros;
        camposInvalidos = camposInvalidos;
    }

    function handleTelefoneChange(e: Event) {
        const input = e.target as HTMLInputElement;
        formData.telefoneResponsavel = formatarTelefone(input.value);
    }

    function handleWhatsAppChange(e: Event) {
        const input = e.target as HTMLInputElement;
        formData.whatsapp = formatarTelefone(input.value);
    }

    // ✅ Caps lock automático para estado
    function handleEstadoChange(e: Event) {
        const select = e.target as HTMLSelectElement;
        if (select.value) {
            formData.estado = select.value.toUpperCase();
        }
    }

    // ✅ Verificar se formulário é válido
    let isFormValid = $derived.by(() => {
        // Campos obrigatórios
        const obrigatorios = [
            'nomeResponsavel',
            'emailResponsavel',
            'telefoneResponsavel',
            'nomeEmpresa',
            'cnpj',
            'segmentoAtuacao',
            'cep',
            'cidade',
            'estado',
            'descricaoNegocio'
        ];

        const temErros = camposInvalidos.size > 0;
        const todosPreenchidos = obrigatorios.every(
            (campo) => String(formData[campo as keyof typeof formData] || '').trim() !== ''
        );

        return !temErros && todosPreenchidos && formData.aceiteTermos;
    });
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
                            onblur={() => handleValidarCampo('nomeResponsavel')}
                            max="40"
                            required
                            readonly={!!data.userNome}
                            disabled={loading}
                            placeholder="Seu nome completo"
                            aria-invalid={camposInvalidos.has('nomeResponsavel')}
                            class="{camposInvalidos.has('nomeResponsavel') ? 'border-destructive' : ''} {data.userNome ? 'bg-muted cursor-not-allowed opacity-70' : ''}"
                        />
                        {#if erros.nomeResponsavel}
                            <p class="text-xs text-destructive mt-1">{erros.nomeResponsavel}</p>
                        {/if}
                        <p class="text-xs text-muted-foreground mt-1">{formData.nomeResponsavel.length}/40</p>
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
                            onblur={() => handleValidarCampo('emailResponsavel')}
                            max="100"
                            required
                            readonly={!!data.userEmail}
                            disabled={loading}
                            placeholder="seu@email.com"
                            aria-invalid={camposInvalidos.has('emailResponsavel')}
                            class="{camposInvalidos.has('emailResponsavel') ? 'border-destructive' : ''} {data.userEmail ? 'bg-muted cursor-not-allowed opacity-70' : ''}"
                        />
                        {#if erros.emailResponsavel}
                            <p class="text-xs text-destructive mt-1">{erros.emailResponsavel}</p>
                        {/if}
                        <p class="text-xs text-muted-foreground mt-1">{formData.emailResponsavel.length}/100</p>
                    </div>

                    <!-- Telefone -->
                    <div>
                        <label for="telefoneResponsavel" class="block text-sm font-semibold mb-2">
                            Telefone/WhatsApp *
                        </label>
                        <TelephoneInput
                            bind:value={formData.telefoneResponsavel}
                            disabled={loading}
                            placeholder="(11) 9XXXX-XXXX"
                        />
                        <!-- Campo hidden para enviar o telefone no formulário -->
                        <input 
                            type="hidden" 
                            name="telefoneResponsavel" 
                            value={formData.telefoneResponsavel}
                        />
                        {#if erros.telefoneResponsavel}
                            <p class="text-xs text-destructive mt-1">{erros.telefoneResponsavel}</p>
                        {/if}
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
                            onblur={() => handleValidarCampo('nomeEmpresa')}
                            max="100"
                            required
                            disabled={loading}
                            placeholder="Ex: Pousada Praia Dourada"
                            aria-invalid={camposInvalidos.has('nomeEmpresa')}
                            class={camposInvalidos.has('nomeEmpresa') ? 'border-destructive' : ''}
                        />
                        {#if erros.nomeEmpresa}
                            <p class="text-xs text-destructive mt-1">{erros.nomeEmpresa}</p>
                        {/if}
                        <p class="text-xs text-muted-foreground mt-1">{formData.nomeEmpresa.length}/100</p>
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
                            max="150"
                            disabled={loading}
                            placeholder="Ex: Pousada Praia Dourada LTDA"
                        />
                        <p class="text-xs text-muted-foreground mt-1">{formData.razaoSocial.length}/150</p>
                    </div>

                    <!-- CNPJ -->
                    <div>
                        <label for="cnpj" class="block text-sm font-semibold mb-2">
                            CPF ou CNPJ *
                        </label>
                        
                        <DocumentInput
                            bind:value={formData.cnpj}
                            bind:isValid={docValido}
                            disabled={loading}
                            placeholder="XX.XXX.XXX/XXXX-XX"
                        />
                        
                        <input 
                            type="hidden" 
                            name="cnpj" 
                            value={formData.cnpj}
                        />

                        {#if erros.cnpj}
                            <p class="text-xs text-destructive mt-1">{erros.cnpj}</p>
                        {:else if docValido === false}
                            <p class="text-xs text-destructive mt-1">Documento inválido. Verifique os números.</p>
                        {/if}
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
                            max="255"
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
                            max="100"
                            disabled={loading}
                            placeholder="@seuinstagram"
                        />
                    </div>

                    <!-- Telefone da Empresa-->
                    <div>
                        <label for="whatsapp" class="block text-sm font-semibold mb-2">
                            WhatsApp da Empresa (Opcional)
                        </label>
                        <TelephoneInput
                            bind:value={formData.whatsapp}
                            disabled={loading}
                            placeholder="(11) 9XXXX-XXXX"
                        />
                        <!-- Campo hidden para enviar o whatsapp no formulário -->
                        <input 
                            type="hidden" 
                            name="whatsapp" 
                            value={formData.whatsapp}
                        />
                        {#if erros.telefoneResponsavel}
                            <p class="text-xs text-destructive mt-1">{erros.telefoneResponsavel}</p>
                        {/if}
                    </div>

                    <!-- CEP -->
                     <div>
                        <label for="cep" class="block text-sm font-semibold mb-2">
                            CEP *
                        </label>
                        <div class="relative">
                            <input
                                id="cep"
                                type="text"
                                use:imask={{ mask: '00000-000' }}
                                onaccept={(e) => {
                                    // Atualiza a variável com os números limpos
                                    formData.cep = e.detail.unmaskedValue;
                                }}
                                oncomplete={(e) => {
                                    // Só dispara a API quando a máscara está 100% preenchida
                                    buscarCep(e.detail.unmaskedValue);
                                }}
                                disabled={loading || loadingCep}
                                placeholder="12345-678"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                class:border-destructive={camposInvalidos.has('cep')}
                            />
                            
                            {#if loadingCep}
                                <span class="absolute right-3 top-2 text-sm animate-pulse text-muted-foreground">
                                    Buscando...
                                </span>
                            {/if}
                        </div>
                        
                        <input type="hidden" name="cep" value={formData.cep} />

                        {#if erros.cep}
                            <p class="text-xs text-destructive mt-1">{erros.cep}</p>
                        {/if}
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
                            onblur={() => handleValidarCampo('cidade')}
                            max="50"
                            required
                            disabled={loading}
                            placeholder="Ex: São Paulo"
                            aria-invalid={camposInvalidos.has('cidade')}
                            class={camposInvalidos.has('cidade') ? 'border-destructive' : ''}
                        />
                        {#if erros.cidade}
                            <p class="text-xs text-destructive mt-1">{erros.cidade}</p>
                        {/if}
                        <p class="text-xs text-muted-foreground mt-1">{formData.cidade.length}/50</p>
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
                            onchange={handleEstadoChange}
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
                            onblur={() => handleValidarCampo('endereco')}
                            max="255"
                            disabled={loading}
                            placeholder="Rua, número, complemento"
                            aria-invalid={camposInvalidos.has('endereco')}
                            class={camposInvalidos.has('endereco') ? 'border-destructive' : ''}
                        />
                        {#if erros.endereco}
                            <p class="text-xs text-destructive mt-1">{erros.endereco}</p>
                        {/if}
                        <p class="text-xs text-muted-foreground mt-1">{formData.endereco.length}/255</p>
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
                            onblur={() => handleValidarCampo('descricaoNegocio')}
                            required
                            disabled={loading}
                            placeholder="Descreva seu negócio, diferenciais, público-alvo, etc. (mínimo 20 caracteres)"
                            class="w-full px-4 py-3 border-2 border-primary bg-background text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-all rounded-md resize-none"
                            class:border-destructive={camposInvalidos.has('descricaoNegocio')}
                            rows="5"
                            aria-invalid={camposInvalidos.has('descricaoNegocio')}
                        ></textarea>
                        {#if erros.descricaoNegocio}
                            <p class="text-xs text-destructive mt-1">{erros.descricaoNegocio}</p>
                        {/if}
                        <div class="flex justify-between text-xs mt-2">
                            <p class="text-muted-foreground">{formData.descricaoNegocio.length}/1000 caracteres</p>
                            <p class={formData.descricaoNegocio.length < 20 ? 'text-amber-600 font-semibold' : 'text-green-600'}>
                                {formData.descricaoNegocio.length < 20 ? `${20 - formData.descricaoNegocio.length} para ir` : '✓ OK'}
                            </p>
                        </div>
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
                {#if camposInvalidos.size > 0}
                    <p class="text-xs text-amber-600 p-3 bg-amber-50 dark:bg-amber-950 rounded">
                        ⚠️ Por favor, corrija os erros destacados em vermelho antes de enviar.
                    </p>
                {/if}
                <Button
                    type="submit"
                    disabled={loading || camposInvalidos.size > 0 || !formData.aceiteTermos || docValido === false}
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
