# Catálogo de sistemas de água em edifícios comerciais e logísticos

**Problema:** P-001 · **Versão:** 1 (2026-10-02) · **Status:** levantamento para o usuário marcar o que existe no prédio

Este é o passo 1 do que foi pedido: a lista completa do que pode existir de água em um prédio. Ainda **não** é o plano de contingência. Cada item tem um ID (A1, C2…) para você responder só com a sigla.

**Como usar:** para cada ID, responder **S** (existe no prédio), **N** (não existe) ou **?** (não sei — vira item de vistoria). Itens com **?** são tão importantes quanto os **S**: os dois episódios que você relatou vieram de algo que ninguém sabia que estava lá.

**Aviso sobre as referências normativas:** as marcadas ✔ tiveram **existência, número e escopo geral** conferidos na pesquisa desta sessão (as cláusulas específicas, como exigências de refluxo, ainda precisam de leitura do texto da norma); as marcadas ◻ vêm de conhecimento geral e **precisam ter a versão vigente conferida** (e a exigência local — município, Corpo de Bombeiros do estado, vigilância sanitária) por um responsável técnico antes de entrar em procedimento.

---

## 0. Antes do catálogo: o episódio em curso

Isto é orientação geral, não laudo. A decisão é do responsável técnico do prédio.

1. **Suspender o uso da água para consumo** nos andares afetados (beber, cozinhar, escovar dente, café) até haver análise. Comunicar os ocupantes por escrito.
2. **Isolar a origem provável:** fechar e, se possível, desconectar fisicamente a linha de reposição de água do circuito do chiller/torre à rede potável. Registrar o horário e quem fechou.
3. **Descobrir o que tem na água do chiller:** pedir ao fornecedor do tratamento químico a **FISPQ/ficha de segurança** de cada produto dosado (inibidor de corrosão, biocida, glicol, etc.) e o histórico de dosagem. Isso define o que procurar na análise e o risco à saúde.
4. **Coletar amostras antes de qualquer descarga** — torneira afetada, caixa d'água, reservatório inferior, reposição do chiller — com cadeia de custódia e laboratório que analise os compostos do item acima. Descargar/limpar antes de coletar apaga a prova.
5. **Só liberar o consumo depois de:** causa identificada e eliminada, limpeza e desinfecção do trecho contaminado, e nova análise conforme. Sem isso, a água volta a ser contaminada.
6. **Registrar tudo** (linha do tempo, fotos, quem foi avisado). Isso protege o prédio e alimenta o plano.
7. **Verificar o episódio 1 junto:** se o reúso já esteve misturado ao potável por erro de obra, a pergunta é **onde mais há interligação não prevista**. Ver grupo H.

---

## Mapa de como a contaminação cruzada acontece

Os dois episódios têm a mesma família de causa. Os mecanismos físicos, para orientar a leitura do catálogo:

| Mecanismo | O que acontece | Onde costuma acontecer neste catálogo |
|---|---|---|
| **Interligação direta (cross-connection)** | Um tubo liga fisicamente dois sistemas que deveriam estar separados | Reúso × potável (B1); reposição do chiller/torre × potável (C3); incêndio × potável (D) |
| **Contrapressão (backpressure)** | O sistema não potável tem pressão maior (bomba do chiller, caldeira) que a rede potável e empurra água para ela | C1, C3, C5, A12 |
| **Retrossifonagem (backsiphonage)** | A rede potável perde pressão (falta de água, manobra, rompimento) e **puxa** água do outro sistema | C3, G (mangueiras), D |
| **Entrada por reservatório** | Água ou sujeira cai/entra na caixa d'água por tampa mal vedada, extravasor, laje, tubulação passando por cima | A4, A6, E5 |
| **Trocador de calor com parede única** | A parede do trocador fura e mistura potável com circuito químico | A12, C5, C1 |
| **Estagnação e retorno de gases** | Trecho parado cria biofilme/Legionella; sifão seco devolve gás do esgoto | A9, A12, E9, G2, G6 |

**Defesa por camada (referência de engenharia):** separação atmosférica (*air gap*) é a barreira mais confiável; dispositivos mecânicos (disconector/BPV, quebra-vácuo) vêm depois; válvula de retenção simples **não** é proteção suficiente contra refluxo de risco alto.

---

