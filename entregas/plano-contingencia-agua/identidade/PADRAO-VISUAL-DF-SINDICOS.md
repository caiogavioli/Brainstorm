# Padrão visual da DF Síndicos (aplicado ao plano-contingencia-agua)

**Origem:** extraído em 2026-10-02 do relatório *Blitz de Exaustão (BGRE)* em Word e da apresentação *Blitz de Exaustão* em PowerPoint, enviados pelo usuário como modelo. **Os originais não estão neste repositório**: contêm dados de condomínios e fotos. Aqui ficam só o logo e um modelo Word com estilos (sem corpo, sem imagens de condomínio).

## Arquivos desta pasta

| Arquivo | Para quê |
|---|---|
| `modelo-df-sindicos.docx` | Modelo Word **só com estilos** (Calibri, títulos, tabelas, listas, numeração) copiado do relatório da DF. Base para qualquer documento novo |
| `logo-df-sindicos-branco.png` | Logo DF Síndicos Profissionais, **branco com fundo transparente**: usar sobre azul-marinho |

## Paleta

| Uso | Cor |
|---|---|
| Azul-marinho do Word (títulos, cabeçalho de tabela) | `1F2A44` |
| Azul-marinho da apresentação (fundo de capa, títulos) | `14213D` |
| Azul-marinho mais claro (detalhes) | `1E2E52` |
| Destaque cobre (rótulos, acentos) | `B85C12` |
| Pêssego (rótulo sobre fundo escuro) | `F2C9A0` |
| Texto secundário | `4A5568` |
| Bege (cartões, divisórias) | `DCD8CE` (caixas de aviso usam o tom claro `EFEDE6`) |
| Azul acinzentado | `BFC8D6` |
| Vermelho de criticidade (texto/borda) | `7A2E1F`, com fundo `F4C7C3` |
| Lilás de status | `D9C7EC` |
| Fundo suave | `FBFBF8` |

## Word (relatórios e procedimentos)

- **A4**, margens de **2 cm** (inferior 1,8 cm). Retrato; **paisagem** só quando a tabela é larga (catálogo, autovistoria, pacote de revisão).
- **Calibri 10,5 pt**; parágrafo com 4 pt depois; entrelinha 1,15. Idioma pt-BR.
- **Títulos** Calibri negrito `1F2A44`: **H1 18 pt** (numerado à mão: "1. …"), **H2 13 pt**, **H3 11 pt**. Em Markdown, `##` vira H1, `###` vira H2.
- **Capa centralizada** (5 linhas em branco antes): título em maiúsculas 28 pt negrito → subtítulo do documento 20 pt negrito → linha 14 pt → "Aplicável a…" 11 pt → versão 10 pt → **"DF Síndicos Profissionais – Administração Condominial Especializada"** 11 pt negrito → nota de elaboração 9,5 pt. Quebra de página depois da capa; a capa **não tem rodapé**.
- **Tabelas** "Table Grid" (grade preta 0,5 pt), **cabeçalho `1F2A44` com texto branco negrito 8,5 pt**, células em 8,5 pt com 1 pt depois do parágrafo, cabeçalho repetido a cada página, linha sem quebra.
- **Caixas de aviso:** uma célula com fundo `EFEDE6` e filete esquerdo azul-marinho.
- **Listas:** estilo "List Bullet" do modelo; numeradas à mão com recuo deslocado.
- **Rodapé:** "DF Síndicos · Plano de Contingência da Água · <título>" à esquerda e "Página N" à direita, 8 pt `4A5568`.
- Legenda de foto: centralizada, 8,5 pt (não usada neste projeto: sem fotos).

## PowerPoint (apresentações, se forem pedidas)

16:9 (33,87 × 19,05 cm), **Arial**. Capa com fundo `14213D`, logo branco no canto superior esquerdo, rótulo em `F2C9A0` 13 pt negrito espaçado, título 54 pt branco negrito, subtítulo `BFC8D6` 15 pt. Slides internos: fundo branco, **rótulo `B85C12` 12 pt negrito espaçado**, título `14213D` 26 pt negrito, subtítulo `4A5568` 12,5 pt, cartões com cabeçalhos em maiúsculas, rodapé "DF SÍNDICOS · <assunto>" e número de página.

## Fluxogramas (A3 e A4, retrato)

Faixa superior `14213D` com o logo, rótulo "PLANO DE CONTINGÊNCIA DA ÁGUA · CENÁRIO N" em `F2C9A0` e título em branco; caixa de "REGRA DE OURO" em `F4C7C3` com borda `7A2E1F`; nós coloridos pela paleta (início `14213D`, perigo `F4C7C3`, ação `F2C9A0` com borda `B85C12`, ramos `DCD8CE`, passos `DDE3EC`, final `1E2E52`); fonte Arial (Liberation Sans no PDF).

## Planilha

Calibri; cabeçalho `1F2A44` com texto branco; barras de seção `DCD8CE`; células de preenchimento em pêssego claro `FBE8D3` com texto azul (convenção de entrada); abas em azul-marinho e cobre.

## Nomes de arquivo

`cenario-<nº>-<assunto>-<tipo>` (tipo: `procedimento`, `fluxograma-A3`, `fluxograma-A4`, `checklist-autovistoria`). Fontes editáveis em Markdown e Mermaid ficam no branch; Word e PDF são **gerados** a partir delas.

## Como regerar

O gerador (Python com `python-docx` sobre `modelo-df-sindicos.docx`; PDF por Chromium com a fonte Carlito, equivalente métrica do Calibri) **não está no repositório**, pela regra de não guardar código aqui. Pode ser recriado a partir desta especificação. Edite sempre o Markdown e regere; nunca edite o PDF.
