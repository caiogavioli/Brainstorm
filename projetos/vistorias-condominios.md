# Vistorias de Condomínios — Fotos no SharePoint e sincronismo confiável

**Origem:** P-001 (`claude/vistorias-condominios-revisao`)
**Status:** spec fechada — repositório ainda não criado (aguarda pedido explícito do usuário)
**Repositório:** <a criar>

> Dosagem: projeto com várias partes e decisão arquitetural em jogo → ferramentas completas (SWOT, SIPOC, GUT, BSC).

## Problema que resolve
O app de vistorias de condomínio (já em produção, ~40 condomínios, ~5 vistoriadores) grava as fotos direto num banco de dados sem nenhuma cópia de segurança, com espaço limitado — risco real de perder foto ou estourar o banco. Quando a sincronização falha, quem opera o app (vistoriadores, sem conhecimento técnico) não tem como perceber: o aviso fica só na tela, e eles "só preenchem". O usuário, único responsável técnico, só descobre o problema investigando manualmente.

## Cenário (SWOT resumido)
- Forças: app já funcional nos ~40 condomínios; único problema real identificado é o sincronismo/armazenamento de foto; já existe instrumentação de diagnóstico no servidor.
- Fraquezas: foto sem cópia de segurança; falha de sincronização invisível para quem opera; relatório sem revisão interna; só uma pessoa mantém o sistema.
- Oportunidades: Microsoft 365/OneDrive já é corporativo, sem custo adicional; Microsoft Graph API permite gravação por credencial de aplicativo, sem depender de cada vistoriador autorizar.
- Ameaças: espaço do banco atual é finito; a cadeia GitHub Pages + Vercel + banco já causou uma falha real (erro de login por configuração descasada).

O que isso mudou na decisão: não há motivo técnico para reescrever o sistema do zero. O usuário decidiu ir além do ajuste cirúrgico recomendado (mover só as fotos) e migrar todo o sistema para o SharePoint — mas o GUT mostrou que o texto da vistoria, que já sincroniza bem, não é o risco urgente. A migração completa vira v2; a v1 ataca o que realmente dói.

## Escopo da v1
Entra:
- Fotos passam a ser gravadas no SharePoint/OneDrive corporativo (via Microsoft Graph API), em tempo real, no momento da sincronização da vistoria.
- O banco de dados atual passa a guardar só o metadado da foto (id, legenda, referência ao arquivo no SharePoint) — não mais o arquivo em si.
- Rotina de verificação periódica que avisa o usuário (e-mail ou Teams) quando um aparelho fica muito tempo sem sincronizar — sem depender de o vistoriador perceber nada.
- Aba de "conclusão do vistoriador": resumo final que ele revisa e confirma antes de concluir a vistoria, no padrão do boletim diário informativo que a empresa já usa em outro sistema.

Não entra (por decisão consciente, vira v2):
- Migrar o texto da vistoria (notas, observações, checklist) do banco atual para dentro do SharePoint.
- Descontinuar o banco de dados atual.
- Qualquer redesenho do sincronismo offline-first em si — continua funcionando como hoje para o texto.

## Prioridade do escopo (GUT)

| Item | G | U | T | Score | Entra em |
|---|---|---|---|---|---|
| Fotos com cópia em tempo real no SharePoint/OneDrive | 5 | 5 | 4 | 100 | v1 |
| Aviso de falha de sincronização fora do app | 3 | 3 | 3 | 27 | v1 |
| Migração completa do texto da vistoria para o SharePoint | 3 | 2 | 3 | 18 | v2 |
| Aba de conclusão do vistoriador | 2 | 2 | 2 | 8 | v1 (barata e já aprovada — entra junto mesmo com score baixo) |

## Usuários e uso
~5 vistoriadores, cada um no próprio celular (iPhone ou Samsung), cobrindo condomínios diferentes — nunca dois na mesma vistoria. Até 40 condomínios na carteira. Um único usuário técnico (dono do processo), responsável por manter o sistema e por quem os avisos de falha devem chegar.

## Processo: hoje e depois (SIPOC)

Hoje:

| # | Fornecedor (S) | Entrada (I) | Etapa (P) | Saída (O) | Cliente (C) |
|---|---|---|---|---|---|
| 1 | agenda do vistoriador | condomínio + data | percorrer o condomínio, preencher checklist e tirar fotos por área | vistoria preenchida no celular | o próprio vistoriador (local) |
| 2 | o aparelho do vistoriador | vistoria concluída + sinal + login Microsoft | finalizar e sincronizar — fotos vão direto para o banco, sem cópia | vistoria e fotos no servidor — quando funciona, sem aviso se falhar | colegas, painel geral, relatório |
| 3 | o vistoriador | vistoria sincronizada | gerar o relatório (PDF) | arquivo PDF | usuário / equipe |
| 4 | o vistoriador, sem revisão formal | relatório gerado | enviar por e-mail | relatório entregue | administradora, proprietário |

