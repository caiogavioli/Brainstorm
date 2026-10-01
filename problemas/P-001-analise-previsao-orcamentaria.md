# P-001 — Análise e parecer das previsões orçamentárias de condomínios

## Em uma frase
As administradoras mandam a previsão orçamentária dos condomínios em Excel, apresentações e outros documentos, e o usuário precisa conferir tudo linha a linha e emitir um relatório com parecer — trabalho manual, extenso e sujeito a deixar passar erro.

## Como é hoje
Esboço inicial (a confirmar na Rodada 1):

1. A administradora envia o material (planilhas Excel, apresentações, "uma série de documentos").
2. O usuário analisa linha a linha: gastos, custos, reajuste proposto, coerência das linhas (manutenção, segurança, limpeza etc.) contra o realizado do ano anterior, aplicação correta dos índices, se as contas batem, se as fórmulas estão certas.
3. O usuário emite um relatório com parecer sobre o material.

Ferramentas: Excel e PowerPoint (do lado das administradoras); o formato do relatório final ainda não foi dito.

## Frequência e volume
- Acontece: ciclo anual, a partir do 2º trimestre
- Tempo gasto por vez: "alguns dias" por previsão (tempo corrido)
- Volume: ~30 condomínios por ciclo; arquivos de até 50 MB; formatos variados (Excel, apresentações, outros); plano de contas próprio de cada administradora e de cada condomínio

## Quem sofre
O usuário e a equipe dele (4 pessoas). O relatório vai para o **proprietário**, por email ou apresentação presencial.

## O que já foi tentado
Nada. O prompt que o usuário achava ter era de outro tema — não existe prompt nem modelo de relatório anterior. Tudo é feito do zero.

## Como saberíamos que resolveu
Hipótese de trabalho (a confirmar na Rodada 2): o usuário joga os arquivos da previsão aqui e recebe de volta o relatório com parecer, com os achados rastreáveis (linha, valor, motivo).

## Restrições conhecidas
- Os documentos vêm das administradoras em formatos variados.
- O pedido do usuário é por um "espaço no Code" (este ambiente) + um prompt, não por um sistema à parte.
- Dados de terceiros (orçamentos de condomínios): o usuário aceita que os arquivos fiquem em OneDrive ou Google Drive; não citou GitHub.
- Não há contratos para cruzar; a conferência de reajuste só pode ser contra o índice informado na planilha.
- O "realizado do ano anterior" vem copiado e colado dentro da planilha da administradora — não há fonte independente.
- Erro que mais importa: valor calculado errado contra o ano anterior e contra o índice de reajuste.
- Não existe controle/tracking dessas previsões hoje.
