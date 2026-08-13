# Catálogo de produtos de impressão 3D

**Origem:** P-001
**Status:** fechado
**Repositório:** https://github.com/caiogavioli/catalogo-produtos-3d

## Problema que resolve
O usuário imprime produtos em 3D e tem os modelos organizados em pastas de
categoria dentro da própria conta no MakerWorld, mas não tem nenhum documento
apresentável para mostrar/vender esses produtos a clientes. Hoje a única
vitrine é um Instagram simples.

## Escopo da v1
Entra:
- Extração automática (raspagem) dos produtos da conta do usuário no
  MakerWorld: nome, descrição, tamanho e foto(s), organizados por categoria
  (pasta).
- Base intermediária (planilha/CSV) com esses dados, para o usuário revisar e
  cortar produtos que não quer manter no catálogo.
- Geração de PDF por categoria e de um PDF completo agrupando todas as
  categorias, com layout simples: foto(s), descrição e tamanho por produto.
- Execução sob demanda, local, pelo próprio usuário (sem servidor).

Não entra (por decisão consciente):
- Preço dos produtos.
- Loja online, checkout ou qualquer fluxo de venda.
- Integração com Instagram ou outras redes.
- Atualização automática/agendada — o usuário roda quando quiser atualizar.

## Usuários e uso
Só o próprio usuário abre e roda a ferramenta, sob demanda, quando quer gerar
ou atualizar o catálogo para enviar aos clientes via WhatsApp. Frequência
esperada: baixa (coleção estável, entra produto novo ocasionalmente).

## Arquitetura escolhida
1. Script de raspagem lê as pastas/categorias da conta do usuário no
   MakerWorld e extrai nome, descrição, tamanho e URL(s) de foto de cada
   produto.
2. Dados gravados numa planilha/CSV intermediária — fonte da verdade que o
   usuário audita e edita manualmente (corta produtos indesejados, ajusta
   texto).
3. Script de geração de PDF lê essa planilha/CSV + as fotos baixadas e monta:
   - um PDF por categoria;
   - um PDF completo com todas as categorias.
4. Tudo roda localmente, sem backend, sem banco de dados, sem hospedagem.

## Stack
| Camada | Escolha | Por quê |
|---|---|---|
| Raspagem | Script Python (ex.: requests/playwright) | MakerWorld não tem API pública; precisa ler a página da conta do usuário |
| Base de dados | Planilha/CSV | Fonte da verdade simples, editável à mão, sem infra |
| Geração de PDF | Script Python (ex.: reportlab/weasyprint) | Gera PDF por categoria e completo a partir do CSV + fotos, sem custo |
| Execução | Local, sob demanda | Sem servidor, sem custo mensal, mantido só pelo usuário |

## Decisões e trade-offs
| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Raspagem automática do MakerWorld | Preenchimento manual em planilha | Usuário aceitou o risco de manutenção do script para não ter trabalho manual de digitar ~1200 produtos no limite |
| PDF por categoria + PDF completo | Só um PDF geral | Facilita mandar pro cliente só a categoria que interessa |
| Sem preço na v1 | Catálogo com preço | Usuário decidiu não expor preço por enquanto |
| Script local | Ferramenta de design (Canva/Notion) | Volume grande de produtos torna manutenção manual inviável; geração automática escala melhor |

## Riscos
- MakerWorld não tem API pública oficial: a raspagem depende da estrutura
  atual da página e pode quebrar se o site mudar o layout. Manutenção
  ocasional do script é esperada, não é "configura uma vez e esquece".
- Raspagem pode esbarrar em termos de uso do site — validar durante o
  desenvolvimento se a extração é dos próprios dados da conta do usuário
  (uso pessoal) e não de dados de terceiros.
- Volume real de produtos desconhecido até a primeira raspagem (pode trazer
  itens demais); corte é manual na planilha.

## Critério de pronto (v1)
- [ ] Script de raspagem extrai nome, descrição, tamanho e foto(s) de todos
      os produtos das pastas de categoria da conta do usuário no MakerWorld,
      gravando numa planilha/CSV.
- [ ] Usuário consegue editar/remover linhas da planilha antes de gerar o PDF.
- [ ] Script gera um PDF por categoria com foto(s), descrição e tamanho de
      cada produto.
- [ ] Script gera um PDF completo agrupando todas as categorias.
- [ ] Processo documentado no README do repositório novo, para o usuário
      rodar sozinho quando quiser atualizar o catálogo.

## Fora do escopo mas mapeado (v2+)
- Preço por produto.
- Atualização automática/agendada da raspagem.
- Publicação do catálogo em outro canal além do PDF (site, loja online).
