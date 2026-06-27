<script lang="ts">
    import { imask } from '$lib/actions/imask';
    import { cpf, cnpj } from 'cpf-cnpj-validator';

    // O valor limpo apenas com números (ex: 12345678909) - Ideal para salvar no banco de dados!
    export let value: string = ''; 
    export let placeholder: string = 'CPF ou CNPJ';
    export let disabled: boolean = false;
    
    // Retorna true (válido), false (inválido) ou null (em digitação)
    export let isValid: boolean | null = null; 

    // O valor com pontuação que aparece na tela do usuário
    let displayValue = '';

    // Configuração inteligente: muda de CPF para CNPJ se passar de 11 dígitos
    const maskOptions = {
        mask: [
            { mask: '000.000.000-00', maxLength: 14 }, // CPF
            { mask: '00.000.000/0000-00' }             // CNPJ
        ],
        dispatch: function (appended: string, dynamicMasked: any) {
            const number = (dynamicMasked.value + appended).replace(/\D/g, '');
            return number.length <= 11 
                ? dynamicMasked.compiledMasks[0] 
                : dynamicMasked.compiledMasks[1];
        }
    };

    /**
     * Disparado toda vez que o IMask aceita uma tecla válida
     */
    function handleAccept({ detail: maskRef }: any) {
        displayValue = maskRef.value;        // Atualiza a tela com máscara
        value = maskRef.unmaskedValue;       // Atualiza a variável do banco sem máscara

        // Só faz a validação matemática quando o usuário digita o tamanho completo
        if (value.length === 11) {
            isValid = cpf.isValid(value);
        } else if (value.length === 14) {
            isValid = cnpj.isValid(value);
        } else {
            isValid = null; // Volta pro estado neutro enquanto apaga ou digita
        }
    }
</script>

<div class="w-full relative">
    <input
        type="text"
        use:imask={maskOptions}
        onaccept={handleAccept}
        value={displayValue}
        {placeholder}
        {disabled}
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        class:border-red-500={isValid === false}
        class:focus-visible:ring-red-500={isValid === false}
    />
    
    {#if isValid === false}
        <span class="absolute right-3 top-2.5 text-xs text-red-500 font-medium">
            Inválido
        </span>
    {/if}
</div>