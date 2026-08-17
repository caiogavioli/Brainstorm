# Sistema de Gestão e Boletim Diário de Operações — Condomínios

Substitui o preenchimento por WhatsApp e planilhas de Excel por: um **formulário
mobile em etapas** para o gerente predial, um **banco relacional**
multi-condomínio, um **painel administrativo** para o síndico profissional e um
**dashboard gerencial** com KPIs, gráficos e matriz de risco de SLA.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Banco | Prisma ORM + PostgreSQL (mesmo provider em dev e produção) |
| Estilos | Tailwind CSS v4 + design tokens próprios (claro/escuro) |
| Gráficos | Recharts |
| Validação | Zod (no servidor, em toda Server Action) |
| Sessão | JWT assinado (`jose`) em cookie httpOnly + bcrypt |

## Colocar no ar

**→ [GUIA-DEPLOY.md](GUIA-DEPLOY.md)** — passo a passo. O caminho principal é a
**Vercel**; Docker num computador próprio e Node direto ficam como alternativas,
junto com Koyeb, Netlify e Render.

Na Vercel: crie o banco no [Neon](https://neon.tech) (não pela aba *Storage*,
que passa pelo marketplace), informe `DATABASE_URL`, `AUTH_SECRET` e
`SETUP_TOKEN`, publique, e crie seu usuário em `/configuracao-inicial`.

O mais rápido, se você tem Docker: sobe aplicação **e** banco de uma vez.

```bash
cp .env.example .env      # preencha AUTH_SECRET, POSTGRES_PASSWORD e ADMIN_*
docker compose up -d      # http://localhost:3000
```

## Rodando localmente

