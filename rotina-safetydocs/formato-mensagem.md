# Formato do email de cobrança

Um email por condomínio, por semana. Vai para quem administra o dia a dia do
prédio — não é um relatório para o Caio, é uma cobrança para quem precisa agir.

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
primeira nem a última. Duas seções, só as que tiverem item:

```
Olá,

Segue a atualização semanal de documentos do <Nome do condomínio> pendentes na
plataforma SafetyDocs. Pedimos a regularização o quanto antes.

🔴 DOCUMENTOS VENCIDOS (<n>)
[tabela: Documento | Responsável | Vencimento | Importância | Prazo]

🟡 DOCUMENTOS A VENCER (<n>)
[tabela: Documento | Responsável | Vencimento | Importância | Prazo]

Qualquer dúvida sobre um item específico, é só responder este email.

Atenciosamente,
Caio Gavioli
```

Colunas usadas: as mesmas do informativo da SafetyDocs, exceto **Status**,
**Arquivo** e **Últ. Comentário** — cortadas porque são ruído para quem só
precisa saber o quê, quem e até quando. Se um documento não tiver
`Responsável`, mostrar `—`, nunca omitir a linha.

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
