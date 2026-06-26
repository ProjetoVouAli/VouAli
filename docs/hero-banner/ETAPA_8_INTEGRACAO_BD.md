# Etapa 8: Integração de Imagens do Banco de Dados (Opcional)

## Objetivo
Explicar como substituir as imagens padronizadas (do Unsplash) configuradas no arquivo `hero-themes.ts` por fotos reais dos destinos cadastrados no Banco de Dados.

## Como funciona atualmente (Config-Driven)
Hoje, a imagem é decidida de forma estática com base no "Tema" que foi selecionado pelas lógicas de `geolocation` ou `season`.
O fluxo é:
1. Pega Localização -> Define Região (Ex: litoral).
2. Pega Tema -> `beach_summer`.
3. Pega Imagem -> URL estática do Unsplash predefinida no tema `beach_summer`.

## Como alterar para puxar do Banco de Dados (DB-Driven)

Para fazer com que a foto exibida seja de fato de um destino próximo ou relevante, você deve seguir estes passos na Etapa de **Integração**:

### Passo 1: Receber os destinos no Componente
O arquivo `src/routes/+page.svelte` já carrega destinos do banco de dados na variável `data.destinations`. Você deve passar essa variável como propriedade para o componente `<HeroBanner />`.

No `+page.svelte`:
```svelte
<!-- Passando os dados do banco para o Banner -->
<HeroBanner destinations={data.destinations} />
```

### Passo 2: Atualizar o Componente Orquestrador (`HeroBanner.svelte`)
No `HeroBanner.svelte`, capture essa propriedade e passe-a para a store na inicialização.

```svelte
<script lang="ts">
    import { onMount } from 'svelte';
    import { heroTheme, initializeHeroBanner } from '$lib/stores/hero-banner';
    
    // Recebendo a lista de destinos do backend
    let { destinations } = $props();
    
    onMount(() => {
        // Passando para a store
        initializeHeroBanner(destinations);
    });
</script>
```

### Passo 3: Modificar a Lógica da Store (`hero-banner.ts`)
No arquivo da store, altere o `initializeHeroBanner(destinations)` para receber os dados. Após descobrir a localização exata do usuário (`geo.latitude` e `geo.longitude`), você fará uma busca no array para encontrar o destino que melhor combina.

```typescript
export async function initializeHeroBanner(destinations?: any[]): Promise<void> {
    // ... lógicas normais de detectar localização e tema ...
    
    const themeKey = getSeasonalTheme(region, season);
    // IMPORTANTE: Faça uma cópia profunda (clone) do tema para não sobrescrever a constante estática original
    const theme = structuredClone(getThemeByKey(themeKey));

    // [NOVO] Injeção da imagem do BD
    if (destinations && destinations.length > 0 && geo) {
        // Aqui você criaria uma função para achar o destino mais próximo
        // Exemplo: const closestDest = findClosestDestination(geo, destinations); 
        // Para fins de exemplo, vamos apenas pegar um destino que tenha imagem:
        const bestDest = destinations.find(d => d.images && d.images.length > 0);
        
        if (bestDest) {
            // Substitui a imagem estática pela foto do Banco de Dados!
            theme.image.url = bestDest.images[0].url;
            theme.image.alt = bestDest.name;
        }
    }
    
    heroTheme.set(theme);
}
```

### Conclusão
Com essa simples modificação em apenas 3 arquivos, a arquitetura continuará aplicando as cores, animações, tipografia e ícones perfeitos baseados no clima/região (via Config-Driven), mas a **imagem de fundo** será extraída diretamente de um destino real que você cadastrou no sistema!
