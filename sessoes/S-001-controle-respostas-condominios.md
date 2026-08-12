# S-001 — Controle de respostas dos condomínios sobre automação de energia elétrica

## Apresentação (palavras do usuário)

> enviei emails para meus condomínios pedindo uma resposta sobre um tema. e encaminhei para a Thassia da BGRE as respostas. quero controlar quem me respondeu, e quais respostas eu enviei para a Thassia. o email era sobre "Automatização de energia elétrica"

## Rodada 1 — entendimento

### Marina (dados e integrações)

1. Onde estão hoje esses emails — Gmail, Outlook, outro provedor? É a mesma caixa que você usa tanto para mandar aos condomínios quanto para encaminhar pra Thassia?
2. Dá pra listar hoje quais condomínios receberam esse email específico (nomes, quantos são), ou isso também precisa ser levantado do zero?
3. Quando você fala "controlar quem respondeu", a resposta sempre chega por email, ou às vezes vem por WhatsApp, telefone, ou verbalmente e você que resume depois?
4. Ao encaminhar pra Thassia, você manda cada resposta assim que ela chega, ou junta várias e manda em lote?
5. Já aconteceu de um condomínio responder mais de uma vez, ou de você encaminhar a mesma resposta duas vezes pra Thassia sem perceber? Isso é algo que precisa aparecer nesse controle?

### Rafael (produto e full-stack)

6. Essa campanha de pedir resposta de vários condomínios sobre um tema e repassar pra BGRE é a primeira vez que acontece, ou é uma rotina que se repete (esse tema hoje, outro tema amanhã)?
7. Hoje, sem nenhuma ferramenta nova, como você sabe quem já respondeu e quem falta — reler a caixa de entrada, uma lista em algum lugar, ou você guarda de cabeça?
8. Quantos condomínios estão nessa leva específica do "Automatização de energia elétrica"?
9. Além de você, alguém mais precisa enxergar esse controle — a própria Thassia, algum síndico, mais ninguém?
10. Se esse controle já existisse pronto hoje, o que exatamente ele tiraria do seu prato — parar de reler a caixa de entrada, parar de lembrar de cabeça quem falta, outra coisa?

### Tomás (infra, automação e custo)

11. Confirmando com a Marina: qual provedor de email você usa no dia a dia? Isso muda bastante o que dá pra automatizar direto na caixa de entrada.
12. Esse controle precisa morar em algum lugar que você já usa (planilha, Notion, etc.), ou pode nascer do zero?
13. É só você que vai atualizar esse controle, ou mais alguém (assistente, síndico, a própria Thassia) também vai mexer nele?
14. Isso é uma necessidade pontual, só para esse tema da automação de energia, ou você já imagina repetir esse controle para outros assuntos com os condomínios no futuro?

## Respostas do usuário (Rodada 1)

> 1) outlook. 2) TNU, Centenário(CTN), Alphaville, JKB, Panamerica, Passeio Paulista, Arquipeo, PL Extrema, 17007. 3) sempre por email. 4) mandei algumas sozinhas, e outras em conjunto no mesmo email. 5) não, não aconteceu até agora. 6) é uma rotina que se repete. 7) eu anoto no papel. 8) só esses que te falei 9) não, só eu. 10) não sei. 11) outlook. 12) não, é pontual. 13) só eu. 14) vai acontecer novamente com outros temas

**Observação de condução:** as respostas 12 e 14 se contradizem — a 12 diz que é pontual, a 14 (e a 6) diz que a rotina se repete com outros temas. Fica pendente de esclarecimento antes da Rodada 2, porque muda a recomendação do Tomás (planilha descartável vs. estrutura pensada para se repetir).

## Esclarecimento

> Eu quero ter um projeto que eu reaproveito a estrutura a cada novo tema que surgir com os condomínios temos de criar um item específico de dar um nome, isso gere um nome legal, mas assim como se fosse uma análise dos pedidos da Brookfield, e aí você cria uma estrutura pra que sempre que chegar um email eu te aviso e falo assim olha, preciso fazer esse acompanhamento. E aí ele ele automaticamente já cria aí um controle de quem mandou ou não mandou.

Resolve a contradição: é recorrente, com estrutura reaproveitável. A cada tema novo, o usuário abre um "caso" com nome (ex.: análise dos pedidos da Brookfield é a referência de formato), avisa a Claude, e um controle de quem respondeu / quem falta / o que já foi encaminhado pra Thassia nasce a partir de um molde comum.

## Rodada 2 — decisão

### Eixo 1 — Onde vive o controle (Tomás)

- **A. Planilha fora do GitHub** (Excel no OneDrive, já que é tudo Microsoft/Outlook) — uma aba ou arquivo por caso, colunas: condomínio, respondeu (data), encaminhado pra Thassia (data).
- **B. Repositório de código dedicado no GitHub**, com o controle como arquivo versionado.
- **C. Só dentro do Outlook** — categorias/pastas/flags por tema, sem tabela separada.

