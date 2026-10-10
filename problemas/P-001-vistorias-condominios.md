# P-001 — App de vistorias de condomínios não está confiável para a equipe

## Em uma frase
O app que registra as vistorias de condomínio (checklist por área, fotos, relatório) não dá confiança de que as fotos chegam e ficam guardadas com segurança — e o usuário quer uma revisão geral de qualidade, não só o conserto pontual.

## Como é hoje
- Cerca de 5 vistoriadores, cada um no próprio celular (iPhone ou Samsung), cobrindo prédios diferentes — nunca duas pessoas na mesma vistoria ao mesmo tempo (o usuário cuida dos seus prédios, o André dos dele, e assim por diante).
- Fluxo esperado: o vistoriador percorre o condomínio, preenche o checklist por área (nota, foto, observação) no app, e ao terminar aperta "finalizar" — a sincronização deveria acontecer nesse mesmo gesto.
- O app grava tudo primeiro no aparelho (offline-first) e sincroniza com um banco central (Postgres) quando há sinal e login Microsoft válido.
- As fotos vão direto para esse banco central, sem nenhuma cópia em outro lugar — é aí que mora o risco: perder foto ou estourar o espaço disponível (plano gratuito, limite da ordem de 60 vistorias completas com foto).
- O relatório final sai como PDF (impressão da página do app) e vai por e-mail para a administradora do condomínio **e** para o proprietário — sem revisão interna antes do envio.
- Até 40 condomínios na carteira (35–40).
- Só o usuário mexe na parte técnica do sistema — ninguém mais na equipe tem esse conhecimento.
- Microsoft 365 (com OneDrive) é corporativo — toda a equipe já tem acesso, sem custo adicional.

## Mapa do processo atual (SIPOC)

**Começa quando:** chega a data de uma vistoria agendada num condomínio · **Termina quando:** o relatório em PDF chega por e-mail à administradora e ao proprietário

| # | Fornecedor (S) | Entrada (I) | Etapa (P) | Saída (O) | Cliente (C) |
|---|---|---|---|---|---|
| 1 | agenda do vistoriador | condomínio + data | percorrer o condomínio, preencher checklist e tirar fotos por área | vistoria preenchida no celular | o próprio vistoriador (ainda local) |
| 2 | o aparelho do vistoriador | vistoria concluída + sinal + login Microsoft | finalizar e sincronizar com o banco central | vistoria e fotos no servidor — **quando funciona** | colegas de equipe, painel geral, o próprio relatório |
| 3 | o vistoriador | vistoria sincronizada | gerar o relatório (imprimir a tela como PDF) | arquivo PDF | usuário / equipe |
| 4 | o vistoriador (sem revisão formal) | relatório gerado | enviar por e-mail | relatório entregue | administradora do condomínio, proprietário |

**Pontos de dor:**
- Etapa 2 é dupla: (a) já existiu um erro de login (401) por descasamento de configuração — corrigido; (b) o problema de fundo, que segue aberto, é a sincronização **dos arquivos de foto** e onde eles ficam guardados — hoje sem nenhuma cópia de segurança, direto para um banco com espaço limitado.
- Etapa 2 também é invisível para quem opera: os vistoriadores não entendem de sincronização nem de sistema, só preenchem — não têm como perceber quando algo falhou, mesmo o app avisando na tela.
- Etapa 4 não tem revisão — o usuário já sinalizou que quer criar uma (ver "O que já foi tentado" / pedido de melhoria abaixo).

**Exceções:** quando a sincronização falha, o app grava um aviso discreto na tela ("nada foi perdido, dados continuam no aparelho") e deixa a pessoa seguir trabalhando — para alguém que "só preenche", esse aviso não é notado; o problema só aparece quando o usuário (único técnico) percebe de fora.

**Lacunas (`?`):** nenhuma crítica restante para a Rodada 1 — o que falta agora é de solução (Rodada 2): como garantir cópia das fotos sem custo de servidor, e como tornar uma falha de sincronização visível para quem não entende de sistema.

## Frequência e volume
- Acontece: vistorias recorrentes por condomínio (periodicidade exata não informada, não crítico para a decisão).
- Tempo gasto por vez: não medido.
- Volume: até 40 condomínios ativos, ~5 vistoriadores.

## Quem sofre
- O usuário, que não confia no sistema e é o único capaz de diagnosticar quando algo falha.
- Os vistoriadores, indiretamente — preenchem sem saber se o trabalho realmente chegou ao servidor.
- Potencialmente a administradora/proprietário, se uma foto se perde e o relatório final sai incompleto — risco de qualidade percebida pelo cliente, que é a preocupação central do usuário.

## O que já foi tentado
O app foi construído especificamente para isso (não é planilha anterior). A sincronização com conta Microsoft foi adicionada recentemente e já causou um episódio de toda a equipe ficar sem sincronizar, por descasamento de configuração entre a publicação do app e a API — corrigido nesta conversa. Mas o problema que o usuário aponta como o maior não é esse: é a falta de cópia de segurança das fotos e o risco de espaço.

**Pedido de melhoria já levantado pelo usuário (entra na Rodada 2, não é resposta de Rodada 1):** criar uma aba/etapa de "conclusão do vistoriador" — um resumo que ele preenche e valida antes de finalizar a vistoria, no mesmo padrão do boletim diário informativo que a empresa já usa em outro sistema.

## Como saberíamos que resolveu
A proposta do usuário é ampla ("tudo que eu posso fazer para melhorar... cada vez mais qualidade"), não um critério único. Critérios candidatos, a confirmar na Rodada 2:
- Nenhuma foto perdida, com cópia fora do banco de dados principal.
- Falha de sincronização visível sem depender de o usuário checar manualmente.
- Sem custo extra de armazenamento de servidor.

Linha de base (hoje): não medido. Primeira tarefa, se isso virar projeto, é medir quantas vistorias/fotos já estão vulneráveis ao risco de espaço hoje.

## Prioridade (GUT)
Não se aplica — problema único apresentado nesta rodada.

## Restrições conhecidas
- Microsoft 365 com OneDrive é corporativo, toda a equipe tem acesso — **sem custo adicional** é restrição explícita do usuário para a solução de armazenamento.
- Só o usuário mexe na parte técnica — qualquer solução depende só dele para manter.
- Equipe não é técnica — qualquer melhoria de confiabilidade (ex.: avisos de erro) precisa funcionar sem exigir entendimento de sistema de quem preenche.
- App já em produção, usado por ~40 condomínios — mudança não pode quebrar o que já funciona nem perder dados existentes.
