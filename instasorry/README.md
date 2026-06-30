# InstaSorry 💔

SaaS para usuários brasileiros monitorarem seguidores do Instagram.

## Funcionalidades

- Cadastro/login com e-mail e senha
- Trial de 3 dias grátis
- Dashboard com estatísticas de seguidores
- Upload de dados exportados pelo Instagram (JSON ou HTML)
- Detecção de quem deixou de seguir
- Lista de quem não te segue de volta
- Notificações por e-mail
- Histórico de eventos
- Pagamentos via Mercado Pago (Pix/Boleto) e Stripe (cartão)
- Painel de assinatura e histórico de pagamentos

## Stack

- **Frontend/Backend**: Next.js 16 (App Router) + TypeScript
- **Estilo**: Tailwind CSS v4
- **Banco**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5
- **Pagamentos**: Stripe + Mercado Pago
- **E-mail**: Nodemailer
- **Hospedagem recomendada**: Vercel + Neon/Supabase

## Instalação local

### Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente (ou Neon/Supabase na nuvem)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais. Campos obrigatórios:

```env
DATABASE_URL="postgresql://user:senha@localhost:5432/instasorry"
NEXTAUTH_SECRET="gere-com: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Banco de dados

```bash
# Criar as tabelas (desenvolvimento)
npm run db:push

# Popular com dados de teste
npm run db:seed
```

### 4. Rodar

```bash
npm run dev
```

Acesse: http://localhost:3000

**Credenciais de teste** (após seed):
- Email: `teste@instasorry.com`
- Senha: `teste1234`

## Configurar webhooks em desenvolvimento

**Stripe:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Mercado Pago:** Use ngrok para expor a porta 3000 e configure a URL
`https://xxx.ngrok.io/api/webhooks/mercadopago` no painel do MP.

## Como importar dados do Instagram

1. Instagram -> Configurações -> Central de Contas
2. Suas informações e permissões -> Baixar suas informações
3. Selecione a conta, tipo "Seguidores e seguindo", formato JSON
4. Aguarde o e-mail, baixe, descompacte
5. Dashboard -> Importar -> faça upload dos arquivos

## Conformidade

- Não solicitamos senha do Instagram
- Não fazemos scraping nem automação proibida
- Usamos apenas exportação oficial da Meta (Central de Contas)
- Não violamos os Termos de Serviço do Instagram
- Aviso claro de não afiliação com a Meta

## Estrutura

```
src/
  app/
    dashboard/         # Área autenticada
      importar/        # Upload de dados
      nao-me-seguem/   # Não seguem de volta
      eu-nao-sigo/     # Você não segue de volta
      deixaram-de-seguir/  # Histórico de unfollows
      configuracoes/   # Notificações
    billing/           # Assinatura
    pricing/           # Planos
    login/ register/   # Auth
    api/               # API routes
  services/
    instagram-parser.ts   # Parser dos arquivos exportados
    snapshot-diff.ts      # Algoritmo de comparação
    email.ts              # Envio de notificações
  lib/
    prisma.ts auth.ts utils.ts
prisma/
  schema.prisma         # Schema do banco
  seed.ts               # Dados de teste
```
