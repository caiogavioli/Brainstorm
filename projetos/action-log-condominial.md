# action-log-condominial (nome provisório)

**Origem:** P-001 (branch `claude/dreamy-noether-ib9gbu`)
**Status:** fechado em spec (2026-10-07); decisões em aberto resolvidas em 2026-10-07 — em construção no repositório próprio
**Repositório:** [`caiogavioli/action-log-condominial`](https://github.com/caiogavioli/action-log-condominial) (privado)

## Problema que resolve

A DF Síndicos controla cada condomínio sob gestão num arquivo Excel próprio (o "Action Log", 12 abas), preenchido pelas **administradoras** e revisado toda semana pela DF; sindicância e proprietário acompanham. O modelo "um arquivo por condomínio, uma coluna por reunião" gera: histórico de assunto espalhado em 138 colunas, observações repetidas semana após semana (≥ 57%), campos que ninguém usa (Responsável, Plano de Ação e Prazo quase sempre vazios), célula sobrescrita sem rastro de quem mudou o quê, investimento que conta item "em cotação" como economia, Forecast sem coluna de **orçado** e sem alerta de saldo negativo, e nenhuma visão da carteira (40 condomínios, ~13 administradoras, 3 responsáveis da DF).

## Escopo da v1

Entra:
- **Cadastro e acesso:** os 40 condomínios, administradoras, clientes/proprietários, responsável da DF por condomínio; usuários por convite, com escopo por condomínio; cinco papéis (ver "Usuários e uso").
- **Action Log:** assunto (item, prioridade, classe, título, descrição, status, prazo, responsável, **aguardando: administradora / sindicância / DF**) com **linha do tempo de atualizações datadas** (autor, data, texto). Botão **"Sem novidade"** (confirmação datada sem texto). Comentário comum para qualquer papel com escrita, inclusive a sindicância. **Revisão semanal da DF** por condomínio, com a visão por carteira (Amanda / Caio / Denise). "Atualizado" é calculado: assunto aberto sem atualização nem "sem novidade" há mais de 7 dias (configurável) aparece como atrasado.
- **Pauta/ata semanal** por condomínio, para imprimir ou salvar em PDF e levar à reunião, no lugar do Excel inteiro.
- **Investimentos** como **entidade própria**: descrição, alocação (fundo), prioridade, AGO/ano que aprovou, **teto aprovado, valor contratado, valor pago**, saving calculado **só quando concluído**, responsável, status (Não iniciado / Em cotação / Em aprovação / Em andamento / Concluído / Stand by / Cancelado), observações e vínculo **opcional** a um assunto do Action Log. Resumo por fundo.
- **Forecast (Fluxo de Caixa):** 6 fundos (Ordinário, Reserva, Contingência, Individualização de Consumos, Água, Energia) × 12 meses, com **três valores por lançamento — orçado, realizado e projetado** — marcação explícita do mês realizado ou projetado, categorias de despesa por fundo (catálogo padrão da planilha, editável por condomínio), saldo inicial/final calculado e **alerta de saldo projetado negativo** (aviso a DF e sindicância do condomínio). Digitação em grade (como na planilha) com **colar do Excel**.
- **Posição Financeira** como **visão calculada** a partir do Forecast (saldo por fundo entre duas datas); não é tela de digitação.
- **Log de alterações** em tudo que a administradora edita: quem, quando, valor antes e depois. É o que substitui o "a célula é sobrescrita".
- **Exportação para Excel** do Forecast e dos Investimentos (a base de usuários vem do Excel).
- **Migração** por script das planilhas existentes (ver abaixo).
- Funciona bem no **celular** (layout responsivo, prioridade para consulta, atualização de assunto e "sem novidade").

Não entra (por decisão consciente):
- Integração automática com os sistemas das administradoras (são ~13, sem fonte única; a administradora digita o Forecast mês a mês, como hoje).
- Versões navegáveis do mês corrigido no Forecast (decisão: o log de alterações basta).
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
- `Fundo`, `CategoriaDespesa`, `Lancamento` (fundo, categoria, competência, **tipo = ORCADO | REALIZADO | PROJETADO**, valor), `SaldoInicial`.
- `LogAlteracao` (entidade, id, campo, antes, depois, usuário, quando) e `AcessoNominal` (quem abriu a lista nominal de inadimplência, quando — v2).

Regras que valem em toda parte: (1) **toda consulta é filtrada pelo escopo do usuário no servidor**, nunca só na interface; (2) toda edição de administradora grava no log; (3) listas fixas (prioridade, classe, status, fundos, índices de reajuste, tipos de contrato) vêm da aba oculta **BASE – Listas Suspensas** das planilhas.

Migração das planilhas (script único, rodado por condomínio, com conferência do usuário antes de valer):
- **Action Log:** itens abertos entram com histórico completo, **colapsando observações idênticas consecutivas** (≈ 57% do volume); concluídos entram como histórico compactado.
- **Investimentos** e **Fluxo de Caixa:** importados; no Fluxo o ano é pedido na importação (a aba não traz ano) e meses sem marcação são tratados como realizados só se o usuário confirmar.
- **Carteira:** o `Consolidado_Fornecedores` alimenta o cadastro dos 40 condomínios (sem contatos pessoais; usuários entram por convite).
- Documentos, Contratos, Auditoria e Inadimplência **não migram na v1** (módulos da v2).

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
| Hospedagem | **Vercel + Neon** (decisão do usuário, 2026-10-07). Criar o banco direto em neon.tech, não pela aba Storage da Vercel (lição do app de boletim) | Sem servidor para manter. Confirmar preço e termos vigentes antes de contratar: o plano gratuito da Vercel costuma ser restrito a uso não comercial, então este projeto provavelmente exige plano pago; não há teto de custo informado |

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
| Saving só quando concluído | `teto − executado` sempre | Item em cotação aparecia como 100% de economia |
| Forecast com orçado + realizado + projetado e alerta de negativo | Só realizado/projetado como hoje | O Forecast serve a antecipar falta de caixa; sem orçado não há desvio |
| Log de alterações (votos de Rafael e Tomás) | Versões navegáveis do mês (Marina) | Custa menos; responde "quem mudou e quando". Custo aceito: não há "foto do mês" para reabrir |
| Posição Financeira calculada | Tela de digitação própria | Mesmo dado digitado duas vezes diverge (já divergia na planilha) |
| Digitação em grade + colar do Excel | Importar a planilha de cada administradora | ~13 administradoras, formatos diferentes |
| Inadimplência nominal visível a todos os papéis (decisão do usuário) | Só administradora e DF; ou conselho sim e proprietário só total | Decisão do usuário; risco de LGPD registrado abaixo |

## Riscos

- **Acesso entre condomínios (o mais sério).** ~100 usuários de ~13 empresas; falha de filtro por escopo expõe financeiro de um condomínio a outro. Mitigação: filtro no servidor em toda consulta, testes automatizados de isolamento por papel e condomínio, revisão de segurança antes de abrir para as administradoras.
- **LGPD — inadimplência nominal visível a todos os proprietários** (decisão do usuário, v2). Nome e unidade de terceiros expostos entre proprietários. Mitigação barata já prevista: `AcessoNominal` registra quem consultou e quando; visibilidade nominal é **configuração por condomínio** (padrão: todos veem), para fechar depois sem refazer o sistema.
- **Adesão das administradoras.** Hoje elas têm o Excel e já conhecem; ~13 empresas, várias pessoas cada. Mitigação: convite por condomínio, treino curto, "sem novidade" em um toque, a DF só revisa o que está no sistema.
- **Qualidade dos números do Forecast** (digitados à mão, sem integração). Mitigação: validações (saldo, soma por categoria), marcação explícita de realizado × projetado, comparação com saldo informado e log de alterações.
- **Migração suja.** Planilhas com filtro quebrado, `#REF!`, `#VALUE!`, ano ausente no Fluxo, Documentos/Contratos defasados. Mitigação: o script reporta o que não conseguiu ler; conferência do usuário antes de virar fonte da verdade.
- **Manutenção por uma pessoa só.** Mitigação: stack padrão já usada no boletim, `CLAUDE.md` próprio no repositório, backup agendado do banco.
- **Dois acessos para as mesmas pessoas** (consequência da decisão de contas separadas). Aceito pelo usuário.

## Critério de pronto (v1)

- [ ] 40 condomínios cadastrados, cada um com administradora, cliente e responsável DF.
- [ ] Uma administradora de teste consegue, **só pelo celular**, convidar-se, entrar, atualizar um assunto e marcar "sem novidade".
- [ ] A DF vê, por carteira, os assuntos abertos sem atualização há mais de 7 dias e registra a revisão semanal.
- [ ] Um assunto lê-se de cima para baixo, com autor e data de cada atualização; comentários da sindicância aparecem no mesmo fluxo.
- [ ] Investimento mostra teto × contratado × pago; um item "em cotação" **não** gera saving.
- [ ] Forecast com orçado, realizado e projetado por fundo e mês; saldo projetado negativo gera aviso a DF e sindicância; Posição Financeira sai calculada.
- [ ] Toda edição de administradora aparece no log com antes e depois.
- [ ] Teste automatizado prova que um usuário de um condomínio **não lê nem escreve** em outro, em todos os papéis.
- [ ] Planilha do Atrium Century Plaza migrada e conferida lado a lado com o original (assuntos, investimentos 2024, Fluxo).
- [ ] Exportação Excel do Forecast e dos Investimentos.
- [ ] Backup agendado do banco e procedimento de restauração testado.

## Fora do escopo mas mapeado (v2+)

- **Inadimplência** (lista por unidade, valor inicial/atual, status; atualização mensal e a cada pagamento), com `AcessoNominal` e visibilidade configurável.
- **Documentos obrigatórios** só para condomínios **sem SafetyDocs** (os BGRE usam SafetyDocs; a decisão do usuário foi não tirar a aba). Ponto aberto: nos BGRE, mostrar apenas o resumo vindo do SafetyDocs ou desligar o módulo.
- **Contratos de despesas e receitas** (vigência, reajuste, aviso prévio, status calculado).
- **Auditoria** (recomendação, plano de ação, prazo, status, resposta).
- Agenda de assembleias ligada aos Investimentos e à previsão orçamentária (existe como aba no `Consolidado_Fornecedores`).
- Fornecedores por disciplina por condomínio (também vêm do `Consolidado_Fornecedores`).
- Exportação para PDF formatado da pauta/ata.

## Pontos ainda em aberto (a fechar no repositório novo)

- Limite de 7 dias para "atrasado": igual para todo condomínio?
- Teto de custo mensal (o usuário não informou; a hospedagem é Vercel + Neon, mas o plano exato depende dele).
- Categorias de despesa: o catálogo padrão sai de um condomínio (13 categorias no Fundo Ordinário do Atrium); confirmar se serve a todos.

## Resolvido depois do fechamento (2026-10-07)

- **Escopo e migração (decisão 6):** o usuário concordou com a proposta.
- **Proprietário só lê** na v1 (não comenta).
- **"BRPRA/CBRE" = "CBRE"**: BRPRA é um setor da CBRE; o cadastro usa uma só administradora, CBRE.
- **Hospedagem: Vercel + Neon.**
