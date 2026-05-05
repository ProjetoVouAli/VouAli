-- Active: 1774973448207@@127.0.0.1@5432@local@public
# VouAli - Documentação Completa do Projeto

**Versão:** 0.0.1  
**Última atualização:** 2026-05-04  
**Status:** Em Desenvolvimento  

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitetura e Estrutura](#arquitetura-e-estrutura)
4. [Setup e Instalação](#setup-e-instalação)
5. [Funcionalidades Principais](#funcionalidades-principais)
6. [Fluxos de Negócio](#fluxos-de-negócio)
7. [Banco de Dados](#banco-de-dados)
8. [Componentes UI](#componentes-ui)
9. [Guia de Desenvolvimento](#guia-de-desenvolvimento)
10. [API e Endpoints](#api-e-endpoints)
11. [Autenticação e Segurança](#autenticação-e-segurança)
12. [Roadmap e Melhorias](#roadmap-e-melhorias)
13. [Troubleshooting](#troubleshooting)
14. [Contribuindo](#contribuindo)

---

## 🎯 Visão Geral do Projeto

### O que é VouAli?

**VouAli** é uma plataforma web moderna para descoberta, cadastro e visualização de destinos turísticos. O sistema conecta viajantes, parceiros de negócios e administradores em um ecossistema integrado de exploração de destinos.

### Objetivos Principais

- ✅ Permitir que usuários cadastrem-se e autentiquem-se de forma segura
- ✅ Facilitar a busca e filtro de destinos turísticos por categorias
- ✅ Visualizar destinos em um mapa interativo
- ✅ Gerenciar perfis de usuários com diferentes níveis de acesso
- ✅ Fornecer uma interface responsiva e intuitiva

### Público-alvo

- **Viajantes**: Exploram destinos, criam perfis, salvam favoritos
- **Parceiros**: Cadastram e gerenciam destinos turísticos
- **Administradores**: Gerenciam conteúdo, usuários e configurações da plataforma

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnologia | Versão | Propósito |
|---|---|---|
| **SvelteKit** | ^2.22.0 | Framework frontend com SSR |
| **Svelte** | ^5.0.0 | Framework reativo (Runes) |
| **TypeScript** | ^5.0.0 | Type-safety |
| **TailwindCSS** | ^4.0.0 | Utility-first CSS framework |
| **Bits UI** | ^2.11.4 | Componentes headless |
| **MapLibre GL** | - | Visualização de mapas |
| **Lucide Icons** | ^0.544.0 | Ícones vetoriais |

### Backend
| Tecnologia | Versão | Propósito |
|---|---|---|
| **SvelteKit API Routes** | ^2.22.0 | Server-side actions |
| **TypeORM** | ^0.3.28 | ORM para banco de dados |
| **PostgreSQL** | ^16 (Docker) | Banco de dados relacional |
| **Bcrypt** | ^6.0.0 | Hash de senhas |

### Autenticação & Segurança
| Tecnologia | Versão | Propósito |
|---|---|---|
| **Firebase Auth** | ^12.11.0 | Gerenciamento de autenticação |
| **Firebase Admin** | ^13.7.0 | Gerenciamento server-side |

### Desenvolvimento
| Tecnologia | Versão | Propósito |
|---|---|---|
| **Vite** | ^7.0.4 | Build tool moderno |
| **Prettier** | ^3.4.2 | Formatação de código |
| **Docker** | - | Containerização (PostgreSQL) |

---

## 🏗️ Arquitetura e Estrutura

### Estrutura de Pastas

```
VouAli/
├── src/
│   ├── lib/
│   │   ├── auth.ts                 # Funções Firebase Auth (login, cadastro, logout)
│   │   ├── firebase.ts             # Configuração Firebase
│   │   ├── index.ts                # Exports centralizados
│   │   ├── utils.ts                # Funções utilitárias
│   │   ├── assets/                 # Imagens, fontes, etc
│   │   ├── components/
│   │   │   └── ui/                 # Componentes UI reutilizáveis
│   │   │       ├── button/
│   │   │       ├── card/
│   │   │       ├── carousel/
│   │   │       ├── combobox/
│   │   │       ├── command/
│   │   │       ├── dialog/
│   │   │       ├── input/
│   │   │       ├── map/
│   │   │       ├── navbar/
│   │   │       └── popover/
│   │   ├── server/
│   │   │   ├── auth/
│   │   │   │   └── cadastro.ts     # Lógica de cadastro (salvar usuário no BD)
│   │   │   └── db/
│   │   │       ├── data-source.ts  # Configuração TypeORM
│   │   │       └── entities/       # Entidades do banco
│   │   │           ├── Usuario.ts
│   │   │           ├── Destination.ts
│   │   │           ├── DestinationCategory.ts
│   │   │           └── DestinationImage.ts
│   │   └── stores/
│   │       ├── user.ts             # Store reativo de usuário
│   │       └── flash.ts            # Store para mensagens flash
│   ├── routes/
│   │   ├── +layout.server.ts       # Layout server (SSR)
│   │   ├── +layout.svelte          # Layout principal (navbar, flash)
│   │   ├── +page.server.ts         # Home - load de destinos
│   │   ├── +page.svelte            # Home - UI
│   │   ├── cadastro/
│   │   │   ├── +page.server.ts     # Actions: cadastro
│   │   │   └── +page.svelte        # Form de cadastro
│   │   ├── login/
│   │   │   ├── +page.server.ts     # Actions: login
│   │   │   └── +page.svelte        # Form de login
│   │   ├── logout/
│   │   │   └── +page.server.ts     # Action: logout
│   │   ├── search/
│   │   │   ├── +page.server.ts     # Search com filtros
│   │   │   └── +page.svelte        # Página de busca
│   │   └── destination/
│   │       └── [slug]/
│   │           ├── +page.server.ts # Load de destino específico
│   │           └── +page.svelte    # Detalhes do destino
│   ├── app.html                    # HTML base
│   ├── app.css                     # Estilos globais
│   ├── app.d.ts                    # Tipos globais
│   ├── hooks.server.ts             # Hooks server (interceptadores)
│
├── static/                         # Arquivos estáticos (favicon, robots.txt)
├── components.json                 # Config Bits UI
├── docker-compose.yml              # Containerização PostgreSQL
├── svelte.config.js               # Config SvelteKit
├── vite.config.ts                 # Config Vite
├── tsconfig.json                  # Config TypeScript
├── package.json                   # Dependências e scripts
└── README.md                      # Guia rápido

```

### Fluxo de Dados

```
Cliente (Browser)
    ↓
SvelteKit Routes (+page.server.ts)
    ↓
SvelteKit Actions (form submission)
    ↓
Auth Module (Firebase + Backend)
    ↓
Database (TypeORM + PostgreSQL)
    ↓
Response → Svelte Stores → UI Update
```

---

## 🚀 Setup e Instalação

### Pré-requisitos

- **Node.js** >= 18.x
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **Git**
- Conta **Firebase**

### 1. Clonar o Repositório

```bash
git clone https://github.com/ProjetoVouAli/VouAli.git
cd VouAli
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase
PUBLIC_FIREBASE_API_KEY=your_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id

# Database
DATABASE_URL=postgresql://postgres:admin321@localhost:5432/local
```

### 4. Iniciar o Banco de Dados

```bash
npm run db:start
```

Isso levantará um container PostgreSQL com:
- **Usuário**: postgres
- **Senha**: admin321
- **Banco**: local
- **Porta**: 5432

### 5. Executar Migrations (se necessário)

```bash
npm run typeorm:generate -- seu-migration-name
npm run typeorm:run
```

### 6. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:5173`

### Build para Produção

```bash
npm run build
npm run preview
```

---

## ✨ Funcionalidades Principais

### 1. Autenticação de Usuários

#### Cadastro
- Formulário com validações (email, senha, confirmação)
- Integração com Firebase Auth
- Criação automática no banco PostgreSQL
- Feedback visual (notificações flash)

#### Login
- Validação de credenciais via Firebase
- Busca de usuário no banco local
- Persistência via token JWT em cookies
- Redirecionamento pós-login

#### Logout
- Limpeza de autenticação Firebase
- Remoção do token dos cookies
- Redirecionamento para home

### 2. Navegação e Navbar Dinâmica

- Display de nome do usuário quando autenticado
- Botão de logout visível apenas para usuários logados
- Link de login/cadastro para visitantes
- Toggle de tema (light/dark mode)
- Redirecionamento responsivo

### 3. Busca e Filtro de Destinos

- Listagem de todos os destinos na home
- Filtro por nome/descrição
- Filtro por categorias/tags
- Visualização em card com imagem, descrição e informações

### 4. Visualização de Destinos

- Página individual por destino (slug-based)
- Exibição de:
  - Nome e descrição completa
  - Localização (latitude/longitude)
  - Categorias/tags
  - Galeria de imagens
  - Mapa interativo (MapLibre GL)

### 5. Gerenciamento de Perfil

- Perfis com diferentes tipos:
  - **Viajante** (padrão)
  - **Parceiro** (cadastra destinos)
  - **Administrador** (gerencia plataforma)
- Informações do usuário: nome, email, sexo, data de criação

---

## 🔄 Fluxos de Negócio

### Fluxo 1: Cadastro Completo

```
1. Usuário clica em "Cadastro"
2. Preenche formulário (email, senha, nome, sexo)
3. Frontend valida dados
4. POST /cadastro com FormData
5. Backend valida campos
6. registerWithEmail() → Firebase Auth
   - Cria usuário no Firebase
   - Gera token JWT
7. saveUserToDatabase() → PostgreSQL
   - Cria registro Usuario com UID do Firebase
8. Cookie com authToken é setado (7 dias)
9. Response com sucesso e dados do usuário
10. Frontend atualiza store $user
11. Redirecionamento para home
```

### Fluxo 2: Login

```
1. Usuário clica em "Entrar"
2. Preenche email e senha
3. POST /login com FormData
4. Backend valida campos
5. loginWithEmail() → Firebase Auth
   - Autentica contra Firebase
   - Gera token JWT
6. Busca usuário no PostgreSQL por email
7. Cookie com authToken é setado (7 dias)
8. Response com dados do usuário
9. Frontend atualiza store $user
10. Redirecionamento para home
```

### Fluxo 3: Logout

```
1. Usuário clica em "Logout"
2. POST /logout (simples)
3. Backend limpa sessão
4. Frontend limpa store $user
5. Limpa cookies
6. Redirecionamento para home
```

### Fluxo 4: Visualizar Destino

```
1. Usuário clica em card de destino
2. Navega para /destination/[slug]
3. +page.server.ts: load destino do banco por slug
4. Carrega relacionamentos (imagens, categorias)
5. Frontend renderiza:
   - Informações principais
   - Galeria de imagens
   - Mapa com marcador
   - Categorias/tags
```

---

## 🗄️ Banco de Dados

### Diagrama ER (Entidades e Relacionamentos)

```
┌─────────────────┐
│    Usuario      │
├─────────────────┤
│ id (PK)         │
│ uid (FK Firebase)
│ nome            │
│ email           │
│ senha (hash)    │
│ sexo            │
│ estaAutenticado │
│ eViajante       │
│ eAdministrador  │
│ eParceiro       │
│ creationDate    │
└─────────────────┘

        ┌──────────────────────────────────┐
        │      Destination                 │
        ├──────────────────────────────────┤
        │ id (PK)                          │
        │ slug (unique)                    │
        │ name                             │
        │ description                      │
        │ summary                          │
        │ neighborhood                     │
        │ city                             │
        │ state                            │
        │ latitude                         │
        │ longitude                        │
        │ active                           │
        │ createdAt                        │
        │ updatedAt                        │
        └──────────────────────────────────┘
                    ▲
                    │ OneToMany
                    │
        ┌───────────────────────┐
        │  DestinationImage     │
        ├───────────────────────┤
        │ id (PK)               │
        │ url                   │
        │ destination_id (FK)   │
        └───────────────────────┘


Destination ◄──── ManyToMany ────► DestinationCategory
(via destinations_categories_relation)
```

### Entidade: Usuario

```typescript
@Entity('usuario')
export class Usuario {
    id: number                          // ID único (auto-incrementado)
    uid: string (36 chars, unique)      // UID do Firebase
    nome: string (40 chars)             // Nome completo
    email: string (30 chars, unique)    // Email único
    senha: string (255 chars)           // Senha hash (bcrypt)
    sexo: 'M' | 'F' | 'O'              // Sexo/Gênero
    estaAutenticado: boolean (default: true)
    eViajante: boolean (default: true)
    eAdministrador: boolean (default: false)
    eParceiro: boolean (default: false)
    creationDate: Date                  // Data de criação
}
```

### Entidade: Destination

```typescript
@Entity('destinations')
export class Destination {
    id: number                          // ID único
    slug: string (unique)               // URL-friendly identifier
    name: string                        // Nome do destino
    description: string                 // Descrição longa
    summary: string                     // Resumo curto
    neighborhood: string                // Bairro
    city: string                        // Cidade
    state: string (default: 'RJ')      // Estado
    latitude: decimal(10,8)             // Coordenada latitude
    longitude: decimal(11,8)            // Coordenada longitude
    active: boolean (default: true)     // Ativo/Inativo
    createdAt: Date                     // Data criação
    updatedAt: Date                     // Data atualização
    
    // Relacionamentos
    images: DestinationImage[]          // OneToMany
    categories: DestinationCategory[]   // ManyToMany
}
```

### Entidade: DestinationCategory

```typescript
@Entity('destination_category')
export class DestinationCategory {
    id: number
    name: string
    
    // Relacionamento
    destinations: Destination[]         // ManyToMany
}
```

### Entidade: DestinationImage

```typescript
@Entity('destination_image')
export class DestinationImage {
    id: number
    url: string
    destination: Destination            // ManyToOne
}
```

### Scripts de Banco

```bash
# Iniciar banco PostgreSQL (Docker)
npm run db:start

# Gerar migration baseada nas entidades
npm run typeorm:generate -- NomeDaMigration

# Executar migrations pendentes
npm run typeorm:run
```

---

## 🎨 Componentes UI

### Componentes Disponíveis

O projeto utiliza componentes reutilizáveis organizados em `src/lib/components/ui/`:

#### Button
```svelte
<Button variant="primary|secondary|ghost" size="sm|md|lg" href="/rota">
  Texto do botão
</Button>
```

#### Card (Composição)
```svelte
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo</CardContent>
  <CardFooter>Rodapé</CardFooter>
</Card>
```

#### Dialog (Modal)
```svelte
<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose>Fechar</DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Input
```svelte
<Input type="text|email|password" placeholder="..." />
```

#### Carousel (Galeria)
```svelte
<Carousel>
  <CarouselContent>
    <CarouselItem>Item 1</CarouselItem>
    <CarouselItem>Item 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

#### Command (Busca/Seleção)
```svelte
<Command>
  <CommandInput placeholder="Pesquise..." />
  <CommandList>
    <CommandEmpty>Nenhum resultado</CommandEmpty>
    <CommandGroup heading="Opções">
      <CommandItem>Opção 1</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

#### Popover
```svelte
<Popover>
  <PopoverTrigger>Abrir</PopoverTrigger>
  <PopoverContent>Conteúdo do Popover</PopoverContent>
</Popover>
```

#### Navbar
```svelte
<Navbar />
```
- Automático: mostra nome de usuário se logado
- Logout button para usuários autenticados
- Login/Signup links para visitantes
- Theme toggle

#### ModeToggle
```svelte
<ModeToggle />
```
- Alternar entre dark/light mode

---

## 💻 Guia de Desenvolvimento

### Padrões de Código

#### TypeScript Strict Mode
Sempre use tipos explícitos:

```typescript
// ❌ Ruim
const user = await getUser();

// ✅ Bom
interface User {
    id: number;
    nome: string;
    email: string;
}

const user: User | null = await getUser();
```

#### Componentes Svelte (Runes)
Utilize Runes para reatividade:

```svelte
<script lang="ts">
    let count = $state(0);
    let doubled = $derived(count * 2);
    
    function increment() {
        count++;
    }
</script>

<button on:click={increment}>
    {count} (dobro: {doubled})
</button>
```

#### Stores
Crie stores tipadas em `src/lib/stores/`:

```typescript
import { writable } from 'svelte/store';

export interface User {
    id: number;
    nome: string;
    email: string;
}

export const user = writable<User | null>(null);
```

#### Server Actions
Use FormData para enviar dados:

```svelte
<script lang="ts">
    import { enhance } from '$app/forms';
    
    let formData = new FormData();
    formData.append('email', 'user@example.com');
</script>

<form method="POST" use:enhance>
    <input name="email" type="email" required />
    <button type="submit">Enviar</button>
</form>
```

### Criando Novas Páginas

1. **Criar pasta em `src/routes/`**
```bash
mkdir src/routes/nova-pagina
```

2. **Criar arquivos necessários**
```
src/routes/nova-pagina/
├── +page.server.ts     (server-side logic)
└── +page.svelte        (UI)
```

3. **Exemplo +page.server.ts**
```typescript
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
    // Carregar dados
    return {
        data: 'exemplo'
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        // Processar form submission
        const data = await request.formData();
        // ...
        return { success: true };
    }
};
```

4. **Exemplo +page.svelte**
```svelte
<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<h1>Nova Página</h1>
<p>{data.data}</p>
```

### Scripts NPM

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor desenvolvimento (hot reload) |
| `npm run build` | Build produção |
| `npm run preview` | Preview do build |
| `npm run check` | Verificar tipos TypeScript |
| `npm run check:watch` | Verificar tipos em tempo real |
| `npm run format` | Formatar código com Prettier |
| `npm run lint` | Verificar estilo com Prettier |
| `npm run db:start` | Iniciar PostgreSQL em Docker |
| `npm run typeorm:generate` | Gerar migration |
| `npm run typeorm:run` | Executar migration |

### Ferramentas Úteis

#### Prettier (Formatação)
```bash
# Formatar todos os arquivos
npm run format

# Verificar sem modificar
npm run lint
```

#### TypeScript Check
```bash
# Uma única verificação
npm run check

# Em modo watch
npm run check:watch
```

#### TypeORM Migrations
```bash
# Gerar nova migration baseada em mudanças de entidades
npm run typeorm:generate -- NomeDaMigration

# Executar migrations pendentes
npm run typeorm:run
```

---

## 📡 API e Endpoints

### Server Actions (Formulários)

#### POST `/cadastro`
**Descrição**: Registrar novo usuário

**Request Body** (FormData):
```
email: string (required)
password: string (required, min 6)
confirmPassword: string (required, deve igualar password)
nome: string (required)
sexo: 'M' | 'F' | 'O' (optional, default: 'O')
```

**Response (Success)**:
```json
{
    "success": true,
    "user": {
        "nome": "João Silva",
        "email": "joao@example.com"
    },
    "message": "Cadastro realizado com sucesso!"
}
```

**Response (Error)**:
```json
{
    "success": false,
    "email": "joao@example.com",
    "message": "Email já cadastrado"
}
```

#### POST `/login`
**Descrição**: Autenticar usuário

**Request Body** (FormData):
```
email: string (required)
password: string (required)
```

**Response (Success)**:
```json
{
    "success": true,
    "user": {
        "nome": "João Silva",
        "email": "joao@example.com"
    },
    "message": "Login realizado com sucesso!"
}
```

**Response (Error)**:
```json
{
    "success": false,
    "email": "joao@example.com",
    "message": "Senha incorreta"
}
```

#### POST `/logout`
**Descrição**: Desautenticar usuário

**Response**:
```json
{
    "success": true,
    "message": "Logout realizado"
}
```

### Data Loading (+page.server.ts)

#### GET `/` (Home)
Carrega todos os destinos

```typescript
export const load: PageServerLoad = async () => {
    const results = await AppDataSource.getRepository(Destination).find({
        relations: ['images', 'categories']
    });
    
    return {
        destinations: results
    };
};
```

#### GET `/search?q=termo&category=id`
Busca e filtra destinos

```typescript
export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get('q');
    const category = url.searchParams.get('category');
    
    // Implementar query builder com filtros
    return { results };
};
```

#### GET `/destination/[slug]`
Carrega destino específico

```typescript
export const load: PageServerLoad = async ({ params }) => {
    const destination = await AppDataSource.getRepository(Destination)
        .findOne({
            where: { slug: params.slug },
            relations: ['images', 'categories']
        });
    
    return { destination };
};
```

---

## 🔐 Autenticação e Segurança (Com Lazy Loading)

### 🚀 Novo Sistema: Lazy Loading de Autenticação

A partir da versão 0.0.2, implementamos um sistema de **lazy loading** que não valida o token em TODA requisição, apenas quando necessário. Isso melhora significativamente a performance!

#### Arquivos Implementados

| Arquivo | Descrição |
|---------|-----------|
| [src/hooks.server.ts](src/hooks.server.ts) | Handle com lazy loading de autenticação |
| [src/lib/server/firebase-admin.ts](src/lib/server/firebase-admin.ts) | Inicialização e helpers do Firebase Admin SDK |
| [src/app.d.ts](src/app.d.ts) | Tipagens para `event.locals.authUser()` e `event.locals.databaseUser()` |

#### Como Funciona?

```typescript
// ❌ ANTES (valida em TODA requisição)
export const handle = async ({ event, resolve }) => {
    const user = await verifyToken(event.cookies);
    event.locals.user = user;
};

// ✅ AGORA (valida APENAS quando chamado)
export const handle = async ({ event, resolve }) => {
    event.locals.authUser = async () => {
        if (validationAttempted) return cachedUser; // Cache!
        // Validar apenas aqui...
    };
};
```

### Fluxo de Autenticação Melhorado

```
┌──────────────────────────────────────────┐
│     Cliente (Browser)                    │
│  1. Login com email/senha                │
│  2. Firebase Auth gera Token             │
│  3. Backend cria Session Cookie          │
└──────────────┬───────────────────────────┘
               │ Cookie HttpOnly
               ▼
┌──────────────────────────────────────────┐
│     SvelteKit - hooks.server.ts          │
│  ⚡ LAZY LOADING                         │
│  - Não valida automaticamente            │
│  - Apenas quando await locals.authUser() │
│  - Cacheia na requisição                 │
└──────────────┬───────────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   +page.server.ts  +server.ts (API)
   await locals.authUser() ou
   await locals.databaseUser()
```

### Usando em +page.server.ts

#### Página Pública (Opcional Auth)
```typescript
export const load: PageServerLoad = async ({ locals }) => {
    const user = await locals.authUser(); // ⚡ Lazy
    
    return {
        destinations: [...],
        user: user || null, // Pode ser null
    };
};
```

#### Página Protegida
```typescript
export const load: PageServerLoad = async ({ locals, redirect }) => {
    const user = await locals.authUser();
    
    if (!user) {
        throw redirect(303, '/login');
    }
    
    return { user };
};
```

#### Com Dados do Banco
```typescript
export const load: PageServerLoad = async ({ locals, redirect }) => {
    // Valida Firebase + Busca PostgreSQL
    const user = await locals.databaseUser();
    
    if (!user) {
        throw redirect(303, '/login');
    }
    
    console.log(user.nome, user.eAdministrador);
    return { user };
};
```

#### Apenas Admin
```typescript
export const load: PageServerLoad = async ({ locals, redirect }) => {
    const user = await locals.databaseUser();
    
    if (!user?.eAdministrador) {
        throw redirect(303, '/');
    }
    
    return { user };
};
```

### Segurança de Senhas

- Senhas são hasheadas com **bcrypt** antes de salvar
- Mínimo 6 caracteres
- Nunca transmitidas em texto plano
- Comparação segura no backend

### Proteção de Cookies

```typescript
cookies.set('authToken', token, {
    path: '/',              // ✅ Disponível em toda a app
    httpOnly: true,         // ✅ JS não pode acessar
    secure: true,           // ✅ Apenas HTTPS
    sameSite: 'strict',     // ✅ Proteção CSRF
    maxAge: 60 * 60 * 24 * 7 // 7 dias
});
```

### Validações de Formulário

- Email válido (@)
- Senha mínimo 6 caracteres
- Confirmação de senha no cadastro
- Campos obrigatórios

### Otimizações de Performance

| Otimização | Ganho |
|-----------|-------|
| **Lazy Loading** | Não valida em cada requisição |
| **Cache na Requisição** | Evita múltiplas validações |
| **Session Cookies** | Usuário não precisa re-autenticar |
| **Índices no Banco** | Busca rápida por UID/Email |

### Arquivo de Configuração

Veja [AUTENTICACAO_GUIA.md](AUTENTICACAO_GUIA.md) para:
- ✅ Setup completo com Firebase Admin
- ✅ Configuração de variáveis de ambiente
- ✅ Exemplos práticos de uso
- ✅ Troubleshooting e debugging

---

## 🚧 Roadmap e Melhorias

### 🔴 Alta Prioridade (Próximas Sprints)

- [ ] **Persistência de Login (SSR)**
  - Implementar verificação de autenticação no `hooks.server.ts`
  - Carregar usuário via cookie/token na hidratação
  - Evitar flash de conteúdo não autenticado

- [ ] **Proteção de Rotas**
  - Guards para rotas administrativas
  - Redirects automáticos para login
  - Validação de permissões (viajante, admin, parceiro)

- [ ] **Testes Automatizados**
  - Testes unitários (componentes, stores)
  - Testes E2E (Playwright/Cypress)
  - Cobertura mínima 80%

- [ ] **Melhorias de Validação**
  - Validação em tempo real (real-time feedback)
  - Mensagens de erro mais descritivas
  - Mostrar requisitos de senha

- [ ] **Responsividade Mobile**
  - Breakpoints TailwindCSS
  - Menu mobile collapse
  - Touch-friendly inputs

### 🟡 Média Prioridade

- [ ] **Documentação de API (OpenAPI/Swagger)**
  - Gerar schemas dos endpoints
  - Exemplos de requisição/resposta
  - Testes interativos

- [ ] **Favoritos/Wishlist**
  - Salvar destinos favoritos
  - Sincronizar com usuário
  - UI de heart toggle

- [ ] **Reviews e Ratings**
  - Usuários avaliam destinos
  - Sistema de estrelas (1-5)
  - Comentários com filtro

- [ ] **Paginação**
  - Implementar cursor-based pagination
  - Infinite scroll ou page numbers

- [ ] **Busca Avançada**
  - Filter múltiplos
  - Sort por popularidade, distância, etc
  - Full-text search

- [ ] **Internacionalização (i18n)**
  - Suporte português/inglês
  - Usar biblioteca como `sveltekit-i18n`

### 🟢 Baixa Prioridade (Nice to Have)

- [ ] **Galeria de Imagens**
  - Upload de imagens
  - Crop/resize
  - Armazenamento em cloud (S3, Firebase Storage)

- [ ] **Notificações**
  - Sistema de notificações in-app
  - Email notifications
  - Preferências do usuário

- [ ] **Analytics**
  - Rastrear visitantes
  - Popular destinations
  - User engagement metrics

- [ ] **Modo Dark/Light**
  - Tema automático do sistema
  - Toggle manual
  - Persistência em localStorage

- [ ] **PWA (Progressive Web App)**
  - Service Worker
  - Offline support
  - Install to homescreen

---

## 🐛 Troubleshooting

### Problema: Banco PostgreSQL não conecta

**Solução:**
```bash
# 1. Verificar se Docker está rodando
docker ps

# 2. Verificar se container está ativo
docker compose ps

# 3. Verificar logs
docker compose logs postgres

# 4. Reiniciar
docker compose down
docker compose up

# 5. Verificar string de conexão em .env.local
# DATABASE_URL=postgresql://postgres:admin321@localhost:5432/local
```

### Problema: Erros de tipo TypeScript

**Solução:**
```bash
# Executar verificação TypeScript
npm run check

# Verificar em tempo real
npm run check:watch

# Podem estar relacionados a:
# - Imports faltando tipos
# - .env.local não carregado
# - package.json desatualizado
```

### Problema: Usuário não persiste após reload

**Causa:** Não há SSR loading de usuário

**Solução:** Implementar em `hooks.server.ts`:
```typescript
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Verificar authToken do cookie
    // Carregar usuário do banco
    // Adicionar a event.locals.user
    
    return await resolve(event);
};
```

### Problema: CORS ou requisições bloqueadas

**Verificar:**
- Origem das requisições
- Headers Content-Type
- Cookies não sendo enviados

### Problema: Migrations não executam

**Solução:**
```bash
# 1. Verificar se banco está rodando
npm run db:start

# 2. Gerar migration
npm run typeorm:generate -- NomeDaMigration

# 3. Executar
npm run typeorm:run

# 4. Verificar arquivo gerado em src/lib/server/db/migrations/
```

---

## 📝 Contribuindo

### Workflow de Contribuição

1. **Criar Branch**
```bash
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

2. **Fazer Alterações**
   - Seguir padrões de código
   - Escrever componentes reutilizáveis
   - Adicionar tipos TypeScript

3. **Formatar Código**
```bash
npm run format
```

4. **Verificar Tipos**
```bash
npm run check
```

5. **Commit e Push**
```bash
git add .
git commit -m "feat: descrição clara da mudança"
git push origin feat/nome-da-feature
```

6. **Criar Pull Request**
   - Descrever mudanças
   - Referenciar issues
   - Aguardar review

### Padrões de Commit

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatora sem alterar funcionalidade
test: adiciona ou atualiza testes
chore: tarefas de build, deps, etc
```

### Padrões de Código

- Indentação: 4 espaços
- Sempre usar TypeScript
- Nomes em camelCase (variáveis/funções)
- Nomes em PascalCase (componentes/classes)
- Componentes em pastas com `index.ts`

---

## 📞 Suporte e Contato

- **Issues**: Abra issue no repositório
- **Discussões**: Use GitHub Discussions
- **Slack/Discord**: [Link do servidor]

---

## 📄 Changelog

### v0.0.1 (2026-05-04)
- ✅ Inicial setup do projeto
- ✅ Autenticação Firebase
- ✅ Componentes UI base
- ✅ CRUD de destinos (básico)
- ✅ Mapa interativo

---

## 📖 Referências Úteis

- [SvelteKit Docs](https://svelte.dev/docs/kit)
- [TypeORM Docs](https://typeorm.io/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Última atualização**: 2026-05-04  
**Versão**: 0.0.1  
**Status do Projeto**: Em Desenvolvimento  

*Para mais informações ou dúvidas, entre em contato com a equipe de desenvolvimento.*
