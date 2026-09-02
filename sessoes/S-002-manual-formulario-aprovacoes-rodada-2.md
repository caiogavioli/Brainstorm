# S-002 — P-001, Rodada 2 (decisão)

**Data:** 2026-09-02
**Problema:** P-001 — Manual de preenchimento do formulário de aprovações
**Fase:** Rodada 2 — propostas e trade-offs

---

## Decisão 1 (Marina) — o que cada item do manual precisa ter

**A. Resumo temático** — um manual organizado por assunto (Due Diligence, minuta padrão, valores, prazos, assinatura...), como um resumo dos 5 procedimentos.
**B. Espelho pergunta a pergunta** — um manual organizado exatamente na ordem dos dois formulários (CT.1→CT.16, depois CP.1→CP.26), e para cada pergunta: o que ela verifica, o documento que comprova, a regra exata (valor, prazo, cláusula) e de qual procedimento ela vem, e o erro comum que já apareceu naquele ponto.

Resumo temático é mais fácil de escrever e fica mais curto, mas obriga o funcionário a **traduzir** cada pergunta do formulário para uma seção do manual toda vez que preenche — exatamente o atrito que ele já tem hoje com os PDFs originais. Espelhar pergunta a pergunta é mais longo (42 itens ao todo: 16 + 26), mas o funcionário abre o manual, vê "CT.12" e vai direto no manual em "CT.12" — sem busca, sem tradução.

**Recomendação da Marina: B.** O usuário confirmou que o funcionário consulta o manual **toda vez que preenche** (resposta 10) — isso só funciona bem se a estrutura do manual for a mesma estrutura do formulário que ele tem na tela.

## Decisão 2 (Rafael) — este manual vira um projeto novo com repositório próprio?

**A. Repositório novo e dedicado**, seguindo o fluxo padrão deste Brainstorm (passo 5 do `CLAUDE.md`): spec aqui, repo novo no GitHub só para o manual.
**B. Documento dentro do repositório que já existe** — `caiogavioli/aprovacoes-contratos-concorrencia`, o próprio sistema que o manual documenta. Fonte em Markdown num diretório `docs/`, PDF exportado a partir dela.
**C. Só o PDF, entregue direto**, sem versionar em repositório nenhum.

Um repositório novo para um único documento é peça móvel sem função — não há código, não há deploy, nada que justifique um projeto próprio (e o próprio Tomás bateria nisso). Entregar só o PDF (C) resolve hoje, mas perde histórico e fica difícil de atualizar com precisão quando uma regra mudar — o próximo "manual v2" vira reescrever do zero. O manual documenta exatamente os checklists `CT.*`/`CP.*` que já vivem em código no repositório do sistema — colocá-lo lá (B) mantém as duas coisas juntas: se alguém mexer em `lib/checklists/contratos.ts`, o manual está a um diretório de distância, não num repositório à parte que ninguém lembra de abrir.

**Recomendação do Rafael: B, com o PDF publicado nas Releases do próprio repositório** (ou goo linkado de dentro do sistema). **Isto não é um projeto de software novo** — é documentação do sistema que já existe. Nenhum repositório novo precisa ser criado.

## Decisão 3 (Tomás) — granularidade: um PDF único ou dois PDFs separados

**A. Um PDF único**, com duas partes (Parte 1 — Contratos, Parte 2 — Quadro de Concorrência), sumário e uma seção comum na frente (o que é Due Diligence, o que é minuta padrão, o que é CGC x Contrato).
**B. Dois PDFs separados**, um por formulário, cada um autocontido (repete o que for preciso da seção comum em cada um).

Um PDF único evita repetir contexto comum duas vezes, mas o funcionário que só vai preencher o Quadro de Concorrência folheia um documento maior para achar sua parte. Dois PDFs são mais curtos e focados — abre o certo, vai direto — ao custo de alguma repetição da seção comum (que é pequena: 3-4 conceitos, não vale a pena poupar).

**Recomendação do Tomás: B, dois PDFs curtos.** Consulta acontece "várias vezes por dia" (resposta 7) — o tempo que se ganha abrindo o documento certo direto, várias vezes ao dia, paga a pequena repetição de conteúdo.

---

## Onde as personas convergem

Nenhuma divergência real entre elas desta vez — as três recomendações compõem um único desenho: dois manuais curtos (um por formulário), cada um espelhando a ordem exata das perguntas do formulário correspondente, com a regra e a fonte citadas em cada item, vivendo como Markdown dentro do repositório `aprovacoes-contratos-concorrencia` e exportados para PDF a partir dali.

## Recorte proposto

**Isto não é um projeto novo de software — não abre repositório no Brainstorm nem em lugar nenhum.** É um par de documentos (2 manuais em PDF, com fonte em Markdown) que vai morar dentro do repositório que já existe, `caiogavioli/aprovacoes-contratos-concorrencia`. A spec fechada deste problema, com o conteúdo completo dos dois manuais (todas as 42 perguntas, regra por regra, citando os procedimentos anexados), vai para `projetos/manual-preenchimento-aprovacoes.md` neste branch — e a partir dela os arquivos finais (Markdown + PDF) são escritos direto no repositório do sistema, com autorização do usuário para editar aquele repositório.

---

## Perguntas para o usuário fechar a Rodada 2

1. Confirma as três recomendações (B/B/B) — manual espelhando cada pergunta do formulário, vivendo dentro do repositório do sistema (não um repo novo), em dois PDFs separados?
2. Tudo bem eu escrever os manuais (Markdown + gerar PDF) direto no repositório `aprovacoes-contratos-concorrencia`, num diretório `docs/`?
3. "Como saberíamos que resolveu" (ficou em aberto no `problemas/P-001-*.md`): o critério de sucesso é reduzir os itens do checklist reprovados por **preenchimento** incorreto (não por reprovação legítima do processo de compra/contrato em si)? Ou você tem outro critério em mente?

---

## Estado

Rodada 2 aberta. Aguardando confirmação do usuário para fechar em `sessoes/S-003-manual-formulario-aprovacoes-decisao.md` e escrever a spec em `projetos/`.
