# S-002 — vistorias-condominios — Rodada 1

**Data:** 2026-10-10
**Fase:** 2 rodada 1
**Problemas:** P-001

## Ferramenta de abertura
SIPOC do processo atual — ver `problemas/P-001-vistorias-condominios.md`, seção "Mapa do processo atual (SIPOC)". As lacunas (`?`) de lá viraram as perguntas abaixo.

## Perguntas

**Marina** (1–5)
1. Quantos vistoriadores estão ativos hoje, e em que aparelho cada um roda o app (celular Android, iPhone, tablet)?
2. Com que frequência cada vistoriador normalmente tem sinal de internet para sincronizar — direto depois da vistoria, ou passa dias offline até sincronizar?
3. Já aconteceu de duas pessoas mexerem na mesma vistoria ou no mesmo condomínio ao mesmo tempo? O que vocês esperam que prevaleça quando isso acontece?
4. Fora o erro de login que já identificamos, alguma vistoria já "sumiu" ou apareceu duplicada para alguém?
5. Quantos condomínios ativos e quantas vistorias concluídas existem hoje no sistema, mesmo que seja uma estimativa?

**Rafael** (6–9)
6. Quem recebe o relatório no final — síndico, administradora, proprietário, mais de um? Hoje como ele é entregue (e-mail, WhatsApp, impresso)?
7. Alguém revisa o relatório antes de sair da DF Síndicos, ou o vistoriador manda direto depois de concluir a vistoria?
8. Quando a sincronização falha hoje (como no print), o que a pessoa faz na hora — percebe e avisa, ignora e segue vistoriando, ou simplesmente não sabe que falhou?
9. Fora o sincronismo, alguma outra parte do app (preencher o checklist, tirar as fotos, gerar o relatório) incomoda a equipe?

**Tomás** (10–12)
10. Quando você fala em manter as fotos no OneDrive: é cada vistoriador salvando a própria foto lá na hora, ou o app continua juntando tudo e só o arquivo final do relatório vai para o seu OneDrive?
11. Fora você, mais alguém mexe na parte técnica do sistema hoje (conta do GitHub, da Vercel, do banco de dados) se precisar, ou é só você?
12. A empresa toda tem Microsoft 365/OneDrive corporativo, ou seria sua conta pessoal/da DF Síndicos guardando as fotos de todo mundo?

## Respostas do usuário

> Ó, tem cerca de cinco vistoriadores e eles usam o celular deles, que é o iPhone ou o Samsung. O ideal é que logo depois que ele termine a, a vistoria, ele aperte o botão de finalizar a vistoria e faça a sincronização com o sistema que for. cada um faz uma vistoria e o outro não interfere. É, eu faço vistorias nos meus prédios, o André faz vistorias nos prédios dele. Nunca tem duas pessoas mexendo na mesma vistoria ao mesmo tempo. Não, o problema não era nem o erro de login. O erro de login foi corrigido, mas o problema maior era a sincronização dos arquivos e onde vão ficar as fotos. Mas agora acho que colocando no OneDrive ou no SharePoint, em algum lugar desse gênero, eu acho que é possível, porque todo mundo tem acesso à conta do Microsoft. Então, temos no máximo 40 condomínios, entre 35 e 40. O final é enviado para a administradora do condomínio e para o proprietário via e-mail em um PDF. não é revisado. O relatório ele vai depois que concluído, mas ele teve a revisão do vistoriador. Ele tem que ter uma aba de, de vistoria do de, de conclusão do vistoriador. Que nem a gente tem no boletim diário informativo. É, o pessoal preenche tudo, a última aba é um resumo que ele valida. Sobre a sincronização, esse é o problema. As pessoas não entendem de sincronização, não entendem de sistema. Elas só preenchem. Então, elas não conseguem ver que deu algum problema. Não, o que eu tenha testado, não vi nenhum outro problema. Nenhum outro problema, a não ser o sincronismo. É, mas eu queria que você estudasse e sugerisse melhoria, sugerisse modo, sugerisse é, é, tudo que eu posso fazer para melhorar o meu programa. Que eu tenha uma qualidade grande para entregar para o cliente cada vez mais, cada vez mais qualidade. Não, hoje é, é um problema. É, ninguém salva. As fotos vão direto para o sistema. E aí eu posso ter problema de perder as fotos ou de espaço. Eu queria que você sugerisse a melhor opção, considerando que eu não quero gastar dinheiro com o servidor para ter espaço, para guardar essas fotos, e que eu posso colocar no OneDrive de graça, porque eu já tenho na empresa o acesso ao OneDrive. Não, só eu mexo na parte técnica. Eu sou o único que consegue mexer, que tem conhecimento dessa parte. O Microsoft 365, ele é da empresa.

**Mapeamento por número (para registro, não é edição da fala dele):**
1. ~5 vistoriadores, aparelho pessoal (iPhone ou Samsung).
2. Fluxo esperado: finalizar a vistoria → sincronizar na hora, no mesmo gesto.
3. Nunca duas pessoas na mesma vistoria — cada um cuida dos próprios prédios (ex.: usuário e André, cada um nos seus). Sem cenário de conflito de edição concorrente na prática.
4. Não houve só o erro de login — o problema maior é a sincronização dos **arquivos** (fotos) e onde elas ficam.
5. Até 40 condomínios (35–40).
6. Relatório final vai por e-mail em PDF para administradora **e** proprietário.
7. Não há revisão interna antes de enviar — mas o usuário quer criar uma: uma aba de "conclusão do vistoriador" (resumo que ele valida antes de finalizar), no mesmo padrão do boletim diário informativo que a empresa já usa em outro sistema. **Pedido de melhoria, não só resposta.**
8. Confirma o ponto mais crítico: os vistoriadores não entendem de sincronização/sistema, só preenchem — não têm como perceber que algo falhou.
9. Nenhum outro problema identificado além do sincronismo.
10. Não respondeu literalmente ao formato da pergunta (foto por vistoriador × arquivo final), mas deixou claro que quer **sem custo de servidor** para armazenar — o espaço do OneDrive corporativo já pago resolve, hoje as fotos vão direto pro sistema sem nenhuma cópia em lugar nenhum (risco de perda e de estourar espaço).
11. Só o usuário mexe na parte técnica.
12. Microsoft 365 é da empresa — toda a equipe tem acesso.

**Além das respostas, pedido explícito mais amplo:** não é só "resolver o sincronismo" — é "estudar e sugerir tudo que dá para melhorar", com qualidade cada vez maior para entregar ao cliente.

## Desacordos do time levados ao usuário
Nenhum ainda — Rodada 1 é levantamento, as propostas (e os desacordos, se houver) vêm na Rodada 2.

## Decisões
-

## Recorte proposto (fim da Rodada 2)
<ainda não chegamos lá>

## Indicadores propostos (fim da Rodada 2)
<ainda não chegamos lá>
