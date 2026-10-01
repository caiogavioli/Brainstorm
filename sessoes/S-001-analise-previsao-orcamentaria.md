# S-001 — Análise de previsão orçamentária de condomínios

**Problema:** [P-001](../problemas/P-001-analise-previsao-orcamentaria.md)
**Data:** 2026-10-01
**Fase:** 1 (Apresentação) → Rodada 1 aberta

---

## Apresentação (palavras do usuário, transcrição de áudio)

> É, como parte do meu trabalho, eu faço análise e revisão das previsões orçamentárias que são montadas pelas administradoras dos condomínios. Eles me mandam planilhas de Excel, eles me mandam apresentações, eles me mandam uma série de documentos, e eu analiso tudo isso e eu tenho que emitir um relatório com um parecer sobre o material. Então, eu tenho que analisar linha a linha todos os gastos, todos os custos, se faz sentido o reajuste que eles estão propondo, se as linhas de segurança, manutenção, estou dando um exemplo, tá? Manutenção, segurança, limpeza, é, elas estão fazendo sentido comparadas com o realizado do ano anterior, se os índices estão sendo aplicados de forma correta, se as contas estão batendo, se as fórmulas estão certas. Em resumo, eu preciso fazer uma análise completa de tudo isso. Eu gerei no passado um prompt para uma outra IA fazer uma análise, eu vou te mandar esse prompt para você usar ele como uma base, mas eu quero que você faça um, um trabalho de... montar um prompt, montar um espaço aqui no Code para que eu te mande as previsões orçamentárias e você faça a análise e me entregue o resultado.

## Pendências de insumo

- O prompt anterior (feito para outra IA) **ainda não foi enviado** — o usuário disse que vai mandar. Chega junto com as respostas da Rodada 1 ou antes.

---

## Rodada 1 — entendimento

_Perguntas feitas; aguardando respostas do usuário._

### Marina (1–5)

1. Que formatos chegam, exatamente? Nas planilhas Excel as fórmulas vêm **vivas** (dá para auditar célula a célula) ou valores colados? Quantas abas, em média? E as apresentações/PDFs: texto nativo ou imagem/escaneado?
2. O "realizado do ano anterior" vem **dentro do pacote** da administradora ou você tem outra fonte (balancete, prestação de contas, razão)? Quando o realizado que a administradora apresenta discorda do seu, quem vale?
3. Quais índices você confere hoje (IPCA, INPC, IGP-M, dissídio/convenção coletiva, tarifas de concessionárias, índice de contrato específico)? De onde você tira o valor de referência de cada um — e em que data-base?
4. Para linhas como segurança e limpeza, o reajuste correto depende do **contrato** (cláusula de reajuste, aditivo, data-base). Você tem os contratos para cruzar, ou confere só pela planilha e pelo histórico?
5. O plano de contas é padronizado entre as administradoras ou cada uma nomeia e agrupa as linhas de um jeito? E a mesma previsão costuma chegar em mais de uma versão (v1, v2…)? Como você compara versões hoje?

### Rafael (6–10)

6. Quando isso acontece no ano: tudo concentrado numa janela (ex.: outubro–dezembro) ou espalhado? Quantas previsões por ciclo e quantas simultâneas no pico?
7. Quanto tempo leva uma previsão do começo ao relatório entregue? Onde o tempo vai: leitura, comparação com o ano anterior, conferência de fórmula e índice, ou redação do parecer?
8. Para quem é o relatório e o que acontece com ele depois (conselho, cliente, assembleia)? Em que formato sai (Word, PDF) e existe modelo? Dá para mandar 1 ou 2 relatórios antigos, com dados trocados se necessário, como exemplo de "parecer bom"?
9. Qual o erro mais caro que já passou — ou que você mais teme que passe? É o que define onde a análise precisa ser mais rigorosa.
10. O prompt que você fez para a outra IA: o que funcionou e o que não funcionou? Por que está migrando para cá?

### Tomás (11–14)

11. Os arquivos das administradoras são dados de terceiros. Eles podem ficar guardados num repositório **privado** no GitHub (versionados, histórico completo) ou você prefere que fiquem só na sessão, sem persistir? Isso decide onde o espaço mora.
12. Tamanho típico dos arquivos (MB) e quantos por previsão? Chegam por email (Outlook) e você baixa, ou já ficam em OneDrive/SharePoint?
13. Só você usa ou outra pessoa da sua equipe também vai mandar previsões para análise? Precisa funcionar do celular (Android) ou só do computador?
14. Hoje você mantém algum controle dessas previsões (lista de condomínios, status, prazos, parecer emitido) em Monday ou planilha? Se sim, o parecer precisa alimentar isso?

