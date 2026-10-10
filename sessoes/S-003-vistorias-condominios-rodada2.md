# S-003 — vistorias-condominios — Rodada 2

**Data:** 2026-10-10
**Fase:** 3 rodada 2
**Problemas:** P-001
**Artefato publicado:** https://claude.ai/artifact/MzfMH4jdWmgKQFEY127kXd (SWOT + as 3 decisões + o desacordo, no formato pedido pelo usuário)

## Ferramenta de abertura

## SWOT — sistema de vistorias atual, para decidir o que fazer sobre armazenamento de fotos e confiabilidade do sincronismo

**Forças** (interno, ajuda)
- App já em produção, atendendo os ~40 condomínios da carteira — "o que eu tenha testado, não vi nenhum outro problema, a não ser o sincronismo" (resposta 9).
- Checklist, fotos e geração de relatório já funcionam; o problema é localizado (fotos/sincronismo), não o sistema inteiro.
- Já existe instrumentação própria de diagnóstico no servidor (registro de quando cada aparelho tenta falar com o sistema) — construída especificamente para investigar esse tipo de falha.

**Fraquezas** (interno, atrapalha)
- Fotos sem nenhuma cópia de segurança — vão direto para um banco com espaço limitado. "Ninguém salva... posso ter problema de perder as fotos ou de espaço" (resposta 10).
- Falha de sincronização é invisível para quem opera: "elas não entendem de sincronização... não conseguem ver que deu algum problema" (resposta 8).
- Relatório sai sem revisão interna: "não é revisado" (resposta 7).
- Só uma pessoa (o usuário) mantém o sistema — ponto único de manutenção (resposta 11).

**Oportunidades** (externo, ajuda)
- Microsoft 365 com OneDrive é corporativo, toda a equipe já tem acesso — sem custo adicional (resposta 12).
- A Microsoft Graph API permite gravar em OneDrive/SharePoint usando uma credencial única do aplicativo, sem depender de cada vistoriador autorizar individualmente — `(hipótese técnica, a confirmar na implementação)`.

**Ameaças** (externo, atrapalha)
- O plano gratuito do banco de dados atual tem espaço finito — o estouro é questão de tempo enquanto as fotos continuarem indo só para lá.
- Dependência de três serviços de terceiros encadeados (GitHub Pages, Vercel, banco) já causou uma falha real (o erro 401 por configuração descasada) — fragilidade que já se provou, não é hipotética.

**Cruzamentos**
- F×O: o app já funcional + OneDrive corporativo já pago → dá para resolver o maior ponto de dor (fotos) sem reescrever o sistema nem gastar mais, só mudando **onde** as fotos ficam guardadas.
- F×A: só o usuário mantém o sistema, mas a instrumentação de diagnóstico que ele já tem pode virar a base de um alerta automático, sem precisar de mais gente técnica.
- D×O: a fraqueza "equipe não técnica não percebe falha" pode ser corrigida aproveitando que todo mundo já usa o Microsoft 365 — avisar por um canal que a equipe já olha, em vez de depender da tela do app.
- D×A (risco crítico): fotos sem cópia de segurança + espaço do banco que vai estourar = perda real de fotos é questão de tempo se nada mudar. É o risco que mais justifica agir agora.

**O que isso muda na decisão**
1. Não há motivo técnico forte para reescrever o sistema do zero — o SWOT aponta para um ajuste cirúrgico (onde as fotos ficam, como avisar falha), não para descartar o que já funciona.
2. A ideia do usuário (OneDrive/SharePoint) ataca diretamente o risco crítico (D×A) e usa a maior oportunidade disponível (M365 já pago).
3. Falta decidir **como** mover as fotos (tempo real vs. rotina periódica) e **como** avisar falha sem depender do vistoriador perceber — duas frentes separadas, com opções abaixo.

## Propostas do time

### 1. Onde as fotos ficam guardadas (Marina lidera)
- **A — só as fotos saem do banco atual, o resto fica como está.** Muda onde as fotos são guardadas (OneDrive/SharePoint), preserva o sincronismo offline do texto (notas, observações), que já funciona.
- **B — todo o sistema migra para dentro do Microsoft 365** (ex. listas do SharePoint no lugar do banco atual), abandonando o banco de dados.
- Recomendação de Marina: **A.** B reescreve uma lógica de sincronismo offline que já funciona bem para o texto, trocando um problema conhecido (espaço de foto) por vários desconhecidos (sincronismo inteiro em cima de uma API de terceiro). A resolve exatamente o que dói, sem mexer no que não dói.

