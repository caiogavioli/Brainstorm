# P-001 — Vistoria de condomínio analisada automaticamente por IA

## Em uma frase
Hoje o usuário fotografa, escreve cada problema, indica o local e dá a nota da administração no app de vistorias; ele quer que a IA faça a análise (identificar o local, achar os problemas nas fotos, classificar e dar nota) e gere um relatório rastreável que possa ser comparado com os de meses seguintes.

## Como é hoje
Em palavras do usuário: "eu coloco as fotos, eu escrevo os problemas, eu coloco os lugares, e aí eu indico que a administração está com uma nota XYZ baseado no problema que eu encontrei". Ele diz que o app que quer é "igual o aplicativo de vistorias que a gente tem aqui, porém [...] é automático. Quem faz a análise é você."

Contexto vindo do branch `claude/vistorias-condominios-revisao` (mesmo negócio, outro problema: sincronização e armazenamento de fotos do app atual — lá a Rodada 2 já decidiu levar o sistema para o Microsoft 365/SharePoint e mandar as fotos em tempo real para lá). Lido apenas para não duplicar; nada foi copiado para este branch.

## Mapa do processo atual (SIPOC)
Rascunho feito só com o que o usuário disse. Validar na Rodada 1; cada `?` virou pergunta em `sessoes/S-002`.

Começa quando: o vistoriador chega ao condomínio · Termina quando: o relatório com a nota da administração chega a quem o recebe (`?` quem exatamente)

| # | Fornecedor (S) | Entrada (I) | Etapa (P) | Saída (O) | Cliente (C) |
|---|---|---|---|---|---|
| 1 | o condomínio (o prédio em si) | visita agendada | percorrer e fotografar | fotos soltas no aparelho (`?` formato e canal) | o próprio vistoriador |
| 2 | o vistoriador | fotos | indicar o local de cada foto no app | fotos por local | o relatório |
| 3 | o vistoriador | fotos por local | escrever os problemas encontrados | lista de problemas por local | o relatório |
| 4 | o vistoriador (`?` critério) | problemas encontrados | dar a nota da administração | nota "XYZ" (`?` escala e regra) | administradora, proprietário (`?`) |
| 5 | o app de vistorias | locais, problemas, notas | gerar o relatório | relatório em PDF | administradora, proprietário |
| 6 | `?` | relatório novo + relatórios antigos | comparar com vistorias anteriores | `?` (hoje não está claro se existe) | `?` |

Pontos de dor: o usuário não declarou dor de tempo; o pedido é pelo ganho de automatizar a etapa 2 a 4 e pela comparação entre meses (etapa 6). Tempo por vistoria: não medido.
Exceções (`?`): foto de local ambíguo, foto ruim (escura, tremida), problema que aparece em mais de uma foto, problema já registrado em vistoria anterior.

## Frequência e volume
- Acontece: periodicidade por condomínio não informada; o usuário prevê "outros relatórios meses depois".
- Tempo gasto por vez: não medido.
- Volume: até 40 condomínios (dado do outro branch); fotos por vistoria não informado.

## Quem sofre
O usuário, que faz a análise à mão. (`?` se os vistoriadores também mandariam as fotos.)

## O que já foi tentado
O app de vistorias atual faz o registro manual (checklist por área, nota, foto, observação, PDF). Nada de análise automática ainda.

## Como saberíamos que resolveu
Candidatos, a confirmar na Rodada 2: tempo por vistoria menor; mesma nota para as mesmas condições em meses diferentes; todo achado ligado à foto, ao local e à data; comparação entre vistorias sem refazer à mão.

Linha de base (hoje): não medido. A primeira tarefa, se virar projeto, é cronometrar uma vistoria real.

## Prioridade (GUT)
Não se aplica — problema único.

## Restrições conhecidas
- Microsoft 365/OneDrive já pago pela equipe (do outro branch).
- Só o usuário mexe na parte técnica (do outro branch).
- Relatório vai a administradora e proprietário; erro de análise sai com o nome do usuário.
- Fotos podem ter pessoas, placas e documentos (`?` restrição de cliente para enviar a serviço externo).
