# Rotina Flash Report: segunda-feira à tarde

**O que é:** toda segunda-feira, às 12h00 (America/Sao_Paulo), a Routine `trig_016LpCwLxczWm1iVwAddguVz` acorda a sessão em que o projeto foi montado (`session_01XwTwm31fTJSAS2PUgRd7Xk`). Ela lê os Flash Reports que chegaram no Outlook do Caio, acrescenta a semana que acabou de fechar ao artefato e publica a nova versão **no mesmo link**.

**Por que na sessão original e não numa sessão nova:** a Routine criada por ferramenta não leva conectores. Uma sessão nova ficaria sem o Microsoft 365 e não leria o Outlook. Se a sessão original for arquivada, a rotina deixa de funcionar: recriar a Routine pela tela de rotinas do claude.ai, marcando o conector Microsoft 365 e o repositório `caiogavioli/Brainstorm`.

**Pausar ou apagar:** `update_trigger` com `enabled=false`, ou `delete_trigger`, usando o id acima.

**Artefato (privado):** https://claude.ai/artifact/V7wZJk18Nu6pGvnFBjnNRQ

**Regras que valem sempre**
- Nunca enviar e-mail, nunca responder ninguém, nunca abrir PR. A rotina só lê o Outlook e atualiza o artefato.
- Dados dos condomínios **não vão para o GitHub**. Neste branch ficam só este playbook, o prompt, o script e o template. Os dados vivem dentro do artefato (`const DATA = {...}`).
- Idioma: português do Brasil. Sem nomes de pessoas atendidas em ocorrências.
- Se o conector Microsoft 365 não estiver disponível, ou se o artefato não puder ser lido, **pare e avise**. Não recrie o artefato do zero e não publique em outro link.

## Passo a passo

1. **Datas.** Hoje é segunda-feira D. A semana alvo é a segunda `D − 7` (período segunda a domingo que acabou de fechar). Ex.: em 12/10/2026 a alvo é `2026-10-05`. Se a rotina for rodada em outro dia, use a segunda anterior à segunda mais recente.
2. **Código.** `git fetch origin claude/flash-report-analises-semanais` e leia os arquivos desta pasta nesse branch (`git show origin/claude/flash-report-analises-semanais:rotina-flash-report/<arquivo>` ou faça checkout numa worktree). Copie a pasta para `/tmp/rotina`.
3. **Ler o artefato.** `Artifact` com `action: "read"` e a URL acima. Salve o conteúdo como `/tmp/base.html` (se o resultado trouxer o caminho do arquivo salvo, use-o). Confirme que existe a linha `const DATA = `.
4. **Semanas em falta.** `python3 /tmp/rotina/build.py --base /tmp/base.html --faltas --week <alvo>` mostra, por condomínio, as semanas anteriores sem report. Reports atrasados costumam chegar depois: o agente procura essas semanas também.
5. **Extração, um agente por condomínio, em paralelo.** Para cada item de `DATA.condos` (slug, nome) use o `prompt-extracao.md` com a dica de busca da tabela abaixo, `{{SEMANAS}}` = semana alvo + semanas em falta daquele condomínio, `{{OUT}}` = `/tmp/flash/<slug>.json`. Use a ferramenta Agent (um por condomínio, todos na mesma mensagem). Sem Agent, faça um condomínio por vez.
6. **Montar.** `python3 /tmp/rotina/build.py --base /tmp/base.html --extracted /tmp/flash --week <alvo> --out /tmp/novo.html`. Leia as estatísticas impressas. O script acrescenta a semana, refaz semanas antigas que ganharam report e mantém o resto.
7. **Reescrever o texto executivo.** Parta do `DATA.exec` atual (leia do `/tmp/base.html`) e salve um `/tmp/exec.json` atualizado, com as mesmas chaves. O relatório é visual: texto curto, números em destaque.
   - `manchetes` (4 a 5): `{c: alta|media|c1|c4, ic: alert|bolt|drop|clock, t}`; `t` com no máximo 15 palavras e `<b>` no assunto. Números vêm das estatísticas impressas pelo script.
   - `prioridades` (5 a 8, da mais urgente): `{sev: alta|media, condos: [slugs], num, numl, t, fatos: [até 3 frases de uma linha], act}`. `num` é o número ou data que resume o risco (ex.: "17/10") e `numl` o rótulo curto dele. `act` é uma ação de uma frase. Remova o resolvido, mantenha o aberto com números atualizados, acrescente o novo.
   - `temas` (5 a 7): `{t, num, numl, p (uma frase), condos, good?: true}`. Mantenha o tema de pontualidade até 12h com os números novos e um tema "Avanços" com `good: true`.
   - `datas`: `{iso: AAAA-MM-DD, d: texto da data, aprox?: true, c: slug, o: o que vence, s: situação em uma frase}`. Tire o vencido e resolvido; vencido sem confirmação fica e aparece como "venceu há N dias". A barra e a contagem regressiva são calculadas a partir de `iso`.
   - `metodo`: mantenha o texto atual, atualizando só as datas.
   Escreva só o que está nos dados, com valores e datas como nos relatórios. Sem travessão em apostos nem frases de efeito.
