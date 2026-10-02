# plano-contingencia-agua

**Origem:** P-001 — Sistemas de água do prédio: contaminação cruzada e falta de plano de contingência
**Status:** spec fechada em 2026-10-02; produção em andamento (catálogo v2, planilha-mestre, cenários 1 a 9 e T, checklists de rotina e pacote de revisão feitos)
**Repositório:** nenhum, por decisão (D6). O modelo genérico vive **neste branch** (`claude/water-systems-contingency-plan-lmgx73`), em `entregas/plano-contingencia-agua/`. As fichas dos condomínios vivem no **OneDrive**. Se o usuário quiser repositório próprio para o modelo depois, é uma mudança de pasta, sem perda.

## Problema que resolve

Dois episódios de contaminação cruzada no mesmo prédio mostraram que ninguém tem o mapa dos sistemas de água nem um plano de contingência, manutenção e monitoramento que os cubra:

1. **Reúso misturado com potável** por erro de instalação na obra, que ninguém viu. Descoberto pelo ocupante, pela água azul. **Pessoas passaram mal e foram ao hospital.**
2. **Água gelada do chiller (com produtos químicos) saindo na torneira** de alguns andares, descoberta pelo ocupante, pela água rosa. Causa confirmada em campo: a reposição automática do circuito quebrou; havia um microvazamento numa válvula; a equipe repôs à mão com **mangueira da torneira de potável ligada direto na entrada do circuito**; a mangueira **ficou conectada**; o circuito, com pressão maior que a do potável, **empurrou a água para a prumada** (contrapressão). O que faltou foi **um jeito seguro de repor à mão** quando o automático falha.

O problema é do **portfólio inteiro** (escritório, lojas com restaurante, logísticos), administrado por terceiros (administradoras), com serviços terceirizados. Cada condomínio tem sistemas diferentes e ninguém sabe de cabeça quais proteções contra refluxo existem em cada um.

## Escopo da v1

Entra:
- **Catálogo v2** dos sistemas de água em edifícios comerciais e logísticos no Brasil, ampliado em relação ao catálogo v1 (76 itens), incluindo o que é "imaginário" ou raro, com mecanismo de falha e referência normativa.
- **Cenários de contingência condicionais** (~9 + comunicação de crise transversal), cada um com **procedimento** e **fluxograma de 1 página**. O cenário 1 (contaminação cruzada) sai primeiro.
- **Checklist de autovistoria** de interligações e pontos de refluxo, para as equipes residentes, nos 5 tipos de ponto: reposição de torre e chiller, reúso, reserva de incêndio, trocador de água quente, dispositivo antirretorno. Com "escalar ao síndico" no que não se pode certificar.
- **Plano de manutenção e monitoramento por família de sistema** (~15), como **aba da planilha-mestre**.
- **Planilha-mestre** (Excel) com a ficha por condomínio: S/N/? por sistema, a matriz sistema × cenário, e colunas estruturadas (sim / não / não sei, data, fonte).
- **Checklist padrão** para anexar ao relatório mensal dos fornecedores, via administradora, e pedido de **cadência semanal** nos itens críticos (cloro residual, dosagem química, nível, reposição de água do circuito, teste de bomba de incêndio).
- **Ronda com torneira sentinela** e **corante como traçador padrão** (já existe na água gelada; estender a outros circuitos).
- Seção de **comunicação de crise** ligada à escada de escalonamento já existente (níveis 1, 2 e 3, fornecedores).

Não entra (por decisão consciente):
- **Vistoria física por consultor externo.** Sem verba; a vistoria é feita pelas equipes residentes.
- **Sensores novos e BMS novo.** Só se aproveita o que já existe.
- **Registro único novo** (planilha ou Monday) alimentado à mão: cria tarefa que ninguém cumpre.
- **Repositório de software** ou qualquer código de produto.
- **Dados reais de condomínio no GitHub** (fichas, contatos, relatórios): ficam no OneDrive.
- **Laudo técnico ou projeto de engenharia.** O kit orienta e organiza; não substitui responsável técnico.
- **Plano específico de um prédio.** O kit é genérico; a ficha parametriza.

