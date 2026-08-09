# Sistema de Gestão e Boletim Diário de Operações — Condomínios

Substitui o preenchimento por WhatsApp e planilhas de Excel por: um **formulário
mobile em etapas** para o zelador/gerente predial, um **banco relacional**
multi-condomínio, um **painel administrativo** para o síndico profissional e um
**dashboard gerencial** com KPIs, gráficos e matriz de risco de SLA.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Banco | Prisma ORM — SQLite em dev, PostgreSQL em produção |
| Estilos | Tailwind CSS v4 + design tokens próprios (claro/escuro) |
| Gráficos | Recharts |
| Validação | Zod (no servidor, em toda Server Action) |
| Sessão | JWT assinado (`jose`) em cookie httpOnly + bcrypt |

## Rodando localmente

```bash
npm install
cp .env.example .env      # ajuste AUTH_SECRET
npm run setup             # prisma generate + db push + seed
npm run dev               # http://localhost:3000
```

O seed cria 3 condomínios, os 27 itens de checklist, ~90 dias de boletins e
ocorrências sintéticas, e os usuários de demonstração:

| Papel | E-mail | Senha |
|---|---|---|
| Administrador (síndico) | `sindico@condominios.com.br` | `condominio123` |
| Gestor local (Atrium Office) | `gestor.atrium@condominios.com.br` | `condominio123` |
| Gestor local (Centenário) | `gestor.centenario@condominios.com.br` | `condominio123` |
| Gestor local (Passeio Paulista) | `gestor.paulista@condominios.com.br` | `condominio123` |

Comandos úteis: `npm run db:studio` (inspecionar o banco), `npm run db:seed`
(repopular), `npm run typecheck`, `npm run build`.

## Modelo de dados

```
Condominio ─┬─< Boletim ─────< BoletimItem >── ChecklistItem
            │      │                │                │
            │      └────────────────┴──> Ocorrencia <┘
            │                              │  └──< OcorrenciaFoto
            │                              └──< OcorrenciaLog
            ├─< PlanoAcao
            └─< UsuarioCondominio >── Usuario
```

As quatro tabelas pedidas na especificação estão em `prisma/schema.prisma`:
**Condominios**, **Boletim Diário**, **Ocorrências** e **Plano de Ação**.

### Decisão: checklist normalizado em vez de ~27 colunas booleanas

A especificação descrevia os itens do checklist como campos do boletim. Aqui
eles são **linhas** da tabela `ChecklistItem`, e cada resposta do dia é uma linha
de `BoletimItem` (`CONFORME` / `NAO_CONFORME` / `NAO_APLICAVEL`). O resultado é
o mesmo na tela, mas:

- incluir, renomear ou desativar um item **não exige migração de schema**;
- "Ocorrências por Setor" sai de um `GROUP BY checklistItemId` — não de somar 27
  colunas;
- boletins antigos continuam íntegros quando o catálogo evolui.

O catálogo vive em `src/lib/checklist.ts`; para adicionar um item, acrescente ali
e rode `npm run db:seed` (o seed faz *upsert* por `codigo`, não duplica).

### Regras de negócio implementadas

- **1 boletim por condomínio por dia**, garantido por índice único
  `(condominioId, dataReferencia)`. Reenviar o mesmo dia substitui o boletim e
  as ocorrências que ele havia gerado — ocorrências avulsas não são tocadas.
- **Ocorrência automática**: todo item `NAO_CONFORME` abre uma ocorrência
  vinculada ao item de origem, dentro da mesma transação do boletim. O SLA
  inicial vem da criticidade (Alta 3d · Média 7d · Baixa 15d).
- **Descrição obrigatória** ao marcar uma falha — sem ela a ocorrência nasceria
  sem contexto, e o wizard bloqueia o envio.
- **Histórico**: toda mudança de status, criticidade, SLA ou plano de ação vira
  uma linha em `OcorrenciaLog`, com valor anterior e posterior.

## Perfis de acesso

| | Gestor local | Administrador |
|---|---|---|
| Lançar boletim | ✅ (só nos seus condomínios) | ✅ |
| Ocorrências e planos | ✅ (só nos seus condomínios) | ✅ (todos) |
| Dashboard gerencial | — | ✅ |
| Cadastro de condomínios | — | ✅ |

O vínculo gestor↔condomínio fica em `UsuarioCondominio`. **Todo filtro por
condomínio é intersectado com o escopo do usuário** (`filtroCondominio` em
`src/lib/auth.ts`) — trocar `?condominio=` na URL não expõe outro prédio.

## Interface

