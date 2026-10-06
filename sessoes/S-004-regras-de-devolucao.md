# S-004 — Regras de devolução, item a item do formulário

**Data:** 2026-10-06
**Contexto:** depois do piloto, o usuário achou a regra "BGRE com Não = bloqueante" dura demais (S-003). Ele pediu para o Claude perguntar, uma a uma, todas as perguntas do formulário (CP.1 a CP.26), e para cada uma ele diz se a resposta "Não" devolve o QC ou se há análise a fazer antes de devolver. Esta sessão substitui a regra simples da S-003 conforme cada item for respondido.

## Duas decisões gerais

1. **Relatório sem limitações de leitura.** Nenhum relatório menciona que algo não foi analisado, que o arquivo era PDF ou imagem, nem outras limitações técnicas de leitura. Isso fica só no resumo que o Claude dá ao usuário no chat.
2. **Devolução por item.** Cada pergunta do formulário tem uma regra própria: devolve sempre, devolve depois de uma análise (que a skill executa) ou só vira ressalva. Valores abaixo, na ordem em que o usuário respondeu.

## Respostas

| Item | Regra | Palavras do usuário |
|---|---|---|
| CP.1 Mínimo de propostas | **Sem justificativa no mapa: devolve sempre. Com justificativa: analisar se convence antes de decidir.** | "Devolve sempre sem justificativa; com justificativa, analise se convence" |

## Ainda por perguntar

CP.2, CP.3, CP.4 a CP.19, CP.20 a CP.22 (alçada), CP.24, CP.25 e CP.26.