## Usuários e uso

| Quem | Quando | O que usa |
|---|---|---|
| **O usuário** (autor e mantenedor; o único com Claude Code) | Ao montar a ficha de cada condomínio, ao revisar o modelo após incidentes | Planilha-mestre, catálogo v2, fonte em Markdown deste branch |
| **Equipe de manutenção residente (24h, ronda)** | Em emergência (a qualquer hora) e na ronda | Fluxograma de 1 página impresso na sala de máquinas e na central; checklist de ronda; checklist de autovistoria |
| **Síndico e administradora** | Decisão, auditoria, resposta ao proprietário | Procedimento-modelo, dossiê por condomínio (v2) |
| **Fornecedores** | Mensalmente | Checklist padrão anexado ao relatório |

Frequência: emergência é rara, mas é o motivo do projeto. A ronda e o relatório mensal são rotina.

## Arquitetura escolhida

Três camadas, todas documentais:

```
CATÁLOGO (o que pode existir)            entregas/plano-contingencia-agua/catalogo/
        │  ids A1…H10 (+ v2)
        ▼
FICHA POR CONDOMÍNIO (o que existe)       planilha-mestre.xlsx   (no OneDrive, com dados reais)
        │  marca S/N/? por id; liga fornecedores, contatos, registros
        │  → seleciona os ramos aplicáveis de cada cenário
        ▼
CENÁRIOS (o que fazer quando falha)      entregas/plano-contingencia-agua/cenarios/
        procedimento + fluxograma de 1 página, condicional por configuração
```

**Procedimento condicional:** cada cenário se ramifica pela configuração do prédio ("se o circuito tem reposição automática…; se só tem manual…; se existe separação atmosférica…; se não sabe → tratar como sem proteção"). A ficha diz qual ramo vale ali. Regra de ouro dos ramos: **"não sei" é tratado como "não tem"**, porque os dois episódios nasceram de pontos que ninguém sabia que existiam.

**Matriz sistema × cenário:** liga a manutenção por sistema (famílias) à contingência por cenário. Fica dentro da planilha-mestre.

### Cenários da v1

1. **Contaminação cruzada** (cor, odor ou sabor na torneira: reúso, água gelada, incêndio) — **sai primeiro**
2. Falta de água / reservatório vazio
3. Água fora do padrão (cloro baixo, turva, suspeita microbiológica, Legionella)
4. Vazamento e alagamento (inclui subsolo, bombas de drenagem e esgoto)
5. Falha de bomba ou de energia (recalque, incêndio, drenagem)
6. Incêndio com reserva ou sistema indisponível
7. Refluxo ou retorno de esgoto
8. Falha do tratamento químico da torre ou do chiller
9. Contaminação do reservatório (sujeira, animal, infiltração)
10. **Transversal:** comunicação de crise — níveis 1-2-3, locatários (inclui restaurantes), proprietário, vigilância sanitária

### Estrutura padrão de cada procedimento

Gatilho e sinais → **contenção imediata** (o que fechar, o que isolar) → escalonamento por função (nível 1, 2, 3, fornecedores) → ramos por configuração → coleta de evidências (amostras antes de qualquer descarga, fotos, linha do tempo) → comunicação → condição de retorno à normalidade (causa eliminada, limpeza, nova análise) → registro → como prevenir.

### O que o cenário 1 precisa conter no mínimo (lições do episódio 2)