A custa quase nada, fica num lugar que o usuário já teria acesso, mas não é atualizada sozinha — alguém (usuário ou Claude, quando avisado) precisa marcar. B carrega complexidade que não se paga: GitHub é para código, ninguém abre PR pra marcar que o síndico respondeu, e um repo pesa em cima de uma planilha operacional do dia a dia. C fica difícil de enxergar "quem falta" de relance, e categoria do Outlook não segura bem dois status combinados (respondeu + encaminhado).

**Recomendação do Tomás: A.** É a solução mais burra que funciona — nenhuma peça nova, nenhum custo, roda dentro do que o usuário já usa. B é dizer que sim pra gente ter uma coisa "profissional" que ninguém vai manter.

### Eixo 2 — Quem detecta a resposta (Marina, discorda de parte do Tomás)

- **A. Manual assistido** — usuário avisa a Claude quando abre um caso novo, quando alguém responde e quando encaminha pra Thassia; a Claude escreve na planilha.
- **B. Monitoramento automático** — Claude usa o conector do Outlook (Microsoft 365, já disponível nesta sessão) pra checar sozinha quando cada condomínio responde e quando o encaminhamento pra Thassia sai.

B economiza o "eu aviso", mas depende de rodar em background com acesso recorrente à caixa, com chance real de errar leitura (ex.: confundir resposta de outro assunto do mesmo condomínio) e tira do usuário o controle de quando algo entra no registro. A dá mais trabalho de avisar, mas é 100% confiável e nada entra no controle sem o usuário validar.

**Recomendação da Marina: A agora, B depois se o volume justificar.** Discorda parcialmente do Tomás: acha que vale desenhar o passo B como evolução natural (o conector já existe, o custo de automatizar depois é baixo), não descartar de vez — mas para 9 itens por tema, automação plena hoje é resolver problema que ainda não apareceu.

### Eixo 3 — Isso é projeto de software? (Rafael)

Volume por caso é baixo (na casa de uma dezena de condomínios), frequência é "quando surge um tema" — não diário, não constante. O que falta hoje não é tecnologia, é deixar de anotar em papel e ter um molde que se repete. Isso não pede código nem repositório dedicado.

**Recomendação do Rafael: isso não deveria virar um repositório de software.** É uma rotina que a própria Claude sustenta: um molde (nome do caso + lista de condomínios + tabela de status) que nasce toda vez que o usuário diz "preciso fazer esse acompanhamento de [tema]", populado e atualizado conversando, guardado numa planilha (Eixo 1) que ele já usa.

## Recorte proposto

Isto **não é um projeto de software** — não abre repositório novo. É uma rotina recorrente ("caso" por tema, mesmo molde), resolvida com:
- Uma planilha (Excel/OneDrive) por caso, nomeada pelo tema.
- Atualização conversacional: o usuário avisa a Claude nos três momentos (abriu o caso, fulano respondeu, encaminhei pra Thassia) e ela mantém a planilha.
- Automação via conector do Outlook fica em aberto para uma iteração futura, se o volume crescer (ponto de discordância entre Marina e Tomás — decisão do usuário).

Pendente de decisão do usuário: confirmar o recorte acima e o Eixo 2 (A puro, ou já deixar B configurado desde já).

## Decisão final do usuário

1. Recorte confirmado: não é projeto de software, não abre repositório novo.
2. Eixo 2: **B** — leitura automática do Outlook desde o início (via conector Microsoft 365), não manual.

Resultado: P-001 vira rotina/script, não projeto fechado com repositório dedicado. A execução prática (ler o Outlook, montar o controle deste caso e dos próximos) segue nesta mesma sessão.

## Execução do primeiro caso

Planilha criada no OneDrive do usuário: `Acompanhamento Condomínios.xlsx`, pasta "Acompanhamento Condomínios", aba "Leia-me" (como reaproveitar o molde a cada tema novo) + aba "Energia elétrica" (o caso deste problema).

Link: https://dfsindicos365-my.sharepoint.com/personal/caio_dfsindicos_com_br/_layouts/15/Doc.aspx?sourcedoc=%7BCA5A6171-C37F-4C07-9F4A-9E6B8ED6CB2D%7D&file=Acompanhamento%20Condom%C3%ADnios.xlsx&action=default&mobileredirect=true

Status levantado lendo o Outlook (envio original de 05/08 até 12/08/2026): 8 de 9 condomínios responderam (falta PL Extrema). Falta encaminhar a resposta do Centenário (CTN) à Thassia; a do Arquipeo pode ter sido encaminhada em duplicidade (a Cushman mandou direto ao time da Thassia e o usuário também incluiu no lote que enviou).
