# Entrega

## Cobrança aos condomínios

Enviada de `caio@dfsindicos.com.br` para o email **confirmado** de cada
condomínio em `mapeamento-predios.md`. Fica automaticamente em **Itens
Enviados** — não precisa de cópia para o Caio para ele ter o registro. Formato
em `formato-mensagem.md`.

## Resumo semanal para o Caio

Mesma lógica da mensagem diária da Triagem Contratante: **email do usuário
para o usuário**, porque ele vive no Outlook do Android e é onde ele vai
notar se a rotina parou de rodar. Enviado **sempre**, mesmo numa semana sem
nenhum condomínio para cobrar — silêncio total é ambíguo entre "nenhum
prédio tinha pendência" e "a rotina quebrou".

Estrutura:

```
[Cobrança SafetyDocs] Resumo da rodada — DD/MM

✅ Cobrados (n): <lista de condomínios>
⚪ Sem pendência esta semana (n): <lista>
⚠️ Pendentes de mapeamento (n) — confirme o email em mapeamento-predios.md:
   <rótulo exato como veio no informativo>
❌ Falhas (se houver): <o que faltou e por quê>
```

## Por que não existe estado em banco/arquivo separado

O "já enviei essa semana" é conferido direto na pasta Itens Enviados (Passo 6
do playbook) — não há arquivo de índice para ficar dessincronizado. O
"quem pode receber email" é só `mapeamento-predios.md`, versionado no git,
editável à mão pelo Caio a qualquer momento sem precisar de sessão do Claude.