---

## Respostas do usuário

### Bloco 1 — 2026-10-01 (transcrição de áudio, respostas parciais)

> A resposta da pergunta número um é, ele vem em todos os formatos, geral, é, variado. A resposta número dois, ele vem dentro, do, dentro da planilha copiado e colado. É, os índices são IPCA, IGPM, etc., ou de sírio de categoria que é informado.

**Leitura provisória (a confirmar — não é a fala do usuário):**
- **1:** formatos variados, sem padrão. Ainda não disse se as fórmulas do Excel vêm vivas ou como valores colados, nem se PDFs/apresentações têm texto nativo ou são imagem.
- **2:** o realizado do ano anterior vem **dentro da planilha da administradora, copiado e colado** — ou seja, hoje não há fonte independente para conferir esse número. Isso significa que "comparar com o realizado" é comparar contra o que a própria administradora declarou.
- **3:** índices citados: IPCA, IGP-M, etc., mais o reajuste da categoria (provável "dissídio", transcrição de áudio), "que é informado". Não ficou claro quem informa nem em que data-base.

### Bloco 2 — 2026-10-01 (respostas 4 a 14)

> 4. Pela planilha. 5. Cada administradora e condomínio tem o seu próprio. 6. A partir do segundo trimestre do ano, são cerca de 30 condomínios. 7. Demorou alguns dias. 8. Para o proprietário . Não tenho relatórios antigos, eu mandava por email ou apresentava presencialmente. 9. Valores calculados errados em comparação ao ano anterior e ao índice de reajuste.10. acabei de descobrir que o prompt era para outro tema, ou seja, não tenho prompt pronto. Você precisa criar tudo do zero. 11. Os arquivos podem ficar em um repositório tipo o Onedrive ou Google Drive. 12. Variam até 50MB. 13. Minha equipe toda (4 pessoas). 14. Não, não mantenho.

**Leitura (a confirmar):**
- **4:** não há contrato para cruzar — a conferência de reajuste só pode ser contra o índice informado na própria planilha.
- **5:** plano de contas diferente por administradora **e** por condomínio — comparar linha a linha exige mapear contas para categorias comuns.
- **6:** ciclo a partir do 2º trimestre, ~30 condomínios.
- **7:** "alguns dias" por previsão (tempo corrido, não necessariamente horas de trabalho).
- **8:** destinatário é o proprietário; entrega por email ou apresentação presencial; **não existe modelo de relatório**.
- **9:** o erro que mais importa é cálculo errado contra o ano anterior e contra o índice de reajuste.
- **10:** **não existe prompt anterior** — era de outro tema. Tudo é feito do zero.
- **11:** arquivos em OneDrive ou Google Drive (não citou GitHub).
- **12:** até 50 MB por arquivo. Como chegam (email/pasta): não respondido.
- **13:** os 4 da equipe vão usar. Celular: não respondido.
- **14:** não há controle hoje; nada a alimentar.

**Fechamento da Rodada 1.** Lacunas que seguem abertas (levadas para a Rodada 2 como pendências): fórmulas do Excel vivas ou coladas (1); PDFs/apresentações com texto nativo ou imagem (1); quem informa o índice da categoria e qual a data-base (3); como os arquivos chegam (12); celular (13).

---

## Rodada 2 — decisão (aberta)

Numeração D1–D9, contínua entre as três.

### Marina

**D1 — Quem faz a conta.** Seu maior medo é número calculado errado. (A) A IA lê as planilhas e confere. Custa pouco de montar, mas a IA lê mal planilha grande e erra aritmética; o mesmo arquivo pode render dois resultados. (B) Um script extrai as linhas, recalcula (ano anterior × índice, somas, subtotais, variação %) e entrega a tabela de divergências; a IA só interpreta e redige. Custa um script a manter, e falha quando o layout da administradora é muito torto. **Vou de B**: a conta tem que ser a mesma sempre que o arquivo for reprocessado, e é a conta que você mostra para a administradora quando ela contestar.

