<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import {
        Compass,
        MapPin,
        CheckSquare,
        PartyPopper,
        MessageCircleHeart,
        Building2,
        ShieldCheck,
        TrendingUp,
        CheckCircle2
    } from 'lucide-svelte';

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });

    const compromissos = [
        "Informações confiáveis e atualizadas.",
        "Plataforma simples, rápida e intuitiva.",
        "Valorização dos empreendedores locais.",
        "Experiências reais compartilhadas pela comunidade.",
        "Crescimento colaborativo entre usuários, parceiros e destinos."
    ];

    const passos = [
        {
            num: "1",
            title: "Explore",
            desc: "Pesquise por cidades, categorias ou pelo nome do lugar. Utilize os filtros para encontrar exatamente o que procura.",
            Icon: Compass
        },
        {
            num: "2",
            title: "Descubra",
            desc: "Acesse informações completas: descrição, fotos, localização, horários e avaliações feitas por outros usuários.",
            Icon: MapPin
        },
        {
            num: "3",
            title: "Escolha",
            desc: "Compare opções, encontre a experiência que mais combina com você e planeje seu passeio.",
            Icon: CheckSquare
        },
        {
            num: "4",
            title: "Viva a experiência",
            desc: "Visite o local escolhido e aproveite tudo o que ele tem a oferecer.",
            Icon: PartyPopper
        },
        {
            num: "5",
            title: "Compartilhe",
            desc: "Deixe sua avaliação e comentário. Sua experiência ajuda outros e fortalece nossa comunidade.",
            Icon: MessageCircleHeart
        }
    ];
</script>

<svelte:head>
    <title>Sobre Nós | VouAli</title>
    <meta name="description" content="Descubra experiências, valorize o local e viva o melhor da região com o VouAli!" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground overflow-hidden">
    
    <!-- Hero Section -->
    <section class="relative pt-32 pb-24 px-8 overflow-hidden">
        <!-- Background Decorators -->
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div class="max-w-5xl mx-auto relative z-10 text-center">
            {#if mounted}
                <div in:fly={{ y: 30, duration: 800, delay: 0 }}>
                    <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                        Descubra experiências.<br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Valorize o local.</span><br/>
                        Viva o melhor da região.
                    </h1>
                </div>
                
                <div in:fly={{ y: 30, duration: 800, delay: 200 }}>
                    <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto mb-10">
                        O <strong class="text-foreground">VouAli!</strong> nasceu para conectar pessoas às melhores experiências de uma cidade de forma simples, rápida e confiável. Mais do que um guia turístico, somos uma plataforma que reúne atrações, gastronomia, hospedagem, lazer, cultura, comércio e serviços em um único lugar, facilitando a descoberta de destinos para moradores e visitantes.
                    </p>
                    <div class="flex flex-wrap justify-center gap-4">
                        <Button href="/search" size="lg" class="rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                            Começar a Explorar
                        </Button>
                        <Button href="#parceiros" variant="outline" size="lg" class="rounded-full px-8 text-base font-semibold hover:bg-muted transition-colors">
                            Para Empresas
                        </Button>
                    </div>
                </div>
            {/if}
        </div>
    </section>

    <!-- Pilares / Missão (Bento Grid Style) -->
    <section class="py-20 px-8 bg-muted/30">
        <div class="max-w-7xl mx-auto">
            {#if mounted}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6" in:fly={{ y: 40, duration: 800, delay: 400 }}>
                    
                    <!-- Card 1 -->
                    <div class="bg-background rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                            <TrendingUp class="w-7 h-7" />
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Nossa Missão</h3>
                        <p class="text-muted-foreground leading-relaxed">
                            Fortalecer o turismo e a economia local, dando visibilidade aos empreendedores da região e proporcionando aos usuários informações completas, avaliações reais e uma experiência personalizada na busca por novos lugares.
                        </p>
                    </div>

                    <!-- Card 2 -->
                    <div class="bg-background rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                            <ShieldCheck class="w-7 h-7" />
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Curadoria e Qualidade</h3>
                        <p class="text-muted-foreground leading-relaxed">
                            No VouAli!, cada destino passa por um processo de curadoria antes de ser publicado, garantindo maior qualidade, confiabilidade e segurança para quem utiliza a plataforma. Nosso compromisso é oferecer uma experiência intuitiva e acessível.
                        </p>
                    </div>

                    <!-- Card 3 -->
                    <div class="bg-background rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div class="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                            <Compass class="w-7 h-7" />
                        </div>
                        <h3 class="text-2xl font-bold mb-4">Visão de Futuro</h3>
                        <p class="text-muted-foreground leading-relaxed">
                            Estamos apenas começando. Nossa proposta é crescer junto com as cidades, promovendo seus atrativos e ajudando cada pessoa a criar memórias e viver experiências únicas. Porque a próxima experiência inesquecível pode estar bem perto.
                        </p>
                    </div>

                </div>
            {/if}
        </div>
    </section>

    <!-- Como Funciona Section -->
    <section class="py-24 px-8">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h2>
                <p class="text-lg text-muted-foreground">Encontrar lugares incríveis nunca foi tão fácil.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                {#each passos as passo, i}
                    <div class="relative group flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
                        <div class="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-6 text-2xl font-bold shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            <passo.Icon class="w-7 h-7" />
                        </div>
                        <h3 class="text-xl font-bold mb-3">{passo.num}. {passo.title}</h3>
                        <p class="text-sm text-muted-foreground">{passo.desc}</p>
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- Call to Action B2B -->
    <section id="parceiros" class="py-12 px-8">
        <div class="max-w-6xl mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-[3rem] p-10 md:p-16 text-primary-foreground text-center md:text-left shadow-2xl relative overflow-hidden">
            <!-- Padrões decorativos no fundo do CTA -->
            <div class="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <Building2 class="w-96 h-96" />
            </div>

            <div class="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <h2 class="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        Para empresas e parceiros
                    </h2>
                    <p class="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
                        Possui um estabelecimento ou oferece uma experiência turística?<br/>
                        Cadastre seu negócio na plataforma e apresente seus serviços para milhares de pessoas que procuram exatamente o que você oferece. As informações passam por análise e curadoria para garantir credibilidade.
                    </p>
                    <Button href="/parceiro" variant="secondary" size="lg" class="rounded-full px-8 font-bold text-primary hover:scale-105 transition-transform">
                        Cadastre seu Negócio
                    </Button>
                </div>
                
                <div class="bg-primary-foreground/10 rounded-3xl p-8 backdrop-blur-sm border border-primary-foreground/20">
                    <h3 class="text-2xl font-bold mb-6 flex items-center justify-center md:justify-start gap-3">
                        <ShieldCheck class="w-6 h-6" />
                        Nosso compromisso
                    </h3>
                    <ul class="space-y-4 text-left">
                        {#each compromissos as compromisso}
                            <li class="flex items-start gap-3">
                                <CheckCircle2 class="w-6 h-6 shrink-0 text-primary-foreground/80" />
                                <span class="font-medium text-primary-foreground/90">{compromisso}</span>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer taglite -->
    <section class="py-16 text-center text-muted-foreground px-8">
        <p class="text-xl font-bold text-foreground">VouAli! — Descubra. Explore. Viva novas experiências.</p>
    </section>

</div>
