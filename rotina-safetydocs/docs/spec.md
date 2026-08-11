# Cobrança SafetyDocs

**Origem:** pedido direto do Caio, 11/08/2026.
**Status:** em construção — mapeamento de condomínios pendente de confirmação.

## Problema que resolve

Toda segunda, dois emails da plataforma SafetyDocs chegam na caixa do Caio
listando documentos a vencer e vencidos de **todos** os prédios que ele
administra, misturados numa lista só. Hoje ele precisaria abrir os dois,
separar manualmente por condomínio, e mandar a cobrança um a um.

## Escopo da v1

**Entra:**
- Ler os dois informativos semanais da SafetyDocs (a vencer + vencido)
- Separar os documentos por prédio
- Cruzar cada prédio com um email de cobrança confirmado
- Mandar uma cobrança por condomínio, só com a lista daquele condomínio
- Mandar um resumo semanal para o Caio, sempre, mesmo sem nada para cobrar

**Não entra (por decisão consciente):**
- Acompanhar se o condomínio de fato regularizou o documento — a cobrança é
  só o disparo, não um funil
- Qualquer canal além de email (WhatsApp, etc.)
- Mapeamento automático de nome de prédio → condomínio — ver decisão abaixo

## Decisão de arquitetura: rotina agentiva, não aplicação nova

A primeira versão deste plano (registrada e descartada nesta mesma conversa)
propunha construir a integração **dentro do sistema Next.js de gestão de
condomínios** (`caiogavioli/brainstorm`): App Registration no Azure AD, OAuth
delegado, tabelas Prisma novas, uma rota de cron na Vercel, parser de HTML
com `cheerio`, criptografia de token em repouso.

**Descartada a pedido do usuário**, que já tinha resolvido o mesmo tipo de
problema (ler e classificar email do Outlook, agir sem servidor) no projeto
**Triagem Contratante** e queria o mesmo processo, não uma segunda peça de
infraestrutura para manter. A alternativa também é estritamente mais barata
para um usuário só: sem host, sem chave de API para rotacionar, sem chamado
de sábado — mesmo argumento que fechou a arquitetura da Triagem Contratante
(`docs/spec.md` de lá, decisão E2).

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| **Rotina agentiva (LLM lê e decide) sem servidor** | App Next.js com OAuth próprio, Prisma, cron na Vercel | Retrabalho de infraestrutura que o usuário já tinha resolvido; conector Microsoft 365 desta sessão já dá leitura e envio sem App Registration novo |
| **Parsing feito pelo próprio agente lendo o HTML** | Parser de código (`cheerio`) rodando num cron | Sem servidor não há onde rodar o parser; o agente lendo o corpo já extrai a tabela por prédio de forma confiável (testado nesta conversa contra um email real) |
| **Mapeamento manual em markdown, versionado** | Cruzamento automático/fuzzy de nome de prédio | Os rótulos da SafetyDocs não têm formato consistente (`Condomínio X` vs `Associação do Empreendimento Y`); cruzar errado manda cobrança para o condomínio errado — pior que não mandar |
| **Trava de destinatário por hook, lendo a lista de confirmados** | Confiar no playbook em markdown | Mesma lição da Triagem Contratante: regra escrita em markdown depende do modelo lembrar sozinho toda segunda de manhã; aqui o hook bloqueia a chamada antes de sair |
| **Self-bind (dispara nesta sessão)** | Routine que cria sessão nova a cada disparo | Sessão nova nasce sem o conector Microsoft 365 — testado e descartado na Triagem Contratante pelo mesmo motivo |

## Arquitetura escolhida

```
Outlook / Microsoft 365 (caixa do Caio)
           │
           │  conector Microsoft 365 desta sessão — leitura e envio
           ▼
┌─────────────────────────────────┐
│  Rotina semanal (segunda 08h)   │
│  1. busca os 2 informativos     │
│  2. separa documentos por prédio│
│  3. cruza com mapeamento        │
│  4. confere duplicidade (7 dias)│
│  5. envia 1 cobrança/condomínio │
│  6. envia resumo ao Caio        │
└─────────────────────────────────┘
           │                    ▲
           ▼                    │
  Cobrança por condomínio   mapeamento-predios.md
  (Outlook do Caio → email  (git, editado à mão
   do condomínio)            pelo Caio)
```

## Riscos

- **Sessão hospedeira é efêmera.** Se o container desta sessão for reciclado,
  a Routine self-bind perde o alvo e para de rodar sem erro visível — mesmo
  risco documentado e aceito na Triagem Contratante. Mitigação: o resumo
  semanal só chega se a rotina rodou; ausência dele até 09h de segunda é o
  sinal de que caiu.
- **Mapeamento desatualizado.** Se a SafetyDocs mudar o rótulo de um prédio
  (renomear, criar bloco novo), a cobrança daquele prédio para até o Caio
  notar e confirmar a linha nova. Aceitável: melhor atrasar uma semana do que
  mandar para o endereço errado.
- **Formato do email mudar.** Se a SafetyDocs mudar a estrutura HTML, a
  extração por prédio pode falhar. O playbook trata isso como "não enviar
  nada, sinalizar no resumo" — nunca como "enviar o que der para extrair".

## Critério de pronto (v1)

- [ ] Todos os 13 rótulos conhecidos confirmados em `mapeamento-predios.md`
- [ ] Uma rodada manual processa o email real de 10/08/2026 e produz as
      cobranças corretas (ver `testes/caso-referencia.md`)
- [ ] A trava de destinatário testada e recusando envio fora da lista
- [ ] Routine agendada, self-bind, confirmada rodando sozinha numa segunda-feira
- [ ] Resumo semanal chegando ao Caio mesmo em semana sem cobrança
