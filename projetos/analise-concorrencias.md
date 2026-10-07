# analise-concorrencias

**Origem:** P-001 (branch `claude/zealous-davinci-3johdf`)
**Status:** spec da v1 escrita (2026-10-06) — **repositório ainda não criado**; nasce quando o usuário disser "fecha o projeto". Antes disso, piloto com casos reais.
**Repositório:** a definir (nome sugerido: `analise-concorrencias`, privado, sem nenhum dado de condomínio)

## Problema que resolve

O usuário (síndico profissional, DF Síndicos) assina ou recusa **de 38 a 59 concorrências por semana** (QCs/mapas de cotação, RFPs, BIDs) que as administradoras (CBRE, Cushman, Innova, HFlex) conduzem para os condomínios dele. Cada uma leva ~10 min; as críticas (obras, equipamentos, RFPs, acima de R$ 1 milhão) levam até 7 dias. Ele é auditado pelas regras do cliente (Brookfield: PRO-004, Matriz de Contratos, formulário CP.1–26). Se o mapa diverge da proposta ou algo não bate, **recusa a assinatura e devolve à administradora com o motivo**. Hoje ele colava prompts em outras IAs que "apenas apontavam os problemas".

## Escopo da v1

Entra:
- **Skill de análise** (instruções + modelos): o usuário manda os arquivos na conversa e recebe a análise.
- **Três camadas, nesta ordem:** (1) auditoria do mapa × propostas originais; (2) conformidade com as regras do cliente (CP.1–26 **e além**); (3) mérito (preço × custo-benefício × solução). Camadas 1 e 2 sempre completas; havendo bloqueante, a devolutiva lista **todos** os problemas das duas e o mérito fica "pendente até a reapresentação".
- **Três níveis:** Rápida · Padrão · Profunda (ver abaixo).
- **Saídas por análise:** relatório (um arquivo por análise), **devolutiva pronta** à administradora (texto copiável), **checklist CP.1–26 pré-preenchido com evidência** (o funcionário copia para o sistema de aprovações — sem integração).
- **Registro** em planilha no OneDrive: uma linha por concorrência, gravada em **todas**, inclusive as pequenas (alimenta CP.26 e "compara com a anterior").
- **Painel** (artefato privado) como extra: lista do período, veredito, nível, link do arquivo.
- **Regras do cliente em arquivo de referência**, com data da versão impressa em todo relatório.

Não entra (por decisão consciente):
- Integração com o `aprovacoes-contratos-concorrencia` (segue separado para não arriscar o que já funciona; integra-se só se este projeto der certo).
- Comparação de preços entre os 11 condomínios.
- Rascunho automático de e-mail no Outlook (v1 entrega o texto pronto; o envio é sempre do usuário).
- Relatório para proprietário/conselho no padrão DF (hoje o relatório é só para o usuário).
- Decidir por ele: o parecer é **recomendação**.

## Usuários e uso

Só o usuário abre a análise (só ele tem Claude Code pago); a equipe consome as saídas (arquivos no OneDrive, checklist CP). Todo dia útil, ~8 concorrências; as críticas sob demanda. Computador (suposição, não confirmada); o painel abre no celular.

## Os três níveis

| Nível | Quando | Entrega | Meta de leitura |
|---|---|---|---|
| **Rápida** | até R$ 5 mil e sem gatilho | 1 tela: veredito, bloqueantes, ressalvas, checklist CP pré-preenchido, devolutiva se for o caso | ≤ 3 min (hoje ~10) |
| **Padrão** | R$ 5 mil a R$ 30 mil | + equalização das propostas, custo total real, comparação item a item, riscos | ~5 min |
| **Profunda** | > R$ 30 mil, obra, equipamento, RFP | relatório completo (o prompt 3.0 melhorado): conformidade, validação matemática, projeção 12/24/36 meses com reajuste, seguro, riscos, SWOT/GUT só quando servirem, pontos de negociação, condições para assinar | sob demanda |

