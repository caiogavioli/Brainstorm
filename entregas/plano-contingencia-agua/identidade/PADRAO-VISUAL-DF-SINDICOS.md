# Padrão visual da DF Síndicos (aplicado ao plano-contingencia-agua)

**Origem:** medido em 2026-10-02 nos dois relatórios-modelo enviados pelo usuário: *Relatório Consolidado — Sistemas de Exaustão (Blitz BGRE)* e *Relatório de Apuração de Ocorrência — Vazamento de Óleo Diesel (Passeio Paulista)*. **Os originais não estão neste repositório**: têm dados e fotos de condomínios. Aqui ficam só os logos e esta especificação.

A regra do usuário: **todos os documentos do plano, de qualquer tipo, devem parecer saídos do mesmo molde**, principalmente a **capa**.

## Arquivos desta pasta

| Arquivo | Uso |
|---|---|
| `logo-df-sindicos-colorido.png` | Logo oficial (quadrado azul `2F4162`, "Síndicos Profissionais" em dourado). PNG com fundo transparente, 1084 × 686. **Usar sobre branco**, na capa |
| `logo-df-sindicos-branco.png` | Versão branca com fundo transparente. Usar só sobre azul-marinho (apresentações) |

## Paleta (medida nos PDFs-modelo)

| Uso | Cor |
|---|---|
| Azul DF (títulos, números, cabeçalho de tabela) | `2F4162` |
| Texto corrido | `1F2A37` |
| Texto secundário, rótulos, rodapé | `5B6470` |
| Filete dourado (capa, rodapé, barra das chamadas) | `D1AE6E` |
| Rótulo dourado-escuro (acima do título de seção) | `9C7A35` |
| Fundo da faixa de indicadores e das chamadas suaves | `FAF8F3` |
| Borda de faixas e tabelas | `C9CCD3` |
| Zebra de tabela | `F5F5F5` |
| Etiqueta de status "em andamento" / rascunho | cobre `C25C26`, texto branco |
| Etiqueta de status "concluído" | verde `2E7D5C`, texto branco |
| Pontos de criticidade | vermelho `A83232`, cobre `C25C26`, azul `7D94B8`, verde `2E7D5C` |
| Mapa de calor | alta `2F4162`, média `7D94B8`, baixa `CCD6E3`, não se aplica `F2EDE6` |

## Tipografia

**Arial / Helvetica** em todos os documentos (Liberation Sans no PDF gerado aqui). Corpo **10 pt**, **justificado**, entrelinha **14,2 pt**, 6,5 pt entre parágrafos.

## Capa (idêntica nos dois modelos; todos os documentos usam)

1. **Logo colorido centralizado**, 87 pt de largura, no topo.
2. **Filete dourado** de 1,4 pt abaixo do logo.
3. **Título em duas linhas**, centralizado, **maiúsculas, 16,5 pt negrito azul**: linha 1 = tipo do documento (e número do cenário); linha 2 = assunto.
4. **Subtítulo** itálico 11 pt cinza: "Plano de Contingência, Manutenção e Monitoramento da Água · Versão 0.1".
5. **Etiqueta de status** centralizada, 188 × 24 pt, texto branco negrito 8,3 pt: **"RASCUNHO PARA REVISÃO TÉCNICA"** em cobre.
6. **Faixa de 3 indicadores**: fundo `FAF8F3`, borda `C9CCD3`; número em 17 pt negrito azul e rótulo em 7,2 pt maiúsculas cinza. Estende-se 10 pt além da margem do texto.
7. **Tabela de dados** (Documento, Aplicável a, Síndica profissional, Quem usa, Fluxograma, Material de apoio, Versão, Data de emissão): rótulo cinza negrito 9 pt, valor 9 pt, **zebra nas linhas ímpares**.
8. **Nota** itálica 8,6 pt cinza.
9. **Rodapé** em todas as páginas, inclusive a capa: filete dourado; à esquerda **"DF SÍNDICOS PROFISSIONAIS"** em negrito azul seguido de "· <documento> — Plano de Contingência da Água — Confidencial · www.dfsindicos.com.br" em itálico cinza (7,6 pt); à direita "Página N".

## Miolo

- A4 retrato (documentos largos: capa em retrato e miolo em paisagem). Margens de página 46 pt, mais 10 pt de recuo no texto; faixas, tabelas de dados e barras de chamada avançam esses 10 pt.
- **Rótulo** da seção em 7,6 pt negrito dourado-escuro, maiúsculas ("LEITURA INICIAL").
- **H1** 13,5 pt negrito azul, com **filete azul de 1 pt** embaixo. **H2** 11 pt negrito `1F2A37`. **H3** 10 pt negrito azul.
- **Chamada** (aviso, regra de ouro): **barra dourada de 2,6 pt** à esquerda; a primeira chamada de cada documento em 10,5 pt negrito azul justificado; as demais (modelos de texto) em fundo suave 9,5 pt.
- **Tabela de dados:** cabeçalho `2F4162` com texto branco negrito 7,8 pt; corpo 8,5 pt; grade `C9CCD3`; zebra nas linhas pares; primeira coluna em negrito azul; cabeçalho repetido a cada página.
- **Listas:** marcador em azul, texto justificado.

## Fluxogramas (A3 e A4, retrato)

Cabeçalho com o logo colorido à esquerda, rótulo dourado-escuro, título em maiúsculas azul e a etiqueta de rascunho em cobre à direita; filete dourado; caixa de "REGRA DE OURO" com barra vermelha `A83232`; nós coloridos pela paleta (início azul, perigo vermelho claro, ação cobre claro, ramos bege, passos azul claro, final verde); rodapé como nos documentos.

## Planilha

Arial; cabeçalho `2F4162` com texto branco; barras de seção `F2EDE6`; células de preenchimento em dourado claro `F6ECD3` com texto azul; abas em azul e cobre; logo na aba LEIAME.

## Apresentações (modelo BGRE, se forem pedidas)

16:9, Arial; capa em `14213D` com logo branco; rótulos em cobre `B85C12` espaçados; títulos 26 pt negrito; cartões com cabeçalhos em maiúsculas; rodapé "DF SÍNDICOS · assunto".

## Nomes de arquivo

`cenario-<nº>-<assunto>-<tipo>` (tipo: `procedimento`, `fluxograma-A3`, `fluxograma-A4`, `checklist-autovistoria`). As fontes (Markdown e Mermaid) ficam no branch; Word e PDF são **gerados**.

## Como regerar

O gerador (Python com `python-docx` e Chromium, fonte Liberation Sans no PDF) **não está no repositório**, pela regra de não guardar código aqui. Recrie a partir desta especificação. Edite sempre o Markdown e regere; nunca edite o PDF.
