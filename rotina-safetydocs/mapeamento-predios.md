# Mapeamento prédio → email de cobrança

Fonte única de destinatários. A rotina **só** envia cobrança para uma linha com
`status: confirmado`. Linha `a confirmar` é relatada no resumo semanal como
pendência, nunca recebe email.

Os 13 rótulos abaixo são os que apareceram no informativo de 10/08/2026 —
confirmado por leitura real do email. Rótulo novo que aparecer numa semana
futura entra nesta tabela como `a confirmar`, nunca é inventado.

**Caio: preciso que você confirme (ou corrija) o email de cada linha antes do
primeiro envio real.** Onde já achei um candidato lendo threads da própria
caixa (marcado *"candidato, não confirmado"*), é só validar ou trocar.

| Rótulo no SafetyDocs | Condomínio (uso interno) | Email de cobrança | Status |
|---|---|---|---|
| Condomínio Alphaville | Alphaville | — | a confirmar |
| Associação do Empreendimento Arquipeo | Arquipeo | — | a confirmar |
| Associação do Parque Logístico Extrema | Extrema | plextrema.gerente@innova.net.br (candidato, não confirmado) | a confirmar |
| Condomínio JK B | JK B | — | a confirmar |
| Condomínio TNU | TNU | — | a confirmar |
| Condomínio 17.007 Nações | 17.007 Nações | — | a confirmar |
| Condomínio Atrium Century Plaza | Atrium Century Plaza | — | a confirmar |
| Condomínio Centenário Plaza B1 - Flórida | Centenário Plaza B1 | — | a confirmar |
| Condomínio Centenário Plaza B2 - Robocop | Centenário Plaza B2 | — | a confirmar |
| Condomínio do Passeio Paulista | Passeio Paulista | analista@condpasseio.com.br (candidato, não confirmado) | a confirmar |
| Condomínio O Parque | O Parque | oparquecorporate.gerente@innova.net.br (candidato, não confirmado) | a confirmar |
| Condomínio Panamerica Park - B2 (Comum) (BGRE) | Panamerica Park B2 | — | a confirmar |
| Condomínio Panamerica Park - B5 (BGRE) | Panamerica Park B5 | — | a confirmar |

## Como confirmar

Editar a linha, colar o email certo na coluna, trocar `a confirmar` por
`confirmado`. Pode ser mais de um endereço (separar por `;`) se a cobrança
deve ir para mais de uma pessoa do mesmo condomínio.

## Ignorar um rótulo

Se um rótulo não deve receber cobrança nunca (ex.: duplicata, área comum sem
gestão própria), trocar o email por `(ignorar)` e o status por `ignorado`. A
rotina pula sem relatar como pendência.