### 2. Como as fotos chegam no OneDrive (desacordo do time — ver abaixo)

### 3. Como tornar a falha de sincronização visível (Rafael lidera)
- **A — alerta só dentro do app**, mais chamativo que o atual (ex. bloqueia continuar até a pessoa ver o aviso).
- **B — alerta que sai do app**, chega para o usuário (único técnico) por e-mail/Teams quando um aparelho fica muito tempo sem sincronizar, sem depender de o vistoriador notar nada.
- Recomendação de Rafael: **B**, complementar ao aviso atual no app (não substitui). Quem precisa agir quando a sincronização falha é o usuário, não o vistoriador — e colocar a responsabilidade de perceber no vistoriador já provou não funcionar (resposta 8).

### 4. Aba de "conclusão do vistoriador" (pedido novo do usuário, Rafael lidera)
- Recomendação de Rafael: **incluir.** É uma mudança só de interface (resumo final que o vistoriador valida antes de concluir), resolve a falta de revisão da etapa 4 do SIPOC, e segue um padrão que a empresa já usa em outro sistema (o boletim diário informativo) — menor risco de ser mais uma coisa nova para a equipe aprender.

## Desacordo do time levado ao usuário

**Como as fotos chegam no OneDrive — tempo real ou em lote?**

- **Marina:** prefere que o próprio app mande a foto direto para o OneDrive assim que a vistoria sincroniza (upload automático pela Microsoft Graph API). É o mais robusto do ponto de vista de dado: a foto nunca fica "só" no banco de dados, nem por um minuto.
- **Tomás:** prefere uma rotina simples, rodando no servidor, que pega o que já chegou no banco e copia para o OneDrive periodicamente (ex. a cada poucas horas) — menos peça móvel para manter (não precisa o celular do vistoriador, muitas vezes sem sinal bom, conversar em tempo real com mais uma API), e ainda assim resolve o problema real: hoje não existe cópia nenhuma, uma rotina a cada poucas horas já é uma melhora enorme. O risco de o upload em tempo real falhar bem na hora em que a pessoa está com sinal ruim — justo quando mais precisa do backup — é real.

Os dois concordam que **ter cópia no OneDrive é a direção certa**; o desacordo é só sobre tempo real × periódico. Fica para o usuário decidir.

## Decisões

Resposta do usuário, direto:

> 1: fazer solução B
> 2: de acordo com a recomendação
> 3 estou de acordo
> Desacordo: sobe em tempo real

- **Decisão 1 (onde as fotos ficam):** **B** — todo o sistema migra para dentro do Microsoft 365 (SharePoint no lugar do banco atual), não só as fotos. Contra a recomendação de Marina (A); decisão explícita do usuário, registrada como o destino do projeto.
- **Decisão 2 (aviso de falha):** **B**, conforme recomendado — aviso sai do app, chega ao usuário por e-mail/Teams.
- **Decisão 3 (aba de conclusão do vistoriador):** confirmada — entra no projeto.
- **Desacordo (tempo real × lote):** resolvido a favor de **Marina — tempo real**. Coerente com a Decisão 1: se o destino final é o SharePoint como sistema de registro, um caminho de escrita direto (tempo real, via Graph API) é mais nativo do que manter uma ponte de cópia em lote a partir de um banco que o projeto já decidiu abandonar.

## GUT — ordem de entrega, v1 × v2

O usuário escolheu o destino (B = tudo no SharePoint), mas migrar o texto da vistoria (que hoje já sincroniza bem) é um projeto maior que resolver o risco real (fotos sem cópia). GUT entre as quatro frentes decididas, para decidir o que entra primeiro:

| # | Item | G | U | T | Score | Por quê (G / U / T) |
|---|---|---|---|---|---|---|
| 1 | Fotos com cópia em tempo real no OneDrive/SharePoint | 5 | 5 | 4 | 100 | G: foto perdida é dado que não volta, relatório sai incompleto pro cliente. U: o risco já existe agora, o banco pode estourar a qualquer momento. T: piora conforme mais vistorias se acumulam. |
| 2 | Aviso de falha de sincronização fora do app | 3 | 3 | 3 | 27 | G: afeta a operação, não perde dado por si só. U: incômodo recorrente, não é incêndio hoje. T: sem correção, a falha invisível se repete a cada novo caso. |
| 3 | Migração completa do dado de texto da vistoria para o SharePoint, descontinuando o banco atual | 3 | 2 | 3 | 18 | G: ganho arquitetural (menos dependência de serviço de terceiro pago), não resolve um risco imediato. U: essa parte não está quebrada hoje. T: enquanto não migrar, o sistema segue na cadeia GitHub Pages + Vercel + banco que já falhou uma vez. |
| 4 | Aba de conclusão do vistoriador | 2 | 2 | 2 | 8 | G: melhoria de processo/qualidade, não resolve risco técnico. U: pode esperar. T: fica como está se não for feito. |

