# MEMORY.md

Estado vivo do brainstorming. Ler no início de cada sessão, atualizar ao fim de cada rodada ou decisão.

**Última atualização:** 2026-08-13

---

## Situação atual

Primeiro projeto fechado: catálogo de produtos de impressão 3D (P-001).
Spec revisada para v2 (site com login + catálogo público, marca CMG3D) antes
de qualquer implementação começar — v1 (PDF via script local) foi
descartada. Repositório e esqueleto atualizados para a v2. Site em
produção no Vercel (`catalogo-produtos-3d`), com catálogo público, área
admin, tema escuro roxo metálico, menu de categorias, busca,
ordenação/paginação, destaques na home, "mais vistos", cores por
produto — inclusive metálicas, com efeito de brilho — (círculos na
página do produto, não mais página separada) e contato via WhatsApp.
Ver "Em aberto" pros passos manuais que faltam pra tudo funcionar de
ponta a ponta.

## Problemas

| ID | Título | Fase | Desfecho |
|---|---|---|---|
| P-001 | Catálogo de produtos de impressão 3D (CMG3D) | fechado (v2) | virou repo `catalogo-produtos-3d` |

Fases: `apresentado` → `rodada 1` → `rodada 2` → `fechado` / `descartado` / `virou script`

## Projetos fechados

