# S-004 — Regras de devolução, item a item do formulário

**Data:** 2026-10-06
**Contexto:** depois do piloto, o usuário achou a regra "BGRE com Não = bloqueante" dura demais (S-003). Ele pediu para o Claude perguntar, uma a uma, todas as perguntas do formulário (CP.1 a CP.26), e para cada uma ele diz se a resposta "Não" devolve o QC ou se há análise a fazer antes de devolver. Esta sessão substitui a regra simples da S-003 conforme cada item for respondido.

## Duas decisões gerais

1. **Relatório sem limitações de leitura.** Nenhum relatório menciona que algo não foi analisado, que o arquivo era PDF ou imagem, nem outras limitações técnicas de leitura. Isso fica só no resumo que o Claude dá ao usuário no chat.
2. **Devolução por item.** Cada pergunta do formulário tem uma regra própria: devolve sempre, devolve depois de uma análise (que a skill executa) ou só vira ressalva. Valores abaixo, na ordem em que o usuário respondeu.

## Respostas

| Item | Regra | Palavras do usuário |
|---|---|---|
| CP.1 Mínimo de propostas | **Sem justificativa no mapa: devolve sempre. Com justificativa: analisar se convence antes de decidir.** | "Devolve sempre sem justificativa; com justificativa, analise se convence" |
| CP.2 Preenchimento do QC — campo obrigatório vazio | **Analisar:** verificar se o campo é crítico, isto é, se faz falta para decidir aprovar o mapa. Só devolve se for crítico; senão, ressalva | "Campo vazio precisa de analise, verificar se é algo critico (faz falta para a decisão de aprovar o mapa)" |
| CP.2 — justificativa ausente ou genérica | **Analisar antes** de decidir | "justificativa genérica, analise antes" |
| CP.2 — mapa sem itens (só valor global) | **Analisar se dá para equalizar pelas propostas.** Se dá, o relatório faz a equalização; se não dá, devolve | "mapa sem itens: analisa se dá para equalizar pelas propostas" |
| CP.3 Papel timbrado — falta CNPJ | **Analisar antes:** o CNPJ pode aparecer em outro lugar, por exemplo no mapa. Só devolve se não estiver em lugar nenhum | "falta cnpj: ele pode aparecer no mapa, por exemplo." |
| CP.3 — falta endereço ou telefone | **Relativo, não devolve por si.** Site, Instagram ou LinkedIn da empresa já ajudam, e com o CNPJ dá para conferir o endereço na internet | "é relativo. se tiver site, instagram, linkedin da empresa, já é algo bom. e com o CNPJ é possível verificar o endereço na internet" |
| CP.3 — proposta sem timbre | **Vale** se os dados do fornecedor constarem na proposta | "com os dados do fornecedor vale" |
| CP.3 — a quem se aplica | Vale para todos os fornecedores, com **prioridade para a vencedora** | "o ideal é valer para todos os fornecedores, mas, vamos dar prioridade para a vencedora" |
| CP.4 Produto ou Serviço — classificação errada no mapa | **Refaz o checklist pela classificação correta, aponta a divergência como ressalva e não devolve** | "Refaz pelo correto, ressalva e não devolve." |
| CP.4 — regra de classificação | **Produto = Produto. Serviço + Produto = Serviço. Serviço = Serviço.** Ou seja, qualquer serviço no pacote classifica como Serviço | "Produto = Produto. Serviço+Produto = Serviço. Serviço = Serviço." |

## Ainda por perguntar

CP.5 a CP.19, CP.20 a CP.22 (alçada), CP.24, CP.25 e CP.26.
