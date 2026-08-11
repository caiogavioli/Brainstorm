# Contexto — Rotina de cobrança SafetyDocs

Instruções para qualquer sessão do Claude que execute ou desenvolva esta rotina.

Idioma de trabalho: **português do Brasil**, em tudo.

## O que é isto

Uma rotina semanal, sem servidor, que lê os dois informativos que a plataforma
**SafetyDocs** manda toda segunda para `caio@dfsindicos.com.br` — documentos **a
vencer** e **vencidos**, de todos os prédios que o Caio administra — separa por
prédio, e manda um email de cobrança por condomínio, só com a lista daquele
condomínio. Segue o mesmo desenho da **Triagem Contratante**
(`caiogavioli/triagem-contratante`): sem servidor, sem banco de dados, o próprio
Outlook do usuário como origem e destino.

## As regras que não se quebram

1. **Nunca inventar destinatário.** Cada condomínio só recebe email depois de o
   endereço estar **confirmado** em `mapeamento-predios.md`. Rótulo novo ou sem
   confirmação → fica de fora do envio, relatado no resumo, nunca chutado.
2. **Falso negativo aqui é caro na direção oposta da Triagem Contratante:** lá,
   perder uma demanda é o risco caro; aqui, **mandar cobrança para o endereço
   errado** é o risco caro (email indo para gente de fora do condomínio, ou
   condomínio errado recebendo lista de outro). Na dúvida, **não envia**.
3. **A rotina não inventa dado de documento.** Os documentos cobrados são
   exatamente os que aparecem nos dois emails da SafetyDocs daquela semana —
   nunca resumidos, arredondados ou reescritos.
4. **Uma cobrança por condomínio por semana.** Reexecução manual não duplica
   quem já recebeu (ver `playbook.md`, Passo 6).

## Como o usuário prefere ser tratado

(Herdado da Triagem Contratante, mesma pessoa.) Explicação direta, decisões
técnicas tomadas por quem constrói e informadas em uma linha, produto mostrado
com exemplo real em vez de desenho abstrato.

## Arquitetura, em uma tela

```
Outlook (SafetyDocs) ──Microsoft 365, leitura──▶  Rotina semanal (segunda 08h)
                                                        │
                              separar por prédio, cruzar com mapeamento
                                                        │
                                                        ▼
                                         1 email por condomínio mapeado
                                         (Outlook do Caio → email do condomínio)
                                                        │
                                                        ▼
                                    resumo da rodada, também por email a ele
```

- **Execução:** Routine agendada (self-bind — dispara nesta mesma sessão, que
  já tem o conector Microsoft 365 ativo). Ver `agendamento.md` para o porquê
  desse modo, copiado literalmente da Triagem Contratante depois de testado lá.
- **Estado:** não há banco. O "já enviei essa semana" é conferido buscando, na
  pasta Itens Enviados, um email `[Cobrança SafetyDocs]` daquela semana e
  daquele condomínio. Ver `playbook.md`.
- **Mapeamento:** `mapeamento-predios.md`, mantido manualmente. Fonte única de
  quem pode receber email.

## Não faça sem pedido explícito

- Enviar para qualquer endereço fora de `mapeamento-predios.md`
- Marcar como lido, mover, arquivar ou categorizar email da SafetyDocs
- Responder, encaminhar ou dar reply em qualquer email
- Criar cobrança para um prédio com zero documentos pendentes na semana
