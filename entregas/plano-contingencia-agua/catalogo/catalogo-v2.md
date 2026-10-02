# Catálogo v2 de sistemas de água em edifícios comerciais e logísticos no Brasil

**Problema:** P-001 · **Versão:** 2 (2026-10-02) · **Status:** rascunho para revisão

> **Aviso.** Este catálogo **orienta e organiza; não substitui responsável técnico habilitado** (engenheiro com ART/RRT, vigilância sanitária local, Corpo de Bombeiros do estado). Não é laudo, não é projeto e não é parecer jurídico. Qualquer exigência citada aqui deve ser conferida, na versão vigente e na regra local, antes de virar obrigação em procedimento.

Este é o catálogo do projeto `plano-contingencia-agua` (spec em `projetos/plano-contingencia-agua.md`). Ele responde à pergunta "o que pode existir de água em um condomínio comercial ou logístico?", inclusive o que é raro, improvisado ou "imaginário". Cada item tem um ID estável para a ficha por condomínio.

**Como usar:** para cada ID, marcar **S** (existe), **N** (não existe) ou **?** (não sei). Na regra do projeto, **"não sei" é tratado como "não tem proteção"** e vira item de vistoria: os dois episódios (reúso × potável; água gelada na torneira por contrapressão) vieram de pontos que ninguém sabia que existiam.

---

## Notas desta versão

### Legenda das referências

- **✔** = a **existência, o número e o escopo geral** da norma ou lei foram conferidos nesta pesquisa (2026-10-02) em fontes públicas. **Não significa** que a cláusula específica foi lida: o texto das normas ABNT é pago e não foi aberto. Quando a edição ou a vigência tem dúvida, a dúvida está escrita ao lado.
- **◻** = conhecimento geral, **a confirmar** (versão vigente, cláusula e exigência local) por responsável técnico antes de entrar em procedimento.
- Como a conferência foi feita por pesquisa web e por páginas de terceiros (o acesso direto a vários sites oficiais ficou bloqueado nesta sessão), cada ✔ da lista final tem link e a observação "fonte secundária" quando for o caso.

### Chave da coluna "Cenários"

| Nº | Cenário do projeto |
|---|---|
| 1 | Contaminação cruzada (reúso, água gelada, incêndio na torneira) |
| 2 | Falta de água / reservatório vazio |
| 3 | Água fora do padrão (cloro baixo, turva, suspeita microbiológica, Legionella) |
| 4 | Vazamento e alagamento |
| 5 | Falha de bomba ou de energia |
| 6 | Incêndio com reserva ou sistema indisponível |
| 7 | Refluxo ou retorno de esgoto |
| 8 | Falha do tratamento químico da torre ou do chiller |
| 9 | Contaminação do reservatório (sujeira, animal, infiltração) |
| T | Transversal: comunicação de crise (níveis 1-2-3, locatários, proprietário, vigilância sanitária) |

A coluna diz **em que cenários o item entra como causa, via ou ponto de contenção**. Serve de base para a matriz sistema × cenário da planilha-mestre. Foi preenchida por critério técnico geral e deve ser revisada na primeira ficha real.

### O que mudou do v1 (76 itens → 195 itens)

- **IDs preservados**: A1…H10 não foram renumerados. Os 119 itens novos continuam a numeração de cada grupo (A15…, B7…, C14…, D9…, E11…, F4…, G13…, H11…).
- **Coluna "Cenários"** em todas as tabelas, inclusive nos itens antigos. A tabela do grupo H ganhou também a coluna "Ref.".
- **Referências conferidas** (✔ onde antes era ◻): NBR 15527:2019 (B2), NBR 13714 (D2, D3, D6), NBR 10897:2020 (D4, D5), NBR 8160 (E1, E2, E9), NBR 10844 (E5), NBR 16401 (C1), NBR 17037:2023 (C6), Lei 13.589/2018 (C6), Portaria 3.523/1998 (C2), NBR 10339:2018 (G1), ANSI/ISEA Z358.1 (G6), ASHRAE 188 e Guideline 12 (A12, C2, G2, G9), NR-13, NR-33 e NR-35 (C5, C9, H10), NBR 17505 (E16), RDC Anvisa 216/2004 (G4), CONAMA 430/2011 (F2, F3, F8), e as novas NBR 15569:2020 (A26), NBR 17076:2024 (F4), NBR 12244 (A2), NBR 15495 (B16), NBR 12209 (F2, F5), Resolução CNRH 54/2005 (B1), IT 22/2025 do CBPMESP (D1).
- **✔ rebaixados a "escopo geral"**: no v1, alguns ✔ cobriam o item inteiro (ex.: G12 chuveiros com NBR 5626). Agora o ✔ vale só para o que a norma cobre no geral; a exigência específica fica ◻.
- **Correções de conteúdo**: C10 descrevia condensador evaporativo como se fosse chiller a água; o condensador evaporativo foi para o novo C27. A11 (tratamento pontual) foi desdobrado em A36–A39 e A12 (água quente) em A24–A31, para o S/N/? ser por equipamento. D4 (anticongelante) foi qualificado: é raro em sprinkler no Brasil e não é típico de prédio comercial comum (D21). E10 e A6 passaram a remeter ao novo A23 (ladrão e respiro).
- **Alerta normativo novo (C2/C6)**: a Lei 13.589/2018 manda o PMOC seguir a Resolução Anvisa RE 9/2003, e fontes secundárias apontam que a RE 9 foi **revogada em julho de 2024**, com a ABNT NBR 17037:2023 como referência técnica atual. Confirmar com o responsável do PMOC antes de citar parâmetros.
- **A seção 0 do v1** (orientação do episódio em curso) **não foi repetida**: o conteúdo migra para o cenário 1 (`entregas/plano-contingencia-agua/cenarios/`). O v1 continua disponível no histórico do branch.

### Escopo: o que ficou de fora de propósito

- **Pressurização de escadas** (ventilação com ar, sem água): fora, a menos que o prédio tenha reservatório ou dreno ligado a ela. Se houver, registrar na ficha como observação do item D ou E correspondente.
- **Gás, vapor ultra-específico de processo industrial pesado, hospitais e diálise** (exigem plano próprio). Consultórios dentro de condomínio comercial entram em G23.
- **Redes públicas** (concessionária a montante do cavalete). Entram só como A1.

---

## Mapa de como a contaminação cruzada acontece

Mecanismos físicos para orientar a leitura do catálogo. A lista de pares que não podem se tocar está na seção **"Mapa de interconexões críticas"** (depois dos grupos).

| Mecanismo | O que acontece | Onde costuma acontecer neste catálogo |
|---|---|---|
| **Interligação direta (cross-connection)** | Um tubo, mangueira ou flexível liga fisicamente dois sistemas que deveriam estar separados | Reúso × potável (B1, B8, B10); reposição do chiller/torre × potável (C3, C14, C17); incêndio × potável (D15, D20); H11–H14 |
| **Contrapressão (backpressure)** | O sistema não potável tem pressão maior (bomba do chiller, caldeira, pressurizador do locatário) que a rede potável e empurra água para ela | C1, C3, C5, C21, A12, A28, A41 |
| **Retrossifonagem (backsiphonage)** | A rede potável perde pressão (falta de água, manobra, rompimento, uso de incêndio) e **puxa** água do outro sistema | C3, G (mangueiras), D, A33, A35 |
| **Entrada por reservatório** | Água ou sujeira entra na caixa d'água por tampa mal vedada, ladrão, laje, tubulação de outro sistema passando por cima | A4, A6, A17, A23, E5, E10 |
| **Trocador de calor com parede única** | A parede do trocador fura (corrosão, fadiga) e mistura potável com circuito químico, ou o contrário | A12, A28, C1, C5, C22, C23 |
| **Estagnação e retorno de gases** | Trecho parado cria biofilme e Legionella; sifão seco devolve gás do esgoto | A9, A43, E9, G2, G6, H15 |
| **Retorno de esgoto ou pluvial pela rede pública** | Rede pública sobrecarregada devolve água pelos ramais, ralos e ladrões | E1, E14, E15, E21 |
| **Serviço temporário de terceiros** | Mangueira, bomba ou tanque levado por prestador fica ligado ao potável durante limpeza química, obra ou evento | C38, A42, G22, H13 |

**Hierarquia de proteção (referência de engenharia, a confirmar na NBR 5626:2020):** separação atmosférica (*air gap*) é a barreira mais confiável; depois, disconector/BPV (zona de pressão reduzida); depois, retenção dupla; válvula de retenção simples e quebra-vácuo atmosférico **não** bastam para risco alto. O conceito de classificar o fluido por categoria de risco e escolher o dispositivo a partir disso vem da EN 1717 (✔ existência; referência internacional, não é norma brasileira).

---

## A. Água potável (captação, armazenamento, distribuição, uso, aquecimento)

