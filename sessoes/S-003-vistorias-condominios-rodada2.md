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
<aguardando o usuário>

## Recorte proposto (fim da Rodada 2)
<aguardando as decisões acima — a inclinação do time é "1 projeto de melhoria no sistema atual", não um sistema novo; fica proposto formalmente depois das decisões>

## Indicadores propostos (fim da Rodada 2)
<depois do recorte>