**Gatilhos que sobem o nível sozinhos:** cotação única acima de R$ 5 mil; divergência de valor/quantidade/modelo entre mapa e proposta; vencedor ≠ menor preço; CNPJ ou dado do fornecedor ilegível; suspeita de fatiamento (CP.26). O usuário força com "modo: profundo".

## Regras de devolução, item a item (decididas em 2026-10-07, `sessoes/S-004-regras-de-devolucao.md`)

A regra simples da primeira versão ("BGRE com Não = bloqueante") foi **substituída**: o usuário achou dura demais e definiu, pergunta por pergunta, o que devolve, o que pede análise antes e o que é só ressalva. O texto exato, com as palavras dele, está na S-004. Resumo:

| Item | Devolve | Analisa antes | Ressalva (nunca devolve) |
|---|---|---|---|
| CP.1 Mínimo de propostas | Sem justificativa no mapa | Com justificativa: convence? | |
| CP.2 Preenchimento do QC | Mapa sem itens que não dá para equalizar | Campo vazio é crítico? Justificativa genérica? Dá para equalizar pelas propostas? | |
| CP.3 Papel timbrado | CNPJ ausente em todo lugar | CNPJ pode estar no mapa | Endereço e telefone (site, redes e CNPJ bastam); timbre vale com dados do fornecedor |
| CP.4 Produto ou Serviço | | | Classificação errada: refaz pelo correto (Serviço + Produto = Serviço) |
| CP.5 Detalhe do produto | Caso extremo (ex.: sifão de plástico × de ferro) | Equivalência funcional; dá para inferir? | Marca diferente: só aponta |
| CP.6 a CP.7 Prazo de entrega e garantia do produto | | | Todos os casos, inclusive divergência entre mapa e proposta |
| CP.8 e CP.17 Validade | Vencida sem reconfirmação | Vencida com reconfirmação cobre valor e data? Validade do mapa diferente da proposta | Sem validade (vale 6 meses fictícios, confirmado pelo Compliance da BGRE); concorrente vencida com a vencedora ok |
| CP.9 a CP.16 (metodologia, ART, SSMA, TST, custos abertos, exclusões, cronograma, garantia do serviço) | | | Sempre ressalva |
| CP.18 Índice de reajuste | | | Fora de IGP-M e IPCA |
| CP.19 Seguro (Matriz de Contratos, p.2) | Sem seguro, ou declara não contemplar | | Seguro citado sem LMI ou com LMI abaixo da faixa; apólice global do fornecedor vale |
| CP.20 a CP.22 Alçada (régua do manual: R$ 5 mil e R$ 30 mil) | Etapa anterior à do usuário faltando; faixa de valor errada | | Cargo não identificável; fluxo em tramitação só informa |
| CAPEX | | | Sempre: "solicitar aprovação da BGRE antes de seguir" |
| Exceções (fornecedor exclusivo, emergencial) | Sem justificativa | | Sem aprovação prévia do Coordenador. Exclusividade por natureza: fornecedor já contratado pelo condomínio para o escopo, ou fabricante do sistema |
| CP.26 Não divisão (janela de 30 dias) | Claramente manobra (mesmo fornecedor, escopo e local, vários pedidos) | Análise aprofundada | Em dúvida: ressalva, indicando a possibilidade e questionando a administradora |

Itens que não estão acima ficam como ressalva ou observação. **Prioridade da análise: a proposta vencedora primeiro; se estiver em ordem, as concorrentes; se só as concorrentes falharem, ressalva.** O valor da compra nunca muda a regra. O relatório não menciona limitações de leitura (PDF, imagem, arquivo não lido): isso fica só no resumo do chat.

## Origem de cada item: política da BGRE × critério do usuário

