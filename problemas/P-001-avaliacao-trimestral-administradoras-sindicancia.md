# P-001 — Avaliação trimestral das administradoras e da sindicância dos condomínios (BGRE)

## Em uma frase
Todo trimestre o usuário precisa avaliar as administradoras dos condomínios dele junto com a BGRE, e avaliar a sindicância de cada prédio; hoje isso vive em duas planilhas preenchidas à mão, sem um controle que compile os dados.

## Como é hoje
_Apresentação (S-001) + leitura das planilhas (S-002). Rotina detalhada ainda por levantar na Rodada 1._

- Existem **duas avaliações**, ambas **trimestrais**:
  1. avaliação das **administradoras** dos condomínios, feita **com a BGRE**;
  2. avaliação da **sindicância** dos prédios.
- Cada avaliação tem a sua **planilha** (modelo Brookfield, aba `Score Card` + aba oculta de classificação + aba `fonte dados_cálculos`):
  - **Administradora** — 4 blocos com pesos 15/35/25/25 (OS no prazo; resultados operacionais; gestão de processos; satisfação do usuário), ~17 itens, escala Excelente/Bom/Satisfatório/Regular/Ruim por faixa de %. Uma planilha **por condomínio por trimestre** (ex.: Panamerica Park/CBRE 1T26, Arquipeo/Cushman Q2-26).
  - **Sindicância** — 4 blocos com pesos 20/30/30/20 (pagamentos; compras; gestão de processos; contratos), 12 itens, mesma escala. Só o modelo em branco/exemplo chegou; histórico por condomínio nas pastas de cada prédio.
- Também chegou um **checklist de evidências por item** da avaliação da administradora (o que cada administradora precisa enviar como prova e a ação pedida).
- Histórico existe no OneDrive da equipe (Operacional\Condomínios\…), **uma pasta por condomínio**, com nomes e subpastas fora de padrão (`1T26`, `Q126`, `Q1-26`; pasta `Q3` guardando planilha do 2T25).
- O usuário **preenche as planilhas manualmente**.

## Frequência e volume
- Acontece: trimestral (duas avaliações por trimestre).
- Tempo gasto por vez: _a levantar_
- Volume: _a levantar (nº de condomínios/prédios e de administradoras a partir das planilhas)_

## Quem sofre
O usuário. Quem mais participa/recebe a avaliação (BGRE, administradoras) _a levantar_.

## O que já foi tentado
_A levantar._

## Como saberíamos que resolveu
Pedido inicial: o Claude **compila os dados** das duas planilhas (preenchidas à mão pelo usuário) e mantém um **controle** do projeto. Critério objetivo _a definir na Rodada 2_.

## Restrições conhecidas
- O preenchimento das planilhas continua **manual**, feito pelo usuário; o Claude entra na compilação.
- Pastas de saída criadas pelo usuário no OneDrive: `Operacional\Claude\Avaliação de Administradora BGRE` e `Operacional\Claude\Avaliação de Sindicância BGRE`.
- Dados de condomínios e avaliações de terceiros: **não vão para o GitHub** (padrão do usuário — ficam no OneDrive).
