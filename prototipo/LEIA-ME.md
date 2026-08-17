# Protótipo navegável do módulo de orçamentos

`orcamentos.html` é um arquivo único, sem dependências: abra no navegador e
navegue. Dados de exemplo em memória, sem login, sem banco e sem envio de
e-mail.

Serve para **avaliar o fluxo antes de construí-lo**. Por isso ele cobre também
as telas que ainda não existem no código — a de envio (fase 3), a página que o
cliente vê ao abrir o link (fase 4) e a linha do tempo com as pendências
(fase 5). Elas aparecem marcadas como "a construir".

Não é o sistema: é a maquete dele. As telas já implementadas (painel, editor,
detalhe, clientes, catálogo) vivem em `src/app/(app)/`, e o protótipo pode ficar
para trás conforme o código andar. O desenho de referência está em
`PLANO-ORCAMENTOS.md`.

Os cálculos de dinheiro repetem a regra de `src/lib/dinheiro.ts` — centavos
inteiros, quantidade em milésimos, arredondamento por linha — porque é
justamente o total que se confere numa maquete de orçamento.