**Atacar primeiro:** 1) fotos em tempo real, 2) aviso de falha fora do app, 3) migração completa para o SharePoint.
**Fica para depois, mas não porque não importa:** a aba de conclusão (4) tem o score mais baixo, mas é uma mudança pequena e isolada (só interface) e já está aprovada — Rafael propõe entregá-la junto com a v1 mesmo assim, por ser barata e não competir por risco com o resto.
**Desacordos:** nenhum — ordem construída sobre o que já foi decidido, sem distância de 2+ pontos entre as personas nesta rodada.

## Recorte proposto (fim da Rodada 2)

**1 projeto, chamado `vistorias-condominios` (nome provisório), entregue em duas fases:**

- **v1 — resolve o risco real, sem reescrever o que já funciona.** Fotos com cópia em tempo real no OneDrive/SharePoint (via Microsoft Graph API), aviso de falha de sincronização fora do app (e-mail/Teams), e a aba de conclusão do vistoriador. O texto da vistoria continua sincronizando pelo banco atual.
- **v2 — completa a Decisão 1.** Migra o dado de texto da vistoria (notas, observações, checklist) do banco atual para dentro do SharePoint, descontinuando o banco de dados.

Dosagem (Rafael): projeto com várias partes e decisão arquitetural em jogo → ferramentas completas (SIPOC, SWOT, GUT v1/v2, BSC), como já feito acima.

## Indicadores propostos (fim da Rodada 2)

## Balanced Scorecard — vistorias-condominios

**Objetivo do projeto (a "estratégia"):** garantir que nenhuma vistoria ou foto se perca e que uma falha de sincronização nunca mais passe despercebida, sem gastar com armazenamento de servidor.
**Cadeia de causa e efeito:** usuário para de precisar vigiar manualmente (Aprendizado) → fotos sempre com cópia e falha sempre avisada (Processos) → relatório sempre completo entregue com confiança (Cliente) → zero custo adicional de armazenamento (Financeira).

| Perspectiva | Objetivo | Indicador | Linha de base | Meta e prazo | Fonte / quem mede | Iniciativa |
|---|---|---|---|---|---|---|
| Financeira | Eliminar custo de armazenamento extra | Custo mensal de armazenamento de fotos | Não medido — hoje no plano gratuito do banco, perto do limite | R$ 0 adicional, confirmado em 30 dias após a entrega do v1 | Fatura do banco atual + uso do OneDrive (já pago, corporativo) | Mover fotos para o OneDrive/SharePoint |
| Cliente | Relatório sempre completo, com todas as fotos | % de vistorias concluídas com todas as fotos presentes no relatório final | Não medido | 100%, revisado 30 dias após a entrega do v1 | Conferência do usuário nos primeiros relatórios pós-entrega | Fotos com cópia garantida no OneDrive em tempo real |
| Processos internos | Nenhuma falha de sincronização passa despercebida | Tempo entre a falha acontecer e o usuário ser avisado | Hoje: indefinido (só descobre se checar manualmente ou alguém reclamar) | Até 24h da falha, a partir da entrega do v1 | Log/alerta automático do sistema (e-mail ou Teams) | Aviso de falha fora do app |
| Aprendizado e crescimento | Reduzir a dependência do usuário como único ponto capaz de perceber problema | Nº de investigações manuais do usuário por mês para saber se alguém sincronizou | Não medido — hoje acontece toda vez que há dúvida | Zero por mês, 90 dias após a entrega do v1 | Registro informal do usuário / contagem de alertas recebidos | Alerta automático + instrumentação de diagnóstico já existente no servidor |

**Revisão:** 30 dias e 90 dias após a entrega do v1, pelo usuário.
**Sem linha de base ainda:** quantas vistorias/fotos estão hoje sob risco de perda (espaço do banco já ocupado) — primeira tarefa do projeto, antes de declarar a v1 pronta.
