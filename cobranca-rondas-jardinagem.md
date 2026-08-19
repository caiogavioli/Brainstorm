# Cobrança — Rondas e jardinagem elétrica (Descarbonização BGRE)

Para você aprovar antes de qualquer envio.

- **Prazo da BGRE:** quarta **19/08**, período da tarde (reforçado pelo Alex em 18/08 às 18h34)
- **Prédios a cobrar:** 7
- **Atrium Office:** fora, conforme você confirmou

---

## 1. Modelo do e-mail

Um e-mail por condomínio. Onde estiver `[CONDOMÍNIO]`, entra o nome do prédio.

**Assunto:**
```
[CONDOMÍNIO] — Levantamento de rondas e jardinagem elétrica: retorno até amanhã (19/08)
```

**Corpo:**
```
Prezados, boa tarde.

Reforço o pedido do Alex Trindade (BGRE), enviado em 14/08, referente ao
levantamento de equipamentos para o Projeto de Descarbonização.

Até agora não identifiquei o retorno do [CONDOMÍNIO] na thread, e a BGRE
reforçou ontem que as informações precisam chegar até amanhã, 19/08, no
período da tarde.

São quatro perguntas:

1. Motos utilizadas nas rondas patrimoniais — modelos em operação e tipo de
   combustível (gasolina, diesel, gás, eletricidade ou outro)
2. Equipamentos de jardinagem — quais são utilizados e o tipo de combustível
   de cada um
3. Caso sejam movidos a combustível fóssil, já existe plano ou proposta de
   substituição por equipamentos elétricos?
4. Existe algum impeditivo para a troca por equipamentos elétricos?

Peço que respondam diretamente no e-mail original do Alex, mantendo-me em
cópia, para que o retorno fique registrado na thread.

Se o retorno já tiver sido enviado direto ao Alex, me avisem para que eu
possa dar baixa na minha lista.

Atenciosamente,

Caio Gavioli
DF Síndicos
```

**Por que a última frase importa:** o Alex disse que já recebeu de 8 prédios,
mas só 3 apareceram na sua caixa. Alguns destes 7 podem já ter respondido
direto para ele. A frase evita que você cobre quem já entregou.

---

## 2. Destinatários por prédio — para você validar

Origem: `rotina-safetydocs/mapeamento-predios.md`, confirmado por você em
11/08/2026.

**Legenda:** ✅ = já estava na thread original do Alex · ➕ = não estava, entraria agora

### 1. Passeio Paulista
| | Endereço |
|---|---|
| **Para** | ✅ sandra.alquimin@cushwake.com |
| Cc | ➕ ederson.silva@cushwake.com · ➕ ricardo.lugli@cushwake.com · ➕ marcelo.durazzo@sa.cushwake.com |

### 2. Arquipeo
| | Endereço |
|---|---|
| **Para** | ✅ helena.borges@cushwake.com |
| Cc | ➕ guilherme.larucci@cushwake.com · ➕ ricardo.lugli@cushwake.com · ➕ marcelo.durazzo@sa.cushwake.com |

### 3. TNU
| | Endereço |
|---|---|
| **Para** | ✅ marcus.martinez@cbre.com |
| Cc | ➕ paloma.pedrosa@cbre.com · ➕ marco.gimenez@cbre.com · ➕ katia.oliveira@cbre.com · ➕ cristiane.cavalcanti@cbre.com |

### 4. 17.007 Nações
| | Endereço |
|---|---|
| **Para** | ✅ 17007@cbre.com |
| Cc | ➕ 17007.oper@cbre.com · ➕ marco.gimenez@cbre.com · ➕ katia.oliveira@cbre.com · ➕ cristiane.cavalcanti@cbre.com |

### 5. Alphaville
| | Endereço |
|---|---|
| **Para** | ✅ abner.nogueira@cbre.com |
| Cc | ➕ marco.gimenez@cbre.com · ➕ katia.oliveira@cbre.com · ➕ cristiane.cavalcanti@cbre.com |

### 6. PL Extrema
| | Endereço |
|---|---|
| **Para** | ✅ plextrema.gerente@innova.net.br |
| Cc | ➕ plextrema.supervisor@innova.net.br · ➕ geraldo.ferreira@innova.net.br · ➕ luis.baptista@innova.net.br |

### 7. O Parque T07
| | Endereço |
|---|---|
| **Para** | ✅ oparquecorporate.gerente@innova.net.br |
| Cc | ➕ oparquecorporate.manutencao@innova.net.br · ➕ oparquecorporate.analista@innova.net.br · ➕ oparquecorporate.assistente@innova.net.br · ➕ thomaz.bastos@innova.net.br |

---

## 3. Três decisões suas antes de disparar

**a) Os endereços em Cc entram ou não?** Todos os ➕ **não estavam** na thread
do Alex — para eles isso chega do nada. A lista veio do mapeamento do
SafetyDocs, que foi montado para cobrança de documentos, não para este
assunto. Se preferir cobrança discreta, mande só para os ✅.

**b) Copiar o Alex Trindade?** Copiar `alex.trindade@bgre.com` mostra ao
contratante que você está conduzindo. Também expõe quais prédios não
responderam. Sua chamada.

**c) Confirmar que os 7 realmente não responderam.** Minha lista é do que
aparece na *sua* caixa. Quem respondeu direto ao Alex é invisível aqui. Se
quiser evitar cobrar quem já entregou, vale perguntar ao Alex quais 8 prédios
já retornaram antes de disparar.

---

## 4. Como enviar

**Hoje, por você.** A trava do projeto (`guard-destinatario.sh`) recusa
qualquer destinatário que não seja `caio@dfsindicos.com.br`, inclusive quando
o pedido parte de você. Ela existe para a rotina automática nunca escrever
para terceiros, e não distingue os dois casos.

**Se quiser que eu dispare**, é preciso afrouxar essa trava — por exemplo,
liberando apenas os endereços já confirmados em `mapeamento-predios.md`, que é
o modelo que a rotina do SafetyDocs já usa (ela tem hook próprio, com
allowlist). Isso é uma mudança de segurança e depende do seu aval explícito.
