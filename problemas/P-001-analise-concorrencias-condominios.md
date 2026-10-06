# P-001 — Análise sistemática de concorrências, mapas de cotação, RFPs e BIDs feitos pelos condomínios

## Em uma frase
Vários processos de concorrência por semana (mapas de cotação, RFPs, BIDs conduzidos pelos condomínios) precisam ser analisados e virar um relatório completo para o síndico decidir — hoje isso é feito colando prompts em outras IAs.

> Atenção: **este é o lado do comprador.** O branch `claude/einstein-rfp-representante-condominial` é o lado oposto (a DF Síndicos *respondendo* a uma concorrência). Não é o mesmo problema.

## Como é hoje
Palavras do usuário: "no passado, fiz um prompt para realizar essa análise em outras IAs". Existem quatro versões desse prompt (ver `material/prompts-anteriores/`), da mais enxuta (2.0 executivo) à mais pesada (3.0 exaustivo para conselho), mais uma específica para propostas de fornecedores. Rotina (Rodada 1): as concorrências chegam em xlsx, PDF nativo e escaneado, e-mail (~4 arquivos); ele confere contra as regras do cliente (formulário CP.1–26) e, se mapa e proposta divergem ou algo não bate, **recusa a assinatura** e devolve à administradora com o motivo; senão aprova. Critério padrão é o melhor valor, mas pode aprovar o melhor custo-benefício ou a melhor solução. Detalhe em `sessoes/S-001` e `S-002`.

## Frequência e volume
- Acontece: ~40 por semana (~8 por dia), respondidas em geral no mesmo dia; as complexas levam até 7 dias
- Tempo gasto por vez: ~10 min em média; obras grandes, equipamentos e RFPs levam bem mais
- Volume: ~4 arquivos por concorrência (xlsx, PDF nativo e escaneado, e-mail), podendo ser mais; a maioria < R$ 5 mil, algumas passam de R$ 1 milhão

## Quem sofre
O usuário (síndico profissional, DF Síndicos) — é quem precisa decidir/assinar. Quem consome o relatório depois ainda a levantar.

## O que já foi tentado
Os quatro prompts acima, em outras IAs. O que deu certo e o que precisou ser consertado à mão: a levantar.

Leitura inicial dos prompts (do Claude, para guiar a Rodada 1 — não é decisão):
- Todos pressupõem **propostas de fornecedores** como entrada. Nenhum trata o **mapa de cotação feito pelo condomínio/administradora** como objeto a ser auditado (o mapa reflete as propostas? as propostas foram equalizadas? tem mínimo de cotações? o escolhido é coerente com o critério?).
- Três tamanhos diferentes de relatório (BLUF curto, completo, exaustivo) sem regra de quando usar cada um.
- Boa ideia recorrente: citação obrigatória de fonte (documento, página), validação matemática (unitário × quantidade × meses), "informação não apresentada" em vez de inventar.
- Ruído: placeholders (`[INSERIR OBJETIVO]`), resíduo de interface ("Exportar / Copiar"), mistura de português do Brasil e de Portugal, pesos de nota fixos sem relação com o critério de cada condomínio.

## Como saberíamos que resolveu
A definir na Rodada 2. Hipótese de trabalho: o usuário envia os arquivos de uma concorrência numa conversa e recebe o relatório sem precisar colar prompt nem corrigir conta.

## Restrições conhecidas
- Os arquivos (propostas, mapas, contratos) têm dados de condomínio e fornecedores: **nunca no GitHub**.
- Só o usuário tem Claude Code pago; a equipe (4 pessoas) consome saídas (preferência registrada em `MEMORY.md`).
- Já existe o sistema `caiogavioli/aprovacoes-contratos-concorrencia` (checklist antes de assinar contratos e quadros de concorrência dos 11 condomínios) — relação com este problema a esclarecer.
- Já existe padrão de relatório com apontamentos + matriz de riscos para previsões orçamentárias (`analise-previsao-orcamentaria`) — possível reaproveitamento a avaliar.