**D2 — Índices.** (A) Tabela de índices mantida pelo time, com valor, fonte e data-base. Reproduzível, mas alguém precisa atualizar. (B) Buscar na hora em fonte pública. Sem manutenção, mas o valor muda de um dia para o outro. **Vou de A**: o parecer de hoje tem que ser refazível daqui a seis meses com o mesmo número. (O desacordo com o Tomás está abaixo.) O reajuste da categoria entra sempre como dado informado — falta saber quem informa.

**D3 — Plano de contas diferente em cada condomínio.** (A) Mapear as contas para categorias comuns (segurança, limpeza, manutenção…) a cada previsão. (B) Mapear uma vez por condomínio, você aprova, e o mapa fica salvo para o ano seguinte. **Vou de B**: o ano que vem a comparação não recomeça do zero, e o mapeamento é onde erro silencioso nasce — vale você ver uma vez.

### Rafael

**D4 — O que sai.** (A) Só o parecer em Word/PDF. (B) Parecer curto para o proprietário (1–2 páginas) **mais** um anexo de achados rastreáveis: linha, valor declarado, valor recalculado, diferença, motivo. **Vou de B**: o parecer é o que o proprietário lê; o anexo é o que você abre quando alguém perguntar "de onde veio isso". Como não existe modelo antigo, o modelo nasce do primeiro caso real, que você aprova. Pergunta para você: o parecer termina com uma conclusão (aprovado / aprovado com ressalvas / não aprovado) ou só lista pontos?

**D5 — Como começar.** (A) Construir tudo e só depois usar. (B) Piloto com 2 ou 3 condomínios reais, medir o tempo e só então decidir o que automatizar. **Vou de B**: com 30 condomínios por ciclo e "alguns dias" cada, o ganho potencial é grande, mas só o piloto mostra onde o tempo realmente vai. Ponto de atrito com a Marina logo abaixo.

**D6 — Reajuste acima do índice, sem contrato.** Você só tem a planilha. (A) Tratar como erro. (B) Tratar como **pedido de esclarecimento**: "a linha subiu X% contra índice de Y%; apresentem cláusula ou aditivo". **Vou de B**: sem contrato, afirmar erro é chutar. O parecer ganha uma seção de pedidos de esclarecimento, que é útil na conversa com a administradora.

### Tomás

**D7 — Onde ficam os arquivos.** (A) OneDrive/SharePoint, pasta por condomínio e ano; a sessão lê de lá pelo conector Microsoft 365. (B) Google Drive. (C) Subir o arquivo na conversa a cada vez. **Vou de A**: você já paga Microsoft 365, não sobe peça nova, e dados de condomínio ficam fora do GitHub. Risco real: preciso testar que o conector traz um .xlsx de 50 MB inteiro; se não trouxer, caímos em C. Teste antes de fechar qualquer coisa.

**D8 — Onde mora o kit (prompt, regras, script, modelo de parecer) para 4 pessoas.** (A) Repositório privado novo, sem nenhum dado de condomínio, aberto por cada pessoa numa sessão do Claude Code. (B) Neste branch, como exceção consciente (como o app de boletim). (C) Sem repositório, só instruções compartilhadas numa ferramenta que o time já use. **Vou de A**, **se** as 4 pessoas já têm acesso ao Claude Code. Se não têm, quatro pessoas não técnicas aprendendo uma ferramenta nova é a peça móvel que quebra em seis meses, e a conversa muda. Pergunta para você, abaixo.

**D9 — Arquivos de 50 MB.** Não vão inteiros para dentro da conversa. O script extrai só as tabelas e a IA trabalha em cima delas. É consequência de D1, não opção; registro porque custo e velocidade dependem disso.

### Onde elas discordam (você decide)

- **Marina × Rafael — script desde o dia 1 ou só depois do piloto?** *Marina:* o script de recálculo entra desde o primeiro condomínio, porque um parecer assinado com conta errada é exatamente o custo que você disse temer. *Rafael:* primeiro o prompt e a conferência pela IA em 2 ou 3 casos reais; só vira script o que a IA errar, para não construir verificador de um problema que talvez nem exista.
- **Marina × Tomás — índices.** *Marina:* tabela mantida pelo time, para reproduzir. *Tomás:* tabela mantida à mão fica velha em seis meses quando ninguém atualiza; prefere buscar o valor em fonte pública na hora e **gravar no relatório** o número e a data usados, o que dá a reprodutibilidade sem a manutenção. O reajuste da categoria seria sempre informado à mão de qualquer jeito.

### Recorte proposto

