<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
    import { destinationSchema } from './schema';
    
    import * as Form from '$lib/components/ui/form';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Textarea } from '$lib/components/ui/textarea';
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import { Separator } from '$lib/components/ui/separator';
import MapPicker from '$lib/components/map/MapPicker.svelte';

    let { data } = $props();

    const form = superForm(data.form, {
        validators: zodClient(destinationSchema),
        dataType: 'json',
        resetForm: false
    });

    const { form: formData, enhance, delayed } = form;

    // Estados locais das tags
    let tagInput = $state('');
    let activeSuggestionIndex = $state(-1);

    // Estados locais de imagens para upload e preview temporário
    let imageFiles = $state<File[]>([]);
    let previewUrls = $state<string[]>([]);
    let isDragging = $state(false);

    let mapLat = $state(Number($formData.latitude) || -22.9068);
    let mapLng = $state(Number($formData.longitude) || -43.1729);

    let searchQuery = $derived.by(() => {
        const parts = [$formData.address, $formData.neighborhood, $formData.city, $formData.state, $formData.name].filter(Boolean);
        return parts.join(', ');
    });

    // Sincroniza posição do mapa com o formulário
    $effect(() => {
        if (mapLat != null && mapLng != null) {
            $formData.latitude = mapLat;
            $formData.longitude = mapLng;
        }
    });

    let suggestions = $derived(
        tagInput.trim()
            ? data.categories.filter(c => 
                c.name.toLowerCase().includes(tagInput.toLowerCase()) && 
                !($formData.categories || []).includes(c.name)
              )
            : []
    );

    function autoGenerateSlug() {
        if (!data.isEdit && $formData.name) {
            $formData.slug = (<string> $formData.name)
                .toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        }
    }

    function addTag(tagName: string) {
        if (!$formData.categories) $formData.categories = [];
        if (!$formData.categories.includes(tagName)) {
            $formData.categories = [...$formData.categories, tagName];
        }
        tagInput = '';
        activeSuggestionIndex = -1;
    }

    function handleTagKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
                addTag(suggestions[activeSuggestionIndex].name);
                return;
            }
            const trimmed = tagInput.trim();
            if (trimmed) addTag(trimmed);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (suggestions.length > 0) {
                activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestions.length;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (suggestions.length > 0) {
                activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            tagInput = '';
            activeSuggestionIndex = -1;
        }
    }

    function removeTag(tagToRemove: string) {
        $formData.categories = $formData.categories.filter((t: string) => t !== tagToRemove);
    }

    // Gerenciamento dos arquivos de imagens
    function handleFiles(files: FileList | null) {
        if (!files) return;
        
        const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        imageFiles = [...imageFiles, ...validFiles];
        // Sincroniza diretamente os arquivos com a propriedade de array do Superforms
        $formData.images = imageFiles;

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    previewUrls = [...previewUrls, e.target.result as string];
                }
            };
            reader.readAsDataURL(file);
        });
    }

    function removeExistingImage(id: number) {
    if (!$formData.imagesToDelete) {
        $formData.imagesToDelete = [];
    }
    // Adiciona o ID no array do Superforms que será enviado pro servidor
    $formData.imagesToDelete = [...$formData.imagesToDelete, id];
}

    function removePreview(index: number) {
        imageFiles = imageFiles.filter((_, i) => i !== index);
        previewUrls = previewUrls.filter((_, i) => i !== index);
        $formData.images = imageFiles;
    }

    function onDragOver(e: DragEvent) {
        e.preventDefault();
        isDragging = true;
    }

    function onDragLeave() {
        isDragging = false;
    }

    function onDrop(e: DragEvent) {
        e.preventDefault();
        isDragging = false;
        if (e.dataTransfer?.files) {
            handleFiles(e.dataTransfer.files);
        }
    }
</script>