| Projeto | Origem | Repositório | Data |
|---|---|---|---|
| CMG3D — catálogo de produtos de impressão 3D (site) | P-001 | [caiogavioli/catalogo-produtos-3d](https://github.com/caiogavioli/catalogo-produtos-3d) | 2026-08-13 (v2) |

## Decisões sobre o processo

| Data | Decisão | Contexto |
|---|---|---|
| 2026-08-09 | Repositório dedicado só é criado no **passo 5**, mediante pedido explícito do usuário. Fim da Rodada 2 não dispara criação. | O usuário perguntou em que momento o repo nasce; alternativa considerada era criar já no fim da Rodada 1, descartada por gerar repositório vazio com nome provisório. |
| 2026-08-09 | Relação problema → repositório não é 1-para-1. O recorte sai da Rodada 2. | Problemas aparentemente separados costumam ser o mesmo sistema. |
| 2026-08-09 | Duas rodadas de perguntas, sem emendar. Rodada 1 = entendimento, Rodada 2 = decisão. | Formato pedido pelo usuário na abertura. |
| 2026-08-09 | Time fixo de três personas com vieses declarados: Marina (dados/integrações), Rafael (produto/recorte), Tomás (infra/custo). | Formato pedido pelo usuário. |
| 2026-08-13 | Repositórios novos nascem **privados** por padrão. | Confirmado no fechamento do P-001. |
| 2026-08-13 | O GitHub App conectado a este workspace **não consegue criar repositórios via API** (403 mesmo após ajuste de permissão pelo usuário). Fluxo que funciona: usuário cria o repo vazio manualmente (privado, com README) → Claude usa `add_repo`/clone local para subir o esqueleto. | Descoberto ao tentar `create_repository` no fechamento do P-001. |
| 2026-08-13 | Spec fechada pode ser revisada antes da implementação começar, sem reabrir as duas rodadas do zero — time analisa a ideia nova, propõe trade-offs e reescreve a spec (marcando "v2") se o usuário confirmar. | Usuário trouxe ideia de site com login logo depois do fechamento v1 do P-001; nenhuma linha de código do v1 tinha sido escrita ainda. |
| 2026-08-13 | P-001 v2: site com catálogo público + área admin (login para 2 usuários, mesma permissão), stack Next.js + Vercel + Supabase, tudo em camada gratuita. PDF saiu do escopo. | Usuário quer compartilhar link com clientes e gerenciar o catálogo junto com a esposa; time recomendou Supabase por resolver banco+auth+storage numa peça só. |

## Preferências do usuário observadas

- Idioma: português do Brasil.
- Quer clareza sobre **quando** cada artefato é criado — não gosta de passo implícito. Ser explícito sobre gatilhos.
- GitHub: conta `caiogavioli`. Repositório de brainstorming: `caiogavioli/Brainstorm`, branch de trabalho `claude/catalogo-produtos-3d-bm2dw2`.
- Modelos 3D do usuário ficam no **MakerWorld** (sem API pública), organizados em pastas de categoria dentro da conta dele.
- Marca: **CMG3D**. Logo enviado (roxo/metálico, tipografia bold angular,
  ilustração de família) — ainda não salvo no repositório do projeto porque
  chegou só inline no chat, não como arquivo; pedir para reenviar como
  anexo quando a implementação visual começar.
- Visual do site **mudou** em 2026-08-14: saiu do roxo/metálico original
  (herdado do logo) pra tema escuro "cinza chumbo", cartões com efeito
  vidro, fonte Inter, ícones Lucide, animações com Framer Motion — pedido
  explícito do usuário (colou um brief de design pronto, só quis aplicar
  em cima do catálogo existente, não trocar a estrutura por uma landing
  page nova). O acento chegou a ser cobre/laranja por algumas horas
  (interpretação errada do brief) mas **voltou pra roxo metálico** no
  mesmo dia, a pedido do usuário — essa é a cor da marca, fixa. Paleta
  exata pode mudar de novo quando o logo real virar arquivo.
- Visual **mudou de novo** em 2026-08-14 (mesmo dia, rodada de revisão
  completa pedida pelo usuário): pesquisa de mercado em catálogos de
  impressão 3D (MakerWorld, Printables, Bambu Store) apontou o roxo-sobre-
  preto-com-glass como clichê de SaaS genérico, não padrão do nicho.
  Usuário decidiu misturar as duas direções propostas — fundo carvão
  neutro sem glass, acento âmbar (funcional: preço/CTA) + ciano
  (estado ativo/selecionado), com o roxo metálico **não mais fixo em
  tudo**: agora reservado só pra 3 pontos de identidade (logo, selo
  "Destaque", indicador do carrossel). Decisão registrada porque muda a
  regra anterior ("roxo é a cor da marca, fixa em tudo").
- Essa tentativa (âmbar+ciano) **não agradou** — usuário pediu, ainda no
  mesmo dia, pra voltar tudo pro roxo. Regra fica **restabelecida**: roxo
  metálico é o acento único do site inteiro (preço, botões, links, foco,
  seleção — não só logo/detalhe). Único acréscimo aceito foi um cinza
  metálico (`steel-*`) como segunda voz discreta em texto técnico, não
  como acento novo. Lição pro futuro: não vale a pena propor trocar o
  acento principal de marca sem pedido explícito, mesmo com pesquisa de
  mercado favorável — a cor da marca é uma preferência fixa do usuário,
  não um parâmetro aberto a otimização.
- Catálogo vai crescer pra **centenas de produtos** (avisado em
  2026-08-14) — motivou adicionar paginação, ordenação e busca antes do
  que seria necessário só com os 8 produtos de exemplo atuais.
- WhatsApp da CMG3D (pro botão "Perguntar no WhatsApp" no site):
  `+55 11 98323-1173`.
- Domínio/hospedagem: aceita gratuito (`*.vercel.app`), sem precisar de
  domínio próprio pago.

## Em aberto

- Site `catalogo-produtos-3d` publicado na `main` do Vercel (time `DF`),
  sem PR (ninguém pediu). Cadastrado com 4 categorias e 8 produtos de
  exemplo (fotos placeholder) via SQL direto, só pra visualização — ainda
  precisa dos produtos e fotos reais, cadastrados pelo painel admin.
  Usuário confirmou ter configurado as env vars no Vercel, feito
  redeploy e já ter rodado `migration-destaques-busca.sql` **antes** do
  erro relatado — então a hipótese inicial (função de contagem de views
  faltando) **não era a causa real**. Causa raiz do erro ainda
  desconhecida; a correção defensiva (view count nunca derruba a página)
  foi mantida por ser boa prática de qualquer forma, mas não resolve o
  que causou o erro de fato. Se o erro persistir depois desta rodada,
  pedir print/texto exato — não há acesso a logs do Vercel nesta sessão
  pra diagnosticar sozinho. Passos manuais que ainda podem faltar (sem
  acesso automatizado ao Supabase nem às env vars do Vercel nesta sessão):
  - Rodar `migration-cores-por-produto.sql` e `migration-cor-metalica.sql`
    (criados em 2026-08-14) no SQL Editor do projeto Supabase real
    (`https://zpisplssvkudvyjaurhm.supabase.co`) — ainda não confirmado
    pelo usuário.
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e
    `NEXT_PUBLIC_WHATSAPP_NUMBER` (`5511983231173`, sem o `+`) já
    configurados no Vercel pelo usuário — a MCP do Vercel disponível
    nesta sessão não tem ferramenta pra setar env vars nem listar
    deployments/projeto (dá 403/404 mesmo após criar o projeto com
    sucesso), então não dá pra confirmar por aqui; usuário que fez.
  - Raspagem do MakerWorld: **descartada**. Ambiente de implementação
    bloqueia rede tanto pra `makerworld.com` quanto pra `supabase.com` —
    não dava pra inspecionar a página nem testar um script. Perguntado ao
    usuário como prosseguir; escolheu cadastro manual pelo painel admin.
    CLAUDE.md e README do repo do projeto já atualizados (raspagem movida
    pra "não entra", pastas `scraper/`/`data/` ficam sem uso). Perfil do
    usuário, se algum dia isso for retomado como projeto à parte:
    `https://makerworld.com/en/@cgavioli/collections`.
- **Incidente de segurança (2026-08-14, corrigido no mesmo dia)**: usuário
  testou em aba anônima (nunca logada) e o painel `/admin` abria direto,
  sem pedir senha — bug real, não confusão de sessão. RLS do banco já
  bloqueava qualquer escrita não autenticada (dados provavelmente não
  foram alterados), mas o painel e a lista de produtos ficaram visíveis
  pra qualquer um por um tempo. Causa suspeita: `src/proxy.ts` (convenção
  nova do Next.js 16, ver decisão abaixo) pode não ter suporte maduro no
  Vercel ainda. Corrigido com duas camadas independentes: voltou pra
  `src/middleware.ts` (convenção antiga, estável) + checagem de sessão
  direto no layout do admin, sem depender só do middleware.
- Logo da CMG3D precisa ser salvo como arquivo real no repo do projeto
  (`assets/logo/`) antes da implementação visual definitiva — pedir ao
  usuário para enviar como anexo, não só inline no chat. Por ora o site
  usa roxo metálico "de estoque" em `src/app/globals.css`.
- Next.js 16 tem um recurso que anexa automaticamente um bloco de
  instruções para agentes de IA ao `CLAUDE.md` toda vez que roda `next dev`
  (`agentRules`). Foi desativado no `next.config.ts` do projeto para manter
  o `CLAUDE.md` sob controle manual, como de costume neste fluxo.
