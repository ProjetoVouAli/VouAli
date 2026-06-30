<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { MapPin } from 'lucide-svelte';
</script>

<footer class="bg-background border-t">
    <div class="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <!-- Brand -->
            <div class="md:col-span-1 space-y-4">
                <div class="flex items-center gap-2">
                    <MapPin class="h-6 w-6 text-primary" />
                    <span class="text-xl font-bold tracking-tight">VouAli</span>
                </div>
                <p class="text-muted-foreground text-sm leading-relaxed">
                    A melhor plataforma para descobrir destinos incríveis e planejar suas próximas aventuras pelo mundo.
                </p>
                <div class="flex gap-4 pt-2">
                    <a href="https://instagram.com/vouali" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="text-muted-foreground hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                    <a href="https://facebook.com/vouali" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="text-muted-foreground hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="https://twitter.com/vouali" target="_blank" rel="noopener noreferrer" aria-label="Twitter" class="text-muted-foreground hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </a>
                </div>
            </div>

            <!-- Links Úteis -->
            <div class="md:col-span-1">
                <h3 class="font-semibold mb-4 text-foreground">Plataforma</h3>
                <ul class="space-y-3 text-sm text-muted-foreground">
                    <li><a href="/" class="hover:text-foreground transition-colors">Início</a></li>
                    <li><a href="/search" class="hover:text-foreground transition-colors">Explorar Destinos</a></li>
                    <li><a href="/login" class="hover:text-foreground transition-colors">Fazer Login</a></li>
                    <li><a href="/cadastro" class="hover:text-foreground transition-colors">Criar Conta</a></li>
                </ul>
            </div>

            <!-- Institucional -->
            <div class="md:col-span-1">
                <h3 class="font-semibold mb-4 text-foreground">Institucional</h3>
                <ul class="space-y-3 text-sm text-muted-foreground">
                    <li><a href="/sobre" class="hover:text-foreground transition-colors">Sobre Nós</a></li>
                    <li><a href="/termos" class="hover:text-foreground transition-colors">Termos de Uso</a></li>
                    <li><a href="/privacidade" class="hover:text-foreground transition-colors">Privacidade</a></li>
                </ul>
            </div>

            <!-- CTA Parceiros -->
            <div class="md:col-span-1 p-6 bg-muted/50 rounded-xl border">
                <h3 class="font-semibold mb-2 text-foreground">Seja um Parceiro</h3>
                <p class="text-sm text-muted-foreground mb-4">
                    Gerencia um destino incrível? Cadastre-o e alcance milhares de viajantes.
                </p>
                <Button href="/parceiro" variant="default" class="w-full">
                    Saiba mais
                </Button>
            </div>
        </div>

        <div class="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} VouAli. Todos os direitos reservados.</p>
            <p>Desenvolvido com ♥ para facilitar sua jornada.</p>
        </div>
    </div>
</footer>