<div class="container max-w-4xl mx-auto py-10 px-4">
    <div class="mb-8 pb-4">
        <h1 class="text-3xl font-bold tracking-tight text-foreground">
            {data.isEdit ? 'Editar Destino' : 'Criar Novo Destino'}
        </h1>
        <p class="text-muted-foreground mt-1">
            {data.isEdit ? 'Atualize as informações e mídias do seu atrativo.' : 'Preencha os dados e suba fotos para publicar um novo local.'}
        </p>
    </div>

    <Separator class="mb-8" />

    <form method="POST" use:enhance enctype="multipart/form-data" class="space-y-6 bg-card text-card-foreground p-6 rounded-lg border shadow-sm">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Field {form} name="name" class="space-y-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Nome do Destino</Form.Label>
                        <Input {...props} bind:value={$formData.name} oninput={autoGenerateSlug} />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="slug" class="space-y-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Slug (URL Amigável)</Form.Label>
                        <Input {...props} bind:value={$formData.slug} disabled={data.isEdit} />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </div>

        <Form.Field {form} name="summary" class="space-y-2">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Resumo Curto</Form.Label>
                    <Input {...props} bind:value={$formData.summary} placeholder="Uma frase chamativa sobre o local..." />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="description" class="space-y-2">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Descrição Completa</Form.Label>
                    <Textarea {...props} bind:value={$formData.description} rows={4} class="min-h-[80px]" />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>

        <Separator class="my-6" />

        <h3 class="text-lg font-semibold">Localização</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Field {form} name="neighborhood" class="space-y-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Bairro</Form.Label>
                        <Input {...props} bind:value={$formData.neighborhood} />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="city" class="space-y-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Cidade</Form.Label>
                        <Input {...props} bind:value={$formData.city} />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>

            <Form.Field {form} name="state" class="space-y-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Estado (UF)</Form.Label>
                        <Input {...props} bind:value={$formData.state} maxlength={2} />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </div>

        <Form.Field {form} name="address" class="space-y-2">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Logradouro (Rua, número)</Form.Label>
                    <Input {...props} bind:value={$formData.address} placeholder="Rua, número, complemento..." />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>

        <div class="space-y-4">
            <div class="flex items-center gap-2">
                <span class="inline-block w-3 h-3 rounded-full bg-primary"></span>
                <h3 class="text-lg font-semibold">Selecione no Mapa</h3>
            </div>
            <p class="text-sm text-muted-foreground -mt-2">
                Preencha os campos de endereço acima e o mapa ajusta automaticamente. Arraste o pin para a posição exata.
            </p>

            <!-- Hidden fields para envio do formulário -->
            <input type="hidden" name="latitude" value={$formData.latitude ?? ''} />
            <input type="hidden" name="longitude" value={$formData.longitude ?? ''} />

            <MapPicker
                bind:latitude={mapLat}
                bind:longitude={mapLng}
                searchQuery={searchQuery}
            />
        </div>

        <Separator class="my-6" />

        <div class="space-y-4">
            <Label class="text-base font-semibold">Galeria de Imagens</Label>
            
            {#if data.isEdit && data.existingImages && data.existingImages.length > 0}
                <div class="space-y-2">
                    <span class="text-sm text-muted-foreground font-medium">Imagens já salvas:</span>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 border p-4 bg-muted/30 rounded-md">
                        {#each data.existingImages as img}
    {#if !($formData.imagesToDelete || []).includes(img.id)}
        <div class="relative group aspect-video rounded-md overflow-hidden border bg-background">
            <img src={img.url} alt="Imagem do Destino" class="object-cover w-full h-full" />
            
            <Button 
                variant="destructive"
                onclick={() => removeExistingImage(img.id)}
                class="absolute top-1 right-1 bg-destructive/90 hover:bg-destructive text-destructive-foreground p-1 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </Button>
        </div>
    {/if}
{/each}
                    </div>
                </div>
            {/if}

            <Form.Field {form} name="images" class="space-y-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <div 
                            role="button"
                            tabindex="0"
                            class="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                            {isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'}"
                            ondragover={onDragOver}
                            ondragleave={onDragLeave}
                            ondrop={onDrop}
                            onclick={() => document.getElementById('file-upload')?.click()}
                            onkeydown={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
                        >
                            <input 
                                id="file-upload"
                                type="file" 
                                accept="image/*"
                                multiple
                                class="hidden" 
                                onchange={(e) => handleFiles(e.currentTarget.files)}
                            />
                            
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                            <p class="text-sm font-medium text-foreground">Arraste novas imagens aqui ou clique para selecionar</p>
                            <p class="text-xs text-muted-foreground mt-0.5">Apenas arquivos de imagem são aceitos</p>
                        </div>

                        {#if previewUrls.length > 0}
                            <div class="space-y-2 pt-2">
                                <span class="text-sm text-muted-foreground font-medium">Novas mídias selecionadas para envio:</span>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {#each previewUrls as url, index}
                                        <div class="relative group aspect-video rounded-md overflow-hidden border shadow-sm bg-background">
                                            <img src={url} alt="Nova prévia" class="object-cover w-full h-full" />
                                            <Button 
                                                variant="destructive"
                                                onclick={() => removePreview(index)}
                                                class="absolute top-1 right-1 bg-destructive/90 hover:bg-destructive text-destructive-foreground p-1 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                                            </Button>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
        </div>

        <Separator class="my-6" />

        <Form.Field {form} name="categories" class="space-y-2">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label class="text-base">Categorias</Form.Label>
                    
                    <div class="relative w-full">
                        <div class="flex flex-wrap gap-2 p-2 bg-background border border-input rounded-md min-h-[42px] focus-within:ring-1 focus-within:ring-ring focus-within:border-ring transition-shadow">
                            {#each $formData.categories || [] as tag}
                                <div class="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-md border border-border">
                                    {tag}
                                    <button 
                                        type="button" 
                                        onclick={() => removeTag(tag)} 
                                        class="text-muted-foreground hover:text-foreground rounded-full p-0.5 hover:bg-muted transition-colors font-bold text-sm"
                                    >
                                        &times;
                                    </button>
                                </div>
                            {/each}
                            
                            <input 
                                {...props}
                                type="text" 
                                bind:value={tagInput} 
                                onkeydown={handleTagKeydown}
                                placeholder={$formData.categories?.length ? "Adicionar mais..." : "Escreva uma categoria..."} 
                                class="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-1 text-sm min-w-[180px] text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        {#if suggestions.length > 0}
                            <ul class="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border rounded-md shadow-md max-h-60 overflow-y-auto p-1 space-y-0.5">
                                {#each suggestions as category, index}
                                    <li>
                                        <button
                                            type="button"
                                            onclick={() => addTag(category.name)}
                                            class="w-full text-left px-3 py-2 text-sm rounded-sm transition-colors cursor-pointer flex items-center justify-between
                                                {index === activeSuggestionIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'}"
                                        >
                                            <span>{category.name}</span>
                                            <span class="text-xs text-muted-foreground">Sugerido</span>
                                        </button>
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </div>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>

        <Separator class="my-6" />

        <div class="flex justify-end space-x-4 pt-2">
            <a href="/dashboard/destinos" class={buttonVariants({ variant: "outline" })}>
                Cancelar
            </a>
            <Form.Button disabled={$delayed}>
                {#if $delayed}
                    Salvando...
                {:else}
                    {data.isEdit ? 'Salvar Alterações' : 'Publicar Destino'}
                {/if}
            </Form.Button>
        </div>
    </form>
</div>