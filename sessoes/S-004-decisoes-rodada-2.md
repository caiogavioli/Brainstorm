# S-004 — Decisões da Rodada 2 (2026-10-06)

## Respostas do usuário (palavras dele)

> vai com a recomendação do time
> por planilha
> eles conhecem, mas não usam... eu que uso todo trimestre

O usuário **delegou** as decisões D1–D5 de S-003 à recomendação do time (as três opções recomendadas eram as mesmas A de cada decisão, contra a discordância de Tomás em D1 e D2 e de Marina em D4). Não sobrou desacordo a devolver: vale a recomendação.

## Decisões fechadas

| # | Decisão | Alternativas descartadas |
|---|---|---|
| D1 | Pedido **mensal** (1º dia útil) dos itens medidos mês a mês + pedido **trimestral** do resto, com **rascunho de e-mail pronto** no Outlook para o usuário enviar | B (um pedido trimestral com lembrete no meio — Tomás); C (tudo mensal) |
| D2 | **Pasta de evidências por condomínio** no OneDrive do usuário, compartilhada **só** com a administradora daquele condomínio, numa **árvore separada** da das planilhas de nota (a administradora nunca vê a nota antes de o usuário circular) | B (biblioteca SharePoint da DF — Tomás, fica como migração futura); C (só e-mail) |
| D3 | Divisão de itens conforme S-003: administradora entrega na pasta (1.1, 2.3, 2.5, 2.6, 3.2, 4.1–4.3); lê-se no Action Log (2.2.1, 2.2.3, 2.4, 3.1); chega no e-mail do usuário (2.1, 2.2.2); só a BGRE (3.3, 3.4) | — |
| D4 | O usuário **continua preenchendo à mão**; o Claude entrega **folha de apoio** por condomínio e, depois, **conferência** da planilha preenchida. A planilha da BGRE não é tocada | B (cópia preenchida por script — Marina; só depois de testar numa cópia) |
| D5 | v1 = **Excel mestre + painel**; arquivar o PDF assinado e digitalizado na pasta do trimestre; PDF consolidado só a pedido da BGRE | — |
| Recorte | **1 projeto**, `avaliacao-trimestral-bgre`, duas trilhas (administradora e sindicância), **sem software e sem repositório novo**; a trilha da sindicância não usa pasta compartilhada e calcula o item 3.4 a partir do controle | 2 projetos separados; script avulso |

## Fatos novos

- **≈ 2 h por planilha.** São até 18 planilhas por trimestre (9 administradoras + 9 sindicâncias) — a ordem de grandeza é de **dezenas de horas por trimestre**, não de 2 h. (A estimativa do tempo da sindicância, que costuma reaproveitar a evidência da administradora, não foi separada.)
- **Os administradores conhecem o checklist e não o usam; quem o usa é o usuário, todo trimestre.** Logo o checklist **não é um instrumento novo para as administradoras**: o que muda é a **cadência mensal, o rascunho pronto, a pasta de entrega simples e o registro do que foi pedido e recebido**. Só entregar a lista de novo repetiria o que já não funciona.

## Pendência levantada pelo time

**Marina:** o que acontece quando a evidência não chega no prazo do mês? A regra da própria planilha ("33,33% para cada mês preenchido em conformidade") já dá um terço do item por mês; se o pedido mensal disser isso com todas as letras, cria consequência. Se o usuário continuar buscando a evidência por conta própria quando a administradora não entrega, o pedido vira só mais um e-mail ignorado. A resposta do usuário define o texto do rascunho.

## Resposta à pendência (palavras do usuário)

> (b)

**Evidência que não chega no mês: o usuário continua buscando por conta própria**, como hoje. O pedido mensal **não carrega penalidade** e o rascunho de e-mail não anuncia perda de nota.

Consequências para o projeto:
- O texto do rascunho é um **pedido com data** ("enviar até o dia X; se não chegar, a DF levanta diretamente"), sem tom de cobrança.
- Risco apontado por Marina: sem consequência, o pedido tende a ser ignorado como o checklist foi. Por isso o controle registra, por condomínio × item × mês, **quem forneceu**: `administradora` (pasta ou e-mail) ou `DF` (o usuário foi buscar). Esse campo é o **indicador de sucesso da v1**: a parcela de itens entregues pela administradora deve subir; as horas de preenchimento, cair. Também deixa o histórico à mão caso o usuário queira levar a não entrega à BGRE, decisão que continua dele.
- O Excel mestre **não altera nota** por falta de evidência: a nota segue a planilha da BGRE preenchida pelo usuário.

## Estado

Rodada 2 **fechada em decisão**. Recorte aceito pela delegação. Falta: o usuário dizer "fecha o projeto" para gerar a spec (`projetos/avaliacao-trimestral-bgre.md`) — **não é gatilho** o fim da Rodada 2. Próximo passo já combinado, que não depende do fechamento: **mapa de lacunas do 3T26** (prazo 31/10/2026).

## Execução: estrutura de pastas no OneDrive (2026-10-06)

Pedido do usuário: criar uma pasta por condomínio dentro das duas pastas de avaliação, usando como modelo a pasta já criada por ele para o Arquipeo. Depois, ajuste dele: dentro da pasta do ano, os trimestres se chamam só `Q1`…`Q4`.

> pode deixar as pastas dos trimestres como Q1, Q2, Q3 e Q4, pois elas estão dentro da pasta do ano já

Padrão adotado, nas duas árvores (`Operacional\Claude\Avaliação de Administradora BGRE` e `Operacional\Claude\Avaliação de Sindicância BGRE`):

```
<Condomínio>\<Ano>\Q1 | Q2 | Q3
```

- Condomínios (9): Alphaville, Arquipeo, CTN, JKB, PL Extrema, Panamerica Park, Passeio Paulista, TNU, 17007 Nações.
- Anos: 2025 (Q1–Q4) e 2026 (Q1–Q3). O Q4 de 2026 ainda não existe: criar quando o trimestre começar.
- Só estrutura de pastas; nenhum arquivo do usuário foi movido ou copiado.
- A pasta `Arquipeo` da árvore de Administradora é do usuário e não foi alterada, exceto pela criação de `2026\Q3` vazia. Ela ainda usa `1T25…4T25` em 2025.
- Esta é a árvore **interna** (planilhas e controle). A pasta compartilhada com as administradoras (D2) é uma árvore separada, ainda não criada.