**Wizard mobile** (`/boletim/novo`) — 6 etapas: identificação, os 4 grupos do
checklist e equipe/envio. Todos os itens já vêm marcados como **Conforme**, então
o zelador só toca onde há falha; ao marcar uma falha, o campo de descrição e a
criticidade aparecem no mesmo cartão. Alvos de toque de 44px, campos de 16px
(evita o zoom automático do iOS) e barra de navegação inferior fixa.

**Painel administrativo** — `/ocorrencias` (fila com filtros de condomínio, mês,
status, criticidade e faixa de SLA), `/ocorrencias/[id]` (gestão + histórico +
fotos), `/planos` e `/condominios`.

## Dashboard (`/dashboard`)

Filtros globais de **condomínio** e **mês/ano**. Contém:

- **KPIs** — % de dias em conformidade, abertas vs. concluídas no mês, taxa de
  ocorrências críticas, volume de faltas, backlog em aberto, SLA estourado,
  cobertura do boletim e total de planos.
- **Ocorrências por setor** — barras horizontais, top 10.
- **Volume diário** — linha do tempo dia a dia, para mapear sazonalidade.
- **Conformidade dos dias** — distribuição dos boletins por status.
- **Abertas x concluídas** — 6 meses; concluídas abaixo de abertas = backlog
  crescendo.
- **Matriz de risco** — criticidade × faixa de SLA (atrasada / ≤3 dias / no
  prazo / sem prazo). Cada célula abre a lista já filtrada.
- **Fila de prioridade** — pendentes de criticidade Alta ou Média, por prazo.

> **Cobertura do boletim** é proposital: sem ela, um mês com 2 boletins e 2 dias
> conformes exibiria "100% de conformidade". O KPI mostra quantos dos boletins
> esperados até hoje realmente chegaram.

### Cores dos gráficos

A paleta foi validada por script para bandas de luminosidade, piso de croma,
separação sob daltonismo e contraste contra a superfície, **em claro e escuro**:

- **Séries categóricas** (máx. 2): azul + aqua — pior par ΔE 23.1 claro / 19.6
  escuro, bem acima do piso 8.
- **Criticidade e conformidade** são **ordinais** (baixa→alta), então usam rampa
  de um único matiz com luminosidade monotônica — e não verde/amarelo/vermelho,
  que reprova como escala categórica (verde↔vermelho ΔE 4.1 em deuteranopia).
- **Status** (verde/âmbar/vermelho) fica restrito a *badges*, onde **sempre** vem
  acompanhado do rótulo em texto. Nenhuma informação depende só de cor.

Os tokens estão em `src/app/globals.css`; os gráficos os leem em runtime
(`src/components/dashboard/tokens.ts`) e reagem à troca de tema do sistema.

## Ir para produção

1. **Banco** — troque `provider` para `postgresql` em `prisma/schema.prisma`,
   aponte `DATABASE_URL` e rode `npx prisma migrate deploy`.
2. **`AUTH_SECRET`** — gere um valor real: `openssl rand -base64 32`.
3. **Senhas do seed** — o seed é de demonstração. Em produção, cadastre usuários
   com senhas próprias e remova os de exemplo.
4. **Fotos** — hoje gravam em `public/uploads/` (disco local). Em ambiente
   serverless, troque `persistirFotos` em `src/lib/acoes/ocorrencias.ts` por um
   upload para S3/Cloud Storage; só a URL em `caminho` é persistida, o resto do
   código não muda.
5. **Fuso** — a apuração usa `America/Sao_Paulo` (`TZ_OPERACAO` em
   `src/lib/datas.ts`).

## Estrutura

```
prisma/
  schema.prisma            # as 4 tabelas + catálogo, usuários, fotos e logs
  seed.ts                  # catálogo, condomínios, usuários e massa de demonstração
src/
  app/
    login/                 # autenticação
    (app)/
      boletim/             # lista, wizard de lançamento e detalhe
      ocorrencias/         # fila, criação avulsa e gestão
      planos/              # planos de ação
      condominios/         # cadastro base (admin)
      dashboard/           # BI
  components/
    boletim/wizard.tsx     # formulário mobile em etapas
    dashboard/             # KPIs, gráficos e tokens de cor
    ocorrencias/ planos/ condominios/
  lib/
    auth.ts                # sessão, papéis e escopo por condomínio
    checklist.ts           # catálogo dos 27 itens
    validacao.ts           # schemas Zod
    datas.ts               # fuso, mês de referência e cálculo de SLA
    acoes/                 # Server Actions (escrita)
    consultas/dashboard.ts # agregações do BI
```
