# S-002 — Rodada 2: decisão (análise de concorrências dos condomínios)

**Data:** 2026-10-06
**Problema:** P-001 — `problemas/P-001-analise-concorrencias-condominios.md`
**Fase:** 3 (Rodada 2 — propostas feitas, aguardando decisões do usuário)
**Insumo:** respostas da Rodada 1 em `sessoes/S-001-*.md` + manual do formulário CP.1–26 (lido em modo leitura do repositório `aprovacoes-contratos-concorrencia`).

## O que a Rodada 1 mudou

| Fato | Consequência |
|---|---|
| ~40 concorrências/semana (~8/dia), ~10 min cada ≈ **6h40/semana** só nas médias | O ganho está nas pequenas: nelas, 10 min → poucos minutos já devolve horas |
| A maioria < R$ 5 mil; poucas passam de R$ 1 mi e exigem análise "extremamente detalhada" | Um relatório único para tudo é errado nas duas pontas |
| Mapa ≠ proposta ⇒ **recusa de assinatura com o motivo** | A saída tem que incluir a **devolutiva pronta** para a administradora, não só o relatório para ele |
| Entrada: xlsx, PDF nativo e escaneado, e-mail; ~4 arquivos; plataformas de assinatura variadas e IPMS (CBRE) | Sempre arquivo anexado; link de plataforma não abre |
| A IA "apenas apontava os problemas"; quem decide é ele | Parecer é **recomendação**, nunca decisão |
| Critério padrão: melhor valor; às vezes melhor custo-benefício ou melhor solução | O relatório mostra os dois vencedores quando divergirem |
| Formulário do cliente (CP.1–26: mín. de propostas 1/3 em R$ 5 mil, alçadas até 5 mil / 30 mil / acima, seguro por faixa, reajuste IGP-M/IPCA, regra de não divisão) | Vira camada obrigatória; "análise completa" vai além dele |
| Segue separado do sistema de aprovações; integração só se funcionar | v1 não toca no `aprovacoes-contratos-concorrencia` |

**O que a análise cobre (3 camadas, nesta ordem):**

| Camada | O que confere | Resultado |
|---|---|---|
| 1. Auditoria do mapa | Mapa × propostas originais (valor, quantidade, unidade, frete/impostos, prazo, condições); soma e fórmulas do xlsx, células ocultas; equalização; validade; datas coerentes; fornecedor igual em mapa e proposta | Divergência = **devolver** |
| 2. Conformidade (cliente) | CP.1–26, Matriz de Contratos, alçadas e assinaturas, seguro, reajuste, não divisão (histórico), Capex/exceções | Checklist CP **pré-preenchido com evidência** |
| 3. Mérito | Preço × custo-benefício × solução, custo total real, escopo e exclusões, proposta suspeita (preço muito baixo, propostas "de cobertura", mesmo CNPJ/endereço/telefone entre concorrentes), cláusulas, negociação | Ranking e recomendação |

Gravidade em três classes: 🔴 **bloqueante** (devolver) · 🟡 **ressalva** (assina se corrigir ou justificar) · ⚪ **observação**.

## Marina — duas decisões

**D1. Ordem e parada.**
- **A)** Fazer as três camadas sempre. Custa tempo nas 40 por semana e gasta mérito num processo que volta.
- **B)** Camadas 1 e 2 sempre, completas. Se houver bloqueante, entregar a devolutiva com **todos** os problemas das duas camadas (não só o primeiro), pular o mérito e marcar "mérito pendente até a reapresentação". Falha: se quiser ver o mérito mesmo assim, tem que pedir.
- **Marina recomenda B.** Administradora que erra "em todos os pontos" e recebe um problema por vez devolve três vezes; cada volta custa dias.

**D2. Memória.**
- **A)** Sem memória; em revisão você anexa a análise anterior. Falha: a regra de não divisão (CP.26) e "compara com a anterior" ficam cegas — e o fatiamento mora justamente nas compras pequenas.
- **B)** Registro mínimo, uma linha por concorrência, numa planilha no OneDrive (ID, condomínio, administradora, categoria, fornecedores, valores, vencedor, nível, decisão, data).
- **C)** Mesmo registro no banco do painel (artefato).
- **Marina recomenda B, gravado em todas, inclusive as pequenas.** Sessão é efêmera: o que não for gravado no fim morre com o container. A análise só conta como terminada quando a linha foi gravada.

## Rafael — duas decisões

