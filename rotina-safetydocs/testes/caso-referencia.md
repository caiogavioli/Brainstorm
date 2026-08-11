# Caso de referência

Lido de verdade em 11/08/2026, direto da caixa `caio@dfsindicos.com.br` —
email `(A VENCER) Informativo SafetyDocs :: Permits (10/08/2026)`,
`helpdesk@safetydocs.com.br`, remetido a `caio@dfsindicos.com.br`.

## O que o email tem

Depois do bloco de KPIs (47 vencem em 7 dias, 182 próximos vencimentos, 143
itens críticos, 43 sem responsável), um rótulo de portfólio `BGRE` e 13 tabelas
de prédio, 242 linhas de documento no total. Trecho real do prédio
**Condomínio Alphaville**:

| Documento | Responsável | Vencimento | Importância | Prazo |
|---|---|---|---|---|
| 046 - Análise da Água Potável da caixa d'água - Mensal | Abner Nogueira | 10/08/2026 | Alto | Vence em 0 dias |
| 064.1 - Relatório mensal de destinação de resíduos recicláveis - mensal | — | 11/08/2026 | Médio | — |

Os 13 rótulos de prédio encontrados nessa semana — usados para popular
`mapeamento-predios.md` na criação deste projeto:

```
Condomínio Alphaville
Associação do Empreendimento Arquipeo
Associação do Parque Logístico Extrema
Condomínio JK B
Condomínio TNU
Condomínio 17.007 Nações
Condomínio Atrium Century Plaza
Condomínio Centenário Plaza B1 - Flórida
Condomínio Centenário Plaza B2 - Robocop
Condomínio do Passeio Paulista
Condomínio O Parque
Condomínio Panamerica Park - B2 (Comum) (BGRE)
Condomínio Panamerica Park - B5 (BGRE)
```

## Critério de aceite (v1)

- [ ] A rotina acha os dois informativos da semana (a vencer + vencido)
- [ ] Extrai os 13 prédios acima do email de 10/08 sem perder nenhum
- [ ] A linha "046 - Análise da Água Potável..." aparece na cobrança do
      Alphaville com Vencimento `10/08/2026` e Importância `Alto`
- [ ] Nenhum email de cobrança sai antes de o condomínio estar `confirmado`
      em `mapeamento-predios.md`
- [ ] Rodando duas vezes na mesma semana, o segundo envio não duplica quem já
      recebeu (Passo 6 do playbook)
- [ ] O resumo semanal chega ao Caio mesmo se nenhum condomínio tiver
      pendência

Isto não é um teste automatizado — é o roteiro para conferir manualmente a
primeira rodada real e qualquer rodada depois de mexer no playbook.
