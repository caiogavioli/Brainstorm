# S-001 — Apresentação e Rodada 1

**Data:** 2026-10-02
**Problema:** P-001 — Sistemas de água do prédio
**Fase:** 1 (Apresentação) concluída; Rodada 1 aberta

---

## Apresentação (palavras do usuário, transcrição de voz sem edição)

> Eu tô com um problema em um prédio. Eu vou contar a história para você e quero que você analise isso e me ajude. Eu tô com um problema num prédio com um problema geral de água. Eu tive problema de água de reuso misturada com água potável por conta de um problema de instalação, um problema de obra que foi feito na construção do prédio que ninguém viu. E agora eu tô tendo um problema que a água que vai para o sistema de ar-condicionado do chiller, que tem produtos químicos e tudo mais, ela saiu na torneira de alguns andares, ou seja, eu tive alguma contaminação cruzada. É, vazou água e caiu na caixa d'água, voltou água pela tubulação, alguma coisa do gênero. E o que eu queria fazer era ter um levantamento completo de todas as possibilidades relacionadas à água no prédio para que eu possa fazer uma contingência, para que eu possa fazer um plano de contingência mirando todos os sistemas existentes de água, é, desde água potável até água para tratamento de equipamentos, tudo, tudo que existe de água em prédios comerciais, prédios logísticos. É, eu queria que você me ajudasse nisso, Primeiro, eu acho que a gente precisa fazer uma busca, uma pesquisa completa é, e olhar tudo que existe de sistemas de água e tudo mais para prédios, para edifícios comerciais, edifícios em geral. É, queria uma lista completa para que eu possa escolher quais são aqueles que são encontrados nos prédios. E aí, depois que eu definir essa lista, a gente vai buscar criar esse procedimento operacional aí de contingência, É, depois a gente cria fluxogramas, a gente cria aí um trabalho de emergência para caso a gente tenha algum problema e também para que a gente possa fazer manutenção em todos os sistemas existentes e monitorar todos eles para evitar que esses problemas aconteçam.

---

## O que foi entregue junto com a Rodada 1

O usuário pediu explicitamente, como **primeiro passo**, a pesquisa completa dos sistemas de água. Ela foi feita e está em `entregas/catalogo-sistemas-de-agua.md`. Não substitui a Rodada 1: o catálogo é o insumo para o usuário marcar o que existe no prédio; as perguntas abaixo mapeiam a realidade.

---

## Rodada 1 — perguntas de entendimento

### Marina (dados, registros, integrações)

1. Existe projeto **as-built**, memorial ou isométrico das instalações hidráulicas e do ar-condicionado? Em que formato e onde está? (O episódio 1 nasceu de algo "que ninguém viu" na obra — queremos saber se existe documento contra o qual conferir.)
2. Que **registros** existem hoje: limpeza de reservatórios, laudos de potabilidade, relatórios de tratamento químico do chiller/torre, PMOC? Quem produz, onde ficam guardados e com que frequência?
3. Que **medição e alarme** existem: hidrômetros, nível, pressão, cloro, condutividade, supervisório/BMS? Alguém é alertado quando algo sai do normal, ou só se descobre quando um ocupante reclama?
4. Nos dois episódios: **como foram descobertos**, quanto tempo passou entre o início provável e a descoberta, e já existe causa raiz confirmada em laudo, ou ainda é hipótese?
5. Quando duas fontes discordam (ex.: o laudo da empresa de tratamento químico versus o que se vê na torneira), **quem decide**? Há um responsável técnico nomeado por sistema?

### Rafael (uso, recorte, valor)

6. O escopo é **este prédio** ou um **modelo replicável** para o portfólio (comerciais e logísticos)? Quantos prédios, de que tipo?
7. Quem vai **executar** o plano numa emergência: equipe própria, facilities terceirizado, portaria/vigilância? E às 3h da manhã de um domingo, quem está lá?
8. Quem são os **locatários** afetados — que atividades têm (alimentos, saúde, data center, escritório comum)? O contrato ou o cliente exige comunicação, prazo ou algum SLA em caso de incidente?
9. Há **pressão externa** com data: proprietário/administradora, seguradora, vigilância sanitária, advogado? Alguém passou mal ou houve notificação formal?
10. Em que **formato** o material precisa chegar (Word, PDF, planilha, impresso na casa de máquinas)? E o que é mais urgente: o plano de contingência, ou impedir o terceiro episódio?

### Tomás (operação, custo, quem mantém)

11. Quem **opera e mantém** hoje cada grupo — tratamento químico, limpeza de reservatório, bombas, incêndio, ar-condicionado? São contratos de terceiros? Com quem e até quando?
12. Quais **proteções físicas** contra refluxo você sabe que existem hoje (válvula de retenção, disconector/BPV, separação atmosférica na reposição do chiller)? E há gerador ou no-break para bombas de recalque e de incêndio?
13. O que já foi **feito depois dos incidentes** (inspeção, análise de água, correção) e quanto custou ou quanto foi autorizado? Há folga para intervenção física (instalar dispositivo antirretorno, medição) ou o plano precisa ser só procedimento?
14. Onde a manutenção preventiva é **registrada** hoje — Monday, planilha, sistema da administradora? E onde o plano deveria viver para a equipe realmente consultar (OneDrive, papel na casa de máquinas)?

### Atrito entre as três (registrado como surgiu)

- **Marina:** antes de qualquer procedimento, precisa existir um **mapa de interconexões** conferido em campo. Procedimento escrito em cima de um desenho que ninguém verificou repete o erro da obra.
- **Rafael:** o maior valor imediato é **não ter o terceiro episódio** — isso é inspeção de refluxo e interligações, feita por engenheiro, e vem antes de 40 procedimentos. E o entregável provavelmente **não é um projeto de software**; é documentação.
- **Tomás:** um **modelo único de procedimento** (mesmo roteiro, preenchido por sistema), não um documento diferente para cada um dos ~70 itens. Quem mantém isso em seis meses é uma pessoa só.

Os desacordos vão para a Rodada 2.

---

## Respostas do usuário

_Aguardando._
