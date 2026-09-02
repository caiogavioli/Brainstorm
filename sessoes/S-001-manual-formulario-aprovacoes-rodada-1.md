# S-001 — P-001, Rodada 1 (entendimento)

**Data:** 2026-09-02
**Problema:** P-001 — Manual de preenchimento do formulário de aprovações
**Fase:** Rodada 1 — perguntas de entendimento

---

## Apresentação do usuário (palavras dele)

> sou auditado para atender todas as regras do meu cliente, que estão nos arquivos anexos (procedimentos). para isso, a administradora faz o trabalho, e eu aprovo (assino contratos e quadros de concorrencia). fiz aquele sistema de aprovações, o qual tem um formulário para meu funcionário preencher a cada aprovação que for fazer. mas, senti falta de um manual/procedimento para o preenchimento daqueles formulários. por favor crie um manual para orientar meu funcionário. use o brainstorm para criar esse projeto

Anexou 5 documentos do cliente (Brookfield Properties): Procedimento de Contas a Pagar, Procedimento de Elaboração e Gestão de Contratos, Procedimento de Gestão de Compras, Matriz de Contratos, e a Apresentação de Treinamento de Compliance (Out/24). Ver leitura deles em `problemas/P-001-manual-formulario-aprovacoes.md`.

---

## Perguntas — Marina (backend, dados e integrações)

Ela quer saber onde o dado nasce e o que acontece quando ele chega errado ou incompleto.

1. O "sistema de aprovações" é uma ferramenta própria sua (planilha, app, Power Automate, Microsoft Forms, Monday) ou é o nome que você dá ao processo de assinatura em si? Onde o funcionário efetivamente preenche isso hoje?
2. Quais campos existem no formulário hoje? Ele já pede o tipo de instrumento (CGC, Contrato, aditamento), valor, número de propostas — ou tem campo de texto livre onde o funcionário decide o que escrever?
3. De onde vem o que o funcionário digita — ele copia do Mapa de Cotação/minuta que a administradora manda, ou ele mesmo calcula (por exemplo, qual alçada se aplica, se precisa de Due Diligence)? Quando a administradora manda algo incompleto ou errado, o que acontece hoje?
4. O formulário roteia sozinho para os aprovadores certos conforme a alçada (você, síndico, gestor regional, diretor), ou o funcionário escolhe/indica quem aprova?
5. Hoje existe alguma validação automática (por exemplo, o sistema recusa um valor fora da alçada) ou tudo depende do funcionário aplicar a regra certa de cabeça?

## Perguntas — Rafael (produto e full-stack)

Ele quer saber quem usa isso, quantas vezes, e onde dói de verdade.

6. Quem é esse funcionário — é da sua equipe direta, alguém emprestado da administradora, um auxiliar do síndico? Ele já conhece os procedimentos de compliance ou está vendo isso pela primeira vez?
7. Quantas vezes por semana ou por mês ele preenche esse formulário? Aprovação de compra e aprovação de contrato têm volumes parecidos, ou uma é bem mais rara que a outra?
8. Me conta o último erro real de preenchimento — o que ele errou, como você descobriu (na hora de assinar? numa auditoria?) e o que precisou ser refeito?
9. O manual precisa ensinar só "como preencher o campo X do formulário", ou também a decisão por trás ("isso é CGC ou Contrato?", "essa compra precisa de 1 ou 3 propostas?", "essa alçada bate com esse valor?")? Se forem as duas coisas, qual dói mais hoje?
10. Você imagina esse manual como algo que ele consulta toda vez que vai preencher, ou algo que ele lê uma vez no treinamento e depois só volta quando erra?

## Perguntas — Tomás (infra, automação e custo)

Ele quer saber onde isso mora e quem cuida quando a regra do cliente mudar.