## A. Água potável (captação, armazenamento, distribuição, uso)

| ID | Sistema | O que é / onde está | Como falha ou contamina | Ref. |
|---|---|---|---|---|
| A1 | Ligação da concessionária | Ramal, cavalete, hidrômetro geral, registros e válvulas na entrada | Rompimento, falta de água (gera retrossifonagem), hidrômetro parado | ✔ NBR 5626:2020 |
| A2 | Poço artesiano / fonte própria | Captação subterrânea, bomba submersa, tratamento, outorga | Contaminação do aquífero, falta de outorga/análise, mistura com a rede sem proteção | ✔ Portaria GM/MS 888/2021 |
| A3 | Abastecimento emergencial (caminhão-pipa) | Ponto de recebimento de água de terceiros no reservatório | Água de origem desconhecida, mangueira suja, falta de cloração | ✔ Portaria 888/2021 |
| A4 | Reservatório inferior (cisterna) | Tanque enterrado ou no térreo/subsolo | Entrada de água de infiltração, tampa sem vedação, ladrão sem proteção, sujeira acumulada | ✔ NBR 5626:2020 |
| A5 | Recalque | Bombas que sobem a água da cisterna ao reservatório superior, boias, quadros | Pane, bomba de reserva ausente, retorno de água, falta de energia | ✔ NBR 5626:2020 |
| A6 | Reservatório superior (caixa d'água) | Tanques na cobertura (podem ser vários, em células) | Entrada de sujeira/água pela tampa, laje, tubulação passando por cima; ladrão sem tela; estagnação | ✔ NBR 5626:2020 |
| A7 | Barrilete e colunas | Tubulação que sai do reservatório e distribui às prumadas | Registros sem identificação, interligações improvisadas, corrosão | ✔ NBR 5626:2020 |
| A8 | Pressurização / redução de pressão | Bombas *booster*, pressurizadores, válvulas redutoras de pressão (VRP) | Pressão alta (rompimento), oscilação, falha da VRP, bomba com retorno | ✔ NBR 5626:2020 |
| A9 | Rede interna de distribuição | Prumadas, ramais, sub-ramais, registros de andar, hidrômetros de sub-medição | Vazamento, trecho morto com água parada, registro não encontrado na emergência | ✔ NBR 5626:2020 |
| A10 | Pontos de consumo | Torneiras, copas, bebedouros, lavatórios, chuveiros, vasos, mictórios | Ponto raramente usado estagna; bebedouro mal higienizado; torneira com conexão cruzada | ✔ NBR 5626:2020 |
| A11 | Tratamento pontual de potável | Cloração, filtros, UV, abrandador (*softener*), osmose reversa | Dosagem errada, filtro saturado, resina contaminada | ✔ Portaria 888/2021 |
| A12 | Água quente sanitária | Aquecedor (gás, elétrico, solar, bomba de calor), acumulação, recirculação, trocadores | Água entre 25–45 °C favorece **Legionella**; trocador de parede única contamina; recirculação parada | ✔ NBR 5626:2020 · ◻ ASHRAE 188 |
| A13 | Dispositivos de proteção contra refluxo | Válvulas de retenção, quebra-vácuo, disconector/BPV, separação atmosférica | Ausência, instalação errada, sem teste periódico, dispositivo "curto-circuitado" | ✔ NBR 5626:2020 |
| A14 | Controle da qualidade da água | Cloro residual, análises laboratoriais, plano de amostragem | Sem ponto de amostragem definido, laudo vencido, não-conformidade sem ação | ✔ Portaria 888/2021 (cloro residual mínimo, monitoramento por ponto) |

---

## B. Água não potável / fontes alternativas

| ID | Sistema | O que é / onde está | Como falha ou contamina | Ref. |
|---|---|---|---|---|
| B1 | Água de reúso | Água cinza ou efluente tratado reaproveitado (descarga, irrigação, lavagem). **Foi o episódio 1.** | Interligação com potável, tubulação sem identificação visual, ponto de uso confundido com potável | ✔ NBR 16783:2019 |
| B2 | Água de chuva | Captação em cobertura, filtro, reservatório próprio, bomba | Contaminação por animais/folhas, mistura com potável na reposição, estagnação | ◻ NBR 15527 |
| B3 | Água de rebaixamento de lençol | Drenagem de subsolo reaproveitada | Qualidade variável, sem tratamento, mistura com potável | ✔ NBR 16783:2019 |
| B4 | Condensado de ar-condicionado | Água dos drenos de fancoils/splits reaproveitada | Contaminação microbiológica, ponto de reaproveitamento sem barreira | ◻ NBR 16783 |
| B5 | Rejeito de osmose reversa | Concentrado salino do tratamento A11, descartado ou reaproveitado | Reaproveitamento sem avaliar sal/químicos | ◻ — |
| B6 | Pontos de uso não potável | Torneiras de jardim, lavagem de piso, descarga com reúso | Ponto sem placa/cor, ocupante bebe ou lava algo sensível | ✔ NBR 16783:2019 (diferenciação visual) |

---

## C. Água de processo de climatização e térmica

Este é o grupo do **episódio 2**. Todo item que **tem produto químico e uma bomba** é candidato a empurrar água para a rede potável.

| ID | Sistema | O que é / onde está | Como falha ou contamina | Ref. |
|---|---|---|---|---|
| C1 | Circuito de água gelada | Anel fechado entre chiller, bombas e fancoils/VAV; com glicol e/ou inibidores | Vazamento reabastece com potável, contrapressão empurra para a rede, glicol contamina | ◻ NBR 16401 |
| C2 | Torre de resfriamento / condensação | Circuito aberto na cobertura; tratamento químico, purga, biocida | **Legionella**, aerossol, químico escapando, tanque cheio de sujeira | ◻ ASHRAE 188 / Guideline 12 · ◻ Portaria 3.523/1998 |
| C3 | Reposição (*make-up*) dos circuitos | Linha de água que repõe o chiller e a torre — **ponto mais crítico de interconexão com o potável** | Ligação direta sem separação atmosférica; contrapressão/retrossifonagem; mangueira deixada conectada | ✔ NBR 5626:2020 (proteção contra refluxo) |
| C4 | Tanque de expansão / reposição do circuito | Tanque que absorve variação de volume e repõe perdas | Boia presa, ladrão submerso, extravasa para a laje ou para a caixa d'água | ◻ — |
| C5 | Circuito de água quente de aquecimento | Caldeira ou bomba de calor para *reheat*/aquecimento, com químicos | Trocador de parede única, contrapressão, vazamento | ◻ NR-13 (se caldeira) |
| C6 | Fancoils, VAV, serpentinas, drenos de condensado | Equipamentos de ar nos andares; bandejas e drenos | Dreno entupido vaza no forro, bandeja com biofilme, serpentina furada vaza água química | ◻ Lei 13.589/2018 (PMOC) |
| C7 | Umidificação | Umidificadores adiabáticos/de vapor em salas técnicas e data centers | Reservatório estagnado, aerossol, dosagem de químico | ◻ — |
| C8 | Sistema de dosagem química | Bombas dosadoras, tanques de produto (inibidor, biocida) | Dosagem errada, produto armazenado sem contenção, linha dosadora ligada à rede | ◻ — |
| C9 | Caldeiras e vapor | Gerador de vapor, rede de vapor, retorno de condensado | Contaminação química do retorno, explosão (risco de vaso de pressão) | ◻ NR-13 |
| C10 | Chillers resfriados a água / condensadores evaporativos | Equipamento que usa a torre C2 para rejeitar calor | Contaminação cruzada entre circuitos no condensador | ◻ — |
| C11 | Termoacumulação | Tanque de água gelada/gelo para deslocar demanda | Perda, estagnação, entrada de ar | ◻ — |
| C12 | Resfriamento líquido de data center | CRAH, *rear door*, circuito a líquido | Vazamento sobre equipamento, glicol | ◻ — |
| C13 | Gerador arrefecido a água | Radiador/circuito do gerador diesel | Vazamento, reposição com água potável sem proteção | ◻ — |

---

## D. Combate a incêndio

| ID | Sistema | O que é / onde está | Como falha ou contamina | Ref. |
|---|---|---|---|---|
| D1 | Reserva técnica de incêndio (RTI) | Volume de água destinado só ao incêndio, na caixa ou em reservatório separado | Água parada vira "potável velha"; reposição liga ao potável sem barreira | ◻ IT Corpo de Bombeiros do estado |
| D2 | Bombas de incêndio | Bomba principal (elétrica/diesel), reserva e jockey; quadro | Não parte, diesel sem combustível, quadro desligado, teste nunca feito | ◻ NBR 13714 |
| D3 | Hidrantes e mangotinhos | Rede, abrigos, mangueiras, esguichos | Registro fechado, mangueira vencida, rede com vazamento | ◻ NBR 13714 |
| D4 | Sprinklers (chuveiros automáticos) | Rede molhada, seca, pré-ação ou dilúvio; válvula de governo e alarme | Corrosão, falso acionamento, rede seca com umidade, anticongelante contaminando | ◻ NBR 10897 |
| D5 | ESFR / alta vazão em armazéns | Sprinklers de supressão para estoque alto em galpão logístico | Rede subdimensionada, obstrução por estoque, pressão insuficiente | ◻ NBR 10897 |
| D6 | Hidrante de recalque / conexão siamesa | Entrada externa para o Corpo de Bombeiros | Tampa solta, registro fechado, rede entupida | ◻ NBR 13714 |
| D7 | Espuma (LGE) / névoa d'água | Sistemas especiais em áreas de risco (combustível, subsolo) | Líquido gerador de espuma contaminando a rede de teste | ◻ — |
| D8 | Descarga de teste | Água usada em teste/manutenção de bombas e sprinklers | Descarte sem destino, perda de reserva, reposição errada | ◻ — |

---

## E. Esgoto e drenagem

| ID | Sistema | O que é / onde está | Como falha ou contamina | Ref. |
|---|---|---|---|---|
| E1 | Esgoto sanitário | Ramais, colunas, ventilação, caixas de inspeção | Entupimento, retorno por ralo, ventilação insuficiente | ◻ NBR 8160 |
| E2 | Caixa de gordura | Cozinhas, restaurantes, refeitórios | Entupimento, transbordo, odor | ◻ NBR 8160 |
| E3 | Poço de recalque de esgoto | Bomba que sobe o esgoto de subsolo | Bomba para → inundação de subsolo; ausência de bomba reserva e alarme | ◻ — |
| E4 | Caixa separadora água-óleo | Garagens, oficinas, lavagem, abastecimento | Saturada, óleo vai para a rede pública | ◻ — |
| E5 | Águas pluviais | Calhas, condutores, ralos de cobertura | Entupimento, transbordo para dentro do prédio ou sobre caixa d'água | ◻ NBR 10844 |
| E6 | Drenagem de subsolo | Poços de drenagem, bombas, canaletas | Bomba para, nível sobe, inundação de subsolo/casa de máquinas | ◻ — |
| E7 | Retenção/detenção de águas pluviais | Reservatório de contenção exigido por lei municipal em muitos lotes | Cheio, bomba de esvaziamento parada, sem manutenção | ◻ legislação municipal |
| E8 | Drenagem de pátio e docas | Canaletas, caixas de areia, ralos | Entupimento, empoçamento, óleo e resíduos | ◻ — |
| E9 | Ralos e sifões | Selo hídrico em ralos e sifonados | Selo seca em ralo sem uso e devolve gás do esgoto | ◻ NBR 8160 |
| E10 | Drenos e extravasores | Ladrão das caixas, drenos de ar-condicionado, poço do elevador | Ladrão ligado ao esgoto sem proteção (retorno); drenos entupidos | ◻ — |

---

## F. Tratamento próprio

| ID | Sistema | O que é / onde está | Como falha ou contamina | Ref. |
|---|---|---|---|---|
| F1 | ETA própria | Tratamento da água de poço ou da água bruta | Falha na desinfecção, filtro esgotado | ✔ Portaria 888/2021 |
| F2 | ETE própria / de reúso | Tratamento do esgoto do prédio (origem do reúso B1) | Efluente fora do padrão, odor, falha de energia | ✔ NBR 16783:2019 |
| F3 | Efluente especial | Lavagem de veículos/empilhadeiras, pré-tratamento de logístico, laboratórios | Descarte sem tratamento | ◻ legislação ambiental estadual |

---

## G. Usos especiais

| ID | Sistema | O que é / onde está | Como falha ou contamina | Ref. |
|---|---|---|---|---|
| G1 | Piscina, spa, hidromassagem | Tratamento químico, filtros, circulação | Cloro baixo, contaminação microbiana, reposição ligada ao potável | ◻ NBR 10339 |
| G2 | Fontes, espelhos d'água, cascatas | Decorativos em hall/praça | **Legionella**, aerossol, algas | ◻ — |
| G3 | Irrigação e paisagismo | Cisterna de jardim, aspersores, parede verde | Ligação ao potável sem barreira, mistura com reúso | ◻ — |
| G4 | Cozinha e copas | Máquina de gelo, lava-louças, cafeteiras, bebedouro industrial | Filtro vencido, mangueira ligada direto em ponto de risco | ◻ — |
| G5 | Lavanderia | Máquinas industriais, tanque de produto | Retorno de químico para a rede | ◻ — |
| G6 | Lava-olhos e chuveiros de emergência | Em salas de bateria, produtos químicos, áreas de manutenção | **Estagnação** — ninguém aciona; sai água suja ou fria demais na hora que precisa | ◻ ANSI/ISEA Z358.1 |
| G7 | Laboratório / água DI | Água destilada, deionizada, tratamentos | Contaminação química/microbiológica | ◻ — |
| G8 | Câmaras frias e degelo | Dreno de degelo, condensador evaporativo | Dreno entupido, gelo, contaminação da câmara | ◻ — |
| G9 | Resfriamento evaporativo e nebulização em galpão | Painéis adiabáticos, nebulizadores | Estagnação, aerossol, Legionella | ◻ — |
| G10 | Lavagem de piso e fachada | Lavadoras, pontos de mangueira em garagem | Mangueira conectada em ponto de potável de risco | ◻ — |
| G11 | Zeladoria e DML | Tanques de limpeza, torneiras de serviço | Mangueira mergulhada em balde; retorno | ◻ — |
| G12 | Chuveiros e vestiários (logístico/indústria) | Uso coletivo, volume alto | Água quente morna, uso irregular, biofilme | ✔ NBR 5626:2020 |

---

## H. Pontos transversais: não são sistemas, são onde o plano falha

| ID | Item | Por que importa |
|---|---|---|
| H1 | **Mapa de interconexões** entre sistemas | Os dois episódios foram interconexões que ninguém sabia que existiam |
| H2 | Identificação e cor das tubulações | Sem isso o operador fecha o registro errado na emergência (NBR 16783 exige diferenciação para não potável) |
| H3 | Mapa e identificação de registros e válvulas de seccionamento | Na emergência, quem fecha o quê e onde |
| H4 | Medição, sensores e telemetria | Hidrômetro, nível, pressão, cloro, condutividade: o que avisa antes do ocupante |
| H5 | Energia de emergência | Gerador/no-break para recalque, bombas de incêndio, bombas de drenagem |
| H6 | Supervisório / BMS / automação | Quem vê o alarme e quem responde |
| H7 | Documentação técnica | As-built, memoriais, laudos, ART, PMOC, certificado de limpeza |
| H8 | Responsáveis técnicos e contratos | Quem opera, quem mantém, quem atende na emergência |
| H9 | Comunicação de crise | Quem avisa ocupantes, locatários, proprietário, vigilância sanitária, concessionária |
| H10 | Segurança de acesso | Espaço confinado (reservatórios), trabalho em altura (cobertura), produto químico (NR-33, NR-35) |

---

## Resumo

| Grupo | Itens |
|---|---|
| A. Água potável | 14 |
| B. Não potável / alternativas | 6 |
| C. Climatização e térmica | 13 |
| D. Incêndio | 8 |
| E. Esgoto e drenagem | 10 |
| F. Tratamento próprio | 3 |
| G. Usos especiais | 12 |
| H. Pontos transversais | 10 |
| **Total** | **76** |

## Referências conferidas nesta pesquisa

- ABNT NBR 5626:2020 — Sistemas prediais de água fria e água quente (cancela NBR 5626:1998 e NBR 7198:1993). Entrou em vigor em 29/12/2020.
- ABNT NBR 16783:2019 — Uso de fontes alternativas de água não potável em edificações (publicada em 19/11/2019).
- Portaria GM/MS nº 888, de 4/5/2021 — controle e vigilância da qualidade da água para consumo humano e padrão de potabilidade.

As demais (marcadas ◻) devem ser confirmadas no próximo passo antes de virarem exigência no procedimento.