Depois (com o projeto, v1):

| # | Fornecedor (S) | Entrada (I) | Etapa (P) | Saída (O) | Cliente (C) |
|---|---|---|---|---|---|
| 1 | agenda do vistoriador | condomínio + data | percorrer o condomínio, preencher checklist e tirar fotos por área | vistoria preenchida no celular | o próprio vistoriador (local) |
| 2 | o aparelho do vistoriador | vistoria concluída + sinal + login Microsoft | finalizar e sincronizar — texto vai ao banco, fotos vão ao SharePoint em tempo real | vistoria no banco, fotos com cópia garantida no SharePoint | colegas, painel geral, relatório |
| 2b | rotina periódica no servidor | registro de contato de cada aparelho (já existe) | verificar quem está sem sincronizar há muito tempo | aviso por e-mail/Teams | o usuário (único técnico) |
| 3 | o vistoriador | checklist completo | revisar e confirmar na aba de conclusão | vistoria validada pelo próprio vistoriador | o próprio vistoriador |
| 4 | o vistoriador | vistoria validada | gerar o relatório (PDF) | arquivo PDF | usuário / equipe |
| 5 | o vistoriador, sem revisão formal | relatório gerado | enviar por e-mail | relatório entregue | administradora, proprietário |

O que muda: a etapa 2 deixa de ser um ponto cego — fotos ganham cópia de segurança automática e falha vira aviso ativo, não mais um banner que só quem entende de sistema percebe. Entra uma etapa nova (3, revisão do próprio vistoriador) que hoje não existe. A entrega final (e-mail para administradora/proprietário) continua manual, por decisão — fora do escopo da v1.

Exceções tratadas: upload de foto que falha não pode travar a conclusão da vistoria (mesmo cuidado que já existe hoje no envio de foto para o banco) — fica pendente e tenta de novo, como o sincronismo de texto já faz.

## Arquitetura escolhida
O app continua como está: PWA offline-first (React + Vite), gravando primeiro no aparelho (IndexedDB) e sincronizando com o servidor quando há sinal. O texto da vistoria continua indo para o banco de dados atual (PostgreSQL), sem mudança nessa parte na v1.

A mudança é no caminho da foto: em vez de o servidor gravar o arquivo da foto no próprio banco, ele passa a enviá-lo para uma biblioteca de documentos do SharePoint (ou pasta do OneDrive corporativo), organizada por condomínio e vistoria, usando a Microsoft Graph API com uma credencial de aplicativo (não depende de login individual de cada vistoriador). O banco passa a guardar só a referência ao arquivo.

Uma rotina programada (ex. uma vez por dia) lê o registro de contato de cada aparelho — que o sistema já mantém para diagnóstico — e, se algum aparelho está sincronizando um usuário específico há muito tempo sem sucesso, envia um e-mail ao usuário (dono do processo) com os detalhes. Isso fecha o ponto cego: a pessoa que pode agir passa a ser avisada sem precisar checar nada manualmente.

A aba de conclusão do vistoriador é só interface nova na tela de preenchimento, sem mudança de arquitetura.

## Stack
| Camada | Escolha | Por quê |
|---|---|---|
| Front-end | React + Vite (PWA), IndexedDB — mantido | Já funciona, offline-first comprovado em produção |
| Dados de texto da vistoria (v1) | PostgreSQL (banco atual), via funções serverless — mantido | GUT mostrou que não é o risco urgente; já sincroniza bem |
| Armazenamento de fotos (novo) | Microsoft Graph API → SharePoint/OneDrive corporativo | Já pago pela empresa, zero custo adicional — decisão do usuário |
| Autenticação de escrita no SharePoint | App Registration própria, permissão de aplicativo (client credentials), não por vistoriador | Simplicidade operacional — um ponto de configuração só, igual ao login de hoje |
| Aviso de falha de sincronização | Rotina programada (cron) + e-mail/Teams via Graph API | Reaproveita a instrumentação de diagnóstico que o sistema já tem |