11. Onde esse manual vai viver — anexado/linkado dentro do próprio sistema de aprovações, PDF solto, documento entregue no treinamento do funcionário?
12. Os procedimentos do cliente têm histórico de revisão praticamente anual (contas a pagar e compras revisados em set/2024, contratos em jul/2024). Quem atualiza o manual quando a Brookfield revisar essas regras de novo, e como você fica sabendo que uma revisão aconteceu?
13. Você (ou um substituto seu) consegue manter esse manual sozinho, ou ele só se sustenta se alguém tecnicamente qualificado mexer nele?
14. Isso é para um funcionário/um condomínio só, ou você já pensa em reaproveitar o mesmo manual em mais de um ativo sob sua aprovação?

---

## Respostas do usuário

> 1) é uma ferramenta própria que desenvolvi com voce aqui no Claude. Isso é preenchido num site que criamos. 2) busque o projeto para verificar o questionário (são 2, 1 para contratos e outro para Quadros de concorrencia). 3) Vem dos mapas e contratos, depois da avaliação do meu funcionário. 4) o formulário é somente uma base para permitir a aprovação do meu funcionario no sistema da administradora (cada uma tem o seu sistema). 5) não, não existe. 6) equipe direta, a Controladoria. 7) varias vezes por dia. 8) valor da proposta diferente do valor do contrato, data de inicio posterior a data de assinatura. 9) As duas. as adminsitradoras erram em todos os pontos, não tem um erro mais comum. 10) ele consulta o manual toda vez. 11) num PDF solto. 12) não, são revisados pontualmente. 13) eu consigo 14) é para todos os condomínios da carteira

### O que a resposta 2 revelou

O "sistema de aprovações" é o repositório `caiogavioli/aprovacoes-contratos-concorrencia` (Next.js + Prisma + Postgres), já em produção, substituto de dois quadros do Monday.com. Adicionado a esta sessão e clonado para conferência. Ele tem **dois formulários**, cada um com um checklist fixo definido em código:

- **`/contratos/novo`** — checklist `CT.1` a `CT.16` (`lib/checklists/contratos.ts`), mais os campos livres Condomínio, Administradora, Fornecedor, Escopo do Contrato, Data da Análise, Exceção/Emergencial e Status (Aprovado/Recusado).
- **`/concorrencia/novo`** — checklist `CP.1` a `CP.26` (`lib/checklists/concorrencia.ts`), condicional: `CP.4` (Produto ou Serviço) muda o bloco de perguntas seguinte (`CP_PRODUTO` x `CP_SERVICO`), e `CP.20` (faixa de valor do QC: até R$5 mil / R$5 mil a R$30 mil / acima de R$30 mil) define qual pergunta de alçada (`CP.21`/`CP.21b`/`CP.22`) aparece. Mais os campos Condomínio, Administradora, Número do QC/Contrato, Descrição, Data da Análise, Exceções, Observações/Evidências, Anexos (link) e Status.

Cada pergunta do checklist é sim/não/não-se-aplica (ou sim/não) — o funcionário só marca; o formulário **não explica o que cada pergunta quer dizer, nem qual documento comprova, nem qual é a regra por trás**. É exatamente essa lacuna que gera o pedido do manual.

O README do repositório confirma o resposta 4: o resultado desse formulário (aprovado/recusado + respostas) é registrado para dashboard e histórico — **não é ele quem aprova de fato no sistema da administradora**, é um registro/checklist de conferência prévio à aprovação real.

Carteira (via `lib/options.ts`): 11 condomínios (17.007 Nações, Alphaville Tower, Arquipélago, Centenário Plaza, Extrema, JKB, Panamérica Park, Passeio Paulista, TNU, O Parque Geral, O Parque T07) e 4 administradoras (CBRE, Cushman, Innova, HFlex) — confirma a resposta 14 (vale para toda a carteira, várias administradoras, não só a Brookfield que assinou os procedimentos anexados).

---

## Estado

Rodada 1 fechada. Rodada 2 (decisão e propostas) em `sessoes/S-002-manual-formulario-aprovacoes-rodada-2.md`.