**D3. Níveis de profundidade.**
- **A)** 2 níveis (Rápida / Profunda).
- **B)** 3 níveis amarrados às faixas do cliente: **Rápida** (≤ R$ 5 mil): 1 tela com veredito, bloqueantes e checklist CP pré-preenchido, para ler em ~2 min · **Padrão** (R$ 5–30 mil): + equalização, custo total e riscos · **Profunda** (> R$ 30 mil, obra, equipamento, RFP): relatório completo (o prompt 3.0 melhorado), com reajuste projetado, seguro, negociação, SWOT/GUT só quando servirem.
- **Gatilhos que sobem o nível sozinhos:** cotação única acima de R$ 5 mil; divergência de valor mapa × proposta; vencedor ≠ menor preço; CNPJ ilegível; suspeita de fatiamento. Você também força com "modo: profundo".
- **Rafael recomenda B.** O valor já é o corte natural das alçadas do cliente.

**D4. Onde o relatório aparece.**
- **A)** Um artefato por concorrência. 40 por semana vira pilha; para a Rápida é peso demais.
- **B)** **Painel único** que se atualiza (mesmo desenho do Flash Report): uma linha por concorrência com veredito, clica e abre o relatório; só as Profundas ganham página própria. Falha: o painel cresce; arquiva por mês.
- **C)** Arquivos Word/PDF no padrão DF no OneDrive. Só vale quando o relatório for para proprietário ou conselho — hoje é só para você.
- **Rafael recomenda B**, com a **devolutiva pronta em texto copiável** e o **checklist CP pré-preenchido** que seu funcionário copia para o sistema de aprovações (sem integração, como você pediu).

## Tomás — duas decisões

**D5. Onde vive e como roda.**
- **A)** Uma **skill** (instruções + modelos dos 3 níveis + as regras do cliente como arquivo de referência, com a data da versão) num repositório próprio privado, sem dados. Qualquer sessão aberta nele já sabe analisar.
- **B)** Dentro deste branch do Brainstorm, sem repositório novo. Zero peça nova, mas mistura planejamento com uso diário, e a sessão tem que abrir neste branch.
- **C)** Projeto no claude.ai. Perde o encaixe com o painel e o OneDrive, que já rodam em sessões do Claude Code (Flash Report).
- **Tomás recomenda A.** Custo extra zero, mantém quem for você; o que quebra em 6 meses é a regra do cliente mudar — por isso o relatório sai com a data da versão das regras.
- **Uso:** uma sessão por dia, em lote (você junta as concorrências do dia e manda de uma vez). Um alerta: 40 análises por semana consomem o limite do plano; a Rápida não pode ler 80 páginas de PDF para uma compra de R$ 2 mil.

**D6. Regras de entrada.**
- Sempre **arquivo anexado**, nunca link de D4Sign/Echosign/IPMS (não abre) — PDF exportado, completo, com a trilha de assinaturas.
- O mapa em **xlsx original**, não o PDF dele: só assim dá para auditar fórmula e célula oculta.
- Escaneado: leitura visual; todo número lido de imagem vai marcado 📷 e conferido por soma; ilegível = "solicitar versão legível", **nunca chutar**.
- **Tomás recomenda** fixar isso como regra. Falha: dá trabalho de organizar o anexo, mas é o que evita um relatório com número errado.

## Onde as três discordam (decide o usuário)

1. **Níveis.** *Rafael:* 3 níveis, porque o valor já é o corte do cliente. *Tomás:* 2 níveis, porque três modelos são três coisas para manter.
2. **Onde o relatório mora.** *Rafael:* painel único. *Tomás:* um arquivo por análise no OneDrive, que a equipe também abre, mais a planilha-registro; o painel é peça extra.

Onde as três convergem (vão como recomendado, salvo objeção): D1 = B, D2 = B, D5 = A, D6 como acima, parecer só como recomendação.

## Recorte proposto

**Isto é 1 projeto, `analise-concorrencias` — documental, sem software e sem aplicativo:**
1. Skill de análise (método único, 3 níveis, citação obrigatória, conferência de conta, "informação não apresentada").
2. Modelos de saída: relatório por nível, devolutiva à administradora, checklist CP pré-preenchido.
3. Regras do cliente em arquivo de referência (PRO-004, Matriz de Contratos), com data de versão.
4. Registro (planilha no OneDrive) + painel.

**Rafael:** não é aplicativo — é um prompt bem escrito, uma planilha e um painel; se virasse sistema, seria o `aprovacoes` de novo. **Fica fora da v1:** integração com o `aprovacoes`, comparação de preços entre os 11 condomínios, rascunho automático no Outlook (só o texto pronto), relatório para proprietário/conselho no padrão DF.

**Critério de pronto proposto:** piloto de 2 semanas com casos reais; leitura da Rápida em até ~3 min (hoje ~10); nenhuma divergência mapa × proposta passando; toda análise gravada no registro; devolutivas aceitas pela administradora sem pedido de esclarecimento.

## Respostas do usuário

_Aguardando._
