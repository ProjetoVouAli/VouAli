<script lang="ts">
    import intlTelInput from 'intl-tel-input';
    import 'intl-tel-input/styles';

    // @ts-ignore - Carrega as traduções em português
    import { pt } from 'intl-tel-input/locale';
    // Props para bind e customização
    export let value: string = '';
    export let placeholder: string = 'Seu telefone';
    export let disabled: boolean = false;

    let inputElement: HTMLInputElement;
    let iti: any;

    /**
     * Svelte Action para instanciar a biblioteca intl-tel-input
     */
    /**
     * Svelte Action para instanciar a biblioteca intl-tel-input
     */
    function telInput(node: HTMLInputElement) {
        iti = intlTelInput(node, {
            initialCountry: 'br',
            separateDialCode: true,
            strictMode: true,
            uiTranslations: pt,
            countryNameLocale: "pt-BR", // Aplica as traduções em português 
            // O Vite entende esse alias sem tentar procurar pastas físicas bloqueadas
            // @ts-ignore
            loadUtils: () => import('intl-tel-input/utils') 
        } as any);

        // Como o utilitário agora carrega em paralelo (assíncrono), 
        // usamos a promise nativa da lib para garantir que a formatação do banco será aplicada
        iti.promise.then(() => {
            if (value) {
                iti.setNumber(value);
            }
        });

        node.addEventListener('countrychange', handleInput);

        return {
            destroy() {
                node.removeEventListener('countrychange', handleInput);
                if (iti) {
                    iti.destroy();
                }
            }
        };
    }

    /**
     * Captura o número validado e formatado
     */
    function handleInput() {
        if (iti) {
            // getNumber() retorna o número no formato E.164 (+5521999999999)
            value = iti.getNumber();
        }
    }
</script>

<div class="w-full">
    <input
        type="tel"
        bind:this={inputElement}
        use:telInput
        on:input={handleInput}
        placeholder={placeholder}
        disabled={disabled}
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
</div>

<style>
    /* Ajuste para o dropdown ocupar 100% da largura do input */
    :global(.iti) {
        width: 100%;
    }

    /* === FORÇAR DARK/LIGHT MODE DO SHADCN NO DROPDOWN === */
    
    /* Fundo da lista e bordas */
    :global(.iti__country-list) {
        background-color: var(--background) !important;
        border: 1px solid var(--border) !important;
        color: var(--foreground) !important;
        border-radius: var(--radius);
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    /* Cor do texto de cada país */
    :global(.iti__country) {
        color: var(--foreground) !important;
    }

    /* Efeito de Hover (passar o rato) e seleção via teclado */
    :global(.iti__country:hover),
    :global(.iti__country.iti__highlight) {
        background-color: var(--accent) !important;
        color: var(--accent-foreground) !important;
    }

    /* Estilização da barra de pesquisa no topo do dropdown */
    :global(.iti__search-input) {
        background-color: var(--background) !important;
        color: var(--foreground) !important;
        border: 1px solid var(--border) !important;
        border-radius: 0px; /* Seguindo o padrão radius: 0px do seu tema Nike */
    }

    :global(.iti__search-input::placeholder) {
        color: var(--muted-foreground) !important;
    }

    /* Ajuste do fundo do container flutuante inteiro */
    :global(.iti__dropdown-content) {
        background-color: var(--background) !important;
        border-color: var(--border) !important;
    }
</style>