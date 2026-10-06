# S-002 — Leitura das planilhas e Rodada 1 (2026-10-06)

Material recebido (anexado à conversa, **não versionado aqui** — dados de condomínio ficam no OneDrive):

1. Checklist de evidências da avaliação da administradora (15 itens).
2. Planilha de avaliação da administradora — Panamerica Park, 1T26 (administradora CBRE).
3. Planilha de avaliação da administradora — Arquipeo, Q2-26 (administradora Cushman & Wakefield).
4. Planilha de avaliação da sindicância (modelo "Rev. 3 – fev/2024", ainda com `XXXXX`).

Pastas de saída informadas pelo usuário: `Operacional\Claude\Avaliação de Administradora BGRE` e `Operacional\Claude\Avaliação de Sindicância BGRE`. Em 2026-10-06 as duas ainda não apareciam na busca do conector (provavelmente vazias/recém-criadas).

## Diagnóstico das planilhas (fatos lidos, com fórmulas)

### Como o cálculo funciona
- Administradora: nota final = soma de (média do bloco × peso do bloco). Pesos 15% / 35% / 25% / 25%. Cada item vale 0–100%, digitado à mão em `F`; as colunas Excelente…Ruim são fórmulas sobre a aba oculta `Classificação`.
- Os critérios de cada item estão na aba `fonte dados_cálculos` (ex.: "33,33% para cada mês em conformidade", "sim 100% / não 0%", "uma documentação vencida = zero", "cada reclamação validada = −20%").
- Sindicância: 4 blocos 20/30/30/20, mesma escala; o bloco 3 tem 8 itens com peso igual.

### Pontos de atenção (candidatos a apontamento — a confirmar com o usuário)
1. **Marcação manual sobrescrevendo fórmula.** Na planilha de Panamerica, o item 3.4 tem nota 0, mas a coluna "Excelente" está com um `X` digitado à mão (e a fórmula de "Ruim" foi apagada). A nota final usa o 0 corretamente; a marcação visual está errada. Idem item 3.2 (`X` digitado em vez de fórmula).
2. **Item "Não aplicável" vira 100%.** Em Arquipeo, os itens de pesquisa de satisfação (4.1–4.3) estão com `X` em "Não aplicável" **e** nota 100%, e o bloco 4 entra na média final com 100% (25% do peso). Em Panamerica a pesquisa também não foi aplicada e os itens estão em 100%. Mesmo caso: CAPEX sem CAPEX = 100%.
3. **Item 3.5 fora da conta.** "Planilha de medições de equipamentos" existe na tela, mas a média do bloco 3 cobre só 3.1–3.4. Em Panamerica está vazio; em Arquipeo o comentário dele fala de outra coisa (contratos/compras).
4. **Número digitado como fórmula.** `=239/686`, `=(98.2+98.2+98.2)%/3` — a conta fica dentro da célula; sem rastro de onde veio cada mês.
5. **Item 1.1 de Panamerica = 239 realizadas de 686 previstas (34,8% → "Ruim")**, com peso de 15%. Merece conferência do dado de origem (período parcial? OS não fechadas no sistema?).
6. **Aba oculta com resto de fórmula** (célula com referência a linha 13064 que não existe), faixas de classificação com "buracos" de milésimos (ex.: 0,9799 a 0,98) — sem efeito prático hoje, mas é lixo de modelo.
7. **Sindicância:** modelo com dois títulos (Rev. 1 maio/2022 e Rev. 3 fev/2024), aba ainda chamada "Score Card Set.21", tabela oculta de classificação com itens que não existem mais (1.3, 1.4, 2.2–2.5, 3.9, 4.3–4.5) e valores estranhos (2, 3, 4). O exemplo recebido está com item 2.1 = 0 e, por isso, nota final de 70% ("Ruim") — presumivelmente valor de exemplo, **confirmar**.

### Sobreposição entre as duas avaliações (importante para o recorte)
| Administradora | Sindicância | Observação |
|---|---|---|
| 3.2 Plano de contas + variações > 5% | 1.1 (mesmo texto) | mesma evidência, dois avaliadores |
| 3.3 Compras conforme normativa | 2.1 | evidência: análise do compliance Brookfield |
| 3.4 Contratações conforme normativa | 4.2 | idem |
| 2.2.2 Documentação legal | 3.5 | validade de documentos/licenças |
| 2.4 Reunião mensal com síndico | 3.6 | mesma reunião, vista dos dois lados |
| 2.1 Documentos nas plataformas | 3.7 | |
| 2.2.3 CAPEX | 3.8 | |
| — | 3.4 "Realizar a avaliação da Administradora do período" | **a avaliação da sindicância depende de a avaliação da administradora ter sido feita** |

