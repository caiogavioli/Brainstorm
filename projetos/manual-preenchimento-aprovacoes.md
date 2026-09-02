# Manual de Preenchimento — Aprovação de Contratos e Quadro de Concorrência

**Origem:** P-001 (branch `claude/manual-formulario-aprovacoes-b7k2xr`)
**Status:** fechado — entregue direto, sem repositório novo
**Repositório:** não se aplica (ver "Onde vive", abaixo) — os arquivos finais estão em [`caiogavioli/aprovacoes-contratos-concorrencia`](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia), commit `94e59a7`

## Problema que resolve

O funcionário da Controladoria do usuário preenche, várias vezes por dia, dois formulários de conferência (Aprovação de Contratos e Aprovação de Quadro de Concorrência) antes de o usuário assinar contratos e quadros de concorrência da sua carteira de 11 condomínios. Cada formulário é um checklist de sim/não/não-se-aplica (CT.1–16 e CP.1–26) sem nenhuma explicação embutida — o funcionário respondia de cabeça, sem um guia do que cada pergunta realmente cobra nos 5 procedimentos de compliance do cliente (Brookfield Properties). Dois erros reais já apareceram por esse motivo: valor do contrato diferente da proposta vencedora (CT.12), e data de início de vigência anterior à data de assinatura (CT.13) — e, segundo o usuário, esses não são os únicos: as administradoras erram em qualquer ponto do checklist.

## Isto não é um projeto de software

Não há código, banco de dados ou deploy neste entregável — é documentação de um sistema que já existe (`aprovacoes-contratos-concorrencia`). Por isso não abre repositório novo, nem aqui no Brainstorm nem em outro lugar: os dois manuais vivem dentro do repositório do próprio sistema que documentam, como pediu o usuário na Rodada 2 (`sessoes/S-002-*.md`, decisão 2).

## Escopo

Entra:
- Dois manuais em Markdown + PDF, um por formulário, espelhando a ordem exata de cada checklist (CT.1→16, CP.1→26 incluindo a lógica condicional Produto×Serviço e a faixa de valor do QC).
- Para cada pergunta: o que ela verifica, o que checar nos documentos do processo, a regra exata com a fonte (procedimento + item), e o erro comum quando já identificado.
- Seção "antes do checklist" cobrindo os campos livres de cada formulário (Condomínio, Administradora, Fornecedor/Descrição, datas etc.).
- Glossário curto dos termos que se repetem (minuta padrão, CGC, QC/Mapa de Cotação, Due Diligence, Matriz de Contratos).

Não entra (por decisão consciente):
- Validação automática dentro do sistema (ex.: o formulário recusar um valor fora da alçada) — não foi pedido; o manual é a camada de instrução humana, não uma mudança de produto.
- Um manual único combinando os dois formulários — Tomás recomendou dois PDFs curtos e focados (Rodada 2, decisão 3), pela frequência de consulta (várias vezes por dia).
- CT.16 (Manual SSMA, Regras de Ouro, EPIs, APR) não tem, no manual, o detalhe do conteúdo desses documentos — não veio especificado em nenhum dos 5 procedimentos anexados nesta rodada. O manual sinaliza isso explicitamente e aponta para o Departamento de Compliance da Brookfield.

## Usuários e uso

O funcionário da Controladoria (equipe direta do usuário), várias vezes por dia, um condomínio/administradora por vez, consultando o manual do formulário que estiver preenchendo naquele momento — não é treinamento de uma vez só, é consulta recorrente.

## Onde vive

Dentro do repositório `caiogavioli/aprovacoes-contratos-concorrencia`, em `docs/`:
- `docs/manual-contratos.md` / `docs/manual-contratos.pdf`
- `docs/manual-concorrencia.md` / `docs/manual-concorrencia.pdf`

A fonte é o Markdown; o PDF é gerado a partir dela (`pandoc -f gfm-tex_math_dollars` + impressão para PDF via Chromium headless, CSS em `docs/manual-print.css`* — ver nota). Nunca editar o PDF diretamente.

\* O CSS de impressão usado para gerar os PDFs ficou no scratchpad desta sessão, não foi commitado no repositório do sistema — se o usuário for regenerar os PDFs no futuro (por exemplo, depois de editar o Markdown), qualquer CSS de impressão simples resolve; o essencial é rodar `pandoc` com `-f gfm-tex_math_dollars` (o "-tex_math_dollars" evita que o pandoc interprete "R$...R$" como fórmula matemática, o que é o principal jeito de dar errado aqui).

## Fontes usadas (procedimentos anexados nesta rodada)

| Documento | Código | Versão |
|---|---|---|
| Procedimento de Elaboração e Gestão de Contratos | PRO-003 | 01/2024 |
| Procedimento de Gestão de Compras | PRO-004 | 01/2024 |
| Procedimento de Contas a Pagar | PRO-005 | 01/2024 |
| Matriz de Contratos | — | — |
| Apresentação de Treinamento de Compliance | — | Out/2024 |

## Decisões e trade-offs (Rodada 2, `sessoes/S-002-*.md`)

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Manual espelha a ordem exata das perguntas do formulário | Resumo temático por assunto | O funcionário consulta a cada preenchimento (resposta 10, Rodada 1) — precisa achar "CT.12" direto, sem traduzir a pergunta do formulário para uma seção do manual. |
| Vive dentro do repositório `aprovacoes-contratos-concorrencia`, sem repositório novo | Repositório dedicado só para o manual / PDF solto sem versionamento | Documenta um sistema que já tem repositório próprio — repositório novo seria peça móvel sem função; PDF solto sem fonte versionada dificulta manter quando uma regra do cliente mudar. |
| Dois PDFs curtos, um por formulário | Um PDF único com duas partes | Consulta "várias vezes por dia" — abrir o documento certo direto paga a pequena repetição de conceitos comuns entre os dois. |

## Riscos

- CT.16 (documentação de SSMA) ficou com o conteúdo genérico, por falta de detalhe nos procedimentos anexados — se a Brookfield tiver um procedimento específico de SSMA, vale anexá-lo numa rodada futura para completar esse item.
- Os procedimentos do cliente são revisados pontualmente (resposta 12, Rodada 1), sem calendário fixo — não há alerta automático de quando um procedimento mudar; o usuário disse que consegue manter o manual sozinho, mas a atualização depende dele notar a revisão.

## Critério de pronto

- [x] Os dois manuais cobrem as 42 perguntas dos dois checklists (CT.1–16, CP.1–26 incluindo os itens condicionais), pergunta por pergunta.
- [x] Cada pergunta cita a regra exata e o procedimento/item de origem.
- [x] Os dois erros reais já identificados (CT.12, CT.13) estão destacados.
- [x] PDFs gerados e revisados visualmente (tabelas, listas numeradas e o texto com "R$" renderizando corretamente).
- [x] Markdown + PDF publicados em `caiogavioli/aprovacoes-contratos-concorrencia` (commit `94e59a7`).

## Fora do escopo mas mapeado (v2+)

- Detalhar CT.16 (SSMA) se a Brookfield disponibilizar o procedimento específico.
- Se o volume de erros de preenchimento continuar alto mesmo com o manual, considerar validação automática no próprio formulário (ex.: bloquear "Aprovado" com item "Não" sem justificativa) — mudança de produto, não de manual.
