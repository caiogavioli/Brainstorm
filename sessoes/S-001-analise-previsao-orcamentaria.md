# S-001 — Análise de previsão orçamentária de condomínios

**Problema:** [P-001](../problemas/P-001-analise-previsao-orcamentaria.md)
**Data:** 2026-10-01
**Fase:** 1 (Apresentação) → Rodada 1 aberta

---

## Apresentação (palavras do usuário, transcrição de áudio)

> É, como parte do meu trabalho, eu faço análise e revisão das previsões orçamentárias que são montadas pelas administradoras dos condomínios. Eles me mandam planilhas de Excel, eles me mandam apresentações, eles me mandam uma série de documentos, e eu analiso tudo isso e eu tenho que emitir um relatório com um parecer sobre o material. Então, eu tenho que analisar linha a linha todos os gastos, todos os custos, se faz sentido o reajuste que eles estão propondo, se as linhas de segurança, manutenção, estou dando um exemplo, tá? Manutenção, segurança, limpeza, é, elas estão fazendo sentido comparadas com o realizado do ano anterior, se os índices estão sendo aplicados de forma correta, se as contas estão batendo, se as fórmulas estão certas. Em resumo, eu preciso fazer uma análise completa de tudo isso. Eu gerei no passado um prompt para uma outra IA fazer uma análise, eu vou te mandar esse prompt para você usar ele como uma base, mas eu quero que você faça um, um trabalho de... montar um prompt, montar um espaço aqui no Code para que eu te mande as previsões orçamentárias e você faça a análise e me entregue o resultado.

## Pendências de insumo

- O prompt anterior (feito para outra IA) **ainda não foi enviado** — o usuário disse que vai mandar. Chega junto com as respostas da Rodada 1 ou antes.

---

## Rodada 1 — entendimento

_Perguntas feitas; aguardando respostas do usuário._

### Marina (1–5)

1. Que formatos chegam, exatamente? Nas planilhas Excel as fórmulas vêm **vivas** (dá para auditar célula a célula) ou valores colados? Quantas abas, em média? E as apresentações/PDFs: texto nativo ou imagem/escaneado?
2. O "realizado do ano anterior" vem **dentro do pacote** da administradora ou você tem outra fonte (balancete, prestação de contas, razão)? Quando o realizado que a administradora apresenta discorda do seu, quem vale?
3. Quais índices você confere hoje (IPCA, INPC, IGP-M, dissídio/convenção coletiva, tarifas de concessionárias, índice de contrato específico)? De onde você tira o valor de referência de cada um — e em que data-base?
4. Para linhas como segurança e limpeza, o reajuste correto depende do **contrato** (cláusula de reajuste, aditivo, data-base). Você tem os contratos para cruzar, ou confere só pela planilha e pelo histórico?
5. O plano de contas é padronizado entre as administradoras ou cada uma nomeia e agrupa as linhas de um jeito? E a mesma previsão costuma chegar em mais de uma versão (v1, v2…)? Como você compara versões hoje?

### Rafael (6–10)

6. Quando isso acontece no ano: tudo concentrado numa janela (ex.: outubro–dezembro) ou espalhado? Quantas previsões por ciclo e quantas simultâneas no pico?
7. Quanto tempo leva uma previsão do começo ao relatório entregue? Onde o tempo vai: leitura, comparação com o ano anterior, conferência de fórmula e índice, ou redação do parecer?
8. Para quem é o relatório e o que acontece com ele depois (conselho, cliente, assembleia)? Em que formato sai (Word, PDF) e existe modelo? Dá para mandar 1 ou 2 relatórios antigos, com dados trocados se necessário, como exemplo de "parecer bom"?
9. Qual o erro mais caro que já passou — ou que você mais teme que passe? É o que define onde a análise precisa ser mais rigorosa.
10. O prompt que você fez para a outra IA: o que funcionou e o que não funcionou? Por que está migrando para cá?

### Tomás (11–14)

11. Os arquivos das administradoras são dados de terceiros. Eles podem ficar guardados num repositório **privado** no GitHub (versionados, histórico completo) ou você prefere que fiquem só na sessão, sem persistir? Isso decide onde o espaço mora.
12. Tamanho típico dos arquivos (MB) e quantos por previsão? Chegam por email (Outlook) e você baixa, ou já ficam em OneDrive/SharePoint?
13. Só você usa ou outra pessoa da sua equipe também vai mandar previsões para análise? Precisa funcionar do celular (Android) ou só do computador?
14. Hoje você mantém algum controle dessas previsões (lista de condomínios, status, prazos, parecer emitido) em Monday ou planilha? Se sim, o parecer precisa alimentar isso?

---

## Respostas do usuário

_Ainda não respondidas._