- **Reposição manual segura** do circuito de água gelada e da torre: por tanque ou funil com folga de ar (separação atmosférica), **nunca mangueira direta**; limite de tempo; quem autoriza.
- **Regra de desconexão** e registro de **quem, quando e quanto** repôs.
- **Verificação de pressão relativa** entre o circuito e o potável antes de qualquer ligação.
- **Reposição de água do circuito como indicador** (litros por dia): um aumento indica vazamento antes da improvisação.
- Ramo para **reúso × potável**, para **incêndio × potável** e para **trocador de calor de parede única**.
- Contenção para o ocupante: **suspender o consumo** nos andares afetados, comunicar por escrito, coletar amostras antes de descarga, **FISPQ dos produtos** do tratamento, só liberar após causa eliminada, limpeza, desinfecção e nova análise conforme.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Fonte editável do modelo | **Markdown** neste branch | Versionável, o Claude edita direto, o histórico git guarda o porquê de cada mudança; o usuário é o único com Claude Code |
| Fluxogramas | **Mermaid** no Markdown, exportado para **PDF** (1 página, A3 e A4) | Também versionável, sem ferramenta nova; a ronda recebe papel e PDF |
| Procedimentos entregues | **Word** e **PDF** gerados do Markdown, **no padrão visual da DF Síndicos** (`entregas/plano-contingencia-agua/identidade/`) | A equipe e as administradoras abrem Word/PDF, não GitHub; o padrão da DF foi pedido pelo usuário em 2026-10-02 |
| Planilha-mestre (ficha) | **Excel (.xlsx)** no OneDrive, com abas: catálogo, ficha, matriz sistema × cenário, manutenção por família, fornecedores | O usuário já usa Microsoft 365 e o OneDrive; colunas estruturadas permitem gerar o dossiê depois |
| Dossiê por condomínio (v2) | **PDF** gerado da planilha | Mostrável ao proprietário |
| Armazenamento de dados reais | **OneDrive** | Dados de condomínio não vão para o GitHub (preferência do usuário) |
| Registro dos fornecedores | **Relatório mensal que já existe** + checklist padrão anexado | Sem peça nova |

Restrição conhecida: o conector do Microsoft 365 lê arquivos **sem fórmulas** e grava no máximo **1 MB**. Por isso a fonte editável fica neste branch e o arquivo final é entregue ao usuário.

## Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Plano por **cenário** (contingência) e **família de sistema** (manutenção), ligados por matriz | Um procedimento por sistema (76+) | Impossível de manter; a ronda às 3h não acha nada no meio de tantos documentos |
| **Cenário 1 primeiro**, catálogo v2 em paralelo, piloto depois como validação (D1) | A: catálogo → ficha → cenários; C: piloto primeiro | O modelo genérico não precisa de prédio; o cenário 1 tem caso real e é a prioridade declarada ("o mais importante é ter o plano"); o catálogo v2 é pesquisa sem custo para o usuário; o piloto depende de arquivos que o usuário não sabe se consegue |
| Formatos: planilha-mestre + procedimento-modelo + fluxograma de 1 página (D2) | Os cinco formatos desde o início; só planilha e fluxograma | Dossiê é derivado; checklist de manutenção vira aba, não formato separado |
| Detecção: **ronda com torneira sentinela + corante como traçador** (D3) | Sensores em todos os pontos | Sem verba; o corante já existe na água gelada e já denunciou os dois episódios. Sensor só onde já há BMS |
| Registro: **checklist padrão no relatório mensal dos fornecedores** (D4) | Registro único novo alimentado à mão | Não cria tarefa nova; um desvio pode levar 30 dias para aparecer, então se **pede** cadência semanal nos itens críticos |
| **Autovistoria guiada** pelas equipes residentes (D5′) | Vistoria por consultor externo | Sem verba. A autovistoria não certifica teste de antirretorno: esses casos escalam ao síndico |
| Modelo **neste branch**, fichas no **OneDrive**, sem repositório novo (D6) | Tudo no OneDrive; repositório próprio para o modelo | A fonte editável fica onde o Claude trabalha; o histórico guarda o porquê; a equipe recebe arquivos; dado real fica fora do GitHub; reversível |
| **"Não sei" = "não tem"** nos ramos | "Não sei" como pendência neutra | Os dois episódios vieram de pontos que ninguém sabia que existiam |

## Riscos

