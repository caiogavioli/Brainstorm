# Playbook da rotina semanal

Isto é o que a rotina executa toda segunda-feira. Siga na ordem. Antes de
começar, leia `CONTEXTO.md`, `mapeamento-predios.md`, `formato-mensagem.md` e
`entrega.md`.

---

## Passo 0 — Contexto fixo

| Item | Valor |
|---|---|
| Caixa de leitura e envio | `caio@dfsindicos.com.br` |
| Remetente monitorado | `helpdesk@safetydocs.com.br` |
| Assuntos monitorados | `(A VENCER) Informativo SafetyDocs :: Permits (DD/MM/AAAA)` e `(VENCIDO) Informativo SafetyDocs :: Permits (DD/MM/AAAA)` |
| Fuso | America/Sao_Paulo (BRT). A API devolve UTC — converter antes de comparar datas |
| Mapeamento | `mapeamento-predios.md` — fonte única de quem pode receber email |

---

## Passo 1 — Buscar os dois informativos da semana

Buscar na Inbox, remetente `helpdesk@safetydocs.com.br`, dos últimos 7 dias.
Entre os resultados, achar o mais recente cujo assunto comece com
`(A VENCER) Informativo SafetyDocs` e o mais recente que comece com
`(VENCIDO) Informativo SafetyDocs`.

**Se faltar um dos dois:** não processar nada essa semana. Ir direto para o
Passo 8 e mandar só o resumo de falha para o Caio — nunca montar cobrança com
metade do dado.

## Passo 2 — Ler o corpo dos dois emails

`read_resource` nos dois. O corpo é HTML: depois de um bloco de KPIs, vem um
rótulo de portfólio (ex. `BGRE`) e, repetido por prédio, um parágrafo com o
nome do prédio seguido de uma tabela com colunas **Documento, Responsável,
Vencimento, Importância, Status, Arquivo, Prazo, Últ. Comentário** — uma linha
por documento pendente daquele prédio.

Ler os dois emails inteiros nesta etapa — ao contrário da Triagem
Contratante, aqui o dado que importa (a lista em si) só existe no corpo, não
tem como trabalhar só com o preview.

## Passo 3 — Separar por prédio

Para cada um dos dois emails, montar uma lista `{ prédio, documentos[] }`. Um
prédio pode não aparecer nos dois (ex.: só tem vencido, não tem a vencer, ou
vice-versa) — tudo bem, tratar como lista vazia do lado que faltar.

Juntar as duas listas por nome de prédio: cada prédio termina com
`{ aVencer: [...], vencido: [...] }`.

**Se um email não tiver nenhum prédio reconhecível** (formato mudou, tabela
sumiu, etc.): tratar como o Passo 1 — não processar nada, sinalizar no
resumo. Nunca mandar cobrança com uma extração que parece errada.

## Passo 4 — Cruzar com o mapeamento

Para cada prédio da lista, procurar o rótulo em `mapeamento-predios.md`:

- **Não existe linha para esse rótulo** → criar uma entrada nova no arquivo
  com `status: a confirmar` (deixar o email em branco), **não enviar**, contar
  como "pendente de mapeamento" no resumo.
- **Existe, `status: a confirmar`** → não enviar, contar como pendente.
- **Existe, `status: ignorado`** → pular, sem contar como pendente.
- **Existe, `status: confirmado`** → segue para o Passo 5.

## Passo 4-B — Agrupar prédios que viram um único email

Alguns pares de rótulos são torres/blocos diferentes do mesmo prédio e devem
virar **uma cobrança só** — a lista exata está em `mapeamento-predios.md`,
seção "Grupos de envio" (hoje: Centenário = B1 + B2; Panamerica = B2 + B5).

Depois do Passo 4, para cada par do grupo: somar os documentos (`aVencer` +
`vencido`) dos dois rótulos num único condomínio de destino, mantendo dentro
de cada tabela (vencidos e a vencer) uma subseção por rótulo original — para
o gestor saber se um item é do B1 ou do B2, por exemplo. Ver
`formato-mensagem.md`. O nome usado no assunto e no corpo é o nome do grupo
("Centenário", "Panamerica"), não o rótulo individual do informativo.

Os demais prédios (sem par em "Grupos de envio") seguem 1 rótulo = 1 email,
sem alteração.

## Passo 5 — Decidir se envia

Para cada prédio confirmado: se `aVencer` e `vencido` estiverem **os dois
vazios**, não enviar nada para esse condomínio — sem "tudo em dia". Contar
como "sem pendência" no resumo, separado de quem recebeu.

## Passo 6 — Checar se já enviou essa semana

Antes de enviar, buscar na pasta **Itens Enviados**, remetente
`caio@dfsindicos.com.br`, assunto contendo `[Cobrança SafetyDocs]`, o nome do
condomínio **e a data do informativo desta rodada** (o `(DD/MM)` do final do
assunto — ver `formato-mensagem.md`). Se já existe um envio com essa mesma
data → pular (idempotência: uma reexecução manual não duplica quem já
recebeu). Isso vale mesmo se a rotina travou no meio da rodada e for retomada
depois.

**Não usar só "últimos 7 dias" sem checar a data no assunto.** A cobrança da
semana anterior (com outra data) pode cair dentro de uma janela solta de 7
dias a partir da segunda seguinte — isso geraria um falso positivo de "já
enviado" e pularia a cobrança nova por engano. A data no assunto é o
identificador confiável de qual semana aquele envio pertence.

## Passo 7 — Montar e enviar

Formato exato em `formato-mensagem.md`. Enviar para o email confirmado em
`mapeamento-predios.md` daquele prédio, **em cópia (CC) os cinco
colaboradores fixos** listados em `formato-mensagem.md` — nunca para
endereço extraído do próprio corpo da SafetyDocs (a coluna Responsável, por
exemplo, não é destinatário nem cópia).

## Passo 8 — Mandar o resumo da rodada para o Caio

Sempre, mesmo em semana sem nada para enviar. De `caio@dfsindicos.com.br` para
`caio@dfsindicos.com.br`, assunto:

```
[Cobrança SafetyDocs] Resumo da rodada — DD/MM
```

Conteúdo: quantos condomínios receberam cobrança (com nomes), quantos ficaram
sem pendência, quantos ficaram pendentes de mapeamento (com o rótulo exato,
para ele ir direto em `mapeamento-predios.md`), e qualquer falha do Passo 1/3.
Detalhes do formato em `entrega.md`.

---

## O que a rotina nunca faz

1. Enviar para endereço que não está `confirmado` em `mapeamento-predios.md`
2. Enviar cobrança de um condomínio para outro (checar duas vezes o
   cruzamento rótulo → email antes de cada envio)
3. Marcar como lido, mover, arquivar ou categorizar email da SafetyDocs
4. Responder, encaminhar ou dar reply em qualquer email
5. Inventar, resumir ou arredondar um documento da lista
6. Enviar cobrança duplicada na mesma semana para o mesmo condomínio
7. Omitir o resumo semanal para o Caio "porque não teve nada"