| ID | Sistema | O que é / onde está | Como falha ou contamina | Cenários | Ref. |
|---|---|---|---|---|---|
| A1 | Ligação da concessionária | Ramal, cavalete, hidrômetro geral, registros e válvulas na entrada. Pode haver mais de um ramal | Rompimento; falta de água (que gera retrossifonagem); hidrômetro parado; ramal sem retenção quando o prédio abastece direto, sem reservatório | 1,2,4 | ✔ NBR 5626:2020 |
| A2 | Poço artesiano / fonte própria | Captação subterrânea, bomba submersa, selo sanitário, laje de proteção, tratamento, outorga | Contaminação do aquífero (fossa próxima, poço mal selado ou abandonado aberto); falta de outorga e de análise; mistura com a rede da concessionária sem separação | 1,2,3 | ✔ Portaria GM/MS 888/2021 · ✔ NBR 12244:2006 (construção de poço tubular) · ◻ outorga estadual/ANA |
| A3 | Abastecimento emergencial (caminhão-pipa) | Ponto de recebimento de água de terceiros no reservatório | Água de origem desconhecida; tanque do caminhão sujo; mangueira dentro da boca de visita do reservatório (entrada por reservatório); sem cloro | 2,3,9 | ✔ Portaria 888/2021 (abrange abastecimento por carro-pipa) · ◻ cloro mínimo no carro-pipa (0,5 mg/L em fonte secundária) |
| A4 | Reservatório inferior (cisterna) | Tanque enterrado ou no térreo/subsolo, com tampa de inspeção | Infiltração de água do solo ou de poça; tampa sem vedação; ladrão sem proteção; sujeira acumulada; tubulação de esgoto ou pluvial próxima | 2,3,9 | ✔ NBR 5626:2020 |
| A5 | Recalque | Bombas que sobem a água da cisterna ao reservatório superior, boias, quadros | Pane; falta de bomba reserva; retenção falha e a água volta; falta de energia; funcionamento a seco | 2,5 | ✔ NBR 5626:2020 |
| A6 | Reservatório superior (caixa d'água) | Tanques na cobertura (um ou vários, em células, ver A17) | Entrada de sujeira ou água pela tampa e laje; tubulação de outro sistema passando por cima; ladrão sem tela (ver A23); estagnação; água quente do sol | 2,3,9 | ✔ NBR 5626:2020 |
| A7 | Barrilete e colunas | Tubulação que sai do reservatório e distribui às prumadas | Registros sem identificação; interligações improvisadas ("jumper", ver H12); corrosão; registro fechado esquecido | 1,2,4 | ✔ NBR 5626:2020 |
| A8 | Pressurização / redução de pressão | Bombas *booster* (ver A20), tanque hidropneumático (A19), válvulas redutoras de pressão (VRP) | Pressão alta (rompimento); oscilação; VRP travada aberta ou fechada; bomba com retorno | 4,5 | ✔ NBR 5626:2020 |
| A9 | Rede interna de distribuição | Prumadas, ramais, sub-ramais, registros de andar | Vazamento oculto; trecho morto com água parada; registro não encontrado na emergência | 2,3,4 | ✔ NBR 5626:2020 |
| A10 | Pontos de consumo | Torneiras, copas, bebedouros, lavatórios, chuveiros, vasos, mictórios | Ponto raramente usado estagna; ponto com conexão cruzada; ponto usado como fonte de reposição improvisada | 1,3 | ✔ NBR 5626:2020 |
| A11 | Tratamento pontual de potável (conjunto) | Guarda-chuva dos itens A36 a A39 (filtros, cloração, UV, osmose) | Dosagem errada; filtro saturado; resina contaminada. Marcar o detalhe em A36–A39 | 3 | ✔ Portaria 888/2021 (padrão de potabilidade) |
| A12 | Água quente sanitária (conjunto) | Aquecimento, acumulação, recirculação e trocadores. Detalhe em A24–A31 | Faixa morna favorece **Legionella** (a faixa de risco varia entre referências, em geral entre ~20 e ~45 °C; confirmar); trocador de parede única contamina; recirculação parada | 1,3 | ✔ NBR 5626:2020 · ✔ ASHRAE 188 · ✔ ASHRAE Guideline 12 |
| A13 | Dispositivos de proteção contra refluxo | Válvulas de retenção, quebra-vácuo, disconector/BPV, separação atmosférica | Ausência; instalação errada; sem teste periódico; dispositivo "curto-circuitado" por by-pass. Ver "Mapa de interconexões críticas" | 1,7 | ✔ NBR 5626:2020 (a norma trata de proteção contra refluxo; cláusula a ler) · ✔ EN 1717 (referência internacional) |
| A14 | Controle da qualidade da água | Cloro residual, análises laboratoriais, plano de amostragem, pontos de coleta | Sem ponto de coleta definido; laudo vencido; não conformidade sem ação. **Cuidado de escopo:** a Portaria 888 trata de sistemas de abastecimento e soluções alternativas; em prédio abastecido pela concessionária, confirmar com a vigilância sanitária local o que é obrigação do condomínio e o que é referência | 3,T | ✔ Portaria 888/2021 (cloro residual livre mínimo de 0,2 mg/L na rede e nos pontos, segundo fonte secundária: ◻ conferir artigo) |
| A15 | Interligação entre prédios, lotes ou reservatórios vizinhos | Tubulação de emergência entre torres, blocos ou galpões; registro "para emergência" | Mistura de qualidades e de pressões; reservatório de um bloco contamina o outro; registro aberto esquece; sem mapa | 1,2,9 | ◻ NBR 5626:2020 (conferir) |
| A16 | Hidrômetros de sub-medição, hidrômetros inteligentes e telemetria | Medidores por andar/loja/galpão, com saída de pulso ou rede (LoRa, GSM); hidrômetro dedicado em reposição de circuito | Medidor parado ou by-passado; telemetria sem alarme de fluxo contínuo (vazamento passa despercebido); medidor sem retenção a jusante | 2,4,T | ◻ regulamento metrológico do Inmetro (conferir) |
| A17 | Reservatório em células e tubulação de equalização | Várias células interligadas por tubo de equalização ou barrilete comum | Célula em limpeza com registro de isolamento aberto contamina a outra; célula parada estagna; equalização leva sujeira de uma à outra | 2,3,9 | ◻ NBR 5626:2020 (conferir) |
| A18 | Reservatório de passagem / tanque pulmão (*break tank*) | Tanque intermediário entre rede e bombas (comum em logístico com baixa pressão) | Estagnação (cloro some); boia presa; tampa aberta; ladrão sem proteção; falta de bomba | 2,3,9 | ◻ NBR 5626:2020 (conferir) |
| A19 | Tanque hidropneumático e vasos de expansão do pressurizador | Vaso com bexiga ou colchão de ar, pressostatos, compressor (se houver) | Bexiga rompida (água em contato com aço, ferrugem, biofilme); perda do colchão de ar faz a bomba ligar e desligar sem parar; vaso de pressão sem inspeção | 3,5 | ◻ NR-13 (se enquadrado como vaso de pressão; conferir) |
| A20 | Skid de bombeamento (*booster*) com inversor de frequência | Conjunto compacto de bombas, inversor, transdutor de pressão, válvulas e quadro | Falha do inversor ou do sensor derruba a pressão ou a sobe demais; sem bomba reserva; alarme sem destinatário; sucção em depressão puxa água de reservatório | 2,4,5 | ◻ NBR 5626:2020 (conferir) |
| A21 | Válvulas de alívio e de segurança hidráulicas | Alívio de pressão em pressurizadores, aquecedores e redes; descarga canalizada ou livre | Descarga ligada direto ao esgoto sem folga de ar; válvula emperrada fechada; gotejando sem ninguém ver (perda contínua) | 4,7 | ◻ NBR 5626:2020 (conferir) |
| A22 | Boias, válvulas de nível, chaves e sensores de nível de reservatório | Boia mecânica, boia elétrica, sensor ultrassônico, chave de nível | Boia presa ou quebrada: transborda (4) ou deixa esvaziar (2); sensor sujo; boia ligada à rede sem proteção contra refluxo | 2,4,5,9 | ✔ NBR 5626:2020 (a norma exige válvula de boia com proteção; cláusula a ler) |
| A23 | Ladrão, extravasor, respiro e tela dos reservatórios potáveis | Tubo de ladrão, tubo de limpeza, respiro, tela | Ladrão ligado direto ao esgoto ou pluvial sem desconexão (gás e retorno entram na caixa); tela rasgada ou entupida; respiro aberto para fonte de poeira ou animais | 7,9 | ✔ NBR 5626:2020 (reservatório e extravasor; cláusula a ler) |
| A24 | Aquecimento central a gás (passagem e acumulação) | Aquecedores a gás em casa de máquinas, com acumulador e chaminé | Temperatura de armazenamento baixa favorece Legionella; trocador de parede única se tiver circuito de aquecimento; acúmulo de sedimento | 3 | ✔ NBR 5626:2020 (água quente) · ◻ norma e regra local de instalação de gás (conferir) |
| A25 | Aquecedor elétrico de acumulação e de passagem | Boilers em vestiários, copas e cozinhas; chuveiros elétricos | Boiler sem uso estagna e fica morno; válvula de alívio gotejando; ânodo de sacrifício vencido | 3 | ✔ NBR 5626:2020 (água quente) |
| A26 | Aquecimento solar com coletores e acumulador | Coletores na cobertura, reservatório térmico, apoio elétrico ou a gás | Estagnação no verão; apoio desligado deixa o acumulador na faixa morna; circuito indireto com fluido de troca (glicol) e trocador de parede única | 1,3 | ✔ NBR 15569:2020 (circuito direto; requisitos de projeto e instalação) |
| A27 | Bomba de calor para água quente sanitária | Bomba de calor ar-água ou água-água com acumulador | Temperatura de acumulação baixa; resistência de apoio desligada; trocador de condensador de parede única | 1,3 | ◻ NBR 5626:2020 (conferir) |
| A28 | Trocador de calor de placas ou de serpentina (água quente sanitária) | Trocador entre circuito primário (caldeira, vapor, recuperação de calor) e água sanitária | **Parede única**: furo mistura circuito químico com potável, em qualquer sentido de pressão. Placas com gaxeta ou solda trincada. Contrapressão se o primário tem pressão maior | 1 | ◻ NBR 5626:2020 (conferir) |
| A29 | Recirculação de água quente e válvulas de balanceamento | Retorno, bomba de recirculação, válvulas de balanceamento ou termostáticas | Bomba parada: trecho frio e morno; ramal sem retorno ("rabo") estagna; balanceamento perdido deixa ramais mornos | 3,5 | ✔ NBR 5626:2020 (água quente) |
| A30 | Válvulas misturadoras termostáticas e misturadores | Mixing valves em vestiários, PNE e chuveiros; misturador central | Para evitar escaldamento o armazenamento é mantido alto e a válvula mistura: se o ramal pós-mistura é longo, fica morno. Válvula travada. Contrapressão por diferença de pressão entre quente e fria | 1,3 | ◻ NBR 5626:2020 (conferir) |
| A31 | Válvula de alívio térmico (T&P) e vaso de expansão do aquecedor | Alívio de pressão/temperatura e vaso de expansão do circuito de água quente | Aquecedor com retenção na entrada e sem vaso de expansão: a dilatação sobe a pressão; descarga sem folga de ar | 4,7 | ◻ NBR 5626:2020 (conferir) |
| A32 | Torneiras e válvulas eletrônicas (com sensor) e arejadores | Torneiras com sensor, solenoide e bateria; arejadores e restritores | Baixa vazão e uso raro estagnam; solenoide e arejador com biofilme; bateria acabada deixa fechada. Ponto de coleta de Legionella e Pseudomonas | 3 | ◻ NBR 5626:2020 (conferir) |
| A33 | Válvulas de descarga, caixas acopladas e mictórios | Válvula de descarga hidromecânica, caixa acoplada, mictório com ou sem água | Válvula de descarga sem quebra-vácuo, ligada ao vaso, **retrossifona** em queda de pressão; selo hídrico seco em mictório sem água | 1,7 | ◻ NBR 5626:2020 (conferir) |
| A34 | Bebedouros refrigerados e purificadores (ponto de uso) | Bebedouro de pressão, bebedouro industrial, purificador com filtro | Filtro vencido; reservatório de gelo ou de água fria com biofilme; água de dreno ligada ao esgoto sem folga; ponto de reúso do rejeito (ver B5) | 3 | ◻ NBR 5626:2020 (conferir) |
| A35 | Torneiras com rosca para mangueira (jardim, serviço, garagem, casa de máquinas) | Torneira de jardim, ponto de lavagem de piso, ponto de serviço, ponto na sala de máquinas | **A mangueira é a interligação mais comum**: ligada em tanque, balde, circuito ou produto, retrossifona; deixada conectada vira jumper (H13). Foi o mecanismo do episódio 2 | 1,3 | ✔ NBR 5626:2020 (proteção contra refluxo em pontos de uso; cláusula a ler) |
| A36 | Filtros de linha (areia, carvão, cartucho, multimídia) e abrandador | Filtros na entrada do prédio, no ponto de uso e na água de processo; resina | Filtro saturado vira fonte de bactérias; retrolavagem com descarga direta ao esgoto sem folga; resina esgotada; sem troca de cartucho | 3 | ◻ Portaria 888/2021 (padrão; conferir) |
| A37 | Clorador e dosador de hipoclorito em potável | Bomba dosadora, pastilha, clorador em linha, tanque de hipoclorito | Dosagem baixa, residual nulo; dosagem alta; tanque de produto sem contenção; bomba parada sem alarme | 3 | ✔ Portaria 888/2021 (desinfecção e residual) |
| A38 | Lâmpada UV em potável | Câmara UV em linha, sensor, quadro | Lâmpada vencida ou câmara suja; **UV não deixa residual** na rede: depois da câmara a água volta a contaminar; falha de energia | 3,5 | ◻ — |
| A39 | Osmose reversa e deionização (potável ou processo) | Osmose reversa, resina de troca iônica, tanque de permeado | Membrana ou resina contaminada; permeado parado no tanque estagna; rejeito sem destino ou ligado à rede sem folga; DI sem residual | 3 | ◻ — |
| A40 | Tubulações de potável enterradas, em canaleta, trincheira ou compartilhando shaft com outros sistemas | Ramais enterrados em pátio logístico; potável na mesma canaleta de esgoto, pluvial ou químico | Em baixa pressão a rede **aspira** do solo ou da canaleta pelas juntas e furos; vazamento escondido sob piso; escavação rompe | 1,3,4 | ◻ NBR 5626:2020 (conferir) |
| A41 | Derivações para equipamentos de locatários | Pontos que o locatário liga a máquinas (lava-louças, máquina de gelo, osmose, lavadora, resfriador, bomba de pressurização própria) | Pressurizador do locatário gera **contrapressão** na rede comum; equipamento sem dispositivo; mudança feita sem avisar o condomínio | 1,3 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| A42 | Ligações provisórias de obra e reforma | Mangueiras, "gambiarras" e pontos temporários de obra, betoneira, lavagem de piso | Mangueira conectada a tanque com produto ou a balde; ponto provisório que vira definitivo; sem registro de fechamento | 1,3 | ◻ — |
| A43 | Pontos de descarga (*flushing*) e drenos de fim de rede | Registro de descarga e dreno no fim de prumadas e ramais | Não existem (trecho nunca é renovado) ou nunca são abertos; dreno ligado ao esgoto sem folga | 3,7 | ✔ NBR 5626:2020 (geral) |

---

## B. Água não potável / fontes alternativas

A NBR 16783:2019 (✔) trata de fontes alternativas de água não potável em edificações (chuva, água cinza, rebaixamento de lençol, esgoto tratado) e, segundo fonte secundária, admite usos como descarga, lavagem de áreas externas e veículos, irrigação, uso ornamental e sistemas de resfriamento (torres). Quando uma torre usa reúso como reposição, B e C se tocam.

| ID | Sistema | O que é / onde está | Como falha ou contamina | Cenários | Ref. |
|---|---|---|---|---|---|
| B1 | Água de reúso | Água cinza ou efluente tratado reaproveitado (descarga, irrigação, lavagem). **Foi o episódio 1** | Interligação com potável na obra; tubulação sem identificação visual; ponto de uso confundido com potável; reposição por potável sem folga de ar (ver B8) | 1,3 | ✔ NBR 16783:2019 · ✔ Resolução CNRH 54/2005 (reúso direto não potável; ◻ ler a modalidade aplicável) |
| B2 | Água de chuva | Captação em cobertura, filtro, reservatório próprio, bomba | Contaminação por animais e folhas; mistura com potável na reposição; estagnação | 1,3,9 | ✔ NBR 15527:2019 (aproveitamento de água de chuva de coberturas para fins não potáveis) · ✔ NBR 16783:2019 |
| B3 | Água de rebaixamento de lençol | Drenagem de subsolo reaproveitada | Qualidade variável (ferro, hidrocarboneto, sal); sem tratamento; mistura com potável | 1,3 | ✔ NBR 16783:2019 |
| B4 | Condensado de ar-condicionado | Água dos drenos de fancoils e splits reaproveitada | Contaminação microbiológica e metálica; ponto de reaproveitamento sem barreira | 1,3 | ✔ NBR 16783:2019 (escopo geral; ◻ confirmar se cita condensado) |
| B5 | Rejeito de osmose reversa | Concentrado salino dos tratamentos A34 e A39, descartado ou reaproveitado | Reaproveitamento sem avaliar sal e químicos; ponto do rejeito ligado ao potável | 1,3 | ◻ — |
| B6 | Pontos de uso não potável | Torneiras de jardim, lavagem de piso, descarga com reúso | Ponto sem placa e cor; ocupante bebe ou lava algo sensível | 1,3 | ✔ NBR 16783:2019 (diferenciação visual dos pontos) |
| B7 | Cisterna / reservatório de reúso ou de chuva | Tanque próprio de armazenamento do não potável, no subsolo ou na cobertura | Tampa aberta; ladrão ligado ao esgoto; vizinho do reservatório potável com parede comum furada; estagnação e odor | 1,3,9 | ✔ NBR 16783:2019 · ✔ NBR 15527:2019 |
| B8 | Complementação automática do reúso/chuva com água potável | Boia, solenoide ou by-pass que repõe a cisterna não potável com potável quando falta reúso | **Interligação direta intencional**: sem separação atmosférica, a pressão do reúso ou o sifão leva o não potável à rede. Boia presa ou by-pass aberto | 1,2 | ✔ NBR 16783:2019 (alimentação complementar; ◻ cláusula) · ✔ NBR 5626:2020 (separação atmosférica) |
| B9 | Descarte da primeira chuva (*first flush*), filtros e telas da captação | Dispositivo que descarta o início da chuva; filtro de folhas; tela do reservatório | Dispositivo entupido ou sem manutenção; descarte ligado ao esgoto sem folga; filtro saturado | 3,9 | ✔ NBR 15527:2019 (pré-tratamento; ◻ cláusula) |
| B10 | Bomba e rede (prumada) exclusiva de reúso/chuva | Recalque e prumada paralelas à de potável, com cor e identificação | Prumada ligada ao potável no andar por erro de obra; flexível provisório entre prumadas; identificação apagada | 1 | ✔ NBR 16783:2019 (identificação) |
| B11 | Tratamento do reúso (cloração, UV, filtros) e controle de qualidade | Dosagem, câmara UV, filtros, medição de cloro e turbidez | Residual baixo; filtro saturado; água sem controle chega a descargas e lavagens (aerossol) | 3 | ✔ NBR 16783:2019 (parâmetros de qualidade; ◻ cláusula) |
| B12 | Água de reúso fornecida por terceiros | Reúso comprado da concessionária ou entregue em caminhão | Descarregado no reservatório potável por engano; sem certificado; mangueira em ponto errado | 1,3,9 | ◻ — |
| B13 | Poço ou fonte própria usada só para fins não potáveis | Poço para irrigação, lavagem ou reposição da torre; bomba própria | Ligação paralela à rede potável "para quando o poço falha"; mistura de qualidades; sem análise | 1,3 | ✔ Portaria 888/2021 (se for consumo humano; ◻ uso não potável) · ✔ NBR 12244:2006 (construção do poço) |
| B14 | Água cinza tratada (chuveiros, lavatórios, lavadoras) | Coleta separada, tratamento, reservatório, redistribuição | Mistura com esgoto negro; tratamento parado; odor e biofilme | 3 | ✔ NBR 16783:2019 |
| B15 | Purga da torre ou do circuito reaproveitada | Purga de torre ou de chiller usada em irrigação, lavagem ou descarga | Biocida e inibidor chegam à planta e ao ocupante; Legionella em aerossol da irrigação; ligação ao potável | 1,3,8 | ◻ — |
| B16 | Poços de monitoramento e piezômetros | Poços que medem o nível e a qualidade do lençol (obra, posto, tanque) | Tampa solta vira via de contaminação do aquífero; confundido com poço de captação | 3 | ✔ NBR 15495 (poços de monitoramento; ◻ edição) |

---

## C. Água de processo de climatização e térmica

Este é o grupo do **episódio 2**. Todo item que **tem produto químico e uma bomba** é candidato a empurrar água para a rede potável. Os itens C14 a C20 e C37 a C38 descrevem as **interligações** (pontos de reposição, by-pass, mangueira) que são o foco do projeto.

| ID | Sistema | O que é / onde está | Como falha ou contamina | Cenários | Ref. |
|---|---|---|---|---|---|
| C1 | Circuito de água gelada | Anel fechado entre chiller, bombas e fancoils/VAV; com glicol e/ou inibidores | Vazamento reabastece com potável; **contrapressão** empurra para a rede; glicol e inibidor contaminam; água rosa ou colorida pela marcação | 1,4,8 | ✔ NBR 16401 (instalações de ar-condicionado; ◻ cláusulas de água) |
| C2 | Torre de resfriamento / condensação (circuito aberto) | Bacia, enchimento, ventilador e distribuição na cobertura; tratamento químico, purga, biocida | **Legionella**; aerossol; químico escapando; bacia cheia de sujeira; tratamento parado | 3,8 | ✔ Portaria 3.523/1998 · ✔ Lei 13.589/2018 (PMOC) · ✔ ASHRAE 188 e Guideline 12 (gestão de Legionella; não são norma brasileira) |
| C3 | Reposição (*make-up*) dos circuitos (conjunto) | Linha de água que repõe o chiller e a torre. **Ponto mais crítico de interconexão com o potável.** Detalhe em C14 a C20 | Ligação direta sem separação atmosférica; contrapressão e retrossifonagem; mangueira deixada conectada | 1,2,4 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| C4 | Tanque de expansão aberto / de reposição do circuito | Tanque aberto que absorve variação de volume e repõe perdas | Boia presa; ladrão submerso; extravasa para laje ou para a caixa d'água; reposição manual por mangueira | 1,4 | ◻ — |
| C5 | Circuito de água quente de aquecimento | Caldeira ou bomba de calor para *reheat* e aquecimento, com químicos | Trocador de parede única; contrapressão; vazamento | 1,4,8 | ✔ NR-13 (se caldeira ou vaso de pressão; ◻ enquadramento) |
| C6 | Fancoils, VAV, serpentinas, drenos de condensado | Equipamentos de ar nos andares; bandejas e drenos | Dreno entupido vaza no forro; bandeja com biofilme; serpentina furada vaza água química; dreno ligado direto à coluna de esgoto (gás entra pela bandeja) | 4,7 | ✔ Lei 13.589/2018 (PMOC) · ✔ NBR 17037:2023 (qualidade do ar interior em ambientes climatizados; fonte secundária) |
| C7 | Umidificação | Umidificadores adiabáticos e de vapor em salas técnicas e data centers | Reservatório estagnado; aerossol; dosagem de químico | 3,8 | ✔ ASHRAE Guideline 12 (aerossol; ◻ aplicabilidade) |
| C8 | Sistema de dosagem química | Bombas dosadoras e linhas de dosagem (inibidor, biocida, dispersante) | Dosagem errada; bomba parada; linha dosadora ligada a água de diluição da rede sem folga; produto cristaliza e trava a retenção | 1,8 | ◻ — |
| C9 | Caldeiras e vapor | Gerador de vapor, rede de vapor, retorno de condensado | Contaminação química do retorno; **vaso de pressão** (risco de explosão); purga quente ao esgoto (ver E22) | 1,4,5 | ✔ NR-13 |
| C10 | Chillers resfriados a água | Chiller cujo condensador rejeita calor pela água da torre (C2) | Vazamento no condensador mistura gás refrigerante ou óleo com a água da torre; contaminação entre circuitos; incrustação | 1,8 | ◻ NBR 16401 (conferir) |
| C11 | Termoacumulação | Tanque de água gelada ou de gelo para deslocar demanda | Perda de água; estagnação; entrada de ar; tanque aberto com reposição manual | 2,4,8 | ◻ — |
| C12 | Resfriamento líquido de data center | CRAH, *rear door*, circuito a líquido e trocadores | Vazamento sobre equipamento; glicol; reposição com mangueira | 1,4 | ◻ — |
| C13 | Gerador arrefecido a água | Radiador e circuito de arrefecimento do gerador diesel | Vazamento; reposição manual com água potável por mangueira, sem proteção | 1,5 | ◻ — |
| C14 | Ponto de água potável na casa de máquinas, sala do chiller ou cobertura | Torneira, registro ou ponto de mangueira perto do circuito ou da torre, usado para repor | **É o ponto do episódio 2**: o ponto de potável perto do circuito vira a fonte da mangueira. Ver A35 e H13 | 1 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| C15 | Reposição automática da torre (boia na bacia) | Válvula de boia na bacia da torre ou em tanque de nível | Boia submersa, tubo mergulhado (perde a folga de ar); bacia transborda; boia presa deixa a torre secar | 2,4,8 | ◻ — |
| C16 | Reposição automática do circuito fechado | Válvula de enchimento automático, solenoide ou regulador de pressão ligado ao potável | Válvula travada **aberta**: reabastece sem parar e esconde vazamento; travada **fechada**: a reposição falha (episódio 2); retenção única na entrada; sem hidrômetro | 1,2,4 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| C17 | By-pass e reposição manual (registro, mangueira, engate) | Registro de by-pass da reposição automática; engate para mangueira ao lado do circuito | **A mangueira ligada direto na entrada do circuito**, mantida conectada, com pressão do circuito maior que a da rede: empurra água para a prumada | 1 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| C18 | Tanque de ruptura / funil de reposição (separação atmosférica) | Tanque ou funil que recebe a água do potável por cima, com folga de ar, e repõe o circuito por bomba ou gravidade | É a solução segura, mas: a folga some se o tubo for mergulhado; o tanque estagna; boia presa; ladrão ligado ao esgoto; vira ponto de contaminação | 1,2 | ✔ NBR 5626:2020 (separação atmosférica; ◻ dimensionamento da folga) |
| C19 | Disconector (BPV), retenção dupla ou outro dispositivo na reposição | Dispositivo de proteção entre o potável e o circuito | Sem teste periódico; dreno do BPV entupido ou ligado ao esgoto sem folga; instalado ao contrário; removido ou "curto-circuitado" por by-pass | 1,7 | ✔ NBR 5626:2020 · ✔ EN 1717 (referência internacional) |
| C20 | Medição da reposição (hidrômetro, contador, nível) nos circuitos | Hidrômetro dedicado, sensor de nível no tanque, contador de pulsos | Não existe: um vazamento só aparece como litros por dia na conta de água. Indicador para pegar o problema antes da improvisação | 1,4,T | ◻ — |
| C21 | Bombas de circulação e vasos desacopladores | Bombas primárias, secundárias e terciárias; pressão do circuito | Pressão de recalque maior que a do potável: é a **causa física da contrapressão**. Selo da bomba vaza | 1,4,5 | ◻ NBR 16401 (conferir) |
| C22 | Trocador de placas entre circuitos de climatização | Trocador que separa a pressão de um prédio alto ou faz *free cooling* entre torre e circuito fechado | Parede única; gaxeta ou solda trinca e mistura os circuitos (um aberto, outro com químicos); sem alarme de pressão ou condutividade | 1,8 | ◻ NBR 16401 (conferir) |
| C23 | Chiller com recuperação de calor | Condensador de recuperação que aquece água sanitária, reheat ou piscina | Recuperação ligada a A28 ou a piscina: parede única; refrigerante/óleo/aditivo vai para água sanitária | 1,3 | ◻ — |
| C24 | Bomba de calor água-água e VRF com condensação a água | Trocadores ligados à torre ou a anel de condensação | Vazamento mistura circuito de refrigerante com água; condensação com tratamento fraco | 1,8 | ◻ — |
| C25 | Chiller de absorção | Chiller a vapor ou queima direta, com torre | Água com aditivos de brometo ou lítio (ver FISPQ); torre grande, mais Legionella; vaso de pressão | 1,3,8 | ◻ NR-13 (conferir) |
| C26 | Resfriador seco com spray adiabático (*dry cooler*) | Resfriador com aspersão de água para pré-resfriar o ar | Água nebulizada com aerossol; reposição ligada ao potável; Legionella | 3 | ✔ ASHRAE Guideline 12 (aerossol; ◻ aplicabilidade) |
| C27 | Condensador evaporativo | Condensador de refrigeração industrial (câmaras frias, logístico) que usa spray e bacia próprios | Bacia e spray com Legionella; reposição por boia ligada ao potável; produto químico dosado | 3,8 | ✔ ASHRAE Guideline 12 (aerossol; ◻ aplicabilidade) |
| C28 | Torre de circuito fechado (*fluid cooler*) | Serpentina fechada com spray externo; circuito interno com glicol | Spray externo com Legionella; vazamento da serpentina leva glicol à bacia | 1,3,8 | ✔ ASHRAE Guideline 12 (aerossol; ◻ aplicabilidade) |
| C29 | Tratamento de torre por ozônio, UV ou físico (sem biocida químico) | Ozonizador, câmara UV ou dispositivo magnético/ultrassônico em derivação | **Sem residual na bacia**; efeito depende do tempo de contato e do fluxo desviado; sonda ou lâmpada falha sem alarme; falsa sensação de controle | 3,8 | ◻ — |
| C30 | Filtragem lateral e separador de sólidos da torre | Filtro de areia, hidrociclone ou filtro de cartucho em derivação | Filtro saturado; retrolavagem com potável direto (interligação) ou descarga ao esgoto sem folga | 3,8 | ◻ — |
| C31 | Purga e descarga da torre (condutividade e destino) | Purga contínua ou por condutividade; descarga para ralo ou coletor | Sensor falha: purga excessiva (falta de água) ou nula (incrustação); purga com biocida ao pluvial; descarga ligada ao esgoto sem folga | 2,4,8 | ◻ — |
| C32 | Linha de equalização e tanque comum entre torres | Tubo de equalização entre bacias de várias torres ou células | Contaminação entre torres; torre parada estagna e recebe da torre ativa; contaminação de uma contamina todas | 3,8 | ◻ — |
| C33 | Circuito de glicol e abastecedor de glicol (*glycol feeder*) | Tanque de glicol e bomba de enchimento do circuito | Bomba de enchimento ligada à rede por mangueira com retenção única; glicol misturado ao potável | 1 | ◻ — |
| C34 | Armazenamento de produtos químicos de tratamento | Bombonas, tanques de inibidor, biocida, ácido, hipoclorito; bacia de contenção | Vazamento sem contenção; ladrão da bacia ligado ao ralo; mistura de incompatíveis (hipoclorito + ácido libera cloro); sem FISPQ à vista | 1,4,8 | ◻ NBR 17505 (se líquido inflamável) · ◻ FISPQ |
| C35 | Controlador de torre e circuito (condutividade, ORP, pH) | Controlador, sondas, bombas dosadoras, alarmes | Sonda suja ou descalibrada; alarme sem destinatário (ver H6); controlador em manual desde a última manutenção | 3,8,T | ◻ — |
| C36 | Vaso de expansão fechado e válvulas de alívio dos circuitos | Vaso com diafragma e válvulas de segurança | Diafragma rompido; alívio gotejando ligado ao ralo; perda de pressão que faz a reposição automática compensar | 1,4 | ◻ NR-13 (conferir) |
| C37 | Esvaziamento, descarte e enchimento de circuitos | Descarga do circuito para manutenção, limpeza ou troca de glicol; enchimento por mangueira | Água com químicos vai ao pluvial ou ao esgoto sem autorização; enchimento por mangueira direta ao circuito (ver C17) | 1,4 | ✔ CONAMA 430/2011 (lançamento de efluentes; ◻ aplicação a rede pública) |
| C38 | Limpeza química, passivação e serviços temporários nos circuitos | Bombas, tanques e mangueiras de terceiros ligados à torre ou ao circuito | **Mangueira do prestador ligada ao potável** durante o serviço e esquecida; descarte de efluente químico | 1,3,8 | ◻ — |

---

## D. Combate a incêndio

Referências típicas: NBR 13714 (hidrantes e mangotinhos) e NBR 10897:2020 (chuveiros automáticos), mais a **Instrução Técnica do Corpo de Bombeiros do estado** (cada estado tem a sua; em São Paulo, a IT 22/2025 revogou a IT 22/2019). A IT de cada estado manda no volume da reserva e no projeto aprovado (AVCB/CLCB).

| ID | Sistema | O que é / onde está | Como falha ou contamina | Cenários | Ref. |
|---|---|---|---|---|---|
| D1 | Reserva técnica de incêndio (RTI) | Volume de água destinado só ao incêndio, na caixa ou em reservatório separado | Água parada vira "potável velha"; reposição liga ao potável sem barreira (ver D15); consumo comum usa a RTI (ver D9) | 1,6,9 | ✔ IT 22/2025 CBPMESP (SP) · ◻ IT do estado do prédio |
| D2 | Bombas de incêndio | Bomba principal (elétrica ou diesel), reserva e jockey; quadro | Não parte; diesel sem combustível; quadro em manual ou desligado; teste nunca feito | 5,6 | ✔ NBR 13714 (ed. 2000; ◻ confirmar edição vigente) |
| D3 | Hidrantes e mangotinhos | Rede, abrigos, mangueiras, esguichos | Registro fechado; mangueira vencida; rede com vazamento; abrigo trancado | 6 | ✔ NBR 13714 |
| D4 | Sprinklers (chuveiros automáticos) | Rede molhada, seca, pré-ação ou dilúvio; válvula de governo e alarme | Corrosão; falso acionamento; rede seca com umidade; válvula de controle fechada (rede fora de serviço) | 4,6 | ✔ NBR 10897:2020 |
| D5 | ESFR / alta vazão em armazéns | Sprinklers de supressão para estoque alto em galpão logístico | Rede subdimensionada para o estoque atual; obstrução por estoque; pressão insuficiente | 5,6 | ✔ NBR 10897:2020 (◻ conferir se cobre ESFR) |
| D6 | Hidrante de recalque / conexão siamesa | Entrada externa para o Corpo de Bombeiros | Tampa solta; registro fechado; rede entupida | 6 | ✔ NBR 13714 |
| D7 | Espuma (LGE) | Líquido gerador de espuma em áreas de risco (combustível, subsolo, tanque) | Líquido contaminando a rede de teste; proporcionador sem teste; validade do LGE | 1,6 | ◻ — |
| D8 | Descarga de teste | Água usada em teste e manutenção de bombas e sprinklers | Descarte sem destino; perda da reserva; reposição por mangueira ligada ao potável | 1,2,6 | ◻ — |
| D9 | RTI em célula dedicada e saída de consumo acima do volume de reserva | Reservatório com célula só de incêndio, ou saída de consumo em cota acima da RTI | Registro de interligação entre células aberto "temporariamente" esvazia a RTI; saída de consumo rebaixada; célula de incêndio sem renovação | 2,6,9 | ◻ IT do estado · ✔ NBR 13714 (reservatório; ◻ cláusula) |
| D10 | Hidrante de passeio / de coluna externa (pátio) | Hidrante no pátio logístico ou na calçada; diferente do hidrante de parede (abrigo interno) | Atingido por caminhão; registro travado; tampa e engate sem proteção; água suja na abertura | 6 | ✔ NBR 13714 |
| D11 | Anel de hidrantes enterrado (rede de pátio) | Tubulação enterrada em ferro dúctil, PEAD ou aço, que atende o galpão e os hidrantes | Corrosão e vazamento sob piso (não aparece); jockey disparando sem parar; válvulas de seccionamento sem mapa | 4,6 | ✔ NBR 13714 (◻ cláusula) |
| D12 | Bomba jockey e pressostatos | Bomba pequena que mantém a pressão da rede; pressostatos de partida | Partida frequente = vazamento na rede; pressostato desregulado liga a principal sem necessidade | 5,6 | ✔ NBR 13714 (◻ cláusula) |
| D13 | Ponto de teste da bomba de incêndio (linha de teste, medidor, retorno) | Linha de retorno à reserva ou descarga com medidor de vazão para o teste da bomba | Teste sem medidor (não prova vazão); retorno à reserva com água contaminada; descarga para o ralo; **válvula de teste não volta ao fechado** | 5,6 | ✔ NBR 13714 (◻ cláusula) |
| D14 | Motor diesel da bomba de incêndio | Motor, tanque de combustível, baterias, arrefecimento (radiador ou trocador com água da própria rede) | Combustível velho; bateria fraca; arrefecimento com reposição por mangueira; vazamento de diesel na bacia | 5,6 | ✔ NBR 13714 (◻ cláusula) |
| D15 | Alimentação da RTI ou da rede de incêndio pela rede potável | Boia, registro de enchimento ou by-pass que repõe a reserva de incêndio com potável; enchimento por mangueira | **Interligação incêndio × potável**: retrossifonagem puxa a água da rede de incêndio (estagnada, às vezes com aditivo) para o potável. Mangueira de enchimento esquecida | 1,6 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| D16 | Válvula de governo e alarme e válvulas de controle da rede | VGA, válvulas de seccionamento com supervisão (chave, sinalização) | Válvula de controle fechada após manutenção: sprinkler fora de serviço sem ninguém saber; alarme sem monitoramento | 6,T | ✔ NBR 10897:2020 (◻ cláusula) |
| D17 | Dilúvio, cortina d'água e canhões monitores | Dilúvio em área de risco, cortina em fachada, canhão em pátio ou tanque | Válvula de dilúvio sem teste; bicos entupidos; vazão que a RTI não sustenta; canhão exposto | 4,6 | ◻ NBR 10897 / IT do estado (conferir) |
| D18 | Compressor de ar ou nitrogênio de rede seca e pré-ação | Compressor ou gerador de nitrogênio e secador de ar | Ar úmido corrói a rede seca; compressor parado perde pressão e dispara a válvula; vazamento de ar | 5,6 | ✔ NBR 10897:2020 (◻ cláusula) |
| D19 | Névoa d'água de alta pressão (*water mist*) | Bombas de alta pressão e bicos, água de baixa condutividade, em data center e salas elétricas | Filtros e bicos entupidos; água tratada contaminada; equipamento exige pessoal especializado | 4,6 | ◻ — |
| D20 | Válvulas de transferência entre RTI e reservas de consumo | Registro "de emergência" que permite usar a RTI para consumo, ou a água de consumo para a rede de incêndio | A RTI vira consumo em falta de água e fica vazia (cenário 2 vira cenário 6); ou potável flui para incêndio sem separação. Registro sem lacre e sem registro de abertura | 1,2,6 | ◻ IT do estado (conferir) |
| D21 | Sprinklers em câmaras frias e redes com anticongelante | Rede seca ou pré-ação em câmara fria; **solução anticongelante (raro no Brasil)** | Solução de glicol ou glicerina em rede ligada ao potável: contaminação por retorno; teste da rede contamina o reservatório; vazamento no frio | 1,6 | ✔ NBR 10897:2020 (◻ anticongelante: conferir) |

---

## E. Esgoto e drenagem

| ID | Sistema | O que é / onde está | Como falha ou contamina | Cenários | Ref. |
|---|---|---|---|---|---|
| E1 | Esgoto sanitário | Ramais, colunas, ventilação, caixas de inspeção | Entupimento; retorno por ralo; ventilação insuficiente; rede pública sobrecarregada | 7 | ✔ NBR 8160 (ed. 1999 com confirmações; fontes citam também 2020: ◻ confirmar edição) |
| E2 | Caixa de gordura | Cozinhas, restaurantes, refeitórios | Entupimento; transbordo; odor; cozinha do locatário sem manutenção | 4,7 | ✔ NBR 8160 · ◻ regra municipal |
| E3 | Poço de recalque de esgoto | Bomba que sobe o esgoto de subsolo | Bomba para e inunda o subsolo; sem bomba reserva e alarme; falta de energia | 4,5,7 | ◻ NBR 8160 (conferir) |
| E4 | Caixa separadora água-óleo | Garagens, oficinas, lavagem, abastecimento | Saturada; óleo vai para a rede pública; sem coleta | 4 | ◻ — |
| E5 | Águas pluviais | Calhas, condutores, ralos de cobertura | Entupimento; transbordo para dentro do prédio ou sobre a caixa d'água; ladrão misturado ao esgoto | 4,9 | ✔ NBR 10844 (ed. 1989; ◻ confirmar edição) |
| E6 | Drenagem de subsolo | Poços de drenagem, bombas, canaletas | Bomba para, nível sobe, inundação de subsolo e casa de máquinas | 4,5 | ◻ — |
| E7 | Retenção/detenção de águas pluviais | Reservatório de contenção exigido por lei municipal em muitos lotes | Cheio; bomba de esvaziamento parada (ver E14); sem manutenção | 4,7 | ◻ legislação municipal |
| E8 | Drenagem de pátio e docas | Canaletas, caixas de areia, ralos | Entupimento; empoçamento; óleo e resíduos | 4 | ◻ — |
| E9 | Ralos e sifões | Selo hídrico em ralos e sifonados | Selo seca em ralo sem uso e devolve gás do esgoto | 7 | ✔ NBR 8160 |
| E10 | Drenos e extravasores | Drenos de ar-condicionado, poço do elevador (E19), extravasor de equipamentos | Dreno ligado direto à coluna de esgoto sem desconexão; drenos entupidos. Para ladrão de reservatório, ver A23 | 4,7 | ✔ NBR 8160 (◻ cláusula) |
| E11 | Caixas de gordura em série e separadores de gordura | Várias caixas em série, separador automático em praça de alimentação | Primeira caixa saturada; separador sem retirada diária; odor e tampa aberta | 4,7 | ✔ NBR 8160 (◻ cláusula) · ◻ regra municipal |
| E12 | Poços de visita e caixas de inspeção externas | PVs e caixas da rede externa, ligações à rede pública | Tampa retirada; infiltração; gases; entrada de pluvial no esgoto e vice-versa | 4,7 | ◻ — |
| E13 | Caixa de areia, desarenador e retenção de sólidos | Retenção de areia e lodo em pátio e lavagem | Cheia; arrasta sedimento à rede; sem limpeza | 4 | ◻ — |
| E14 | Bomba de esvaziamento do reservatório de detenção e válvula de retenção do lançamento | Bomba e saída do reservatório de retardo de pluviais | Bomba parada: reservatório cheio na próxima chuva; sem retenção no lançamento, a rede pública em carga **devolve água** ao reservatório | 4,5,7 | ◻ legislação municipal |
| E15 | Válvulas de retenção (anti-refluxo) nos ramais para a rede pública | Válvula de retenção ou comporta (*flap*) em esgoto e pluvial na saída do lote | Ausente; travada aberta por sujeira; subsolo com ralos abaixo da rua recebe refluxo | 7 | ✔ NBR 8160 (◻ cláusula) |
| E16 | Bacias de contenção de tanques de combustível e drenagem da bacia | Bacia de contenção do tanque de diesel do gerador, da bomba de incêndio ou de abastecimento interno | Dreno da bacia aberto leva diesel ao pluvial; bacia cheia de água de chuva; tanque sem bacia | 4 | ✔ NBR 17505 (armazenamento de inflamáveis e combustíveis; ◻ parte aplicável) |
| E17 | Heliponto: drenagem e coleta | Laje de cobertura com canaletas, caixa de coleta, hidrante de heliponto | Combustível em derrame segue pelo pluvial; hidrante e espuma sem teste | 4,6 | ◻ regulamento ANAC de heliportos/helipontos (conferir número) |
| E18 | Drenagem de lajes técnicas, jardineiras e coberturas | Ralos de laje de máquinas, jardineiras, telhado verde (G13) | Ralo entupido por terra e folha; alaga laje técnica e teto; vazamento no forro | 4 | ✔ NBR 10844 (◻ cláusula) |
| E19 | Fosso de elevador | Poço do elevador com dreno ou bomba | Água no fosso para o elevador; bomba sem alarme; óleo hidráulico misturado | 4,5 | ◻ — |
| E20 | Ralos e poços da casa de máquinas, sala do chiller e bacias de torre | Pontos de descarga de purgas, vazamentos e lavagem de equipamentos | Água com químicos vai ao pluvial; dreno entupido alaga a sala; descarga sem folga de ar | 4,7,8 | ✔ NBR 8160 (◻ cláusula) |
| E21 | Poço ou bomba de rampa de garagem e docas rebaixadas | Poço de recalque pluvial de rampa e de doca abaixo do nível da rua | Bomba única que falha: rampa e doca alagam; sem alarme; aterro de sedimento | 4,5 | ◻ — |
| E22 | Purgas quentes e condensado (caixa de resfriamento, neutralização) | Purga de caldeira e condensado ácido ligados ao esgoto por caixa | Descarga acima de 40 °C danifica a rede e o PVC; sem neutralização | 4 | ✔ CONAMA 430/2011 (temperatura e pH de lançamento; ◻ aplicação a rede pública) |
| E23 | Válvulas de admissão de ar (AAV) e ventilação secundária | Válvula que admite ar na coluna no lugar do tubo de ventilação | Válvula travada devolve gás ao ambiente; aceitação normativa varia | 7 | ◻ NBR 8160 (conferir) |
| E24 | Sanitários com triturador ou bomba individual | Triturador em subsolo, vestiário e lojas; bomba individual | Entupimento por material estranho; bomba sem alarme; retorno por válvula presa | 4,7 | ◻ — |

---

## F. Tratamento próprio

| ID | Sistema | O que é / onde está | Como falha ou contamina | Cenários | Ref. |
|---|---|---|---|---|---|
| F1 | ETA própria | Tratamento da água de poço ou da água bruta (coagulação, filtração, desinfecção) | Falha na desinfecção; filtro esgotado; ferro e manganês; dosagem sem registro | 3 | ✔ Portaria 888/2021 |
| F2 | ETE própria / de reúso | Tratamento do esgoto do prédio (origem do reúso B1) | Efluente fora do padrão; odor; falha de energia; lançamento sem licença | 3,5 | ✔ NBR 16783:2019 · ✔ NBR 12209:2011 (projeto de ETE) · ✔ CONAMA 430/2011 |
| F3 | Efluente especial | Lavagem de veículos e empilhadeiras, pré-tratamento de logístico, laboratórios | Descarte sem tratamento | 1,4 | ✔ CONAMA 430/2011 (◻ legislação estadual) |
| F4 | Fossa séptica, filtro anaeróbio e sumidouro | Tratamento local sem rede coletora (condomínio logístico fora da rede) | Transbordo; sumidouro saturado contamina o lençol e poços próximos; sem limpeza | 3,9 | ✔ NBR 17076:2024 (tratamento de menor porte, até 12.000 L/dia, substitui NBR 7229 e 13969) |
| F5 | ETE compacta (MBBR, MBR, lodo ativado em pacote) | ETE de pacote com reator de leito móvel (MBBR) ou de membrana (MBR), soprador | Falha do soprador; membrana colmatada; lodo em excesso; descarte fora do padrão; alarme sem destinatário | 3,5 | ✔ NBR 12209:2011 (projeto de ETE; ◻ porte) |
| F6 | Tratamento terciário do efluente para reúso | Filtração, cloração e UV após a ETE, antes da reserva de reúso (B7) | Terciário parado: efluente cru vai ao reúso; residual de cloro baixo | 1,3 | ✔ NBR 16783:2019 |
| F7 | Lodo e limpeza (limpa-fossa, destinação, MTR) | Caminhão limpa-fossa, destinação do lodo, manifesto de transporte | Destinação irregular; limpeza esquecida; lodo no pátio | 3,4 | ◻ legislação ambiental estadual |
| F8 | Recirculação e tratamento de água de lavagem (lava-rápido, empilhadeiras, fachada) | Reciclagem da água de lavagem com filtros e separador; tratamento de água de lavagem de fachada | Reciclada sem controle volta com óleo e produto; ligação ao potável para completar o nível; descarte ao pluvial | 1,3 | ✔ CONAMA 430/2011 (◻ legislação estadual) |

---

## G. Usos especiais

| ID | Sistema | O que é / onde está | Como falha ou contamina | Cenários | Ref. |
|---|---|---|---|---|---|
| G1 | Piscina, spa, hidromassagem | Tratamento químico, filtros, circulação | Cloro baixo; contaminação microbiana; reposição ligada ao potável sem folga | 1,3 | ✔ NBR 10339:2018 |
| G2 | Fontes, espelhos d'água, cascatas | Decorativos em hall e praça | **Legionella**; aerossol; algas; reposição por mangueira | 3 | ✔ ASHRAE Guideline 12 (aerossol; ◻ aplicabilidade) |
| G3 | Irrigação e paisagismo | Cisterna de jardim, aspersores, parede verde (ver G14) | Ligação ao potável sem barreira; mistura com reúso; aspersor com aerossol | 1,3 | ◻ — |
| G4 | Cozinha e copas | Máquina de gelo, lava-louças, cafeteiras, bebedouro industrial | Filtro vencido; mangueira ligada direto em ponto de risco; reservatório do restaurante sem limpeza | 1,3 | ✔ RDC Anvisa 216/2004 (serviços de alimentação; reservatório limpo no máximo a cada 6 meses, segundo fonte secundária: ◻ conferir) |
| G5 | Lavanderia | Máquinas industriais, tanque de produto | Retorno de químico para a rede; produto dosado direto da rede | 1,3 | ◻ — |
| G6 | Lava-olhos e chuveiros de emergência | Em salas de bateria, produtos químicos, áreas de manutenção | **Estagnação**: ninguém aciona; sai água suja ou fria demais na hora em que precisa | 3 | ✔ ANSI/ISEA Z358.1 (norma americana; acionamento semanal e água tépida de 16 a 38 °C, segundo fontes secundárias) |
| G7 | Laboratório / água DI | Água destilada, deionizada, tratamentos | Contaminação química e microbiológica; equipamento ligado à rede sem proteção | 1,3 | ◻ — |
| G8 | Câmaras frias e degelo | Dreno de degelo, condensador evaporativo (ver C27) | Dreno entupido; gelo; contaminação da câmara | 4 | ◻ — |
| G9 | Resfriamento evaporativo e nebulização em galpão | Painéis adiabáticos, nebulizadores | Estagnação; aerossol; Legionella | 3 | ✔ ASHRAE Guideline 12 (aerossol; ◻ aplicabilidade) |
| G10 | Lavagem de piso e fachada | Lavadoras, pontos de mangueira em garagem | Mangueira conectada em ponto de potável de risco; produto aspirado pela rede | 1 | ◻ — |
| G11 | Zeladoria e DML | Tanques de limpeza, torneiras de serviço | Mangueira mergulhada em balde; retorno | 1 | ◻ — |
| G12 | Chuveiros e vestiários (logístico/indústria) | Uso coletivo, volume alto | Água quente morna; uso irregular; biofilme | 3 | ◻ NBR 5626:2020 (geral; ◻ cláusula de água quente) |
| G13 | Telhado verde / cobertura verde | Camada vegetal com irrigação e drenagem na laje | Irrigação ligada ao potável sem barreira; ralo entupido por terra; infiltração na laje | 1,4 | ◻ — |
| G14 | Jardim vertical / parede verde | Fitofachada com irrigação recirculada e reservatório | Recirculação com biofilme e aerossol; fertirrigação ligada ao potável sem retenção; vazamento em fachada | 1,3,4 | ◻ — |
| G15 | Lava-rápido e lavagem de caminhões (docas, áreas de lavagem) | Pista de lavagem com bomba de alta pressão, produto, canaleta | Mangueira em ponto potável; água de lavagem ao pluvial; separador saturado | 1,4 | ✔ CONAMA 430/2011 (◻ legislação estadual) |
| G16 | Máquinas de gelo industriais e câmara de gelo | Fábrica de gelo em barra ou escama, câmara de estocagem de gelo | Gelo é alimento: filtro vencido, drenos ligados ao esgoto sem folga, reposição por mangueira | 1,3 | ✔ RDC Anvisa 216/2004 (serviços de alimentação; ◻ aplicabilidade) |
| G17 | Degelo por água em evaporadores | Spray de água para degelo de evaporadores de câmaras e túneis | Água de degelo com glicol ou refrigerante; dreno entupido forma gelo; ligação ao potável | 1,4 | ◻ — |
| G18 | Água de resfriamento de compressores e equipamentos de processo | Compressores, prensas e equipamentos refrigerados a água, em circuito aberto ou fechado | Circuito aberto alimentado direto da rede; vazamento de óleo no circuito; contrapressão da bomba do equipamento | 1,4 | ◻ — |
| G19 | Saunas, banho turco e duchas de academia ou wellness | Gerador de vapor, duchas, ofurô, ducha escocesa | Reservatório do vapor com biofilme; ducha em desuso estagna; Legionella em aerossol | 3 | ✔ ASHRAE Guideline 12 (aerossol; ◻ aplicabilidade) |
| G20 | Cozinha profissional: forno combinado, lava-louças de túnel, boiler de café, lavador de coifa | Equipamentos com consumo alto, tanque e bomba próprios | Lavador de coifa ligado ao potável com produto químico; boiler sem retenção; bomba de pressurização do equipamento gera contrapressão | 1,3 | ✔ RDC Anvisa 216/2004 (◻ aplicabilidade) |
| G21 | Lava-olhos portáteis e estações autônomas | Frasco ou tanque de lava-olhos fora de ponto fixo | Água do tanque parada e vencida; tanque vazio; sinalização apagada | 3 | ✔ ANSI/ISEA Z358.1 (norma americana) |
| G22 | Foodtrucks, quiosques, feiras e eventos conectados provisoriamente | Mangueiras de eventos ligadas ao hidrante ou ponto do condomínio | Mangueira comum (não própria para alimento), sem retenção, mergulhada ou ligada ao tanque do veículo; ponto deixado em uso depois do evento | 1,3 | ✔ RDC Anvisa 216/2004 (◻ aplicabilidade) |
| G23 | Clínicas, consultórios, estética e pet (autoclave, cadeira odontológica, equipamentos de diálise) | Salas comerciais com equipamentos de saúde ligados à rede do condomínio | Linhas de água de baixa vazão com biofilme; equipamento sem dispositivo antirretorno; descarte de químicos no esgoto | 1,3 | ◻ regulamento sanitário do serviço de saúde (conferir) |

---

## H. Pontos transversais: não são sistemas, são onde o plano falha

Os itens H11 a H15 são os **pontos de interligação** (válvulas de transferência, by-pass improvisado, mangueira, "jumper", conexão de reposição manual) que o projeto quer achar na autovistoria.

| ID | Item | Por que importa / como falha | Cenários | Ref. |
|---|---|---|---|---|
| H1 | **Mapa de interconexões** entre sistemas | Os dois episódios foram interconexões que ninguém sabia que existiam. Ver a seção "Mapa de interconexões críticas" | 1,T | ◻ — |
| H2 | Identificação e cor das tubulações | Sem isso o operador fecha o registro errado na emergência. A NBR 16783 trata da diferenciação do não potável | 1,T | ✔ NBR 16783:2019 |
| H3 | Mapa e identificação de registros e válvulas de seccionamento | Na emergência, quem fecha o quê e onde; registro sem etiqueta ou escondido em forro | 1,2,4,6 | ◻ — |
| H4 | Medição, sensores e telemetria | Hidrômetro, nível, pressão, cloro, condutividade: o que avisa antes do ocupante | 2,3,4,T | ◻ — |
| H5 | Energia de emergência | Gerador ou no-break para recalque, bombas de incêndio, bombas de drenagem | 2,4,5,6 | ◻ — |
| H6 | Supervisório / BMS / automação | Quem vê o alarme e quem responde; alarme sem destinatário | 5,8,T | ◻ — |
| H7 | Documentação técnica | As-built, memoriais, laudos, ART, PMOC, certificado de limpeza de reservatório | 1,3,T | ✔ Lei 13.589/2018 (PMOC) · ✔ NBR 5674 (gestão de manutenção; ◻ edição vigente: há 2012 e 2024 em fontes) |
| H8 | Responsáveis técnicos e contratos | Quem opera, quem mantém, quem atende na emergência | T | ◻ — |
| H9 | Comunicação de crise | Quem avisa ocupantes, locatários, proprietário, vigilância sanitária, concessionária | T | ◻ — |
| H10 | Segurança de acesso | Espaço confinado (reservatórios), trabalho em altura (cobertura), produto químico | 9,T | ✔ NR-33 · ✔ NR-35 |
| H11 | Válvulas de transferência e interligações previstas entre sistemas | Registro que liga um sistema a outro "para emergência" (RTI ↔ consumo, célula ↔ célula, prédio ↔ prédio, potável ↔ reúso). Previsto, mas sem lacre, sem registro de abertura e sem mapa | 1,2,6 | ◻ — |
| H12 | By-pass improvisado e "jumper" | Tubo, flexível ou mangueira instalado em intervenção e **que ficou** (a gambiarra que virou definitiva). Ninguém desenhou, ninguém lembra | 1,2 | ◻ — |
| H13 | Mangueiras e flexíveis deixados em ponto fixo (engate rápido) | Mangueira de torneira conectada a circuito, tanque ou bomba depois do uso. **Foi o mecanismo do episódio 2** | 1 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| H14 | Conexão de reposição manual (engate, registro, funil) | Ponto de ligação criado para repor o circuito quando o automático falha; sem regra de desconexão nem registro de quem repôs | 1,2 | ✔ NBR 5626:2020 (proteção contra refluxo; cláusula a ler) |
| H15 | Trechos desativados, ramais cegos e tubulações órfãs | Ramais de lojas e andares desocupados, "rabos" de reforma, prumadas sem uso. **Estagnam** e podem ainda estar ligados | 1,3 | ✔ NBR 5626:2020 (geral) |
| H16 | Reformas e obras de locatários sem atualização do as-built | O prédio muda e o desenho não; novo ponto e novo equipamento entram sem avaliação de refluxo | 1,3,T | ◻ — |
| H17 | Teste periódico e cadastro dos dispositivos antirretorno | Lista de BPV, retenções e quebra-vácuos com localização, data do último teste e responsável | 1,7 | ✔ NBR 5626:2020 (Anexo A trata de ensaios de proteção contra refluxo, segundo resumo secundário: ◻ conferir) |
| H18 | Pontos sentinela e traçador (corante) | Torneira sentinela por prumada e uso de corante já existente na água gelada para denunciar mistura | 1,3,T | ◻ — |
| H19 | Balanço hídrico e indicador de consumo e reposição | Litros por dia da reposição de circuitos, consumo noturno do prédio; aumento indica vazamento antes da improvisação | 1,2,4 | ◻ — |
| H20 | Treinamento da equipe, simulados e registro de intervenções | Equipe de ronda sabe o procedimento? Passagem de turno registra reposição, by-pass e válvula manobrada? | 1,T | ◻ — |
| H21 | Contratos de emergência | Caminhão-pipa, laboratório acreditado, hidrojato, limpadora de reservatório, serviço de bombeamento, fornecedor do tratamento químico | 2,3,9,T | ◻ — |
| H22 | Relatório mensal e checklist dos fornecedores (via administradora) | Relatório que já existe + checklist padrão do projeto; cadência semanal pedida nos itens críticos | 3,8,T | ◻ — |

---

## Famílias de sistema para manutenção

O plano de manutenção e monitoramento é por **família**, não por ID: um procedimento por sistema (195 itens) seria impossível de manter. Cada ID aparece em **exatamente uma** família (a principal). A planilha-mestre liga família × cenário na aba de manutenção.

A coluna "Cadência de referência" lista só o que é **pedido** no projeto (semanal nos itens críticos) ou o que a fonte conferida diz. As demais periodicidades dependem do responsável técnico, do contrato e da regra local, e **não** foram inventadas aqui.

| Nº | Família | IDs | O que se mantém (tipo de manutenção) | Cadência de referência |
|---|---|---|---|---|
| 1 | Reservatórios e armazenamento de potável | A4, A6, A17, A18, A22, A23 | Limpeza e desinfecção, inspeção de tampa, vedação, ladrão, respiro, tela, boias e sensores; ensaio de estanqueidade | Nível: semanal (pedido). Limpeza: periodicidade a definir (ver RDC 216 para restaurantes, ◻) |
| 2 | Bombas e pressurização | A5, A8, A19, A20, A21 | Revezamento de bombas, vedação, rolamento, quadro, inversor, vaso hidropneumático, VRP, válvulas de alívio | Teste de revezamento: a definir |
| 3 | Rede e pontos de consumo | A1, A7, A9, A10, A15, A16, A32, A33, A34, A35, A40, A41, A42, A43, G10, G11 | Descarga de pontos pouco usados, manutenção de torneiras e válvulas, hidrômetros, registros, pontos de mangueira, ramais de locatário | Torneira sentinela: ronda (pedido) |
| 4 | Tratamento de potável e qualidade | A2, A3, A11, A14, A36, A37, A38, A39 | Dosagem, residual, troca de filtro e lâmpada UV, análise laboratorial, controle de poço e carro-pipa | **Cloro residual: semanal (pedido)** |
| 5 | Água quente | A12, A24, A25, A26, A27, A28, A29, A30, A31, G12 | Temperatura de acumulação e de retorno, recirculação, válvulas misturadoras, T&P, trocadores, limpeza de acumulador | Temperaturas: a definir (ASHRAE Guideline 12, ◻) |
| 6 | Reposição, refluxo e interligações | A13, C3, C14, C15, C16, C17, C18, C19, C20, H11, H12, H13, H14, H15, H17 | **Ensaio de BPV e retenção; inspeção de folga de ar; busca de mangueira, jumper e by-pass; indicador de reposição** | **Reposição de água do circuito: semanal (pedido)** |
| 7 | Reúso e fontes alternativas | B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14, B15, B16 | Controle de qualidade do reúso, limpeza de cisterna, first flush, filtros, identificação, ensaio de estanqueidade da separação potável × reúso | A definir pela NBR 16783 (◻) |
| 8 | Circuitos de climatização | C1, C4, C5, C6, C7, C9, C11, C12, C13, C21, C22, C23, C24, C25, C33, C36, C37 | Pressão, vazamento, bombas, trocadores, glicol, vaso de expansão, drenos e bandejas, PMOC | PMOC (Lei 13.589); reposição: ver família 6 |
| 9 | Torre de resfriamento e tratamento químico | C2, C8, C10, C26, C27, C28, C29, C30, C31, C32, C34, C35, C38 | Limpeza e desinfecção de bacia, enchimento, biocida, condutividade, purga, controlador, sondas, produto químico e contenção | **Dosagem química: semanal (pedido)** |
| 10 | Incêndio | D1 a D21 | Teste de bombas (principal, jockey, diesel), válvulas supervisionadas abertas, mangueiras, hidrantes, RTI, rede seca, teste do ponto de teste | **Teste de bomba de incêndio: semanal (pedido)** |
| 11 | Esgoto e drenagem | E1 a E24 | Limpeza de caixas, gordura, poços, bombas de recalque e de drenagem, ralos e selos, válvulas de retenção, reservatório de detenção | Alarme de nível das bombas: a definir |
| 12 | ETA, ETE e efluentes | F1 a F8 | Operação e registro de ETA/ETE, sopradores, membranas, lodo, terciário, fossa, lavagem | Licença e laudos: a definir (CONAMA 430, ◻ regra estadual) |
| 13 | Piscinas, fontes e spas | G1, G2, G19 | Cloro e pH, filtros, reposição, limpeza de fontes, saunas e duchas | Parâmetros da NBR 10339 (◻ cláusula) |
| 14 | Cozinhas, lavanderia, gelo e processos de locatário | G4, G5, G7, G8, G16, G17, G18, G20, G23 | Filtros, caixas de gordura (família 11), dispositivo antirretorno dos equipamentos, limpeza de reservatório do restaurante | A definir; checar o locatário |
| 15 | Lava-olhos e chuveiros de emergência | G6, G21 | Acionamento e descarga, teste de vazão e temperatura, sinalização | Acionamento semanal (ANSI/ISEA Z358.1; ◻ adoção no Brasil) |
| 16 | Outros e gestão | G3, G9, G13, G14, G15, G22, H1 a H10, H16, H18, H19, H20, H21, H22 | Irrigação, nebulização, telhado verde, lavagem, eventos; mapa, registros, telemetria, energia, documentação, contratos, comunicação, treinamento | Relatório mensal + cadência semanal dos itens críticos |

---

## Mapa de interconexões críticas

Pares de sistemas que **nunca deveriam se tocar** e onde costumam se tocar por erro ou improviso. Para cada par: o dispositivo que protege e **o que o dispositivo não garante**. Os dispositivos listados são a referência geral de engenharia (✔ EN 1717 existência; ✔ NBR 5626:2020 trata de proteção contra refluxo): a escolha, o dimensionamento e o teste são do responsável técnico, e a cláusula da NBR 5626:2020 deve ser lida antes de usar isto como exigência.

**Regras de leitura do que cada dispositivo faz:**

- **Separação atmosférica (folga de ar):** barreira mais confiável. Protege contra retrossifonagem **e** contrapressão porque não há tubo contínuo. Não protege se alguém *cria* a ligação (mangueira, tubo mergulhado, boia submersa).
- **Disconector / BPV (zona de pressão reduzida):** protege contra retrossifonagem e contrapressão em risco alto. Exige **teste periódico** e dreno livre; falha em silêncio.
- **Retenção dupla:** reduz o risco, não é para risco alto de saúde.
- **Válvula de retenção simples:** pode vazar com a sujeira e **não** é proteção de risco alto.
- **Quebra-vácuo atmosférico:** só protege contra retrossifonagem, não contra contrapressão, e não pode ter válvula fechada a jusante.

| # | Par que não pode se tocar | Onde costuma se tocar (erro ou improviso) | Dispositivo que protege | O que o dispositivo NÃO garante | Itens | Cenários |
|---|---|---|---|---|---|---|
| 1 | **Reposição do chiller/água gelada × potável** (episódio 2) | Mangueira ligada direto na entrada do circuito e mantida conectada; by-pass da reposição automática; ponto de torneira na sala de máquinas | Separação atmosférica (tanque de ruptura ou funil com folga de ar) e, se for ligação permanente, disconector/BPV | Air gap só vale se a folga é mantida: tubo mergulhado, boia submersa ou mangueira por baixo anulam. BPV exige teste e dreno; **não evita** que alguém instale a mangueira por fora do dispositivo. Nenhum dispositivo substitui a regra de desconexão e o registro de quem repôs | C3, C14–C19, A35, H13, H14 | 1,2 |
| 2 | **Torre de resfriamento/bacia × potável** | Boia da bacia com tubo mergulhado; reposição manual por mangueira; ladrão da bacia ligado ao esgoto | Folga de ar na entrada da bacia (boia acima do nível máximo) | A folga some com submersão; não protege se a torre for alimentada por by-pass; a bacia contaminada (Legionella) não contamina o potável por refluxo se há folga, mas contamina o ar por aerossol | C2, C15, C31, C32 | 1,3,8 |
| 3 | **Reúso/chuva × potável** (episódio 1) | Prumada de reúso ligada ao potável por erro de obra; complementação da cisterna de reúso com potável sem folga; torneira de reúso confundida com potável | Complementação com **separação atmosférica**; identificação e cor; ponto de reúso com placa e acesso diferenciado | Folga de ar não corrige uma ligação **cruzada de obra** (tubo a tubo): só o ensaio com traçador e a conferência de projeto acham. Identificação não impede conexão | B1, B7, B8, B10, B6, H2 | 1,3 |
| 4 | **Incêndio (RTI ou rede) × potável** | Enchimento da RTI por boia, by-pass ou mangueira; válvula de transferência (D20); rede de incêndio alimentada pela rede para "completar" | Folga de ar no enchimento da RTI; disconector/BPV em qualquer ligação permanente | A RTI e a rede de incêndio ficam com água parada: **não** devem alimentar o consumo, e BPV não resolve a estagnação. Registro de transferência aberto pode esvaziar a reserva | D1, D9, D15, D20, H11 | 1,2,6 |
| 5 | **Trocador de calor de parede única × potável** | Aquecimento de água sanitária com trocador ligado a caldeira, vapor, recuperação de calor do chiller ou circuito com químicos | Trocador de **parede dupla** com espaço intermediário visível, ou circuito intermediário; pressão do lado potável **maior** que a do lado químico | Diferença de pressão inverte com a bomba parada ou com a pressão da rede caindo. Parede dupla só **denuncia** o furo, não o impede. Furo pequeno em parede única é invisível | A12, A28, C5, C22, C23 | 1,3 |
| 6 | **Caixa d'água/reservatório × tubulação de outro sistema** | Tubo de esgoto, pluvial, ar-condicionado ou químico passando por cima ou dentro do reservatório; laje com infiltração | Afastamento, tampa estanque, desvio da tubulação (a NBR 5626 trata de proteção do reservatório: ◻ cláusula) | Tampa e vedação não detectam um vazamento lento sobre a laje. Só inspeção e traçador acham | A4, A6, A17, A18, E5 | 1,9 |
| 7 | **Ladrão/extravasor × esgoto ou pluvial** | Ladrão ligado direto à coluna de esgoto; ladrão sem tela; pluvial com refluxo ao ladrão | Ladrão com **descarga livre e visível**, folga de ar e tela; ou desconexão por ralo sifonado | Tela entupida bloqueia o ladrão e a caixa transborda; ralo sem selo devolve gás; refluxo da rede pública pode vir pelo ladrão se não há desconexão | A23, E10, E15 | 7,9 |
| 8 | **Esgoto/gás × potável por selo seco ou dreno** | Dreno de ar-condicionado ligado direto à coluna; ralo e sifão secos; bacia sem uso | Sifão com selo hídrico; desconexão por ralo sifonado; AAV | Selo seca em ralo sem uso: **gás volta**. AAV travada não protege | C6, E9, E10, E23 | 7 |
| 9 | **Mangueira de lavagem/jardim/DML × potável** | Torneira de jardim, DML e lava-rápido com mangueira em balde, tanque, produto ou ligada a equipamento | **Quebra-vácuo na rosca da torneira**; folga de ar; ponto sem rosca | Quebra-vácuo atmosférico **não protege contra contrapressão** (bomba de lavadora) e não pode ter válvula depois. Mangueira deixada conectada anula a proteção | A35, G10, G11, G15, H13 | 1,3 |
| 10 | **Equipamento do locatário × rede comum** | Máquina de gelo, lava-louças, osmose, pressurizador, clínica; locatário liga e muda sem avisar | Dispositivo antirretorno **no ramal do locatário** (BPV ou retenção dupla conforme o risco) e folga de ar interna no equipamento | Não vê a troca de equipamento depois da instalação; depende de vistoria do locatário e do contrato | A41, G4, G16, G20, G23, H16 | 1,3 |
| 11 | **Dosagem química × potável** | Linha de diluição ou de lavagem de bomba dosadora ligada à rede; injeção direta em linha; tanque de produto com ladrão | Folga de ar na água de diluição; válvula de injeção com retenção; contenção do produto | Retenção de injeção cristaliza e vaza; contenção ligada ao ralo vaza ao esgoto; produto incompatível se mistura | C8, C34, C35, A37 | 1,8 |
| 12 | **Piscina/fonte/spa × potável** | Reposição por mangueira ou boia ligada direto; retrolavagem com descarga | Folga de ar (tanque de compensação com boia acima do nível); BPV | A água da piscina tem cloro e sedimento e **não** deve voltar; folga some com tubo submerso | G1, G2, G19 | 1,3 |
| 13 | **Caminhão-pipa/terceiros × reservatório** | Mangueira do caminhão dentro da boca de visita; abastecimento sem ponto fixo | Ponto de recebimento fixo, **acima do nível** (folga de ar), com registro e amostra | Não resolve a qualidade da água do caminhão: exige certificado, cloro e amostra na chegada | A3, B12, H21 | 2,3,9 |
| 14 | **Poço ou fonte própria × rede da concessionária ou do prédio** | Poço ligado em paralelo à rede "para emergência"; poço usado em torre | Separação atmosférica com reservatório intermediário; análise e tratamento próprios | Reservatório intermediário não resolve qualidade ruim do poço | A2, B13 | 1,3 |
| 15 | **Gerador/radiador e compressor × potável** | Reposição do radiador por mangueira; resfriamento de compressor por circuito aberto ligado à rede | Folga de ar na reposição; circuito fechado com tanque próprio | Glicol e óleo no circuito voltam se a bomba do equipamento gera pressão e há retenção simples | C13, G18 | 1,5 |
| 16 | **Pluvial × esgoto (ligação cruzada)** | Ralo de pátio ligado ao esgoto; esgoto ligado ao pluvial; detenção ligada ao esgoto | Redes separadas; válvula de retenção no lançamento; bomba de esvaziamento | Retenção entra com sujeira; rede pública em carga **devolve** pela retenção que falha | E5, E7, E14, E15 | 4,7 |
| 17 | **Bacia de contenção de produto × pluvial ou esgoto** | Dreno da bacia de diesel, hipoclorito ou ácido aberto ou ligado à rede | Dreno da bacia **normalmente fechado**, drenagem manual com inspeção | Chuva enche a bacia e a equipe abre o dreno sem olhar; produto vai à rede | C34, E16 | 1,4 |
| 18 | **Circuito químico com ponto de reposição por equipe externa (serviços)** | Prestador de limpeza química liga mangueira à torre ou ao circuito e deixa | Procedimento de desconexão com assinatura; folga de ar | Procedimento não impede a conexão: só o registro e a conferência após o serviço | C38, H13, H21 | 1,8 |

---

## Resumo: itens por grupo

| Grupo | v1 | Novos | v2 |
|---|---|---|---|
| A. Água potável (inclui água quente e pontos de uso) | 14 | 29 | 43 |
| B. Não potável / fontes alternativas | 6 | 10 | 16 |
| C. Climatização e térmica | 13 | 25 | 38 |
| D. Incêndio | 8 | 13 | 21 |
| E. Esgoto e drenagem | 10 | 14 | 24 |
| F. Tratamento próprio | 3 | 5 | 8 |
| G. Usos especiais | 12 | 11 | 23 |
| H. Pontos transversais (inclui interligações) | 10 | 12 | 22 |
| **Total** | **76** | **119** | **195** |

---

## Referências conferidas (✔) nesta pesquisa

A conferência foi feita por pesquisa web em 2026-10-02: **existência, número, título e escopo geral**, em fontes públicas (muitas vezes páginas de terceiros, porque o acesso direto a vários sites oficiais ficou bloqueado). **Nenhum texto de norma ABNT foi lido**; as cláusulas (inclusive as de proteção contra refluxo da NBR 5626:2020) ainda precisam de leitura por responsável técnico.

### Normas ABNT

| Referência | Escopo conferido | Observação | Link |
|---|---|---|---|
| ABNT NBR 5626:2020 | Sistemas prediais de água fria e água quente; cancela a NBR 5626:1998 | Conferida no v1; esta pesquisa viu resumos que citam proteção contra refluxo e separação atmosférica | [cópia de terceiros](https://normadedesempenho.com.br/wp-content/uploads/2022/10/NBR-5626-2020.pdf) |
| ABNT NBR 16783:2019 | Uso de fontes alternativas de água não potável em edificações | Resumo cita chuva, água cinza, rebaixamento, esgoto; usos incluem descarga, lavagem, irrigação, resfriamento | [APM](https://www.apaulista.org.br/reuso-de-agua-agora-tem-norma-brasileira/) |
| ABNT NBR 15527:2019 | Aproveitamento de água de chuva de coberturas para fins não potáveis | Revisa a edição de 2007 (fonte secundária) | [Apuerj](https://projetosapuerj.com/2019/10/01/nbr-155272019/) |
| ABNT NBR 13714 | Sistemas de hidrantes e de mangotinhos para combate a incêndio | Edição de 01/2000 consta em vigor, com confirmações até 04/2024; uma fonte cita atualização em 2022 sem prova: **confirmar edição** | [Target](https://www.target.com.br/produtos/normas-tecnicas/36887/nbr13714-sistemas-de-hidrantes-e-de-mangotinhos-para-combate-a-incendio) |
| ABNT NBR 10897:2020 | Sistemas de proteção contra incêndio por chuveiros automáticos, requisitos | Cancela a edição de 2014 | [Target](https://www.normas.com.br/visualizar/abnt-nbr-nm/6075/abnt-nbr10897-sistemas-de-protecao-contra-incendio-por-chuveiros-automaticos-requisitos) |
| ABNT NBR 8160 | Sistemas prediais de esgoto sanitário, projeto e execução | **Dúvida de edição**: 1999 (confirmada em 2022) e fontes que citam "2020". Confirmar | [Target](https://www.target.com.br/produtos/normas-tecnicas/27469/nbr8160-sistemas-prediais-de-esgoto-sanitario-projeto-e-execucao) |
| ABNT NBR 10844 | Instalações prediais de águas pluviais | Edição de 1989 em fontes secundárias; confirmar se há revisão | [Busca Normas](https://buscanormas.com.br/guias/nbr-10844) |
| ABNT NBR 16401 (partes 1 a 3) | Instalações de ar-condicionado, sistemas centrais e unitários (projeto, conforto térmico, qualidade do ar interior) | Fonte setorial cita nova versão em vigor a partir de 19/11/2024 | [Abrava](https://abrava.com.br/norma-que-regulamenta-instalacoes-de-ar-condicionado-em-sistemas-centrais-e-unitarios-nbr-16401-foi-atualizada/) |
| ABNT NBR 17037:2023 | Padrões de qualidade do ar interior em ambientes climatizados não residenciais | Fonte secundária; citada como referência no lugar da RE 9/2003 | [Revista do Frio](https://revistadofrio.com.br/abnt-nbr-17037-e-estrategias-no-controle-da-qualidade-do-ar-interior/) |
| ABNT NBR 10339:2018 | Piscina, projeto, execução e manutenção | Cancela a edição de 1988 | [CBIC](https://cbic.org.br/publicada-revisao-da-norma-abnt-nbr-10339-piscina-projeto-execucao-e-manutencao/) |
| ABNT NBR 15569:2020 | Aquecimento solar de água em circuito direto, requisitos de projeto e instalação | Emenda 1:2021 | [Abrava](https://abrava.com.br/abnt-cb-055-informa-a-publicacao-a-emenda-da-norma-abnt-nbr-155692020-emenda-12021-sistema-de-aquecimento-solar-de-agua-em-circuito-direto-requisitos-de-projeto-e-instalacao/) |
| ABNT NBR 17076:2024 | Projeto de sistema de tratamento de esgoto de menor porte (até 12.000 L/dia, sem rede coletora) | Unifica e substitui NBR 7229 e NBR 13969 | [Stebio](https://www.stebio.com.br/post/nova-abnt-nbr-17076-2024) |
| ABNT NBR 12209:2011 | Projeto de estações de tratamento de esgoto sanitário | Para ETE de projeto; aplicabilidade a porte pequeno a confirmar | [Studocu](https://www.studocu.com/pt-br/document/universidade-federal-do-amazonas/sistemas-prediais-de-aguas/nbr-12209-2011-nbr/112638988) |
| ABNT NBR 17505 | Armazenamento de líquidos inflamáveis e combustíveis (7 partes; exige bacia de contenção) | Parte aplicável a conferir | [Sinproquim](https://sinproquim.org.br/abnt-publica-norma-com-requisitos-sobre-o-armazenamento-de-liquidos-inflamaveis-e-combustiveis/) |
| ABNT NBR 12244:2006 | Construção de poço tubular para captação de água subterrânea | Fonte secundária | [Solis](https://solisconsultoria.com.br/downloads/NBR%2012244.pdf) |
| ABNT NBR 15495 (partes 1 e 2) | Poços de monitoramento de água subterrânea em aquíferos granulares | Edições 2007 e 2008; fonte secundária | [Avpima](https://avpima.eb.mil.br/MA/123654789/AGUA_SUB/extrao_de_gua_subterrnea.html) |
| ABNT NBR 5674 | Manutenção de edificações, requisitos para o sistema de gestão de manutenção | Há edição de 2012 e uma de 2024 em fontes: confirmar a vigente | [Target](https://www.target.com.br/produtos/normas-tecnicas/27550/nbr5674-manutencao-de-edificacoes-requisitos-para-o-sistema-de-gestao-de-manutencao) |

### Leis, portarias, resoluções e normas regulamentadoras

| Referência | Escopo conferido | Observação | Link |
|---|---|---|---|
| Portaria GM/MS nº 888, de 4/5/2021 | Altera o Anexo XX da Portaria de Consolidação nº 5/2017; controle e vigilância da qualidade da água para consumo humano e padrão de potabilidade | Aplica-se a sistemas de abastecimento, soluções alternativas (coletivas e individuais) e carro-pipa. Cloro residual livre mínimo de 0,2 mg/L e cloro mínimo de 0,5 mg/L no carro-pipa vêm de fonte secundária: conferir artigos | [BVS](https://bvsms.saude.gov.br/bvs/saudelegis/gm/2021/prt0888_07_05_2021.html) · [DOU](https://www.in.gov.br/en/web/dou/-/portaria-gm/ms-n-888-%20de-4-de-maio-de-2021-318461562) |
| Lei nº 13.589, de 4/1/2018 | Manutenção de instalações e equipamentos de sistemas de climatização; exige PMOC em edifícios de uso público e coletivo | O texto manda seguir a Resolução Anvisa RE 9/2003, **que fontes secundárias dão como revogada em 2024** | [Câmara](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13589-4-janeiro-2018-786057-publicacaooriginal-154702-pl.html) |
| Portaria GM/MS nº 3.523, de 28/8/1998 | Regulamento técnico de medidas básicas para manutenção e limpeza de sistemas de climatização; exige PMOC para sistemas acima de 5 TR | Fontes secundárias a dão como vigente: confirmar | [BVS](https://bvsms.saude.gov.br/bvs/saudelegis/gm/1998/prt3523_28_08_1998.html) |
| Resolução CONAMA nº 430, de 13/5/2011 | Condições e padrões de lançamento de efluentes | Complementa a Resolução CONAMA 357/2005 | [IBAMA](https://www.ibama.gov.br/sophia/cnia/legislacao/CONAMA/RE0430-130511.PDF) |
| Resolução CNRH nº 54, de 28/11/2005 | Modalidades, diretrizes e critérios gerais para reúso direto não potável | A Res. CNRH 121/2010 trata do reúso agrícola e florestal | [Normas Brasil](https://www.normasbrasil.com.br/norma/?id=102111) |
| RDC Anvisa nº 216, de 15/9/2004 | Boas práticas para serviços de alimentação | Reservatório de água limpo, no máximo, a cada 6 meses, segundo fonte secundária | [LegisWeb](https://www.legisweb.com.br/legislacao/?id=100899) |
| NR-13 | Caldeiras, vasos de pressão, tubulações e tanques metálicos | Enquadramento de cada vaso a conferir | [MTE](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-13-atualizada-2023-b.pdf) |
| NR-33 | Espaços confinados | Última alteração citada: Portaria SEPRT 1.690/2022 | [MTE](https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-33-nr-33) |
| NR-35 | Trabalho em altura | O texto vigente tem atualizações recentes citadas em fontes secundárias | [Seconci-SP](https://www.seconci-sp.org.br/trabalho-em-altura-conheca-a-nova-nr-35.html) |
| IT 22/2025 do Corpo de Bombeiros de São Paulo | Sistemas de hidrantes e de mangotinhos; em vigor desde 20/3/2025; revogou a IT 22/2019 | **Só vale para SP.** Cada estado tem a sua | [Guia SegCI](https://guiasegci.com.br/legislacoes/it-22-2025-hidrantes-e-mangotinhos/) |

### Referências estrangeiras (não são norma brasileira)

| Referência | Escopo conferido | Link |
|---|---|---|
| ANSI/ASHRAE 188 (edição 2021) | Gestão de risco de legionelose em sistemas de água de edificações | [ANSI](https://webstore.ansi.org/standards/ashrae/ansiashraestandard1882021) |
| ASHRAE Guideline 12-2023 | Gestão do risco de legionelose em sistemas de água de edificações; apoia a 188 | [ANSI](https://webstore.ansi.org/standards/ashrae/ashraeguideline122023) |
| ANSI/ISEA Z358.1 | Equipamento de emergência para lavagem de olhos e corpo: acionamento semanal; fluido tépido (16 a 38 °C) | [ISEA](https://safetyequipment.org/emergency-eyewash-shower-equipment/) |
| EN 1717 | Proteção da água potável contra poluição por refluxo; categorias de fluido 1 a 5; separação atmosférica | [DIN Media](https://www.dinmedia.de/en/standard/din-en-1717/403140395) |

---

## Referências ◻ a confirmar

Antes de entrar em procedimento, o responsável técnico confere versão vigente e exigência local de cada uma.

- **Exigência de refluxo e da folga de ar na NBR 5626:2020**: ler o texto (cláusulas e Anexo A) antes de citar números. Vale para todos os itens que dizem "cláusula a ler".
- **Instrução Técnica do Corpo de Bombeiros do estado de cada condomínio** (volume da RTI, bombas, teste, hidrantes): IT 22/2025 foi conferida só para SP.
- **Legionella em torres e sistemas de água quente no Brasil**: a Portaria 3.523/1998 e a Lei 13.589/2018 tratam de climatização e PMOC. Se há norma brasileira específica de Legionella para água quente sanitária, ela **não foi encontrada**; ASHRAE 188 e Guideline 12 são referência estrangeira.
- **Status da RE 9/2003 e relação da NBR 17037:2023 com a Lei 13.589**: fontes secundárias falam em revogação por ato da Anvisa em julho de 2024 (RDC 886/2024); confirmar o ato.
- **Cloro residual da Portaria 888** (0,2 mg/L livre; 0,5 mg/L no carro-pipa) e **aplicabilidade da Portaria a prédio abastecido pela concessionária** (A14).
- **NBR 13714** (qual edição vale), **NBR 8160** (1999 ou 2020), **NBR 10844** (se há revisão), **NBR 5674** (2012 ou 2024), **NBR 16401** (edição de 2024).
- **NBR 17505** (parte que se aplica a tanque de gerador e abastecimento interno) e regras de bacia de contenção; normas de **postos de abastecimento**, caso o condomínio tenha bomba interna.
- **NR-13**: se cada vaso de pressão (hidropneumático, vaso de expansão, caldeira) está enquadrado.
- **Regulamento de heliponto/heliporto da ANAC** (número e exigências de drenagem): E17.
- **Regulamento sanitário de serviços de saúde** aplicável às clínicas de G23.
- **Outorga de poço (A2, B13)**: Lei federal 9.433/1997 e regra estadual.
- **Regra municipal**: caixa de gordura, reservatório de detenção/retardo, ligação pluvial, lançamento de purga e efluente.
- **ANSI/ISEA Z358.1**: é norma americana; confirmar se o prédio ou o contrato a adota (no Brasil, NBR de lava-olhos a verificar).
- **Hidrômetro**: regulamentação do Inmetro para medidores (A16).
- **Itens ◻ sem referência (—)**: são o que não tem norma identificada ou o que depende de projeto específico. Isso **não** significa que não exista exigência.
