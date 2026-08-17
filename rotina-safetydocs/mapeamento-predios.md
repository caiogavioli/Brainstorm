# Mapeamento prédio → email de cobrança

Fonte única de destinatários. A rotina **só** envia cobrança para uma linha com
`status: confirmado`. Linha `a confirmar` é relatada no resumo semanal como
pendência, nunca recebe email.

Confirmado pelo Caio em 11/08/2026. Os 13 rótulos abaixo são os que apareceram
no informativo de 10/08/2026. Rótulo novo que aparecer numa semana futura
entra nesta tabela como `a confirmar`, nunca é inventado.

| Rótulo no SafetyDocs | Condomínio (uso interno) | Email de cobrança | Status |
|---|---|---|---|
| Condomínio Alphaville | Alphaville | abner.nogueira@cbre.com;marco.gimenez@cbre.com;katia.oliveira@cbre.com;cristiane.cavalcanti@cbre.com | confirmado |
| Associação do Empreendimento Arquipeo | Arquipeo | helena.borges@cushwake.com;guilherme.larucci@cushwake.com;ricardo.lugli@cushwake.com;marcelo.durazzo@sa.cushwake.com | confirmado |
| Associação do Parque Logístico Extrema | PL Extrema | plextrema.gerente@innova.net.br;plextrema.supervisor@innova.net.br;geraldo.ferreira@innova.net.br;luis.baptista@innova.net.br | confirmado |
| Condomínio JK B | JKB | pedro.perozzi@cbre.com;lenilde.costa@cbre.com | confirmado |
| Condomínio TNU | TNU | marcus.martinez@cbre.com;paloma.pedrosa@cbre.com;marco.gimenez@cbre.com;katia.oliveira@cbre.com;cristiane.cavalcanti@cbre.com | confirmado |
| Condomínio 17.007 Nações | 17007 | 17007@cbre.com;17007.oper@cbre.com;marco.gimenez@cbre.com;katia.oliveira@cbre.com;cristiane.cavalcanti@cbre.com | confirmado |
| Condomínio Atrium Century Plaza | Atrium Office | atriumcomercial.gerente@innova.net.br;atriumcomercial.supervisor@innova.net.br;atriumcomercial.assistente@innova.net.br;thomaz.bastos@innova.net.br | confirmado |
| Condomínio Centenário Plaza B1 - Flórida | Centenário | adriano.camilo@cbre.com;daiane.silva1@cbre.com;jose.ferreira@cbre.com;marco.gimenez@cbre.com;katia.oliveira@cbre.com;cristiane.cavalcanti@cbre.com | confirmado |
| Condomínio Centenário Plaza B2 - Robocop | Centenário | adriano.camilo@cbre.com;daiane.silva1@cbre.com;jose.ferreira@cbre.com;marco.gimenez@cbre.com;katia.oliveira@cbre.com;cristiane.cavalcanti@cbre.com | confirmado |
| Condomínio do Passeio Paulista | Passeio Paulista | sandra.alquimin@cushwake.com;ederson.silva@cushwake.com;marcelo.durazzo@sa.cushwake.com;ricardo.lugli@cushwake.com | confirmado |
| Condomínio O Parque | O Parque T07 | oparquecorporate.gerente@innova.net.br;oparquecorporate.manutencao@innova.net.br;oparquecorporate.analista@innova.net.br;oparquecorporate.assistente@innova.net.br;thomaz.bastos@innova.net.br | confirmado |
| Condomínio Panamerica Park - B2 (Comum) (BGRE) | Panamerica | kelly.dangelis@cbre.com;suneimy.brito@cbre.com;marco.gimenez@cbre.com;katia.oliveira@cbre.com;cristiane.cavalcanti@cbre.com | confirmado |
| Condomínio Panamerica Park - B5 (BGRE) | Panamerica | kelly.dangelis@cbre.com;suneimy.brito@cbre.com;marco.gimenez@cbre.com;katia.oliveira@cbre.com;cristiane.cavalcanti@cbre.com | confirmado |
| Condomínio Panamerica Park - B3 (BGRE) | — | — | a confirmar |
| Condomínio Panamerica Park - B6 (BGRE) | — | — | a confirmar |

## Grupos de envio — prédios que viram **um único email**

Dois pares de rótulos são fisicamente prédios distintos (torres/blocos
diferentes) mas têm o mesmo gestor e devem chegar como **uma cobrança só**,
não duas emails separados:

| Grupo de envio | Rótulos combinados |
|---|---|
| **Centenário** | Condomínio Centenário Plaza B1 - Flórida + Condomínio Centenário Plaza B2 - Robocop |
| **Panamerica** | Condomínio Panamerica Park - B2 (Comum) (BGRE) + Condomínio Panamerica Park - B5 (BGRE) |

Regra para a rotina (ver `playbook.md`, Passo 4-B): quando dois ou mais
rótulos confirmados têm a **mesma coluna "Condomínio (uso interno)"**, seus
documentos (a vencer + vencidos) são somados num único email, com uma
subseção por rótulo original dentro de cada tabela (vencidos/a vencer) — para
o gestor saber se um item é do bloco B1 ou do B2, por exemplo. O assunto usa
o nome do grupo de envio ("Centenário", "Panamerica"), não o rótulo
individual. Todos os outros 9 prédios continuam 1 rótulo = 1 email.

## Pendências de mapeamento

**Condomínio Panamerica Park - B3 (BGRE)** e **Condomínio Panamerica Park - B6
(BGRE)** apareceram pela primeira vez no informativo de 17/08/2026 — não
existiam na semana anterior (10/08). Parecem ser blocos novos do mesmo
complexo Panamerica (que já tem B2 e B5 confirmados e agrupados). **Não
enviados ainda** — confirme o email de cobrança de cada um (e diga se
devem entrar no grupo de envio "Panamerica" ou ficar separados).

## Como confirmar um rótulo novo

Editar a linha, colar o email certo na coluna, trocar `a confirmar` por
`confirmado`. Mais de um endereço: separar por `;`. Se dois rótulos novos
devem virar um único envio, dar a eles a mesma "Condomínio (uso interno)" e
adicionar o par na tabela de Grupos de envio acima.

## Ignorar um rótulo

Se um rótulo não deve receber cobrança nunca (ex.: duplicata, área comum sem
gestão própria), trocar o email por `(ignorar)` e o status por `ignorado`. A
rotina pula sem relatar como pendência.
