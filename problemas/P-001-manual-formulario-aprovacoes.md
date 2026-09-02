# P-001 — Manual de preenchimento do formulário de aprovações

**Fase:** rodada 2 — propostas em `sessoes/S-002-manual-formulario-aprovacoes-rodada-2.md`
**Apresentado em:** 2026-09-02

## Apresentação do usuário (palavras dele)

> sou auditado para atender todas as regras do meu cliente, que estão nos arquivos anexos (procedimentos). para isso, a administradora faz o trabalho, e eu aprovo (assino contratos e quadros de concorrencia). fiz aquele sistema de aprovações, o qual tem um formulário para meu funcionário preencher a cada aprovação que for fazer. mas, senti falta de um manual/procedimento para o preenchimento daqueles formulários. por favor crie um manual para orientar meu funcionário. use o brainstorm para criar esse projeto

## Documentos anexados nesta apresentação

São os procedimentos de compliance do cliente do usuário (Brookfield Properties), origem das regras pelas quais ele é auditado:

- **Procedimento de Contas a Pagar** (PRO-005, v01/2024) — comprovantes aceitos, conferência de nota fiscal, vedação a aprovar despesa própria.
- **Procedimento de Elaboração e Gestão de Contratos** (PRO-003, v01/2024) — quando usar Contrato x CGC, Due Diligence obrigatória por tipo de terceiro, alçadas de aprovação de Due Diligence por risco (baixo/médio/alto), assinatura, prazos (até 36 meses).
- **Procedimento de Gestão de Compras** (PRO-004, v01/2024) — etapas do processo de compra, número mínimo de propostas por faixa de valor, Mapa de Cotação, alçadas de aprovação por valor (até R$5mil / até R$30mil / acima de R$30mil).
- **Matriz de Contratos** — condições comerciais negociáveis (multa, prazo, seguro, foro etc.) e seus limites de exceção.
- **Apresentação de Treinamento de Compliance (Out/24)** — versão resumida em slides dos quatro documentos acima, incluindo tabela de alçadas de aprovação de compras e de Due Diligence.

Esses documentos são a fonte da verdade das regras; nenhum deles é, em si, o formulário do sistema de aprovações do usuário.

## O sistema de aprovações (achado na Rodada 1)

É o repositório privado [`caiogavioli/aprovacoes-contratos-concorrencia`](https://github.com/caiogavioli/aprovacoes-contratos-concorrencia) — Next.js + Prisma + Postgres, já em produção, substituto de dois quadros do Monday.com. Detalhes completos em `sessoes/S-001-*.md`. Resumo:

- **Formulário 1 — Aprovação de Contratos** (`/contratos/novo`): checklist fixo `CT.1`–`CT.16`.
- **Formulário 2 — Aprovação de Quadro de Concorrência** (`/concorrencia/novo`): checklist fixo `CP.1`–`CP.26`, condicional (Produto x Serviço, faixa de valor do QC).
- Cada pergunta é sim/não/não-se-aplica, sem explicação embutida do que ela significa, qual documento comprova, ou qual regra está por trás.
- O resultado (aprovado/recusado) é um registro/checklist de conferência prévio — não é a aprovação final, que acontece no sistema próprio de cada administradora (CBRE, Cushman, Innova, HFlex).
- Vale para os 11 condomínios da carteira do usuário, não só para ativos da Brookfield.

## Em uma frase

O funcionário que preenche o formulário de aprovação (para o usuário assinar contratos e quadros de concorrência) não tem um guia de como preencher — só os procedimentos do cliente, que são densos, genéricos para qualquer condomínio da carteira e não foram escritos pensando no formulário específico do usuário.

## Como é hoje

O funcionário (Controladoria, equipe direta do usuário) recebe o Mapa de Cotação/contrato que a administradora preparou, avalia e preenche um dos dois formulários várias vezes por dia, marcando sim/não/não-se-aplica pergunta por pergunta, sem nenhum guia — só o que sabe de cabeça. Não há validação automática no sistema. O resultado é um registro de conferência prévio; a aprovação de fato acontece depois, no sistema da administradora.

## Frequência e volume

- Acontece: várias vezes por dia (2 formulários diferentes, 11 condomínios, 4 administradoras).
- Cada preenchimento consulta o manual pretendido — não é treinamento único, é consulta recorrente.

## Quem sofre

O funcionário, que preenche sem um guia. E o usuário, que assina o que foi preenchido e é o auditado — um erro no formulário pode virar não conformidade em auditoria dele, mesmo sem ele ter causado o erro.

## O que já foi tentado

O sistema de aprovações com os dois formulários já existe e está em uso (histórico de 51 contratos e ~147 quadros de concorrência migrados do Monday). Falta a camada de instrução: nenhuma pergunta do checklist vem com explicação, documento de referência ou regra por trás.

## Erros reais já observados

- Valor da proposta comercial diferente do valor final do contrato (bate com `CT.12`).
- Data de início de vigência posterior à data de assinatura (bate com `CT.13`).
- Segundo o usuário, **não há um erro mais comum** — as administradoras erram em todos os pontos do checklist, então o manual precisa cobrir cada pergunta, não só as duas acima.

## Como saberíamos que resolveu

_A fechar na Rodada 2 — candidato natural: menos itens reprovados por preenchimento incorreto (não por reprovação legítima do fornecedor/processo), medido pelo próprio dashboard do sistema de aprovações._

## Restrições conhecidas

- O cliente cujas regras valem é a Brookfield Properties — as regras vêm dos 5 documentos anexados.
- O usuário aprova/assina; não é ele quem preenche o formulário — é a Controladoria.
- Manual final: PDF solto (decisão do usuário, resposta 11 da Rodada 1).
- Procedimentos do cliente são revisados pontualmente, sem calendário fixo — o usuário mesmo consegue manter o manual atualizado.
- Vale para toda a carteira (11 condomínios, 4 administradoras), não só ativos formalmente da Brookfield.