Ou seja: boa parte da evidência é a mesma, olhada de dois ângulos, e uma avaliação alimenta a outra.

### O que o OneDrive mostrou (somente nomes/caminhos, nenhum conteúdo)
- Há planilhas de avaliação da administradora por condomínio e trimestre desde 1T25 (Alphaville, Arquipeo, CTN, JKB, TNU, PL Extrema, Passeio Paulista, 17007, entre outros), e um modelo oficial em `Procedimentos Brookfield\Avaliação Indicadores Administração`.
- Padrões de nome e de pasta **diferentes** por condomínio (`1T26`, `Q126`, `Q1-26`; `16_Avaliação Administradora`, `Avaliação da Administradora`, `SLA Avaliações\Administradora CW`; pasta `Q3` com planilha de `2T25` dentro; "3T25" com período "abr a jun").
- Há caixas de e-mail anexadas "Avaliação sindicatura Q12026 – DF Síndicos" por condomínio — indica que a avaliação da sindicância chega ou é enviada por e-mail.

## Rodada 1 — perguntas de entendimento

Cada persona só pergunta o que **não** está nas planilhas. Numeração contínua.

### Marina — dados e integrações
1. De onde vem cada número hoje? OS previstas × realizadas, % de segurança do trabalho, "auditoria interna", pesquisa de satisfação — você (ou a equipe) abre IPMS, SafetyDocs, Action Log e Climas e **digita o resultado** na planilha, ou alguém já entrega o número pronto?
2. Quando as duas fontes discordam (a administradora diz que cumpriu, o sistema diz que não), quem decide e onde isso fica registrado? A nota de Panamerica no item 1.1 é um exemplo?
3. A nota pode mudar depois de enviada (administradora contesta, Brookfield pede ajuste)? Existe versão assinada ("De acordo") guardada como PDF, ou só o `.xlsx`?
4. Todos os condomínios usam o **mesmo modelo** de planilha (mesmos itens e pesos), ou há condomínios com itens diferentes (sem CAPEX, sem pesquisa)? Quando a Brookfield mudou o modelo pela última vez, como você ficou sabendo?
5. Regra de "Não aplicável": quando o item não existe naquele condomínio, a regra da Brookfield é dar 100%, ou isso é costume seu/da equipe? Já houve questionamento deles?

### Rafael — produto e rotina
6. Qual é a **lista do trimestre**: quais condomínios e quais administradoras entram, e quantas planilhas isso dá (administradora + sindicância)? Os nomes que vi no OneDrive (Alphaville, Arquipeo, CTN, JKB, TNU, PL Extrema, Passeio Paulista, 17007, Panamerica) são todos?
7. Quem preenche hoje, e quanto tempo leva por planilha e por trimestre? O que consome mais: juntar a evidência ou digitar?
8. Na **sindicância**, quem dá a nota: a Brookfield avalia a DF, ou a DF se autoavalia e a Brookfield assina? Os comentários do modelo estão na voz da própria DF ("Ajustaremos conforme contrato…").
9. O que a Brookfield faz com o resultado? Muda contrato, cobra plano de ação da administradora, afeta honorário? Alguém já pediu uma visão consolidada (ranking, evolução trimestre a trimestre)?
10. Qual é o prazo do trimestre fechado em setembro (3T26) e o que mais dói hoje: o preenchimento, o prazo, a cobrança de evidência das administradoras ou a falta de visão do conjunto? E "controle do projeto" para você é acompanhar **status e prazos** de cada condomínio, consolidar **notas**, ou os dois?

### Tomás — infra e custo
11. Quem mais mexe nessas planilhas além de você? As do OneDrive estão na conta do Marco; ele (e o resto da equipe) precisa **abrir** o consolidado no dia a dia, e em quê — Excel no Windows, celular?
12. Quando você diz "vai compilar", qual é a saída que resolve: um Excel mestre no OneDrive (uma linha por condomínio × trimestre), um painel, um PDF para a Brookfield, ou os três? Para quem é cada um?
13. Cada trimestre você me manda as planilhas já preenchidas na conversa, ou prefere que eu leia direto do OneDrive? (O conector lê só **valores**, sem fórmulas, e grava até 1 MB — para conferir fórmula o arquivo tem de vir anexado.)
14. Se nada disso for automatizado, quanto tempo por trimestre você aceitaria gastar só para me entregar os arquivos? E o que quebra em 6 meses: troca de modelo da Brookfield, entrada ou saída de condomínio, troca de administradora?

## Estado
Rodada 1 **aberta**, aguardando as respostas do usuário. Não há proposta ainda — a Rodada 2 só começa depois.