8. **Gerar de novo com o texto.** Repita o passo 6 com `--exec /tmp/exec.json`. Confira: o arquivo tem uma linha `const DATA = ` com JSON válido, tem menos de 2 MB, e a semana nova aparece em `weeks`. Opcional: um screenshot com Playwright (`/opt/pw-browsers/chromium`) para ver se a página abre sem erro.
9. **Publicar.** `Artifact` publish do `/tmp/novo.html` com `url` = a URL acima (sem `icon`). Não mude o título.
10. **Responder (curto).** Semana processada, quantos condomínios reportaram, quantos sem report, as 3 maiores prioridades e o link. A Routine avisa o Caio por notificação.

## Dicas de busca por condomínio

| slug | Administradora | Assunto / remetente |
|---|---|---|
| `jkb` | CBRE | assunto `JKB_Flash Report_DD.MM a DD.MM.AA` |
| `arquipeo` | Cushman & Wakefield (cushwake.com) | assunto `Flash Report - Arquipeo`; há threads de perguntas da BGRE |
| `centenario-plaza` | CBRE | assunto `Flash Report - DD/MM a DD/MM/AAAA - Condomínio Centenário Plaza` |
| `17007-nacoes` | CBRE | assunto `\|17007 Nações\| Flash Report Semanal ...` |
| `parque-corporate` (nome no relatório: **O Parque - T07**) | Innova (innova.net.br) | assunto `RELATÓRIO FLASH REPORT - SEMANA DE ...`; período de terça a segunda |
| `alphaville-tower` | CBRE | assunto `Flash Report semanal - Alphaville. DD.MM.AAAA até DD.MM.AAAA`; período de domingo a sábado |
| `tnu` | CBRE | assunto `TNU \| Flash Report Semanal (DD/MM/AAAA à DD/MM/AAAA)` |
| `passeio-paulista` | Cushman & Wakefield | assunto `FLASH REPORT SEMANAL_DD/MM/AA à DD/MM/AA` (às vezes com prefixo PASSEIO PAULISTA) |
| `panamerica-park` | CBRE | assunto `PNP_Flash Report - DD a DD/MM/AAAA` |

## Regra de prazo (BGRE)
O report de uma semana (segunda a domingo) está **no prazo** se chegou até **12h00 de segunda-feira, horário de Brasília**, da semana seguinte. Depois disso conta como atrasado, mesmo que tenha chegado na segunda. O `build.py` recalcula `no_prazo` de todos os reports a partir do horário de recebimento (`rec`, em UTC; Brasília = UTC-3), então não depende do que o agente marcou. No passo 7, os números do `lead` e do tema de pontualidade devem usar a contagem "até 12h" que o script imprime ("na segunda=N").

## Filtro mensal
O artefato tem uma linha de meses no topo (Tudo, Agosto, Setembro, Outubro...) e, abaixo, a visão do mês e as semanas daquele mês. A semana pertence ao mês em que cai a quinta-feira (regra ISO), então 31/08 a 06/09 é de setembro e 28/09 a 04/10 é de outubro. O template cria o botão de um mês novo sozinho quando entra a primeira semana dele; não há nada a configurar na rotina. A visão de cada mês é calculada dos dados (indicadores, mapa, gráficos, destaques com as semanas em severidade alta). Prioridades, temas e datas críticas ficam só na aba "Tudo", porque descrevem a situação de hoje.

## Filtro por condomínio
Abaixo das abas há uma linha de condomínios (Todos e um botão por condomínio, com sigla e um ponto da pior severidade no recorte). Dá para marcar um ou mais; o relatório inteiro (indicadores, mapa, gráficos, prioridades, temas, datas e cartões) passa a mostrar só os escolhidos, combinando com o mês e a semana. Com um condomínio só, aparece também a "Semana a semana" dele. O botão de um condomínio novo nasce de `DATA.condos`; a sigla vem de `SIG` no template (ou das iniciais do nome).

## Cobranças da BGRE
Por decisão do usuário (06/10/2026) o relatório **não mostra** a lista "Cobranças da BGRE sem resposta", e o `build.py` não guarda mais essas cobranças nos dados da página. Os agentes continuam lendo as respostas da BGRE para entender o contexto das semanas, mas isso não vira um item do relatório.

## Como o script encaixa os períodos
- Report normal: vai para a semana (segunda a domingo) que contém o meio do período. Isso trata Alphaville (domingo a sábado) e O Parque - T07 (terça a segunda).
- Consolidado de 13 dias ou mais: entra na última semana coberta; as anteriores aparecem no mapa como "consolidado".
- "Sem report" significa que nada foi localizado no e-mail do Caio. A semana alvo da rotina vence na própria segunda, então os que ainda não chegaram ao meio-dia aparecem como "hoje" e viram "sem report" ou são preenchidos na rodada seguinte, pelo back-fill.

## Severidade
Alta: risco real para operação, segurança de pessoas ou patrimônio, finanças ou reputação. Média: impacto limitado ou pendência relevante. Baixa: rotina, manutenção e melhorias. É classificação automática do texto de cada relatório; o Caio pode pedir ajuste.

## Se algo quebrar
- `build.py` não achou `const DATA = `: o artefato foi editado à mão ou mudou de formato. Pare e avise.
- Agente sem resultado para um condomínio: o script avisa "sem arquivo de extração"; a semana fica como estava e o condomínio aparece como sem report. Diga isso na resposta.
- Conflito ao publicar (artefato mudou): leia de novo, refaça o passo 6 em cima da versão nova e publique.