**É 1 projeto, menor do que parece.** Nome provisório: `analise-previsao-orcamentaria`. Não é app, banco ou servidor: é um **kit de análise** com (1) as instruções/prompt de análise, (2) as regras de conferência (reajuste vs. índice, somas, fórmulas, comparação com ano anterior), (3) o verificador de contas, se você optar por ele em D1/D5, (4) o modelo de parecer e de anexo de achados. Os dados dos condomínios ficam no OneDrive, fora do repositório.

**Não é só um script**, porque são 4 usuários, não existe modelo de parecer, e cada condomínio tem um plano de contas próprio que precisa de mapeamento. **Também não é "só um prompt"**, pelo mesmo motivo. O Rafael não quer matar este: 30 condomínios por ano a "alguns dias" cada paga o projeto com folga.

### Pendências para você

1. D1–D8: aceita as recomendações, ou quer trocar alguma?
2. Os dois desacordos acima: Marina × Rafael e Marina × Tomás.
3. As 4 pessoas já têm acesso ao Claude Code?
4. O parecer termina com uma conclusão (aprovado / com ressalvas / não aprovado) ou só lista pontos?
5. Fórmulas do Excel vêm vivas ou coladas? PDFs e apresentações têm texto nativo ou imagem?
6. Quem informa o índice da categoria e qual a data-base?
7. Você tem alguma previsão real em mãos agora, mesmo com dados trocados, para o piloto?

---

## Decisões do usuário sobre a Rodada 2 — 2026-10-01

> Aceito D1 a D8, vamos com o script desde o dia 1. O parecer termina com a opinião de pode ser aprovado ou não. 5. Vem de todos os jeitos, não tem um padrão. 6. A própria administradora, nos arquivos da previsão orçamentária. 7. Sim, separei um exemplo real do condomínio Atrium Santo André

**Decidido:**

| Item | Decisão |
|---|---|
| D1 | Script determinístico extrai e recalcula; a IA interpreta e redige |
| D2 | Tabela de índices mantida pelo time, com valor, fonte e data-base (lado da Marina no desacordo com o Tomás) |
| D3 | Mapeamento de contas uma vez por condomínio, aprovado pelo usuário, salvo para o ano seguinte |
| D4 | Parecer curto para o proprietário + anexo de achados rastreáveis. **Conclusão do parecer: "pode ser aprovado" ou "não"** (binária) |
| D5 | Piloto com casos reais — mas **com o script desde o dia 1** (lado da Marina no desacordo com o Rafael) |
| D6 | Reajuste acima do índice, sem contrato, vira pedido de esclarecimento, não erro |
| D7 | Arquivos no OneDrive/SharePoint, lidos pelo conector Microsoft 365; dados fora do GitHub. **Risco ainda não validado:** o conector trazer um .xlsx de até 50 MB inteiro |
| D8 | Repositório privado novo, sem dados — **condicionado** a as 4 pessoas terem acesso ao Claude Code (ver pendências) |
| D9 | Consequência de D1: o script extrai só as tabelas; arquivo de 50 MB não vai inteiro para a conversa |

**Respostas às pendências:**
- **Formatos (pergunta 5):** "vem de todos os jeitos, não tem um padrão" — o extrator não pode assumir fórmula viva nem PDF com texto nativo; precisa tratar os dois casos e avisar quando não consegue ler.
- **Índice da categoria (pergunta 6):** quem informa é a própria administradora, nos arquivos da previsão. Logo não há fonte externa para o reajuste da categoria — o parecer só pode conferir a **conta**, não o valor do índice informado. IPCA e IGP-M seguem pela tabela do time (D2).
- **Piloto (pergunta 7):** o usuário diz ter separado um exemplo real do **Atrium Santo André**.

**Pendências abertas:**
1. **O arquivo do Atrium não chegou.** Busquei no OneDrive e no Drive e achei muito material do Atrium, mas nada que se identifique, sem dúvida, como a previsão orçamentária "separada" — ver mensagem de abertura da sessão. Preciso do caminho exato (ou do arquivo na conversa).
2. **As 4 pessoas da equipe têm acesso ao Claude Code?** Não respondido; condiciona D8.
3. **Celular (Android)?** Não respondido (baixa prioridade).
4. **"Fecha o projeto"?** Ainda não dito. Pelo CLAUDE.md, fim de Rodada 2 não é gatilho.

---

## Fechamento — 2026-10-01

> 1. As 4 pessoas devem ter acesso ao material, mas não tem acesso ao Claude Code pago. 2.melhor usar só no computador. 3.pode executar já.      Segue um print do email que recebi com o material da Previsão Orçamentária 2027 do Atrium Santo André

