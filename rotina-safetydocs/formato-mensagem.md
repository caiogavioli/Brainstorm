# Formato do email de cobrança

Um email por condomínio, por semana. Vai para quem administra o dia a dia do
prédio — não é um relatório para o Caio, é uma cobrança para quem precisa agir.

## Destinatários

**Para:** o(s) email(s) `confirmado(s)` do condomínio em `mapeamento-predios.md`.

**Cópia (CC), fixa em toda cobrança** — colaboradores da DF Síndicos, pedido
do Caio em 11/08/2026:

```
amanda@dfsindicos.com.br
andre@dfsindicos.com.br
anapaula@dfsindicos.com.br
controladoria@dfsindicos.com.br
denise@dfsindicos.com.br
```

A trava de destinatário (`guard-destinatario-safetydocs.sh`) já libera esses
cinco endereços em CC, além dos condomínios confirmados — não precisa pedir
liberação adicional.

## Assunto

```
[Cobrança SafetyDocs] <Nome do condomínio> — <n> documento(s) pendente(s) (DD/MM)
```

A data é a do informativo da semana (a mesma dos dois assuntos da SafetyDocs).
O prefixo `[Cobrança SafetyDocs]` é fixo — é o que a rotina usa para reconhecer
que já mandou cobrança para aquele condomínio naquela semana (ver
`playbook.md`, Passo 6).

## Corpo

Tom profissional, direto, sem ser agressivo — é cobrança recorrente, não a
primeira nem a última. Texto de abertura **fixo**, decidido pelo Caio em
11/08/2026 — não parafrasear, usar literalmente:

```
Olá pessoal.

Peço que me atualizem sobre o status de cada documento "A VENCER" e
"VENCIDOS", conforme lista abaixo enviada pelo Safetydocs. Reforço a
necessidade de plano de ação para regularizar sua unidade com brevidade.

🔴 DOCUMENTOS VENCIDOS (<n>)
[tabela: Documento | Responsável | Vencimento | Importância | Prazo]

🟡 DOCUMENTOS A VENCER (<n>)
[tabela: Documento | Responsável | Vencimento | Importância | Prazo]

Atenciosamente,

Caio Gavioli
DF Síndicos Profissionais — Compromisso com a Qualidade
📱 (11) 98323-1173
✉️ caio@dfsindicos.com.br
🌐 www.dfsindicos.com.br
```

### Sobre a assinatura em imagem

O Caio pediu a assinatura real (cartão com logo, em imagem). **Não é possível
pelo canal de envio desta rotina**: o `outlook_send_mail` do conector
Microsoft 365 sanitiza o HTML antes de enviar e remove qualquer tag `<img>` —
proteção do próprio conector, não uma escolha de implementação, e vale tanto
para teste quanto para os envios reais de segunda. Decisão do Caio em
11/08/2026: recriar as mesmas informações do cartão **em texto formatado**
(acima), sem o logo. Se um dia a rotina passar a enviar por uma via que não
sanitize HTML (ex. API própria em vez do conector), a imagem pode voltar.

Colunas usadas: as mesmas do informativo da SafetyDocs, exceto **Status**,
**Arquivo** e **Últ. Comentário** — cortadas porque são ruído para quem só
precisa saber o quê, quem e até quando. Se um documento não tiver
`Responsável`, mostrar `—`, nunca omitir a linha.

## Prédios agrupados (Centenário, Panamerica)

Quando o email cobre mais de um rótulo do informativo (ver
`mapeamento-predios.md`, "Grupos de envio"), cada tabela — vencidos e a
vencer — ganha uma subseção por rótulo original, para o gestor saber a que
bloco/torre cada item pertence:

```
🔴 DOCUMENTOS VENCIDOS (<n total>)

Centenário Plaza B1 - Flórida
[tabela]

Centenário Plaza B2 - Robocop
[tabela]
```

O `<n>` no cabeçalho da seção é a soma dos dois; o assunto usa o nome do
grupo ("Centenário", não "Centenário Plaza B1 - Flórida").

## Regras

- **Nunca resumir a lista.** Cada documento pendente daquele condomínio entra
  na tabela, exatamente como veio no informativo da SafetyDocs — nome,
  vencimento e importância inclusive.
- **Vencidos antes de a vencer.** Dentro de cada tabela, ordenar por
  `Vencimento` mais antigo primeiro.
- **Zero documentos → não envia.** Ver `playbook.md`, Passo 5. Não existe
  versão "tudo em dia" deste email.
- **HTML simples.** Só `<table>`, `<tr>`, `<th>`, `<td>`, `<p>`, `<b>`, `<hr>` —
  sem CSS externo, sem `<style>`, para sobreviver a qualquer cliente de email.