O usuário avisou (2026-10-06) que **parte dos itens do formulário não é política da BGRE**: ele os criou para analisar as concorrências mais a fundo. A separação abaixo é **inferência do Claude** a partir de quais itens o manual `docs/manual-concorrencia.md` amarra a uma regra com fonte e quais não — **a confirmar com o usuário**.

| Origem | Itens | Evidência |
|---|---|---|
| **Política BGRE** (tem fonte no manual) | CP.1 mínimo de propostas (PRO-004 6.3.d/i) · CP.2 preenchimento do QC (6.4.b) · CP.3 papel timbrado (6.3.c) · CP.18 índice de reajuste e CP.19 seguro (Matriz de Contratos) · CP.20–22 alçada (6.5.a) · CP.24 CAPEX · CP.25 exceções · CP.26 não divisão (6.3.e) | Regra e fonte citadas no manual |
| **Critério do usuário** (sem fonte no manual) | CP.4 classificação · CP.5–CP.17: detalhamento, prazo de entrega, garantia, validade, metodologia, ART, SSMA, TST, custos abertos, exclusões, cronograma, garantia do serviço | Só "o que checar", sem regra nem fonte. Bate com o histórico: são justamente os itens que quase nunca causam recusa (1% a 6%) |

**Consequências no desenho:**
1. Todo achado sai com a etiqueta **[BGRE]** ou **[Critério próprio]**.
2. Na devolutiva à administradora, **só item [BGRE] cita procedimento e item** (ex.: "PRO-004, 6.3.c"). Item [Critério próprio] é pedido como exigência da análise do síndico, **nunca atribuído à política do cliente**.
3. Exposição de auditoria é diferente: dispensar um item [BGRE] precisa de justificativa registrada; dispensar um [Critério próprio] é decisão livre dele.
4. O que for [Critério próprio] tende a ser 🟡 ressalva; o que for [BGRE] e falhar tende a ser 🔴 bloqueante. A tabela de severidade será recalibrada no piloto com essa divisão.

## Aprendizados do piloto (2026-10-06, `sessoes/S-003-piloto-seis-casos.md`)

- **Alçada no iPMS:** corte de R$ 20 mil; até lá 4 etapas (Gestor, Regional, Síndico BackOffice, Síndico preposto), acima 5 (+ Diretor). O PRO-004 do manual usa R$ 5 mil e R$ 30 mil. O relatório lista os cargos de cada aprovação e diz qual régua aplicou.
- **Arquivos do mapa:** o mapa do iPMS lista os arquivos orçamentários. A skill compara com o que recebeu e pede o que falta.
- **Histórico:** a exportação do sistema de aprovações é insumo para CP.26 e para detectar o mesmo escopo aprovado antes. Anexar a cada lote até o registro no OneDrive existir.
- **Nível por valor e por tipo (aprovado pelo usuário):** commodity de preço unitário acima de R$ 30 mil vai para Padrão, não Profunda. Profunda = acima de R$ 30 mil de obra, equipamento ou RFP.
- **Mérito em Profunda (aprovado):** o mérito preliminar fica mesmo quando há bloqueante.
- **Onde ficam as análises:** OneDrive, pasta `Operacional\Claude\Análise de QCs`. Dados de condomínio e fornecedor nunca no GitHub.
- **Limite do conector:** o `sharepoint_upload_file` recebe o PDF como texto base64, e a transcrição confiável pelo Claude fica em torno de 13 mil caracteres por chamada. Por isso o relatório sai dividido em `_relatorio` e `_anexos` (e em `_parte1`/`_parte2` nos casos Profunda). A skill deve gerar PDFs pequenos (ReportLab, fontes padrão) e, quando possível, gravar por uma ferramenta que aceite arquivo, não texto.
- **Severidade:** sem régua por valor. A regra simples de 2026-10-06 foi substituída pelas regras item a item de 2026-10-07 (seção acima).
- **Achados novos que o checklist não pergunta:** validade do mapa × propostas, faturamento direto por terceiro, escopo menor na vencedora, valor da vencedora mudando no histórico, CNPJ ausente.
- **Citação:** sempre a página do PDF; toda "inconsistência" é revisada contra o contexto antes de entrar no relatório.