(O usuário anexou o print do email "ATRIUM BCP OFFICE - Prévia PO 2027", da Innova, de 29/09/2026, com a planilha de previsão e a apresentação.)

**Leitura:**
- **1:** as outras 3 pessoas **não têm Claude Code pago** ⇒ a condição do D8 não se cumpre como desenhada. Ajuste feito na spec: só o usuário opera; a equipe lê as saídas no OneDrive.
- **2:** só no computador; celular fora do escopo.
- **3:** é o gatilho "**fecha o projeto**" (era o item 3 da lista de pendências). Disparou os quatro passos do `CLAUDE.md`.

**Piloto localizado.** O email original foi achado na caixa do usuário; o conector Microsoft 365 leu a planilha anexa (9 abas) — como **texto com valores, sem fórmulas**. Isso muda o desenho: auditar fórmula exige o arquivo em disco ⇒ execução **local** (Windows + OneDrive sincronizado) como modo recomendado; sessão web + conector fica como plano B.

**Execução do fechamento:**
1. `projetos/analise-previsao-orcamentaria.md` escrito, completo.
2. **Criação do repositório falhou: 403.** `POST /user/repos` → "Resource not accessible by integration". Limitação já registrada neste `MEMORY.md` (integração sem `Administration: write`). **O usuário precisa criar o repositório vazio à mão** — ver "Em aberto" em `MEMORY.md`.
3. Esqueleto preparado **de forma temporária** neste branch (README, CLAUDE.md, .gitignore, pyproject.toml, config.exemplo.toml, `dados/indices.csv`, `prompts/analise.md`, `prompts/parecer.md`, `docs/casos-piloto-atrium-2027.md`, `src/`, `tests/`). Sai deste branch quando for empurrado ao repositório novo.
4. `MEMORY.md` e catálogo atualizados.

### Repositório criado — 2026-10-01

> Criei o repositório, pode empurrar o esqueleto

O usuário criou `caiogavioli/analise-previsao-orcamentaria` (privado, vazio). O esqueleto foi empurrado para `main` (commit `9d6ebca`, 11 arquivos, sem nenhum dado de condomínio) e a pasta temporária foi removida deste branch. Passo 4 do `CLAUDE.md` concluído.

### Arquivos reais do piloto — 2026-10-01

O usuário anexou à sessão a planilha (`00 - PREVISÃO ORÇAMENTÁRIA 2027 - ATRIUM_Vs.01_Rev.Cleber_Rev.Joao.xlsx`) e a apresentação (`1 - Apresentação - Previsão orçamentária manutenções e investimentos 2027-01.pptx`), sem texto.

Conferidos com script descartável fora dos repositórios (`openpyxl`, `python-pptx`). Resultado: 8 dos 9 casos da leitura por texto confirmados; 8 novos; divergência apresentação × planilha (total mensal, CMQ, % de reajuste, área); tabelas de slide em imagem não lidas. Detalhe em `docs/casos-piloto-atrium-2027.md` do repositório novo (commit `342f92d`), que ganhou as regras C10 (apresentação × planilha) e C11 (% digitado dentro de fórmula). Os arquivos não foram copiados para nenhum repositório.

---

## Mudança de desenho — 2026-10-01 (depois do fechamento)

> Quero que você, nesse prompt, nesse projeto, você crie um relatório e a primeira coisa é que ele me mostre todos os problemas encontrados, sejam eles técnicos, sejam eles da parte de números, sejam eles da parte de conceito. É, faça uma lista de problemas encontrados com uma matriz de riscos. Isso é crítico, isso não é crítico. É, sugira algumas coisas para mim para que eu possa falar se está certo ou não. O que eu preciso mostrar primeiro é para o condomínio que a análise foi feita e que existem coisas erradas e que ele precisa corrigir. Depois, quando o condomínio corrigir tudo isso, a gente vai emitir um relatório final para o proprietário falando que está tudo certo.

**O que muda:** o ciclo passa de um parecer a **dois documentos em sequência**: (1) **relatório de apontamentos** ao condomínio e à administradora, com matriz de riscos, que repete a cada reapresentação; (2) **parecer final** ao proprietário, só quando tudo estiver corrigido. Isso promove a **comparação entre versões** de v2+ para v1, com chave estável por apontamento.

