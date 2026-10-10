# P-001 — App de vistorias de condomínios não está confiável para a equipe

## Em uma frase
O app que registra as vistorias de condomínio (checklist por área, fotos, relatório) está deixando a equipe sem conseguir sincronizar o trabalho de uns com o dos outros, e o usuário não tem mais confiança nele.

## Como é hoje
<rascunho — a rotina real da equipe ainda não foi descrita pelo usuário; o que segue é o que o sistema faz tecnicamente, não o fluxo de trabalho das pessoas. Perguntas 1–5 e 6–9 abaixo existem para preencher isso.>

O que se sabe do sistema (técnico, não é rotina de uso):
- É um app web (PWA) que funciona offline no celular: o vistoriador percorre o condomínio, dá nota por área, tira fotos e escreve observações, tudo gravado primeiro no aparelho.
- Esse registro só aparece para o resto da equipe depois de sincronizar com um banco central (Postgres) — e a sincronização exige login com a conta Microsoft da empresa.
- O relatório final é uma página HTML que vira PDF pelo "Imprimir" do navegador — não existe um PDF gerado e guardado automaticamente em lugar nenhum.
- As fotos ficam hoje dentro do mesmo banco central (como dado binário), não em arquivo — é esse armazenamento que o usuário está cogitando trocar por OneDrive.
- O plano gratuito do banco atual tem espaço para algo em torno de 60 vistorias completas com foto; depois disso, precisa de outro lugar para as fotos.

## Mapa do processo atual (SIPOC)

**Começa quando:** chega a data de uma vistoria agendada num condomínio  ·  **Termina quando:** o relatório chega a quem vai usá-lo (síndico, administradora ou proprietário — `?`)

| # | Fornecedor (S) | Entrada (I) | Etapa (P) | Saída (O) | Cliente (C) |
|---|---|---|---|---|---|
| 1 | `?` (quem agenda) | agenda da vistoria | percorrer o condomínio e preencher o checklist no app (nota, foto, observação por área) | vistoria preenchida no celular do vistoriador | o próprio vistoriador (ainda local) |
| 2 | o aparelho do vistoriador | vistoria preenchida + sinal de internet + login Microsoft válido | sincronizar com o banco central | vistoria disponível para o resto da equipe — **quando funciona** | colegas de equipe, painel geral |
| 3 | o vistoriador (ou `?` outra pessoa) | vistoria concluída no app | gerar o relatório (imprimir a tela como PDF) | arquivo de relatório | `?` |
| 4 | `?` | relatório gerado | `?` revisar antes de entregar | `?` | `?` |
| 5 | `?` | relatório | entregar ao destinatário final | relatório recebido | síndico / administradora / proprietário (`?` qual) |

**Pontos de dor:** etapa 2 — é onde o problema relatado acontece: a sincronização falha (já confirmado um caso de erro 401 por descasamento de configuração entre o app publicado e a API) e, mesmo corrigido uma vez, a equipe segue sem ver o trabalho umas das outras.
**Exceções:** quando a etapa 2 falha, o app avisa discretamente ("nada foi perdido, dados continuam no aparelho") e deixa a pessoa seguir trabalhando — o que significa que a falha pode passar despercebida por dias sem ninguém perceber que aquele vistoriador está "ilhado".
**Lacunas (`?`):** quem agenda as vistorias; quem gera e revisa o relatório final; qual o canal de entrega (e-mail, WhatsApp, impresso); quem é de fato o cliente final de cada vistoria; se há um passo de conferência antes de sair da mão da DF Síndicos.

## Frequência e volume
- Acontece: `?`
- Tempo gasto por vez: `?`
- Volume: `?` quantos condomínios ativos, quantas vistorias por mês, quantas pessoas na equipe fazendo vistoria

## Quem sofre
O usuário (dono do processo) e a equipe de vistoriadores, que não conseguem ver o trabalho umas das outras. Possivelmente o cliente final (síndico/administradora/proprietário), se isso atrasa a entrega do relatório — a confirmar.

## O que já foi tentado
O app foi construído especificamente para isso (não é planilha/gambiarra anterior). A sincronização com conta Microsoft foi adicionada recentemente e já causou pelo menos um episódio de todo mundo ficar sem sincronizar por um descasamento de configuração entre a publicação do app e a API — corrigido nesta conversa, mas o usuário continua sem confiança no sistema.

## Como saberíamos que resolveu
`?` — critério ainda não definido pelo usuário.

Linha de base (hoje): não medido. Primeira tarefa, se isso virar projeto, é medir: quantas vistorias estão "presas" sem sincronizar agora, e com que frequência isso se repete.

## Prioridade (GUT)
Não se aplica — problema único apresentado nesta rodada.

## Restrições conhecidas
- Equipe inteira usa conta Microsoft 365 da empresa (DF Síndicos) — login já integrado a isso.
- Usuário está cogitando guardar as fotos no OneDrive em vez de no banco atual — ainda não avaliado se é tecnicamente viável do jeito que ele imagina (ver pergunta 11).
- Dispositivos da equipe: `?` (celular, qual sistema operacional).