## Além do formulário (o que "análise completa" significa)

Conferir o que o checklist não pergunta: soma, fórmulas e células escondidas do xlsx; unidade e quantidade entre propostas; frete e impostos incluídos ou não; marcas equivalentes; datas incoerentes (proposta posterior ao mapa, mapa muito depois da validade); mesmo CNPJ, endereço, telefone ou layout entre "concorrentes"; preço muito abaixo da concorrência (inexequível, risco trabalhista em serviço contínuo); escopo e exclusões desiguais; cláusulas da Matriz de Contratos (multa, vigência ≤ 36 meses, reajuste, foro); compra recorrente que deveria ser contrato; justificativa quando o vencedor não é o menor preço. Preço × custo-benefício × solução: o relatório mostra o vencedor por valor **e**, quando divergir, o vencedor por custo-benefício, com a diferença em R$.

## O que se aproveita e o que se descarta dos quatro prompts

| Fica | Sai |
|---|---|
| Citação obrigatória de fonte (arquivo, página, item) | Placeholders (`[INSERIR OBJETIVO]`) e resíduo de interface ("Exportar / Copiar") |
| Validação matemática (unitário × quantidade × meses) | Mistura de português do Brasil e de Portugal |
| "Informação não apresentada" em vez de inventar | Pesos de nota fixos; o critério vem do pedido ("menor valor" por padrão) |
| BLUF: decisão primeiro | SWOT, GUT e 5W2H com responsável e prazo inventados em todo relatório |
| Parecer com estados claros | Perguntar contexto em toda análise: o contexto já é conhecido; só os gatilhos mudam |
| Modo essencial/completo | Um tamanho único exaustivo |

**Parecer:** 🟢 ASSINAR · 🟡 ASSINAR COM RESSALVAS · 🔴 DEVOLVER À ADMINISTRADORA · ⛔ NÃO CONTRATAR (nenhuma proposta atende). Sempre recomendação.

## Regras de entrada

1. **Arquivo anexado, nunca link.** Link de D4Sign, Echosign, Qualisign ou IPMS não abre. Vale qualquer plataforma: o que importa é o PDF baixado.
2. **Mapa em xlsx original**, quando existir. Só nele dá para conferir fórmula, soma e linha escondida. Se só houver PDF, o relatório declara "fórmulas não verificáveis".
3. **Escaneado ou foto é aceito.** Número lido de imagem sai marcado 📷 e é conferido por soma; o que for ilegível vira "pedir versão legível", nunca palpite.

## Registro (colunas)

ID · data da análise · condomínio · administradora · nº do QC · descrição · categoria · Produto/Serviço · faixa de alçada · valor total · fornecedores e valores (cotados) · vencedor do mapa · vencedor por valor · vencedor por custo-benefício · nível · gatilhos · bloqueantes · ressalvas · parecer · decisão do usuário · versão das regras do cliente · nome do arquivo do relatório.

## Arquitetura escolhida

```
usuário (sessão do dia, anexa os arquivos)
   └─ skill analise-concorrencias
        ├─ lê xlsx (fórmulas) e PDFs (nativo e escaneado)
        ├─ camadas 1 → 2 → (3) conforme nível e bloqueantes
        ├─ grava: relatório (1 arquivo) + linha no registro (OneDrive)
        └─ entrega no chat: veredito + devolutiva + checklist CP
painel (artefato privado, extra): lista do período a partir do registro
```
A sessão é efêmera: **a análise só conta como terminada depois que o relatório e a linha do registro foram gravados**.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Método | Skill (`SKILL.md` + modelos + regras do cliente em arquivo de referência) em repositório próprio privado | Custo extra zero; qualquer sessão aberta no repositório já sabe analisar; método versionado, sem dados |
| Relatório | **Um arquivo por análise** no OneDrive (formato padrão sugerido: PDF; a confirmar no piloto) | Escolha do usuário; a equipe também abre |
| Registro | Planilha no OneDrive, uma linha por concorrência | Já paga Microsoft 365; memória que sobrevive à sessão |
| Painel | Artefato privado, extra | Visão do período sem abrir arquivos; padrão do Flash Report |
| Leitura de arquivos | Anexo na conversa (xlsx com fórmulas, PDFs) | O conector Microsoft 365 lê anexo como texto, sem fórmulas |

## Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| 3 níveis amarrados às faixas da PRO-004 | 2 níveis (Tomás) | O valor já é o corte natural das alçadas; 59–61% das concorrências caem na Rápida |
| Um arquivo por análise; painel como extra | Painel único como casa principal (Rafael) | Escolha do usuário; a equipe abre arquivo no OneDrive |
| Camadas 1 e 2 completas antes de devolver; mérito pendente se houver bloqueante | Analisar tudo sempre | Administradora que erra em todos os pontos e recebe um problema por vez devolve três vezes |
| Registro em todas as concorrências, inclusive as pequenas | Registrar só Padrão e Profunda | O fatiamento (CP.26) mora nas compras pequenas |
| Skill em repositório próprio | Dentro do branch do Brainstorm; Projeto no claude.ai | Não mistura descoberta com uso diário; mantém conectores e painel que já rodam em sessões do Claude Code |
| Separado do `aprovacoes-contratos-concorrencia` na v1 | Integrar já | Evita risco ao sistema em produção; integra se o projeto funcionar |

## Riscos

- **Limite de uso do plano:** 40–60 análises por semana consomem a cota. A Rápida não pode ler 80 páginas para uma compra de R$ 2 mil.
- **Leitura de escaneado:** número errado em imagem de baixa qualidade. Mitigação: marca 📷, conferência por soma, "ilegível" nunca vira palpite.
- **Regras do cliente mudam** (procedimento revisado sem aviso): o relatório sai com a data da versão das regras; a atualização do arquivo é do usuário.
- **Gravar no OneDrive:** o conector grava arquivo de até 1 MB e a planilha precisa ser lida e reenviada inteira. A verificar no piloto; plano B: entregar o PDF no chat e o usuário salva.
- **Severidade mal calibrada:** devolver à toa irrita a administradora; deixar passar expõe o usuário na auditoria. Calibra no piloto com os casos reais.
- **Achado lateral (fora deste projeto):** nos dados do sistema de aprovações, ~67% dos QCs aprovados (321 de 482) têm ao menos uma resposta "Não" no checklist, e só ~12% têm "Observações e Evidências" preenchidas; 19 dos 31 recusados não têm motivo escrito. Parte pode ser explicada por "Exceções = Sim" (154), mas vale conferir antes de uma auditoria.

## Critério de pronto (v1)

- [ ] Piloto de 2 semanas com casos reais (ao menos uma Rápida, uma Padrão e uma Profunda).
- [ ] Leitura da Rápida em até ~3 min (hoje ~10).
- [ ] Nenhuma divergência mapa × proposta passando nos casos do piloto.
- [ ] Toda análise com relatório gravado e linha no registro.
- [ ] Devolutivas aceitas pela administradora sem pedido de esclarecimento.
- [x] Severidade simplificada e aprovada pelo usuário (2026-10-06).

## Fora do escopo mas mapeado (v2+)

- Integração com o `aprovacoes-contratos-concorrencia` (pré-preencher o formulário direto no sistema).
- Benchmark de preços de materiais recorrentes entre os 11 condomínios.
- Rascunho da devolutiva no Outlook.
- Relatório no padrão DF para proprietário ou conselho.
- Conferência de CNPJ em fonte pública.