**Interpretação de "sugira algumas coisas para eu validar":** o relatório nasce como **rascunho com anexo interno** (critérios, perguntas V1–V11 com sugestão, e checklist Concordo/Ajustar/Retirar por apontamento). O usuário valida e só então sai a versão ao condomínio. Se a leitura estava errada, o ajuste é pequeno.

**Entregue:**
- Repositório novo (commit `3b06727`): `prompts/relatorio-apontamentos.md`, `prompts/parecer-final.md` (antes `parecer.md`), `docs/matriz-de-risco.md`, e `CLAUDE.md`, `README.md` e `prompts/analise.md` atualizados.
- **Rascunho do relatório do Atrium (rodada 1):** 17 apontamentos — 2 críticos, 9 moderados, 6 baixos — enviado ao usuário como `.docx`. **Fora do git** (valores reais do condomínio). Não foi possível renderizar o arquivo neste ambiente (o LibreOffice não abre nem um `.docx` trivial); o arquivo abre no `python-docx`, mas o layout não teve conferência visual.
- Esta spec atualizada: D4 revisado, critério de criticidade, ciclo de rodadas, novos riscos 9 e 10.

### Validação do rascunho — 2026-10-01

> Concordo com V1 a V5. V6 a V9 devem ser respondidas pela administradora. V10 e V11 podem ser retiradas do material. Além disso, eu quero que você crie um questionário para que a administradora responda, para me dar base para responder as, as respostas de concordo ou não concordo. Outro ponto que eu acho que é importante é que tenha uma lista, uma tabela resumida dos itens que precisam ser é, corrigidos pela administradora para que tenha um índice fácil de ser analisado.

**Decidido:**
- **V1 a V5 aprovados:** três níveis de criticidade; crítico a partir de 1% ou divergência no número deliberado; moderado de 0,1% a 1%; parecer final só com zero críticos abertos; seção "o que foi conferido e está correto"; baixos ficam na lista.
- **V6 a V9 viram perguntas à administradora** (área correta → A-02; acordo da Limpeza → A-04; defeitos do modelo da Innova → A-07 e A-10; convenção do bombeiro → A-08).
- **V10 e V11 retiradas** (destinatários e prazo; assinatura). O campo "Analista responsável" também saiu do cabeçalho.
- **Novo: questionário** à administradora, em planilha, que dá base ao *Concordo / Não concordo* do usuário.
- **Novo: resumo dos itens a corrigir** logo depois da conclusão: 17 itens, 10 a corrigir, 6 a esclarecer, 1 a enviar.

**Regra derivada (a confirmar com o usuário):** resposta da administradora não fecha apontamento sozinha; um "Esclarecer" só vira resolvido quando o usuário marca *Concordo*. Foi a leitura que dei de "base para responder concordo ou não concordo".

**Entregue:** relatório v2 (`.docx`) e `Questionario-Administradora-Atrium-PO2027.xlsx` (2 abas, 17 linhas, 3 listas suspensas), ambos fora do git por conterem valores do condomínio. Repositório novo, commit `6487396`: `prompts/relatorio-apontamentos.md`, `CLAUDE.md`, `README.md` e `docs/matriz-de-risco.md` atualizados.

### Modelo encerrado — 2026-10-01

> Sim, só o meu Concordo fecha o item. As perguntas estão ótimas. Pode encerrar a criacao do modelo, e manter esse padrão para o futuro. Cada vez que eu te mandar um novo material e pedir uma nova análise, de um novo prédio, você vai faze-la e criar novos relatórios, independentes dos anteriores de outros condomínios. Mas, cada vez que eu te mandar material revisado pelo condomínio, você deve retomar a última análise feita para o condomínio em questão, e atualizar análise e o relatório. Você entendeu minha necessidade? Me explique o que eu preciso e como você vai fazer, e eu vou validar

**Decidido:** (1) só o *Concordo* do usuário fecha um apontamento "Esclarecer"; (2) o questionário está aprovado; (3) o **modelo v1 está encerrado** e vira o padrão de todos os condomínios (repositório novo, commit seguinte a `6487396`).

**Requisito novo, em validação:** (a) prédio novo ⇒ análise e relatórios **independentes** dos de outros condomínios; (b) material revisado de um condomínio ⇒ **retomar a última análise daquele condomínio** e atualizar análise e relatório. Em validação: onde o estado de cada condomínio é guardado, como a sessão decide "nova" × "revisão" e o que o usuário envia em cada caso. A explicação foi enviada ao usuário; **nada foi implementado** antes do aval.