Precisa de um PostgreSQL — ou use o `docker compose` acima, que já traz um.
Sem Docker, crie um banco gratuito no [Neon](https://neon.tech) e cole a URL.

```bash
npm install
cp .env.example .env      # cole DATABASE_URL e um AUTH_SECRET
npm run setup             # migra o banco + popula dados de demonstração
npm run dev               # http://localhost:3000
```

⚠️ `npm run setup` cria **dados de demonstração**. Para um banco de produção use
`npm run producao:init` (só catálogo + administrador), ou a tela
`/configuracao-inicial`.

O seed cria 3 condomínios, os 27 itens de checklist, ~90 dias de boletins e
ocorrências sintéticas, e os usuários de demonstração:

| Papel | E-mail | Senha |
|---|---|---|
| Administrador (síndico) | `sindico@condominios.com.br` | `condominio123` |
| Gerente predial (Atrium Office) | `gestor.atrium@condominios.com.br` | `condominio123` |
| Gerente predial (Centenário) | `gestor.centenario@condominios.com.br` | `condominio123` |
| Gerente predial (Passeio Paulista) | `gestor.paulista@condominios.com.br` | `condominio123` |

Comandos úteis: `npm run db:studio` (inspecionar o banco), `npm run db:migrate`
(criar migração após mudar o schema), `npm run typecheck`, `npm run build`.

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

### O checklist

47 itens em 10 grupos, na ordem de uma ronda: quem está trabalhando → o que
alimenta o prédio (energia, água, ar) → como se circula → o que protege → o que
conecta → como está conservado → o que está em obra.

Três regras o organizam:

- **Um assunto, um item.** O efetivo das equipes é o grupo 1 e só ali (os itens
  se chamam "Equipe de …"); o estado físico das áreas é o grupo 9. Nada é
  perguntado duas vezes.
- **Falta de pessoal é item do checklist**, não pergunta separada. Marcar
  "Equipe de Limpeza" como não conforme já registra a falta — `houveFaltas`,
  `qtdeFaltas` e `setoresFaltas` do boletim são derivados disso.
- **A criticidade é do item, não de quem preenche.** Cada item carrega
  `criticidadePadrao` (incêndio é sempre Alta; jardinagem é sempre Baixa), e é
  ela que define a criticidade e o SLA da ocorrência. Dois gerentes relatando a
  mesma falha produzem a mesma prioridade.

O catálogo vive em `src/lib/checklist.ts` e é sincronizado com o banco a cada
build (`scripts/sincronizar-catalogo.ts`): itens novos entram, os existentes são
atualizados e os que saíram do catálogo são **desativados** — nunca apagados,
para que boletins antigos continuem legíveis.

### Decisão: checklist normalizado em vez de colunas booleanas

A especificação descrevia os itens do checklist como campos do boletim. Aqui
eles são **linhas** da tabela `ChecklistItem`, e cada resposta do dia é uma linha
de `BoletimItem` (`CONFORME` / `NAO_CONFORME` / `NAO_APLICAVEL`). O resultado é
o mesmo na tela, mas:

- incluir, renomear ou desativar um item **não exige migração de schema**;
- "Ocorrências por Setor" sai de um `GROUP BY checklistItemId` — não de somar 27
  colunas;
- boletins antigos continuam íntegros quando o catálogo evolui.

Para mudar o checklist, edite `src/lib/checklist.ts`. O próximo build sincroniza
o banco sozinho; localmente, `npm run catalogo:sync`.

### Regras de negócio implementadas

- **1 boletim por condomínio por dia**, garantido por índice único
  `(condominioId, dataReferencia)`. Reenviar o mesmo dia substitui o boletim e
  as ocorrências que ele havia gerado — ocorrências avulsas não são tocadas.
- **Ocorrência automática**: todo item `NAO_CONFORME` abre uma ocorrência
  vinculada ao item de origem, dentro da mesma transação do boletim. Criticidade
  e SLA vêm do catálogo (Alta 3d · Média 7d · Baixa 15d).
- **Pendência que se arrasta reaparece sozinha.** Enquanto uma ocorrência não é
  dada como concluída, ela volta no boletim do dia seguinte, numa etapa própria
  logo depois da identificação, já com risco, plano e prazo preenchidos. Quem
  preenche só diz se **continua em aberto** ou se foi **resolvida** — e resolver
  fecha a ocorrência com a data daquele boletim.
- **O backlog não classifica o dia.** As pendências arrastadas entram no boletim
  e viram recorrência, mas a sugestão de status do dia olha só o que a ronda
  encontrou de novo. Se contassem, um prédio com oito problemas abertos nasceria
  "ocorrência crítica" todo dia e o indicador de conformidade travaria em zero
  até o último deles ser fechado — deixando de distinguir o dia bom do ruim, que
  é a única coisa que ele serve para fazer. O acúmulo tem indicadores próprios.
  Pelo mesmo motivo, falta de equipe que se arrasta não é recontada a cada dia.
- **Um problema, uma ocorrência.** Se já existe ocorrência em aberto para o
  mesmo condomínio e item, o boletim do dia **não** abre outra: registra uma
  linha em `OcorrenciaRecorrencia` e anota no histórico. Sem isso, uma
  infiltração que dura duas semanas viraria catorze ocorrências e catorze planos
  de ação para o mesmo problema. A unicidade por (ocorrência, boletim) mantém o
  reenvio do mesmo dia idempotente.
- **Descrição obrigatória** ao marcar uma falha — sem ela a ocorrência nasceria
  sem contexto, e o wizard bloqueia o envio.
- **Histórico**: toda mudança de status, criticidade, SLA ou plano de ação vira
  uma linha em `OcorrenciaLog`, com valor anterior e posterior.

## Como se entra

Todo mundo entra com login. A raiz (`/`) apenas encaminha: quem não tem sessão
vai para `/login`; quem tem, vai para a sua tela inicial.

| Endereço | Quem usa | Cai em |
|---|---|---|
| `/inicio` | Gerente predial — trata ocorrências e lança o boletim | Após o login |
| `/dashboard` | Administradora | Após o login |

**Houve aqui um formulário público, sem login**, em que o gerente se
identificava digitando o nome. Ele foi removido quando o acompanhamento das
ocorrências passou a ser tarefa de quem preenche: "as suas ocorrências" não
existe sem saber quem é quem, e um nome digitado não liga o registro a ninguém.
A Server Action daquele fluxo foi apagada junto com a tela — uma Server Action
segue alcançável pelo identificador mesmo sem botão apontando para ela, então
escondê-la da interface não a fecharia.

Para migrar, o administrador cria em **/usuarios** uma conta por preenchedor,
define a senha inicial e marca os condomínios que cada um enxerga.

## Perfis de acesso

| | Gerente predial | Administrador |
|---|---|---|
| Lançar boletim | ✅ (só nos seus condomínios) | ✅ |
| Ocorrências e planos | ✅ (só nos seus condomínios) | ✅ (todos) |
| Dashboard gerencial | — | ✅ |
| Cadastro de condomínios | — | ✅ |
| Gestão de usuários | — | ✅ |

O administrador cria as contas dos gerentes em **/usuarios**, definindo quais
condomínios cada um enxerga e podendo redefinir senhas e bloquear acessos.

O vínculo gerente↔condomínio fica em `UsuarioCondominio`. **Todo filtro por
condomínio é intersectado com o escopo do usuário** (`filtroCondominio` em
`src/lib/auth.ts`) — trocar `?condominio=` na URL não expõe outro prédio.

## Interface

**Tela inicial do preenchedor** (`/inicio`) — abre com as ocorrências em aberto
dos condomínios dele, as mais urgentes primeiro (atraso vence criticidade: uma
Baixa que estourou o prazo é promessa quebrada e não pode ficar atrás de toda
Alta ainda no prazo). Logo abaixo, o estado do boletim de hoje e o botão para
lançá-lo.

**Wizard mobile** (`/boletim/novo`) — identificação, pendências de dias
anteriores (quando há), os grupos do checklist e o fechamento:
identificação, os 10 grupos do checklist e o fechamento. Todos os itens já vêm marcados como **Conforme**, então
o gerente só toca onde há falha; ao marcar uma falha, o campo de descrição e a
criticidade aparecem no mesmo cartão. Alvos de toque de 44px, campos de 16px
(evita o zoom automático do iOS) e barra de navegação inferior fixa.

**Painel administrativo** — `/ocorrencias` (fila com filtros de condomínio, mês,
status, criticidade e faixa de SLA), `/ocorrencias/[id]` (gestão + histórico),
`/planos`, `/condominios` e `/usuarios`.

> **Fotos das ocorrências estão desativadas.** O envio foi removido para que o
> sistema não dependa de nenhum serviço externo de armazenamento. O modelo
> `OcorrenciaFoto` e a galeria na tela de detalhe continuam no lugar, então
> reativar é acrescentar o upload — sem migração nem perda de dados.

## Dashboard (`/dashboard`)

Filtros globais de **condomínio** e **intervalo de datas** (início e término,
com atalhos para hoje, ontem, 7/30 dias, este mês e o mês passado). Contém:

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

## Notas de produção

- **Migrações** — o build roda `prisma migrate deploy`, então publicar já aplica
  o que estiver pendente. Ao mudar o schema, gere a migração com
  `npm run db:migrate` e faça commit da pasta `prisma/migrations/`.
- **Serverless** — em plataformas que rodam o app em funções (Vercel), cada
  instância abre a própria conexão. Acrescente `&connection_limit=1` à
  `DATABASE_URL` para não esgotar o limite do banco.
- **`output: "standalone"`** — ligado apenas quando `DOCKER_BUILD=1`, definido
  no Dockerfile. As plataformas de hospedagem montam o próprio empacotamento a
  partir do build padrão, e forçá-lo ali só acrescenta uma variável a mais para
  dar errado.
- **Docker** — `Dockerfile` em três estágios com saída `standalone`. As
  dependências de produção são instaladas com `npm ci --omit=dev` e copiadas
  inteiras: escolher pacotes a dedo esquece dependências transitivas do Prisma
  (os *engines*), e a falha só apareceria ao subir o container.
- **Entrypoint** — `docker/entrypoint.sh` espera o banco responder, aplica as
  migrações, cria o administrador quando `ADMIN_EMAIL`/`ADMIN_SENHA` existem e
  então larga o root.
- **Credenciais de demonstração** — a dica na tela de login some sozinha em
  produção (`MOSTRAR_CREDENCIAIS_DEMO` reativa, se for uma vitrine).
- **`SETUP_TOKEN`** — habilita `/configuracao-inicial`. A tela também exige que
  não exista nenhum admin ativo, então a janela fecha sozinha após o primeiro
  cadastro. Remova a variável depois.
- **Fuso** — a apuração usa `America/Sao_Paulo` (`TZ_OPERACAO` em
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
      usuarios/            # contas e escopo de acesso (admin)
      dashboard/           # BI
    configuracao-inicial/  # criação do primeiro admin, após o deploy
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
scripts/sincronizar-catalogo.ts # aplica src/lib/checklist.ts no banco (roda no build)
scripts/init-producao.ts   # catálogo + admin, sem dados de demonstração
Dockerfile                 # imagem de produção (standalone)
docker-compose.yml         # aplicação + PostgreSQL em um comando
vercel.json                # build e install explícitos para a Vercel
```
