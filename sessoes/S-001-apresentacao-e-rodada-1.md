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

Respondidas por áudio, uma por uma (transcrição sem edição). **Respostas 1–5 (Marina) recebidas em 2026-10-02. Respostas 6–14 (Rafael e Tomás) ainda virão em outro áudio.**

**1.** Existe projeto, memorial e isométrico?
> Número um, é, existe projeto memorial e isométrico das instalações de ar-condicionado de todos os prédios. O problema é que eu não vou conseguir te mandar tudo. Eu acho que tem que ser algo mais genérico aí, é, colocando todas as opções possíveis, imaginárias, e aí cada condomínio eu vou, eu vou ticando e vou deixando é, certinho.

**2.** Que registros existem hoje?
> Número dois, que registros existem hoje? É, existe limpeza de reservatório, laudo de potabilidade, relatório do tratamento químico, tem PMOC, é, quem produz são os fornecedores contratados pela administração e tudo isso fica com a própria administradora lá no servidor do condomínio. Eu não tenho acesso em tempo real. Eu preciso pedir é, os documentos e eles me mandam.

**3.** Que medição e alarme existem?
> Número 3, é, nem todos os condomínios têm medição e alarme. É, nem todos os condomínios têm um sistema de BMS, de automação, que atenda a todos esses sistemas.

**4.** Como os dois episódios foram descobertos e qual a causa raiz?
> 4, é, nos dois episódios, eles foram descobertos com o usuário abrindo a torneira e vendo a água com corante. Né? No primeiro caso, era água de reuso, tinha um corante azul, e no segundo caso, era água da água gelada, que tinha um corante rosa. É, a causa raiz está confirmada em laudo, é, no primeiro item, e no segundo item, é, segundo acontecimento, ela está confirmada presencialmente por mim, é o erro que aconteceu ali de operação.

**5.** Quem decide quando as fontes discordam?
> O 5... Há uma decisão da sindicância. É, a gente contrata normalmente um consultor especialista que vai analisar o problema, vai dar um diagnóstico, vai dar o resultado, e aí a sindicância que faz a decisão. Agora eu vou responder em outro áudio o Rafael e o Tomás.

### O que essas respostas já mudam (anotado pelo time, sem decidir nada — a decisão é da Rodada 2)

- **Escopo é portfólio, não um prédio.** O usuário trata "cada condomínio" como uma instância a ticar. Isso aponta para um **modelo genérico com todas as opções possíveis** (o catálogo) e uma **ficha por condomínio** — e não para a leitura de projetos reais, que ele não consegue enviar. Parte da pergunta 6 do Rafael já está respondida; ele confirma quando o usuário responder.
- **Fonte dos registros é terceira e sem acesso em tempo real** (Marina): laudos, limpezas, tratamento químico e PMOC ficam com a administradora, que envia sob pedido. Qualquer plano de monitoramento precisa partir de **pedido periódico de documentos**, não de painel.
- **Instrumentação desigual** (Marina): nem todo condomínio tem medição, alarme ou BMS. O plano não pode depender de sensor; precisa de uma versão "com BMS" e uma "sem BMS" por sistema.
- **Detecção hoje é o ocupante** (Marina): nos dois episódios a água saiu colorida na torneira — azul no reúso, rosa na água gelada. A cor é o único alarme que existiu. O plano precisa de detecção anterior ao ocupante.
- **Causa do episódio 2 foi erro de operação**, confirmado presencialmente pelo usuário — não falha de projeto nem de obra. Isso muda o plano: o foco passa a ser **procedimento de operação e barreira física contra refluxo**, não só inspeção de interligação. O usuário ainda não disse **qual foi o erro**; ele pode contar na próxima resposta, se quiser.
- **Quem decide é o condomínio**, apoiado por consultor especialista contratado caso a caso (o usuário escreveu "sindicância"; leitura do time: o órgão de decisão do condomínio, o síndico). O papel do usuário é montar o dossiê e o plano, não decidir a causa técnica.

### Pendente

Respostas 6–10 (Rafael) e 11–14 (Tomás). Só depois disso a Rodada 1 fecha e a Rodada 2 começa.
