# action-log-condominial (nome provisório)

**Origem:** P-001 (branch `claude/dreamy-noether-ib9gbu`)
**Status:** fechado; repositório criado em 2026-10-07 (commit inicial `3d14a8a`), spec ajustada no commit `9d14a5a` do repositório novo, sem código ainda
**Nota:** a spec viva está em `docs/spec.md` no repositório novo; esta cópia é o histórico da decisão.
**Repositório:** [`caiogavioli/action-log-condominial`](https://github.com/caiogavioli/action-log-condominial) (privado)

## Problema que resolve

A DF Síndicos controla cada condomínio sob gestão num arquivo Excel próprio (o "Action Log", 12 abas), preenchido pelas **administradoras** e revisado toda semana pela DF; sindicância e proprietário acompanham. O modelo "um arquivo por condomínio, uma coluna por reunião" gera: histórico de assunto espalhado em 138 colunas, observações repetidas semana após semana (≥ 57%), campos que ninguém usa (Responsável, Plano de Ação e Prazo quase sempre vazios), célula sobrescrita sem rastro de quem mudou o quê, investimento que conta item "em cotação" como economia, Forecast sem alerta de saldo negativo (e, no Atrium, sem **orçado**; outros condomínios o mantêm numa aba à parte), e nenhuma visão da carteira (40 condomínios, ~13 administradoras, 3 responsáveis da DF). As quatro planilhas analisadas (Atrium Century Plaza, JIT Park, Passeio Paulista, Faria Lima Tower) têm abas, colunas, fundos e categorias diferentes entre si: cada cópia diverge com o tempo.

## Escopo da v1

Entra:
- **Cadastro e acesso:** os 40 condomínios, administradoras, clientes/proprietários, responsável da DF por condomínio; usuários por convite, com escopo por condomínio; cinco papéis (ver "Usuários e uso").
- **Action Log:** assunto (item, prioridade, classe, título, descrição, status, prazo, responsável, **aguardando: administradora / sindicância / DF**) com **linha do tempo de atualizações datadas** (autor, data, texto). Botão **"Sem novidade"** (confirmação datada sem texto). Comentário comum para qualquer papel com escrita, inclusive a sindicância. **Revisão semanal da DF** por condomínio, com a visão por carteira (Amanda / Caio / Denise). "Atualizado" é calculado: assunto aberto sem atualização nem "sem novidade" há mais de **N dias** aparece como atrasado, com **N = 7 por padrão e parâmetro por condomínio** (a cadência real varia: semanal no Atrium, em torno de mensal no JIT Park e na Faria Lima). Assuntos em **Stand by**, **Concluído** ou **Cancelado** ficam fora do cálculo.
- **Pauta/ata semanal** por condomínio, para imprimir ou salvar em PDF e levar à reunião, no lugar do Excel inteiro.
- **Investimentos** como **entidade própria**: descrição, alocação (fundo), prioridade, AGO/ano que aprovou, **teto aprovado, valor contratado, valor pago**, saving calculado **só quando concluído**, responsável (texto livre, pode ser empresa e pessoa), status (Não iniciado / Em cotação / Em aprovação / Em andamento / Concluído / Stand by / Cancelado), **status das propostas, status de aprovação, status do contrato, previsão de início e de finalização** (colunas que o JIT Park já usa), observações e vínculo **opcional** a um assunto do Action Log. Resumo por fundo.
- **Forecast (Fluxo de Caixa):** por condomínio e **por ano**, com 12 meses. **Fundos escolhidos por condomínio** a partir de uma lista (Ordinário, Reserva, Contingência, Proprietário, Estacionamento, Melhorias, Obras, Privativo/Reembolsável, Individualização de Consumos, Água, Energia) mais contas livres que a administradora nomear (ex.: provisões, créditos e débitos transitórios). **Categorias de despesa cadastradas pela própria administradora, em cada fundo, com a nomenclatura dela — não há catálogo padrão:** nome, código opcional (o plano de contas do Passeio Paulista tem ~76 linhas numeradas, como 08.01), ordem, **inclusão e exclusão livres** e cadastro em lote colando uma lista do Excel. Excluir uma categoria já usada **arquiva** (o histórico fica); só se apaga de verdade uma categoria nunca usada. **Três valores por lançamento — orçado, realizado e projetado** — por categoria e mês, com variação em R$ e %, como a aba "Previ x Real" do JIT Park; marcação explícita de mês realizado ou projetado; saldo inicial/final calculado e **alerta de saldo projetado negativo** (aviso a DF e sindicância do condomínio). Digitação em grade (como na planilha) com **colar do Excel**.
- **Posição Financeira** como **visão calculada** a partir do Forecast (saldo por fundo e conta, em fronteiras de mês); não é tela de digitação.
- **Log de alterações** em tudo que a administradora edita: quem, quando, valor antes e depois. É o que substitui o "a célula é sobrescrita".
- **Exportação para Excel** do Forecast e dos Investimentos (a base de usuários vem do Excel).
- **Migração** por script das planilhas existentes (ver abaixo).
- Funciona bem no **celular** (layout responsivo, prioridade para consulta, atualização de assunto e "sem novidade").

Não entra (por decisão consciente):
- Integração automática com os sistemas das administradoras (são ~13, sem fonte única; a administradora digita o Forecast mês a mês, como hoje).
- Versões navegáveis do mês corrigido no Forecast (decisão: o log de alterações basta).
- Catálogo padrão de categorias de despesa e comparação de despesa por categoria entre condomínios (decisão: cada administradora cadastra as suas).
- Tipo "exigência" com prazo próprio para a sindicância (decisão: comentário + "aguardando quem").
- Login único com o app de boletim (decisão: contas separadas).
- Troca de e-mails por dentro do sistema além dos avisos (nada de caixa de mensagens).
- Aplicativo nativo; o sistema é web responsivo.

## Usuários e uso

~100 usuários estimados (≈ 2,5 por condomínio), os mesmos perfis do boletim diário, **em contas separadas**.

| Papel | Quem | Pode |
|---|---|---|
| `DF_ADMIN` | Gestão da DF | Tudo, em todos os condomínios; cadastra condomínios e convida usuários |
| `DF_ANALISTA` | Equipe da DF (Amanda, Caio, Denise e demais) | Ler e editar nos condomínios da sua carteira; fazer a revisão semanal; ver os demais em leitura |
| `ADMINISTRADORA` | Gerente, supervisor, assistente etc. | Criar/editar assuntos, atualizações, "sem novidade", investimentos, Forecast (e, na v2, inadimplência/documentos/contratos), **só nos condomínios a que está vinculado** |
| `SINDICANCIA` | Conselho/sindicância | Ler tudo do condomínio; comentar e marcar "aguardando" |
| `PROPRIETARIO` | Proprietário/cliente | Ler tudo do condomínio (inclui inadimplência nominal — decisão 5) |

Uso esperado: a administradora atualiza **sempre que há novidade** em um tema; a DF revisa **toda semana** (por carteira); sindicância e proprietário consultam; o Forecast é preenchido **uma vez por mês** pela administradora, e o alerta de saldo negativo dispara a reunião conjunta que já existe hoje.

## Arquitetura escolhida

Aplicação web única, **multi-tenant por condomínio**, no mesmo padrão do app de boletim, mas **repositório, banco e contas próprios**:

```
Navegador (celular/PC)
   └── Next.js (App Router, Server Actions)  ── regra de acesso no servidor, sempre
          ├── Prisma ── PostgreSQL (um banco, um schema)
          ├── Sessão: cookie httpOnly com JWT + bcrypt (convite → define senha)
          └── E-mail transacional (convite, redefinição de senha, aviso de saldo negativo, resumo semanal)
```

Modelo de dados (resumo; detalhe na primeira migração):
- `Administradora`, `Cliente`, `Condominio` (apelido, CNPJ, cidade/UF, cliente, administradora, **responsável DF**).
- `Usuario` (papel) + `UsuarioCondominio` (escopo).
- `Assunto` → `Atualizacao` (texto **ou** "sem novidade"; autor; data) e `RevisaoSemanal` (condomínio, semana, quem revisou).
- `Investimento` (+ vínculo opcional a `Assunto`).
- `Fundo` (por condomínio: tipo da lista ou conta livre), `CategoriaDespesa` (condomínio, fundo, nome, código opcional, ordem, arquivada), `Lancamento` (categoria, ano, mês, **tipo = ORCADO | REALIZADO | PROJETADO**, valor), `SaldoInicial` (fundo, ano).
- `LogAlteracao` (entidade, id, campo, antes, depois, usuário, quando) e `AcessoNominal` (quem abriu a lista nominal de inadimplência, quando — v2).

Regras que valem em toda parte: (1) **toda consulta é filtrada pelo escopo do usuário no servidor**, nunca só na interface; (2) toda edição de administradora grava no log; (3) listas fixas (prioridade, classe, status, tipos de fundo, índices de reajuste, tipos de contrato) vêm da aba oculta **BASE – Listas Suspensas** das planilhas.

Migração das planilhas (por condomínio, com conferência do usuário antes de valer). **Cada planilha diverge das outras** (as quatro analisadas têm abas, colunas e layout de Fluxo diferentes), então a migração é feita por **leitor tolerante**, não por script de molde único:
- **Action Log:** as colunas A–I (item … status) são idênticas nos quatro arquivos; as demais são datas de reunião (cabeçalho "REUNIÃO" ou "Atualização"). Itens abertos entram com histórico completo, **colapsando observações idênticas consecutivas** (de 0% a 59% do volume, conforme o condomínio); concluídos entram como histórico compactado. Item **sem status** (12 de 30 na Faria Lima) entra marcado para revisão do usuário, nunca como concluído. Colunas com data placeholder (`dd/mm/aa`) são ignoradas.
- **Investimentos:** leitor guiado pelo cabeçalho; aceita as colunas extras do JIT Park; cada aba por ano vira o campo `ano`. O saving é recalculado pela regra nova.
- **Fluxo de Caixa:** o layout varia (Atrium tem coluna de observações, Passeio Paulista tem coluna de código, Faria Lima tem linha PREVISTO e uma aba por ano). O leitor identifica os blocos "FUNDO … até SALDO FINAL", propõe fundos e categorias a partir dos nomes das linhas e o usuário confirma o mapeamento. Se um arquivo não for legível, o Forecast **recomeça no ano corrente**, sem histórico. O ano é pedido na importação quando a aba não o traz.
- **Previ x Real** (JIT Park) alimenta o **orçado** do Forecast; a **Posição Financeira** é recalculada, não importada.
- **Carteira:** o `Consolidado_Fornecedores` alimenta o cadastro dos 40 condomínios (sem contatos pessoais; usuários entram por convite).
- Documentos, Contratos, Auditoria, Inadimplência e as abas específicas de um condomínio (Visita Operacional, Plano SDAI) **não migram na v1**.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript | Mesmo padrão do app de boletim; quem mantém já conhece |
| Banco | PostgreSQL via Prisma | Multi-condomínio relacional; mesmo provider em dev e produção |
| Estilo | Tailwind CSS v4, tokens claro/escuro | Idem boletim; responsivo para celular |
| Validação | Zod em toda Server Action | Quem escreve é externo; nada confia no cliente |
| Sessão | JWT (`jose`) em cookie httpOnly + bcrypt | "Da mesma forma que as do boletim"; sem dependência de provedor de identidade |
| Planilhas | biblioteca de leitura/escrita de `.xlsx` (importação e exportação) | Migração e exportação para o Excel |
| E-mail | serviço transacional de plano gratuito | Convite, redefinição, alerta de saldo negativo, resumo semanal |
| Hospedagem | **Planos gratuitos primeiro (Vercel + Neon), VPS pago depois** (decisão do usuário, 2026-10-07). Criar o banco direto em neon.tech, não pela aba Storage da Vercel. **Portável desde o primeiro dia:** `output: "standalone"`, `Dockerfile` e `docker-compose` para a futura VPS (o guia do app de boletim serve de base); nada de recurso exclusivo da Vercel (Blob, KV, Edge-only); tarefas agendadas (resumo semanal, alerta de saldo negativo) por endpoint protegido por segredo, chamado por um agendador externo (GitHub Actions no gratuito, `cron` na VPS); e-mail por SMTP ou serviço transacional | Sem servidor para manter na fase gratuita e sem amarrar o projeto à Vercel. **Limites verificados em 2026-10-07:** o plano gratuito da Vercel (Hobby) é restrito a uso não comercial, e a definição de comercial inclui projeto usado para ganho financeiro de qualquer envolvido, até quem escreve o código; o gratuito do Neon tem 0,5 GB, 100 horas de computação por mês e 6 horas de histórico de restauração. Ver riscos e pontos em aberto |

## Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Plataforma própria | Monday | Usuário: "está muito caro"; Forecast encaixa mal em board |
| Plataforma própria | Microsoft 365 (listas + Power BI) e híbrido (Monday + Excel mestre) | Mais peças móveis e permissão externa por condomínio é pior; usuário optou por plataforma própria |
| Sistema apartado do boletim, contas separadas | Estender o app de boletim; login único | Usuário: "deve ser um sistema apartado" e "contas separadas"; custo aceito: as mesmas pessoas terão dois acessos |
| Atualização datada, uma por registro | Campo único sobrescrito / coluna por semana | Histórico vertical; permite "atrasado" calculado |
| Botão "Sem novidade" | Copiar o texto da semana anterior | Prova que a administradora olhou, sem ruído (57% do log era repetição) |
| Exigência da sindicância = comentário + campo "aguardando quem" (decisão do usuário, voto do Tomás) | Tipo "exigência" com prazo próprio (Marina e Rafael) | Mais simples. Custo aceito: a cobrança depende do campo "aguardando" e da revisão semanal; o prazo fica no nível do assunto |
| Investimento como entidade própria (voto da Marina) | Assunto com campos financeiros (Rafael e Tomás) | Várias contratações/parcelas por investimento; teto × contratado × pago |
| Saving só quando concluído | `teto − executado` sempre | Item em cotação aparecia como 100% de economia; nas planilhas analisadas, mais de 95% do teto do JIT Park em 2026 e 76% do da Faria Lima em 2025 aparecem como saving em itens ainda não concluídos |
| Forecast com orçado + realizado + projetado e alerta de negativo | Só realizado/projetado como hoje | O Forecast serve a antecipar falta de caixa; sem orçado não há desvio |
| Log de alterações (votos de Rafael e Tomás) | Versões navegáveis do mês (Marina) | Custa menos; responde "quem mudou e quando". Custo aceito: não há "foto do mês" para reabrir |
| Categorias de despesa cadastradas pela administradora, livres por condomínio, com inclusão e exclusão (decisão do usuário, opção B) | Catálogo padrão com as 13 categorias do Atrium; grupo fixo + categoria livre | Cada administradora tem a sua nomenclatura e "não temos como equalizar todas elas" (as quatro planilhas têm planos de contas diferentes, de 10 a ~76 linhas). Custo aceito: sem comparação de despesa por categoria entre condomínios |
| Limite de atraso: 7 dias por padrão, parâmetro por condomínio, sem contar Stand by/Concluído/Cancelado (decisão do usuário, opção B) | 7 dias fixos para todos; prazo por prioridade | A cadência real varia por condomínio; Stand by não deve gerar atraso |
| Hospedagem gratuita primeiro, VPS pago depois (decisão do usuário) | Vercel Pro ou VPS desde o início | Custo zero na fase inicial; o projeto nasce portável para trocar sem reescrever |
| Fundos escolhidos por condomínio (lista + contas livres) | 6 fundos fixos | JIT Park usa 8 fundos, Faria Lima usa contas transitórias e provisões, Atrium usa Água, Energia e Individualização |
| Posição Financeira calculada | Tela de digitação própria | Mesmo dado digitado duas vezes diverge (já divergia na planilha) |
| Digitação em grade + colar do Excel | Importar a planilha de cada administradora | ~13 administradoras, formatos diferentes |
| Inadimplência nominal visível a todos os papéis (decisão do usuário) | Só administradora e DF; ou conselho sim e proprietário só total | Decisão do usuário; risco de LGPD registrado abaixo |

## Riscos

- **Acesso entre condomínios (o mais sério).** ~100 usuários de ~13 empresas; falha de filtro por escopo expõe financeiro de um condomínio a outro. Mitigação: filtro no servidor em toda consulta, testes automatizados de isolamento por papel e condomínio, revisão de segurança antes de abrir para as administradoras.
- **LGPD — inadimplência nominal visível a todos os proprietários** (decisão do usuário, v2). Nome e unidade de terceiros expostos entre proprietários. Mitigação barata já prevista: `AcessoNominal` registra quem consultou e quando; visibilidade nominal é **configuração por condomínio** (padrão: todos veem), para fechar depois sem refazer o sistema.
- **Adesão das administradoras.** Hoje elas têm o Excel e já conhecem; ~13 empresas, várias pessoas cada. Mitigação: convite por condomínio, treino curto, "sem novidade" em um toque, a DF só revisa o que está no sistema.
- **Qualidade dos números do Forecast** (digitados à mão, sem integração). Mitigação: validações (saldo, soma por categoria), marcação explícita de realizado × projetado, comparação com saldo informado e log de alterações.
- **Migração suja e planilhas que divergem.** Filtro quebrado, `#REF!`, `#VALUE!`, ano ausente no Fluxo, status em branco, layout de Fluxo diferente por condomínio, Documentos/Contratos defasados. Mitigação: leitor tolerante que reporta o que não leu; conferência do usuário antes de virar fonte da verdade; no pior caso o Forecast recomeça no ano corrente.
- **Hospedagem gratuita com dados reais.** O Hobby da Vercel não é para uso comercial (risco de suspensão do projeto) e o Neon gratuito tem só 6 h de restauração e 100 h de computação por mês (a computação suspende ao estourar). Mitigação: fase gratuita só com dados sintéticos; backup próprio com `pg_dump` agendado, independente do provedor; projeto portável para a VPS. Recomendação do Tomás de **sair do gratuito antes de entrarem dados reais** aguarda o ok do usuário (ver pontos em aberto).
- **Manutenção por uma pessoa só.** Mitigação: stack padrão já usada no boletim, `CLAUDE.md` próprio no repositório, backup agendado do banco.
- **Dois acessos para as mesmas pessoas** (consequência da decisão de contas separadas). Aceito pelo usuário.

## Critério de pronto (v1)

- [ ] 40 condomínios cadastrados, cada um com administradora, cliente e responsável DF.
- [ ] Uma administradora de teste consegue, **só pelo celular**, convidar-se, entrar, atualizar um assunto e marcar "sem novidade".
- [ ] A DF vê, por carteira, os assuntos abertos sem atualização há mais de N dias (padrão 7, por condomínio, fora Stand by/Concluído/Cancelado) e registra a revisão semanal.
- [ ] Um assunto lê-se de cima para baixo, com autor e data de cada atualização; comentários da sindicância aparecem no mesmo fluxo.
- [ ] Investimento mostra teto × contratado × pago; um item "em cotação" **não** gera saving.
- [ ] Forecast com orçado, realizado e projetado por fundo e mês; saldo projetado negativo gera aviso a DF e sindicância; Posição Financeira sai calculada; a administradora cadastra, arquiva e exclui seus fundos e categorias, inclusive colando uma lista do Excel.
- [ ] Toda edição de administradora aparece no log com antes e depois.
- [ ] Teste automatizado prova que um usuário de um condomínio **não lê nem escreve** em outro, em todos os papéis.
- [ ] Action Log e Investimentos dos quatro arquivos de exemplo importados e conferidos lado a lado com o original; Fluxo de Caixa importado onde legível, com relatório do que não foi lido.
- [ ] Exportação Excel do Forecast e dos Investimentos.
- [ ] Backup agendado do banco (`pg_dump` próprio, independente do provedor) e procedimento de restauração testado.
- [ ] A aplicação sobe por `docker compose` numa máquina limpa (portabilidade para a futura VPS).

## Fora do escopo mas mapeado (v2+)

- **Inadimplência** (lista por unidade, valor inicial/atual, status; atualização mensal e a cada pagamento), com `AcessoNominal` e visibilidade configurável.
- **Documentos obrigatórios** só para condomínios **sem SafetyDocs** (os BGRE usam SafetyDocs; a decisão do usuário foi não tirar a aba). Ponto aberto: nos BGRE, mostrar apenas o resumo vindo do SafetyDocs ou desligar o módulo.
- **Contratos de despesas e receitas** (vigência, reajuste, aviso prévio, status calculado).
- **Auditoria** (recomendação, plano de ação, prazo, status, resposta) — ver "Planos de ação por origem".
- **Planos de ação por origem** (proposta, aguarda ok do usuário): uma lista única — item, data, descrição, plano de ação, criticidade, prazo, status, link — com **origem** (Auditoria, Visita Operacional da Sindicância, SDAI, outras). Unifica a aba Auditoria e as abas "Visita Operacional Sindic" (176 linhas) e "Plano de ação SDAI" da Faria Lima, que têm o mesmo formato.
- **Conciliação financeira** (saldo bancário e de aplicações × saldo calculado do fundo), presente na Faria Lima.
- **Custo por m²** (indicador do JIT Park; exige a área do condomínio).
- Agenda de assembleias ligada aos Investimentos e à previsão orçamentária (existe como aba no `Consolidado_Fornecedores`).
- Fornecedores por disciplina por condomínio (também vêm do `Consolidado_Fornecedores`).
- Exportação para PDF formatado da pauta/ata.

## Pontos ainda em aberto (a fechar no repositório novo)

- **Sair do plano gratuito antes de dados reais?** Recomendação do Tomás: a fase gratuita roda só com dados sintéticos; antes de entrarem dados reais e as administradoras, migrar para a VPS paga (já planejada pelo usuário) ou para a Vercel Pro. O usuário disse "a princípio vamos nos planos gratuitos" e ainda não opinou sobre este ponto.
- **Linha de despesa × Investimento:** na Faria Lima as linhas de despesa do Fundo de Reserva são nomes de projetos, as mesmas coisas dos Investimentos. Para não digitar duas vezes, vincular opcionalmente a categoria ou o lançamento a um Investimento e preencher o "pago" a partir do Forecast? A decidir na etapa 4.
- **Planos de ação por origem** na v2 (proposta acima).
- **Quem paga a hospedagem** (DF ou condomínios): sem resposta; só pesa na fase paga.

## Resolvido depois do fechamento (2026-10-07)

- **Escopo e migração (decisão 6):** o usuário concordou com a proposta.
- **Proprietário só lê** na v1 (não comenta).
- **"BRPRA/CBRE" = "CBRE"**: BRPRA é um setor da CBRE; o cadastro usa uma só administradora, CBRE.
- **Hospedagem: Vercel + Neon.**

## Resolvido em 2026-10-07 (segunda rodada de ajustes)

- **Limite de atraso (opção B):** 7 dias por padrão, parâmetro por condomínio; Stand by, Concluído e Cancelado ficam fora do cálculo.
- **Hospedagem:** "a princípio vamos nos planos gratuitos, mas tenho a ideia de mudar para um VPS pago no futuro" — projeto portável desde o início.
- **Categorias de despesa (opção B):** "as categorias devem ser inseridas pela propria administradora. cada uma tem uma nomenclatura diferente, e não temos como equalizar todas elas. faça campos com possibilidade de inclusão e exclusão de categorias."
