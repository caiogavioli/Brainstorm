# S-001 — Apresentação e Rodada 1: análise de concorrências dos condomínios

**Data:** 2026-10-06
**Problema:** P-001 — `problemas/P-001-analise-concorrencias-condominios.md`
**Fase:** 1 (Apresentação) + 2 (Rodada 1 — perguntas feitas, aguardando respostas)

## Apresentação — palavras do usuário

> preciso analisar uma concorrências, mapas de cotação, RFPs, BIDs, feitos pelos condomínios. incialmente, no passado, fiz um prompt para realizar essa análise em outras IAs. Mas agora quero que você faça esses análises para mim. vai ser uma coisa sistemática, vou pedir sempre para você analisar, são várias por semana. quero mandar os arquivos aqui e você analise e me dá um relatório completo. olhe os prompts que fiz no passado, melhore eles, e crie uma solução para meu projeto.

Anexos: quatro prompts (ver `material/prompts-anteriores/`).

## Rodada 1 — perguntas

### Marina (dados e integrações)

1. **O que chega, exatamente, em cada concorrência?** Mapa de cotação (xlsx? PDF?), propostas originais de cada fornecedor (PDF nativo ou escaneado?), minuta de contrato, e-mail da administradora? Quantos arquivos, em média, e quanto vem como imagem escaneada? Se puder, mande 2 ou 3 casos reais recentes — é o melhor insumo para a Rodada 2.
2. Quando o **mapa de cotação** e a **proposta original** do fornecedor divergem (valor, escopo, prazo), qual vale? Você já pegou divergência assim? De que tipo?
3. A mesma concorrência **volta**? (fornecedor reenvia proposta, administradora refaz o mapa, rodada de negociação.) Quando volta, você quer a análise do zero ou comparada com a anterior?
4. **Onde o relatório vive depois de pronto?** Para quem vai, em que formato (Word/PDF no padrão DF Síndicos?) e você precisa consultar depois ("quanto pagamos de limpeza no prédio X em 2025?") ou cada relatório morre depois da decisão?
5. Nos quatro prompts, **qual saída a IA errou e você teve que consertar à mão?** (conta errada, valor inventado, fornecedor trocado, escopo que ela "completou" sozinha.) Isso diz onde precisa de trava.

### Rafael (produto e recorte)

6. **Quantas por semana de verdade, e quanto tempo você gasta hoje em cada uma** (ler, conferir conta, escrever)? E quanto tempo seria aceitável para o relatório sair depois de você mandar os arquivos?
7. **Quem lê o relatório e o que decide com ele?** Você, antes de assinar? O proprietário? O conselho? A administradora? Os quatro prompts vão de BLUF curto até exaustivo — para cada leitor, qual tamanho serve?
8. **Que tipo de serviço aparece mais?** (segurança, limpeza, elevador, obra, jardinagem…) Os 3 ou 4 principais e a faixa de valor típica. Existe um valor acima do qual a análise precisa ser mais pesada (conselho, assembleia, compliance do cliente)?
9. **Como isso se encaixa no `aprovacoes-contratos-concorrencia`?** A análise acontece *antes* de a administradora fechar o mapa, *depois* dele, ou na hora de você assinar? O resultado deveria alimentar aquele checklist ou são momentos separados?
10. **Já houve caso em que a análise mudou a decisão?** Que tipo de achado mais valeu a pena (erro de conta, escopo faltando, cotação única, fornecedor com risco trabalhista)? Isso define o que o relatório nunca pode deixar passar.

### Tomás (infra, custo e manutenção)

11. **Onde e como você recebe esses arquivos?** Anexo no Outlook das administradoras (CBRE, Cushman, Innova, HFlex), link, WhatsApp, pasta compartilhada? E em que aparelho você vai pedir a análise — só no computador, ou também no celular?
12. **Os materiais têm alguma restrição para ir a uma IA?** Propostas com CNPJ e valores de fornecedor, e o compliance de algum cliente (Brookfield, por exemplo) pode ter regra sobre isso. Já foi perguntado ou nunca veio à tona?
13. **Por que sair das outras IAs?** Custo, qualidade da saída, trabalho de copiar o prompt toda vez, limite de arquivo, falta de histórico? O que você paga hoje e o que deixaria de pagar?
14. **Em quanto tempo o relatório precisa sair depois de o arquivo chegar** — no mesmo dia, em horas, em dias? E numa semana pesada (8 ou 10 concorrências), o que acontece se o relatório atrasar um dia?

## Pontos de atrito já visíveis (ainda não é proposta)

- **Marina** lê isto como problema de **auditoria**: o mapa de cotação do condomínio é um dado sujo até prova em contrário, e nenhum dos quatro prompts confere o mapa contra as propostas originais.
- **Rafael** desconfia de que "relatório completo e exaustivo" para todo caso é tempo jogado fora: o recorte provavelmente é um relatório curto por padrão e o pesado só sob demanda.
- **Tomás** acha que, se o problema é o usuário mandar arquivos numa conversa e receber relatório, a solução mais burra que funciona é **um prompt/skill bem escrito mais um modelo de relatório**, sem peça nova nenhuma — e quer ser convencido do contrário.

## Respostas do usuário

_Aguardando._