- **Plano tratado como substituto de engenharia.** Mitigação: aviso explícito em todos os documentos e revisão do cenário 1 por responsável técnico habilitado, a critério do usuário e do síndico (o consultor que já é contratado caso a caso).
- **Referências normativas desatualizadas.** Só NBR 5626:2020, NBR 16783:2019 e Portaria GM/MS 888/2021 tiveram existência e escopo conferidos; as demais (◻ no catálogo) precisam ter a versão vigente e a exigência local conferidas antes de virar exigência no procedimento.
- **Autovistoria sem competência técnica** gerando falsa segurança. Mitigação: o checklist só pede o que se enxerga e marca "escalar ao síndico" para o que exige profissional.
- **Procedimento não usado ou desatualizado.** Mitigação: fluxograma de 1 página na ronda, revisão após cada incidente, histórico git do porquê.
- **Administradoras não aceitarem o checklist ou a cadência semanal.** Mitigação: são pedidos, não exigências; começar pelo relatório mensal que já existe.
- **Piloto sem arquivos.** Mitigação: o cenário 1 e o catálogo v2 não dependem dele; a alternativa é a entrevista guiada por áudio sobre o catálogo (S/N/?).
- **Vazamento de dado de condomínio para o GitHub.** Mitigação: só o modelo genérico entra neste branch; fichas ficam no OneDrive; a sessão não commita arquivos do usuário.
- **Cenário condicional virar labirinto.** Mitigação: no máximo dois níveis de ramo por cenário; fluxograma de 1 página.
- **Risco sanitário em curso no prédio** (episódio 2 sem ficar totalmente fechado). O kit não substitui a contenção, a coleta e a análise que o síndico e o consultor decidem.

## Critério de pronto (v1)

- [x] Catálogo v2 publicado (rascunho, 195 itens), com mecanismo de falha e referência por item, e referências ◻ marcadas como "a confirmar" — **falta a revisão por responsável técnico das referências**
- [x] Cenário 1 completo (v0.1): procedimento, fluxograma de 1 página (A3 e A4) e checklist de autovistoria dos 5 tipos de ponto
- [ ] Cenário 1 revisado por responsável técnico habilitado (a critério do síndico)
- [x] Os demais cenários com procedimento e fluxograma — **feitos (rascunho): 2 a 9 e T (comunicação de crise)**; falta a revisão técnica
- [x] Planilha-mestre (em branco, rascunho) com as abas: catálogo, ficha, matriz sistema × cenário, manutenção por família, contatos e fornecedores, autovistoria, incidentes e resumo
- [x] Checklist padrão do relatório mensal dos fornecedores pronto para a administradora (rascunho)
- [x] Checklist de ronda com torneira sentinela pronto (rascunho)
- [ ] Piloto: ficha de **um** condomínio preenchida e o cenário 1 conferido contra ela (testa se teria apontado os dois episódios)
- [ ] Nenhum dado real de condomínio no GitHub

## Fora do escopo mas mapeado (v2+)

- Dossiê por condomínio gerado da planilha
- Simulados e treinamento da equipe de ronda nos cenários
- Sensores (condutividade, cloro, nível, fluxo reverso na reposição) onde houver BMS, e hidrômetro na reposição dos circuitos
- Projeto físico de reposição com dispositivo antirretorno ou separação atmosférica permanente (exige verba e engenharia)
- Registro único integrado ao Monday ou a outro sistema
- Auditoria periódica da ficha e dos relatórios dos fornecedores

## Continuidade (o repositório não tem CLAUDE.md próprio)

Qualquer sessão que continuar este projeto começa lendo, nesta ordem: `MEMORY.md` de `main` (catálogo), esta spec, `sessoes/S-001-apresentacao-e-rodada-1.md`, `sessoes/S-002-rodada-2.md` e `entregas/catalogo-sistemas-de-agua.md`. Ordem de produção: **(1)** cenário 1; **(2)** catálogo v2, em paralelo; **(3)** planilha-mestre e os demais cenários, por ordem de risco; **(4)** piloto. Os arquivos produzidos vão para `entregas/plano-contingencia-agua/`. Idioma: português do Brasil.

## Referências

- ABNT NBR 5626:2020 — Sistemas prediais de água fria e água quente
- ABNT NBR 16783:2019 — Uso de fontes alternativas de água não potável em edificações
- Portaria GM/MS nº 888/2021 — controle e vigilância da qualidade da água para consumo humano
- Demais normas e leis: ver o catálogo, marcadas ◻ (a confirmar)
