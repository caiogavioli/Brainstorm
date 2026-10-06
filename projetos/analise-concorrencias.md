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

## Severidade (proposta inicial, a calibrar no piloto)

Calibrada pelo histórico de aprovações do usuário (ago–out/2026, ~510 QCs reais): quando a resposta é "Não", o QC foi recusado em **62% a 100% das alçadas incompletas (CP.21)**, 75% de QC mal preenchido (CP.2), 45% de falta de papel timbrado (CP.3), 14% de mínimo de propostas (CP.1) e de proposta vencida (CP.8), mas só 1–6% em garantia, prazo de entrega, exclusões, SSMA, TST e seguro.

| Classe | Itens |
|---|---|
| 🔴 **Bloqueante — devolver** | divergência mapa × proposta (valor, quantidade, unidade, modelo, fornecedor); alçada/assinaturas incompletas (CP.21); QC não preenchido (CP.2); proposta vencida sem reconfirmação (CP.8/17); sem proposta anexa; mínimo de propostas sem justificativa (CP.1); sem papel timbrado/CNPJ (CP.3); vencedor não identificado ou ≠ menor preço sem justificativa; CAPEX sem aprovação (CP.24); suspeita de divisão (CP.26) |
| 🟡 **Ressalva — assina se corrigir ou justificar** | garantia (CP.7/16); prazo de entrega (CP.6); lista de exclusões (CP.14); SSMA/TST/ART conforme tipo e valor (CP.10–12); seguro abaixo da faixa (CP.19); cronograma e custos abertos (CP.13/15); índice de reajuste (CP.18) |
| ⚪ **Observação** | melhoria sem risco de auditoria |

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
- [ ] Severidade calibrada contra os casos do piloto.

## Fora do escopo mas mapeado (v2+)

- Integração com o `aprovacoes-contratos-concorrencia` (pré-preencher o formulário direto no sistema).
- Benchmark de preços de materiais recorrentes entre os 11 condomínios.
- Rascunho da devolutiva no Outlook.
- Relatório no padrão DF para proprietário ou conselho.
- Conferência de CNPJ em fonte pública.