## Decisões e trade-offs
| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| Fotos saem do banco e vão para o SharePoint via Graph API, em tempo real | Rotina de backup periódica (proposta de Tomás) | Usuário decidiu por tempo real — coerente com o destino final (v2) ser o SharePoint como sistema de registro |
| v1 mantém o texto da vistoria no banco atual | Migrar tudo de uma vez (leitura literal da Decisão 1 do usuário) | GUT mostrou que o texto não é o risco urgente; migrar tudo de uma vez é mais arriscado sem necessidade imediata — o destino final é preservado, só adiado para a v2 |
| Credencial de aplicativo única para escrever no SharePoint | OAuth delegado, um por vistoriador | Um só ponto de configuração a manter; vistoriador não precisa autorizar nada |
| Aviso de falha por e-mail/Teams, fora do app | Só melhorar o aviso dentro do app | Quem precisa agir (usuário) não é quem vê a tela (vistoriador, que "só preenche") |

## Riscos
- A permissão de aplicativo do Graph API para escrever no SharePoint precisa ser concedida por um administrador do tenant Microsoft 365 da empresa — a confirmar se o usuário tem esse acesso ou precisa pedir a alguém.
- Fotos grandes podem esbarrar em limite de tamanho de requisição da função serverless — mesmo cuidado que já existe hoje precisa se estender ao envio para o Graph API.
- A v2 (migrar também o texto) carrega risco real de redesenhar um sincronismo offline que hoje funciona bem — por isso não faz parte do critério de pronto da v1.
- Mais uma dependência de serviço de terceiro (Microsoft Graph), além dos já existentes — ainda que seja um serviço que a empresa já usa no dia a dia.

## Indicadores de sucesso (Balanced Scorecard)

Objetivo do projeto: garantir que nenhuma vistoria ou foto se perca e que uma falha de sincronização nunca mais passe despercebida, sem gastar com armazenamento de servidor.
Cadeia de causa e efeito: usuário para de precisar vigiar manualmente (Aprendizado) → fotos sempre com cópia e falha sempre avisada (Processos) → relatório sempre completo entregue com confiança (Cliente) → zero custo adicional de armazenamento (Financeira).

| Perspectiva | Objetivo | Indicador | Linha de base | Meta e prazo | Fonte / quem mede | Iniciativa |
|---|---|---|---|---|---|---|
| Financeira | Eliminar custo de armazenamento extra | Custo mensal de armazenamento de fotos | Não medido — hoje no plano gratuito do banco, perto do limite | R$ 0 adicional, confirmado em 30 dias após a entrega | Fatura do banco atual + uso do OneDrive (já pago) | Mover fotos para o SharePoint/OneDrive |
| Cliente | Relatório sempre completo, com todas as fotos | % de vistorias concluídas com todas as fotos presentes no relatório final | Não medido | 100%, revisado 30 dias após a entrega | Conferência do usuário nos primeiros relatórios pós-entrega | Fotos com cópia garantida em tempo real |
| Processos internos | Nenhuma falha de sincronização passa despercebida | Tempo entre a falha acontecer e o usuário ser avisado | Hoje: indefinido (só descobre investigando ou por reclamação) | Até 24h da falha, a partir da entrega | Log/alerta automático (e-mail ou Teams) | Rotina de aviso fora do app |
| Aprendizado e crescimento | Reduzir a dependência do usuário como único ponto capaz de perceber problema | Nº de investigações manuais do usuário por mês | Não medido — hoje acontece toda vez que há dúvida | Zero por mês, 90 dias após a entrega | Registro informal do usuário / contagem de alertas recebidos | Alerta automático + instrumentação já existente |

Revisão: 30 dias e 90 dias após a entrega da v1, pelo usuário.

## Critério de pronto (v1)
- [ ] Fotos novas são gravadas no SharePoint/OneDrive em vez do banco, com fallback que não trava a vistoria se o upload falhar.
- [ ] Metadado da foto no banco aponta para o arquivo correspondente no SharePoint.
- [ ] Rotina de verificação roda periodicamente e avisa o usuário por e-mail (ou Teams) quando um aparelho fica muito tempo sem sincronizar.
- [ ] Aba de conclusão do vistoriador implementada e usada em pelo menos uma vistoria real.
- [ ] Linha de base dos indicadores medida antes de entrar em produção.

## Fora do escopo mas mapeado (v2+)
- Migrar o texto da vistoria (notas, checklist, observações) do banco atual para dentro do SharePoint, descontinuando o banco de dados.
- Reavaliar se o sincronismo offline-first precisa ser redesenhado para funcionar nativamente com a Graph API, sem o cursor por sequência que o banco atual usa hoje.
