# VouAli

Plataforma web para descoberta, cadastro e gestão de destinos turísticos, unindo viajantes, parceiros e administradores em um ecossistema com autenticação, catálogo público, busca, avaliações e administração de conteúdo.

![SvelteKit](https://img.shields.io/badge/SvelteKit-2.22.0-FF3E00?logo=svelte)
![Svelte](https://img.shields.io/badge/Svelte-5.x-FF3E00?logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Admin-FFCA28?logo=firebase)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)

## Visão geral

O repositório representa uma aplicação SvelteKit com base funcional já estruturada para:

- catálogo público de destinos com imagens, categorias e status de aprovação;
- autenticação via Firebase no frontend e validação server-side em hooks do SvelteKit;
- cadastro de usuários com papéis `VIAJANTE`, `PARCEIRO` e `ADMINISTRADOR`;
- fluxo de solicitação e aprovação de parceiros;
- gestão de conteúdo e avaliações em PostgreSQL;
- upload de imagens para Cloudinary e envio de e-mails via Nodemailer/Resend.

## Arquitetura e stack

### Fase de maturidade

- Status atual: desenvolvimento ativo com base funcional implementada.
- Padrão arquitetural: monólito full-stack em um único app SvelteKit, com renderização server-side, hooks globais e persistência em TypeORM.
- Banco local: provisionado via Docker Compose para desenvolvimento e testes locais.

### Tech Stack oficial

#### Frontend

- SvelteKit 2.x
- Svelte 5
- TypeScript 5
- Tailwind CSS 4
- componentes UI baseados em `bits-ui` e estruturas em `src/lib/components/ui`
- MapLibre GL para visualização geoespacial
- Lucide Icons

#### Backend / servidor

- SvelteKit routes e `+page.server.ts`
- hooks globais em `src/hooks.server.ts`
- TypeORM como camada de persistência
- PostgreSQL 16 em container Docker

#### Autenticação e identidade

- Firebase Auth no cliente
- Firebase Admin SDK no servidor
- usuário carregado em `event.locals` via `LayoutServerLoad` e `hooks.server.ts`

#### Mídia e integrações

- Cloudinary para upload e remoção de imagens
- Nodemailer com SMTP do Resend
- PostgreSQL como banco principal do sistema

### ADRs evidentes na base de código

1. SvelteKit como base de runtime e SSR do produto.
2. PostgreSQL como banco relacional canônico do sistema.
3. Firebase como mecanismo de autenticação e identidade, com validação server-side centralizada.
4. TypeORM como camada de persistência e modelagem de entidades.
5. Cloudinary como solução de armazenamento de imagens do conteúdo editorial.
6. Docker para provisionamento local do PostgreSQL e ambiente reproduzível.

## Onboarding (setup local)

### Pré-requisitos

- Node.js 20+ (recomendado 22 LTS)
- npm
- Docker Desktop / Docker Compose v2
- Git

### 1) Clone e instale dependências

```bash
git clone https://github.com/ProjetoVouAli/VouAli.git
cd VouAli
npm install
```

### 2) Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis essenciais para autenticação, banco e integrações:

```env
# Banco PostgreSQL local
DATABASE_URL="postgresql://postgres:admin321@localhost:5432/local"

# Firebase Admin SDK (backend)
FIREBASE_PROJECT_ID="seu-project-id"
FIREBASE_CLIENT_EMAIL="seu-service-account@seu-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA\n-----END PRIVATE KEY-----\n"

# Firebase Web SDK (cliente)
VITE_FIREBASE_API_KEY="sua_api_key"
VITE_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu-project-id"
VITE_FIREBASE_STORAGE_BUCKET="seu-projeto.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu_sender_id"
VITE_FIREBASE_APP_ID="seu_app_id"

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu_cloud_name"
CLOUDINARY_API_KEY="seu_api_key"
CLOUDINARY_API_SECRET="seu_api_secret"

# Nodemailer / Resend
RESEND_API_KEY="seu_resend_api_key"
```

> O projeto usa `$env/dynamic/private` para variáveis do servidor e `import.meta.env` para variáveis expostas ao browser (`VITE_*`).

### 3) Inicie o banco local

```bash
npm run db:start
```

Esse comando sobe um container PostgreSQL definido em `docker-compose.yml` com:

- host: `localhost`
- porta: `5432`
- usuário: `postgres`
- senha: `admin321`
- banco: `local`

### 4) Inicie o ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em `http://localhost:8443`, conforme a configuração atual em `vite.config.ts`.

### 5) Verificação rápida do ambiente

```bash
npm run check
```

Esse comando executa `svelte-kit sync` e `svelte-check` para validar tipos e integração do projeto.

## Scripts & workflow

| Script             | Comando                                         | O que executa                                     |
| ------------------ | ----------------------------------------------- | ------------------------------------------------- |
| `dev`              | `npm run dev`                                   | inicia o ambiente de desenvolvimento do SvelteKit |
| `build`            | `npm run build`                                 | gera a build de produção                          |
| `preview`          | `npm run preview`                               | serve a build localmente                          |
| `prepare`          | `npm run prepare`                               | sincroniza o ambiente do SvelteKit                |
| `check`            | `npm run check`                                 | valida tipagem e integração com `svelte-check`    |
| `check:watch`      | `npm run check:watch`                           | executa a checagem em modo watch                  |
| `format`           | `npm run format`                                | formata o código com Prettier                     |
| `lint`             | `npm run lint`                                  | valida a formatação via `prettier --check .`      |
| `db:start`         | `npm run db:start`                              | sobe o PostgreSQL via Docker Compose              |
| `typeorm:generate` | `npm run typeorm:generate -- nome-da-migration` | tenta gerar migração TypeORM                      |
| `typeorm:run`      | `npm run typeorm:run`                           | executa migrações TypeORM                         |

### Observações sobre o banco

- O datasource atual em `src/lib/server/db/data-source.ts` usa `synchronize: true` em desenvolvimento.
- O projeto não inclui um conjunto de migrations consistentes como fonte única de verdade no repositório atual.
- O banco é provisionado por Docker e consumido pela app via `DATABASE_URL`.

## Diretrizes de engenharia

### Regras inegociáveis

- Usar TypeScript estrito em toda a base (`tsconfig.json` com `strict: true`).
- Manter lógica sensível no diretório `src/lib/server` e evitar expor segredos no frontend sem a convenção `VITE_*`.
- Centralizar autenticação e validação de sessão em `src/hooks.server.ts` e `src/lib/server/firebase-admin.ts`.
- Preferir `+page.server.ts` e server actions para leitura/escrita com banco e integrações externas.
- Manter entidades TypeORM em `src/lib/server/db/entities`.
- Validar entradas e sanitizar dados antes de persistir formulários de cadastro e parceria.
- Rodar checks antes de abrir PR:

```bash
npm run check
npm run format
```

### Padrões de contribuição

- Nomeação em camelCase para variáveis e funções.
- Componentes em PascalCase e organização por diretório.
- Preferir reutilização de componentes em `src/lib/components/ui`.
- Usar logs com finalidade de observabilidade local; não os tratar como mecanismo de negócio.
- Commits devem seguir convenção clara, por exemplo:

```bash
feat: adiciona fluxo de busca por destinos
fix: corrige validação de parceiro
docs: atualiza README e onboarding
refactor: reorganiza camada de autenticação
```

## Estrutura de diretórios relevante

```text
VouAli/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── server/
│   │   │   ├── auth/
│   │   │   ├── db/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── firebase.ts
│   │   └── auth.ts
│   ├── routes/
│   ├── app.css
│   ├── app.d.ts
│   ├── hooks.server.ts
│   └── app.html
├── static/
├── docs/
├── docker-compose.yml
├── package.json
├── vite.config.ts
├── tsconfig.json
├── svelte.config.js
├── .env.example
├── README.md
└── serviceAccountKey.json
```

## Resumo executivo

O VouAli é uma aplicação SvelteKit com autenticação Firebase, PostgreSQL em Docker, arquitetura server-first e gestão de conteúdo turístico. O documento acima reflete o stack, o nível de maturidade e os padrões efetivamente presentes no código atual, sem documentar funcionalidades ou integrações fora da base implementada.
