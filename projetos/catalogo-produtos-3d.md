# CMG3D — Catálogo de produtos de impressão 3D

**Origem:** P-001
**Status:** fechado (v2 — revisado após primeiro fechamento)
**Repositório:** https://github.com/caiogavioli/catalogo-produtos-3d

## Histórico da decisão
v1 (2026-08-13) fechou como script local Python (raspagem MakerWorld → CSV →
PDF por categoria + completo, para envio via WhatsApp). Antes de qualquer
implementação, o usuário trouxe uma ideia melhor — site com login para
gerenciar e link público para compartilhar — e o time reabriu a Rodada 2.
Este documento substitui a v1 por inteiro.

## Problema que resolve
O usuário imprime produtos em 3D e tem os modelos organizados em pastas de
categoria dentro da própria conta no MakerWorld, mas não tem nenhuma vitrine
apresentável para mostrar/vender esses produtos a clientes. Hoje a única
vitrine é um Instagram simples.

## Escopo da v1 (revisada)
Entra:
- **Catálogo público**: página web sem login, navegação por categoria,
  visual "vitrine" na identidade da marca CMG3D (roxo/metálico, moderno).
  Cada produto mostra foto(s), nome, descrição, tamanho e preço (preço pode
  ficar em branco).
- **Área administrativa**: login para duas pessoas (usuário + esposa), mesma
  permissão para ambos (cadastrar, editar e excluir produtos e categorias).
- **Página de cores disponíveis**: lista geral de cores que a impressora
  aceita, independente de produto — não é atributo por item.
- **Raspagem do MakerWorld** para popular os produtos inicialmente (nome,
  descrição, tamanho, foto, categoria); edição posterior é manual, pelo
  painel admin.
- Link público compartilhável (ex.: enviado por WhatsApp) em vez de PDF.

Não entra (por decisão consciente):
- Geração de PDF — descontinuada nesta revisão; o link do site substitui.
- Checkout, pagamento ou qualquer fluxo de venda — o site é vitrine, não loja.
- Domínio próprio pago — usa domínio grátis do provedor de hospedagem.
- Atualização automática/agendada da raspagem — sempre disparada manualmente.

## Usuários e uso
- **Usuário e esposa**: acessam a área admin com login, cadastram/editam
  produtos e categorias. Frequência baixa (coleção estável, produto novo
  entra sob demanda).
- **Clientes**: acessam o catálogo público pelo link, sem login, para ver os
  produtos disponíveis e decidir o que encomendar.

## Arquitetura escolhida
1. Script/rotina de raspagem lê as pastas/categorias da conta do usuário no
   MakerWorld e grava produtos (nome, descrição, tamanho, foto, categoria)
   no banco de dados do site.
2. Banco de dados (Supabase) guarda produtos, categorias, cores disponíveis
   e usuários admin.
3. Autenticação (Supabase Auth) protege a área administrativa; usuário e
   esposa têm a mesma permissão (acesso total de CRUD).
4. Frontend (Next.js) renderiza:
   - o catálogo público, por categoria, com o visual de marca;
   - o painel admin, atrás de login, para cadastro/edição/remoção.
5. Hospedagem no Vercel, domínio gratuito `*.vercel.app`.

## Stack
| Camada | Escolha | Por quê |
|---|---|---|
| Frontend/site | Next.js | Combina bem com Vercel, suporta páginas públicas + área logada no mesmo projeto |
| Hospedagem | Vercel | Camada gratuita cobre esse volume; domínio `.vercel.app` grátis, sem servidor para o usuário administrar |
| Banco de dados + Auth + Storage | Supabase | Grátis no volume esperado; resolve banco, login de dois usuários e armazenamento de fotos numa peça só |
| Raspagem inicial | Script (Python ou Node) contra o MakerWorld | MakerWorld não tem API pública; roda sob demanda para popular/atualizar o banco |

## Decisões e trade-offs
| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Site com login + catálogo público | Script local gerando PDF (v1) | Usuário quer acesso compartilhado (ele + esposa) e link para enviar a clientes; PDF não atendia isso bem |
| Preço visível, campo opcional | Sem preço | Usuário decidiu mostrar preço, podendo deixar em branco por produto |
| Raspagem do MakerWorld mantida | Cadastro 100% manual pelo site | Time recomendou manter a raspagem para não obrigar digitação de centenas de produtos; site cobre a manutenção manual depois |
| Cores como página separada, não campo por produto | Cor como atributo de cada produto | Qualquer peça pode ser impressa em qualquer cor disponível; não é característica fixa do item |
| Hospedagem gratuita (Vercel + Supabase), sem domínio próprio | Domínio pago | Usuário confirmou que domínio 100% grátis é aceitável |
| Mesma permissão para os dois usuários admin | Papéis diferentes (ex. um só visualiza) | Usuário confirmou que ambos precisam do mesmo nível de acesso |

## Riscos
- MakerWorld não tem API pública oficial: a raspagem depende da estrutura
  atual da página e pode quebrar se o site mudar o layout.
- Camadas gratuitas (Vercel/Supabase) têm limites de uso; improvável de
  estourar no volume esperado, mas vale monitorar se o catálogo crescer
  muito ou receber tráfego alto.
- Autenticação e hospedagem introduzem peças que podem falhar (login fora do
  ar, build quebrado) — mais superfície de manutenção que um script local,
  ainda que sem custo.
- Identidade visual definida pelo logo enviado (CMG3D, roxo/metálico); ainda
  não há paleta de cores exata nem tipografia formalizada — a levantar na
  implementação.

## Critério de pronto (v1)
- [ ] Catálogo público no ar, navegável por categoria, com visual alinhado à
      marca CMG3D.
- [ ] Produto exibe foto(s), nome, descrição, tamanho e preço (podendo ficar
      em branco).
- [ ] Página de cores disponíveis, independente de produto.
- [ ] Login funcional para dois usuários (mesma permissão), protegendo a
      área administrativa.
- [ ] Painel admin permite cadastrar, editar e excluir produtos e categorias.
- [ ] Raspagem do MakerWorld popula o banco de produtos inicialmente.
- [ ] Site hospedado no Vercel, acessível por link público gratuito.

## Fora do escopo mas mapeado (v2+)
- Domínio próprio pago.
- Checkout/venda dentro do site.
- Atualização automática/agendada da raspagem.
- Geração de PDF (pode voltar se surgir necessidade específica).
