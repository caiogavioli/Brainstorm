# CLAUDE.md

Instruções para qualquer sessão do Claude trabalhando neste repositório.

## O que é

Plataforma web multi-condomínio que substitui o Action Log em Excel da DF Síndicos. **Leia `docs/spec.md` antes de qualquer coisa**: escopo da v1, papéis, modelo de dados, decisões já tomadas (com quem votou em quê), riscos e critério de pronto.

Idioma de trabalho: **português do Brasil** — chat, código de domínio (nomes de entidades e campos), commits, documentação.

## Decisões que não se reabrem sem pedido do usuário

- Plataforma própria; **sem Monday**.
- **Sistema apartado** do app de boletim (`caiogavioli/Brainstorm`, branch `claude/condominio-boletim-gestao-ougoqd`): só é referência de padrão. **Contas separadas**, sem login único, sem banco compartilhado.
- Exigência da sindicância = **comentário + campo "aguardando quem"** (sem tipo "exigência" nem prazo próprio).
- Investimento é **entidade própria** (teto, contratado, pago; saving só quando concluído).
- Forecast guarda **orçado, realizado e projetado**; correção de mês = **log de alterações**, sem versões navegáveis.
- Posição Financeira é **visão calculada**, nunca tela de entrada.
- Inadimplência nominal é visível a todos os papéis (v2), com `AcessoNominal` e configuração por condomínio.
- Nenhuma aba da planilha foi descartada; só a ordem de entrega (v1 × v2) muda.

## Regras de código

1. **Toda consulta e toda escrita é filtrada pelo escopo do usuário (`UsuarioCondominio`) no servidor.** Nunca confiar em filtro de interface. Todo `findMany`/`update` passa pelo helper de escopo em `src/lib`.
2. **Todo teste de feature nova inclui o caso "usuário de outro condomínio não vê nem altera".**
3. Toda edição feita por papel `ADMINISTRADORA` grava `LogAlteracao` (entidade, campo, antes, depois, usuário, quando).
4. Validação com Zod em toda Server Action.
5. Mobile primeiro: toda tela nova é conferida em 375 px.
6. Sem dados reais no repositório: nada de `.xlsx`/`.csv` de condomínio, e-mail ou telefone de pessoas, nome de inadimplente. Dados de demonstração são sintéticos.
7. Listas fixas (prioridade, classe, status, fundos, índices, tipos de contrato) vêm da aba oculta "BASE – Listas Suspensas" das planilhas.

## Ordem de construção sugerida

1. Esqueleto Next.js + Prisma + Postgres, sessão, convite de usuário, helper de escopo e **teste de isolamento**.
2. Cadastro de condomínios, administradoras, clientes, responsáveis DF.
3. Action Log (assunto, atualização, "sem novidade", "aguardando", revisão semanal, atrasado calculado, pauta).
4. Investimentos.
5. Forecast (grade, colar do Excel, três valores, saldo, alerta de negativo), Posição Financeira calculada.
6. Importação das planilhas (`scripts/migracao`) com relatório do que não foi lido; conferir o Atrium Century Plaza lado a lado.
7. Exportação Excel, backup agendado, revisão de segurança antes de abrir para as administradoras.

## Pontos em aberto

Ver o fim de `docs/spec.md` (limite de 7 dias para "atrasado", teto de custo mensal, catálogo de categorias de despesa).

Já resolvido: escopo e migração aprovados; **proprietário só lê** na v1; "BRPRA/CBRE" é **CBRE** (um só cadastro); hospedagem **Vercel + Neon** (criar o banco direto em neon.tech, não pela aba Storage da Vercel; confirmar plano pago, pois o gratuito da Vercel costuma ser só para uso não comercial).

## Commits

Mensagem em português, imperativo, uma linha de assunto e corpo explicando a decisão quando houver.
