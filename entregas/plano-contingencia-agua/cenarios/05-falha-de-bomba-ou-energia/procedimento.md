# Cenário 5 — Falha de bomba ou de energia

**Projeto:** plano-contingencia-agua · **Versão:** 0.1 — rascunho para revisão técnica · **Data:** 2026-10-02

**Quem usa:** equipe de manutenção residente (ronda 24h), gestão predial, síndico

**Fluxograma de 1 página:** `fluxograma-a3.pdf` (para imprimir na sala de máquinas, na sala do gerador e na central)

> **Aviso.** Este procedimento orienta e organiza a resposta. **Não substitui responsável técnico habilitado nem laudo.** Os tempos-alvo, as ordens de partida, as autonomias, as frequências de teste e os critérios marcados com ⚠ devem ser validados por engenheiro eletricista, engenheiro mecânico ou consultor especialista antes de o documento ser tratado como oficial. **Manobra em quadro elétrico e em gerador é só de pessoa habilitada.** A decisão sobre qualquer proteção de incêndio é do síndico.

---

## 1. Quando usar este procedimento

Use **qualquer um** dos gatilhos abaixo. Na dúvida, **trate como falha até prova em contrário**.

**Energia**
- **Queda de energia da concessionária** (prédio inteiro ou parte).
- **Gerador não partiu**, partiu e **caiu**, ou está com alarme no painel.
- **Falha de partida ou de transferência** (QTA/ATS): a rede caiu e a carga não passou para o gerador, ou a rede voltou e a carga não voltou para a rede.
- **Disjuntor desarmado** ou **quadro com alarme** (bomba, inversor, soft-starter, quadro geral).
- **Diesel baixo** (gerador ou bomba de incêndio a diesel), **bateria fraca** do gerador, da central ou do no-break.

**Bomba**
- **Bomba em falha ou em alarme** (painel, inversor, supervisório, luz do quadro).
- **Bomba rodando sem recalcar** (motor gira, mas a pressão ou o nível não mudam).
- **Ruído, vibração, cheiro de queimado ou aquecimento** anormal na bomba ou no motor.
- **Vazamento no selo** ou na bomba.

**Efeito na água**
- **Nível do poço de drenagem, do poço de esgoto ou do fosso subindo** (visto na ronda ou no alarme).
- **Pressão caindo** nos andares, ou **reservatório superior baixando** sem reposição.
- **Bomba de incêndio** em falha, em manual, sem partida no teste, ou **jockey** partindo sem parar.

## 2. Princípios (valem para qualquer ramo)

1. **Segurança elétrica primeiro.** Quadro molhado, com fumaça, cheiro de queimado ou faísca **não se mexe**. Quem não é habilitado **não manobra** quadro, disjuntor geral, chave de transferência nem gerador.
2. **Prioridade de atendimento**, nesta ordem: **(1) vida e segurança das pessoas > (2) combate a incêndio > (3) drenagem de subsolo e de casa de máquinas (alagamento) > (4) recalque de água > (5) esgoto > (6) conforto**. Quando duas falhas coincidem, resolva na ordem. *Observação do projeto ⚠: poço de esgoto prestes a transbordar no subsolo passa a ser tratado como alagamento (item 3).*
3. **Não forçar rearme repetido.** Disjuntor que desarma tem motivo. Rearmar em sequência queima motor, solda contato e pode causar incêndio. Uma tentativa, por habilitado, e só sem sinal de dano ⚠; se desarmar de novo, **não insista**: diagnóstico.
4. **Nunca desligar ou colocar fora de serviço uma proteção de incêndio** (bomba, válvula, central, sprinkler) **sem decisão do síndico**. Se a bomba de incêndio está indisponível, avisar e reforçar a vigilância, não "desligar para consertar".
5. **"Não sei" = "não tem proteção".** Se a ficha não diz **o que o gerador atende**, assuma que **não atende**. Se não diz se existe **bomba reserva**, assuma que **não existe**. Se não diz se existe **alarme de nível**, assuma que **ninguém será avisado**.
6. **Não improvisar na água.** Nenhuma mangueira, "jumper" ou by-pass entre o potável e qualquer outro circuito, nem para "ajudar" a encher caixa ou circuito durante a falha (lição do Cenário 1). Reposição manual só com **folga de ar + bomba**.
7. **Ao religar bomba de circuito químico, lembrar da contrapressão** (água gelada, torre) sobre a rede potável. E, quando a pressão do potável **cai**, lembrar da **retrossifonagem**. Ver ramo E e a Fase 5.
8. **Registrar tudo** (quem, o quê, quando). A linha do tempo é parte da resposta.

## 3. Segurança de quem opera (leia antes de se aproximar)

| Risco | Regra |
|---|---|
| **Elétrico** (quadros, motores, gerador) | Só pessoa **habilitada e autorizada** manobra (NR-10 ◻ a confirmar escopo e exigências do prédio). Quadro **molhado, quente, com fumaça ou cheiro de queimado**: **afastar**, avisar o nível 1 e aguardar. Usar **EPI** e ferramentas previstos para o serviço ⚠. **Sem improviso** com cabo, extensão ou "ponte" |
| **Água + eletricidade** (subsolo, casa de máquinas, poço) | **Não entrar em área alagada** onde exista quadro, tomada, bomba ou cabo energizado. **Desenergizar antes** que a água chegue, por habilitado. Água no piso com energia ligada é risco de **choque** |
| **Espaço confinado** (poço de esgoto, de drenagem, fosso, cisterna) | **Não entrar.** Olhar **de fora**, sem debruçar. Entrada só com **permissão de trabalho e equipe treinada** (NR-33). Gases e falta de oxigênio podem incapacitar em segundos |
| **Altura** (cobertura, caixa d'água, torre) | Só com treinamento e proteção (NR-35). Às 3h da manhã, com vento e chuva, **adiar** o que não é urgente |
| **Gerador e combustível** | **Monóxido de carbono:** gerador só com escape para fora e ventilação; **nunca** gerador (próprio, portátil ou de aluguel) em subsolo, garagem fechada ou sala sem ventilação. **Partes quentes e giratórias:** não encostar com o gerador em operação. **Reabastecer** conforme o procedimento do fornecedor ⚠. Combustível derramado: bacia de contenção, sem chama |
| **Retorno de energia para a rede** | **Nunca** ligar gerador portátil ou de aluguel no quadro do prédio **sem chave de transferência adequada** instalada por habilitado. A energia volta pela rede da concessionária e **mata** quem trabalha nela |
| **Trabalhar sozinho** | Em sala de quadros, de gerador, poço ou cobertura, **avisar a central** da hora e do local, e combinar um retorno ⚠. De madrugada, preferir **dupla** |
| **Iluminação** | Na falta de energia, **lanterna** e iluminação de emergência. **Não** usar chama (vela, isqueiro) perto de gerador, diesel ou poço de esgoto |

## 4. Quem faz o quê (por função)

Os nomes e telefones de cada condomínio ficam na **ficha** (escada de escalonamento níveis 1, 2 e 3 e fornecedores). Aqui só funções.

| Função | Papel neste cenário |
|---|---|
| **Operador de ronda** (primeiro a ver o alerta) | Faz a **segurança** (afasta pessoas, não mexe em quadro), registra, **aciona o nível 1**, faz a ronda de nível e de pressão |
| **Responsável da manutenção residente** (nível 1) | Comanda a contenção; identifica o ramo; mantém as **cargas críticas**; **autoriza** partida manual e religamento; aciona fornecedores |
| **Pessoa habilitada** (eletricista ou técnico autorizado, da equipe ou do fornecedor) | **Única** que manobra quadro, QTA/ATS, gerador, inversor; faz diagnóstico elétrico; faz a **partida ordenada** |
| **Gestão predial / administradora** (nível 2) | Aciona fornecedores e aluguel de equipamentos; **comunica locatários**, restaurantes e proprietário; cuida do registro |
| **Síndico** (nível 3) | Decide: **proteção de incêndio indisponível**, comunicação externa, contratação emergencial, evacuação de área, uso de reservas |
| **Brigada de incêndio / vigilância** | Reforça a vigilância e a ronda quando há proteção de incêndio indisponível |
| **Fornecedor de elétrica / gerador / QTA** | Diagnostica e corrige falha elétrica; fornece gerador de aluguel; fornece diesel |
| **Fornecedor de bombas / hidráulica** | Troca ou reforma bomba; fornece bomba portátil ou de aluguel |
| **Fornecedor de incêndio** | Atende falha de bomba de incêndio, central, válvulas |
| **Fornecedor de elevadores** | Atende pessoa presa e elevador em fosso alagado |
| **Fornecedor de tratamento químico** | Orienta dosagem e circuito químico quando a energia cai ou volta |
| **Consultor especialista** (contratado caso a caso) | Entra se a causa é indefinida, se a falha se repete, ou se a restauração exige decisão técnica |

## 5. Procedimento por fases

Os tempos são **metas sugeridas** ⚠, contadas a partir do alerta (T+0). As fases 3 e 4 correm **em paralelo**: não espere o diagnóstico para proteger as cargas críticas.

### Fase 0 — Receber o alerta (T+0 a T+5 min)

1. Registrar: **o que** parou (energia, gerador, qual bomba, qual alarme), **onde**, **quando**, **quem** viu, **o que ainda funciona** (luz de emergência, gerador, outras bombas), e se há **pessoa em risco** (presa em elevador, em área alagada, com choque).
2. **Há pessoa com choque elétrico ou mal-estar?** Cortar a energia **antes** de tocar na vítima (se não for possível com segurança, não tocar) e acionar **SAMU 192**. **Há fogo ou fumaça?** Acionar **Bombeiros 193** e a brigada.
3. **Há pessoa presa em elevador?** Acionar o fornecedor de elevadores e **avisar a pessoa** (manter contato, tranquilizar; **não forçar a porta**; resgate pelo fornecedor ou por quem for habilitado). ⚠
4. Acionar o **nível 1** e abrir o **registro de incidente** (modelo na seção 11).

### Fase 1 — Contenção e segurança (T+0 a T+15 min)

1. **Segurança elétrica** (seção 3): afastar pessoas de quadro, gerador e área alagada. **Não manobrar** o que não é sua habilitação. **Não rearmar** repetidamente.
2. **Ver o que o painel diz**, sem abrir o quadro: luzes, alarmes, display do gerador, indicação do QTA/ATS, nível. Anotar.
3. **Proteger as cargas críticas** na ordem da seção 2 (item 2): quem está sem energia **e** em risco (incêndio, drenagem) vai primeiro.
4. **Evitar agravar:** parar bomba que **gira sem recalcar** (dano por falta de água ou ar), se for possível parar com segurança ⚠; **não abrir** válvula de transferência entre reserva de incêndio e consumo (D20) para "salvar" a água; **não** deixar mangueira ligada a nada.
5. **Se houver pessoa em risco de alagamento** (subsolo, garagem, doca): retirar pessoas e **orientar** a retirada de veículos e materiais, **sem entrar em área com energia**.

### Fase 2 — Escalonar e comunicar (T+0 a T+30 min)

1. Escalar pela escada **nível 1 → 2 → 3**, na ordem da ficha. **Informar ao nível 2 e ao síndico, sem demora, se a bomba de incêndio ou a drenagem estiver indisponível.**
2. **Acionar o fornecedor** da falha provável: elétrica e gerador (ramos A, B, F), bombas (D, E, F), incêndio (C). Se a ficha tem **contrato de emergência** (H21), acionar. Se há dúvida sobre a causa, acionar o consultor, **por decisão do síndico**.
3. **Consultar a concessionária** sobre a falta de energia (previsão de retorno): o contato está na ficha. Registrar o que for dito, **sem tratar a previsão como certa**.
4. **Comunicar por escrito** (modelos na seção 9): ocupantes, **restaurantes e lojas** (câmara fria, cozinha, bebedouro), proprietário (resumo). **Não afirmar a causa** antes de confirmada.
5. **Se a falta de energia pode durar:** o síndico decide sobre **gerador de aluguel**, **caminhão-pipa** (Cenário 2), **bomba de aluguel**, **reforço de vigilância** e **comunicação a ocupantes sensíveis** (clínicas, restaurantes, data centers: G23, C12).

### Fase 3 — Diagnóstico e identificação do ramo (T+10 a T+60 min)

1. **Identificar o ramo** pela tabela da seção 6, a partir da ficha. **Mais de um ramo pode valer ao mesmo tempo**: seguir todos, na ordem de prioridade. **Causa indefinida → ramo F** (o mais restritivo).
2. **Diagnóstico por pessoa habilitada:**
   - **Energia:** a falta é da **rede** (concessionária) ou **interna** (disjuntor geral, quadro, cabo)? Há tensão no QGBT? O **gerador** partiu? O **QTA/ATS** transferiu?
   - **Gerador:** combustível, bateria, arrefecimento, parada de emergência, alarmes, chave em automático.
   - **Bomba:** disjuntor/térmico/inversor, alimentação, nível de comando (boia, sensor), sucção, registros, ar na linha, sentido de giro, selo, rolamento.
3. **Anotar hora e ação** de cada tentativa (quem, o quê, resultado).
4. **Não "testar" com o sistema incerto:** antes de religar, ver a Fase 5.

### Fase 4 — Operação em modo degradado (a partir de T+15 min; enquanto durar)

1. **Plano de cargas críticas** (modelo na seção 6, ramo B): manter vivas as cargas na ordem de prioridade. **Cargas grandes não essenciais** (chiller, ar-condicionado, elevadores em excesso, equipamento de conforto) **só voltam ao gerador com ordem do nível 1** ⚠.
2. **Bomba reserva e rodízio** (seção 7): se existe e a titular falhou, **partir a reserva** (por habilitado, se for manual).
3. **Bomba portátil ou de aluguel** (seção 7), se a falha não será corrigida a tempo.
4. **Ronda em modo reforçado**, com registro, no intervalo definido na ficha ⚠: **nível** de poços e fosso, **nível** da cisterna e da caixa superior, **pressão**, **diesel** (autonomia), **temperatura** e **ruído** do gerador, **bateria** das centrais.
5. **Água potável:** restringir o consumo (Cenário 2) quando o recalque está indisponível. **Reserva de incêndio não é reserva de consumo.**
6. **Se houver circuito químico em operação** (água gelada, torre) e a pressão do potável cair: **conferir que a linha de reposição está fechada e sem mangueira**, e olhar o **traçador** na torneira sentinela; **cor ou odor** → Cenário 1.

### Fase 5 — Restabelecimento em partida ordenada

> **Só começa quando:** causa **eliminada e confirmada** pela pessoa habilitada, **energia estável** (rede ou gerador) e **autorização do nível 1**. Religar tudo de uma vez pode derrubar o gerador e repetir a falha.

1. **Conferir antes de partir cada bomba:** **sucção cheia** (nunca partir a seco), **registros** de sucção e recalque na posição certa, **retenção** livre, **sentido de giro** (se houve obra elétrica ou troca de cabo), **selo e acoplamento**, e **ar na linha** (escorvar e purgar conforme a bomba) ⚠.
2. **Partida ordenada, um motor por vez, com intervalo entre eles** ⚠ (para evitar pico de corrente e sobrecarga do gerador). A **ordem** é a da seção 2 (incêndio e drenagem primeiro; recalque; esgoto; circulação e conforto por último), **conforme a ficha e o responsável técnico** ⚠. Inversor ou soft-starter, se existirem, ajudam: usar como previsto.
3. **Evitar golpe de aríete:** abrir e fechar registros **devagar**; partir conforme a instrução do fornecedor (alguns sistemas pedem registro parcialmente aberto) ⚠. Ruído de batida na tubulação: **parar e avisar**.
4. **Observar cada bomba** após partir: **pressão**, **corrente** (comparar com a plaqueta ⚠), **ruído**, **vibração**, **temperatura**, **vazamento no selo**. Algo fora do normal: **parar** e voltar ao diagnóstico.
5. **Colocar em automático** e **conferir** o **modo** (manual/automático), o **nível de comando** e a **bomba reserva** (testar o revezamento) ⚠.
6. **Ao religar bomba de circuito químico** (água gelada, torre: C21): **antes**, conferir a **linha de reposição** (fechada, **sem mangueira nem jumper**, H12/H13), **ler a pressão relativa** do circuito e do potável no ponto de reposição (se a do circuito é **maior ou igual**, **não conectar nada** e seguir o Cenário 1), e **confirmar que a dosagem química** (C8, C35) voltou a operar. **Olhar a torneira sentinela** nos primeiros momentos e na ronda seguinte.
7. **Ao restabelecer a pressão da rede predial:** **purgar o ar** (abrir lentamente pontos altos), deixar correr até **limpar** (pode haver turbidez e ar após o retorno). **Cor ou odor estranho** → **Cenário 1**. Caixa vazia ou muito baixa → **Cenário 2**.
8. **Outros equipamentos que dependem de energia** e podem ter parado sem alarme (ver a tabela abaixo): conferir cada um.
9. **Retorno da concessionária:** **não** retornar para a rede no primeiro instante. Aguardar **estabilidade** ⚠ e transferir **conforme a ficha** (automático ou manual pelo habilitado). **Depois** da transferência, religar as cargas em partida ordenada.

**O que mais depende de energia (e pode ficar parado depois do retorno):**

| Item | ID | O que conferir |
|---|---|---|
| Clorador e dosadora em potável | A37 | Voltou a dosar? Residual de cloro |
| Lâmpada UV em potável | A38 | Lâmpada acesa, sem alarme; UV **não deixa residual** |
| Dosagem química da torre e do circuito | C8, C35 | Controlador em automático (não em manual); dosagem retomada; sondas |
| Bombas de circulação de água gelada | C21 | Ver passo 6 desta fase (contrapressão) |
| Bomba de reúso e tratamento terciário | B10, F6, B11 | **Terciário parado = efluente cru no reúso**: manter o reúso **fechado** até conferir |
| ETE (soprador, bombas) | F2, F5 | Efluente fora do padrão; odor; alarme |
| Bomba jockey e compressor de rede seca | D12, D18 | Pressão de rede de incêndio; compressor |
| Bombas de drenagem, esgoto e fosso de elevador | E3, E6, E19, E21 | Nível voltou ao normal; bomba reserva |
| Centrais de alarme, BMS, telemetria | H6 | **Voltaram a avisar** (alarme sem destinatário não protege) |
| Hidrômetros com telemetria | A16 | Comunicando |

### Fase 6 — Registro e lições

1. Fechar o **registro do incidente** (seção 11): linha do tempo, ramo, causa, quem fez o quê, tempo com a carga crítica sem proteção.
2. **Atualizar a ficha:** o que o gerador **realmente** atendeu, a autonomia **medida**, o que não partiu, bombas sem reserva, alarmes que não avisaram.
3. **Revisar** este procedimento e o **plano de cargas críticas** com o que o incidente mostrou.
4. Se a falha vier de **manutenção ou teste que não foi feito**, registrar **sem apontar culpado** antes da análise.
5. Preparar o **resumo ao proprietário** (o que aconteceu, o que foi feito, o que muda).

## 6. Ramos por configuração

A **ficha** do condomínio diz qual ramo vale (quais bombas existem, o que o gerador atende, autonomia, fornecedores). Onde a ficha não diz, vale o ramo **mais restritivo** ("não sei" = "não tem proteção").

### Tabela de decisão: sinal → ramo

| Sinal | Ramo |
|---|---|
| **Falta de energia da concessionária** e o **gerador está operando** | **A** |
| **Gerador não partiu**, caiu, ou **QTA/ATS não transferiu** (ou não retornou) | **B** |
| **Bomba de incêndio** em falha, em manual, sem partida, jockey partindo sem parar, diesel baixo na bomba de incêndio | **C** (e **Cenário 6**) |
| **Nível subindo** em poço de drenagem, esgoto, fosso de elevador ou poço de rampa; alarme de nível alto | **D** (e **Cenário 4**) |
| **Pressão caindo**, reservatório superior baixando, booster em falha, **recalque** parado | **E** (e **Cenário 2**) |
| **Quadro, inversor ou comando** em falha; **bomba** com ruído, aquecimento, vibração, **girando sem recalcar**; **causa indefinida** | **F** |

> **Mais de um ramo pode valer ao mesmo tempo** (ex.: sem rede + gerador não parte = **B**, que afeta **C, D e E**). Seguir todos, **na ordem de prioridade** da seção 2.

### Ramo A — Falta de energia da concessionária, gerador OPERANDO

**Perguntas de causa e de situação:**
1. **O que o gerador atende?** (ficha). Recalque? Bomba de incêndio? Drenagem? Esgoto? Pressurização? Elevadores? Iluminação? Centrais de alarme? **O que não está na ficha: assumir que não atende.**
2. **Qual a autonomia de combustível** com a carga real (ficha)? Qual o nível do tanque **agora**?
3. A transferência foi **automática** (QTA/ATS) e **completa** (todas as cargas que deveriam estar no gerador estão)?
4. O gerador está **estável** (tensão, frequência, temperatura, pressão de óleo, sem alarme)?
5. Qual a **previsão** da concessionária?

**Ações específicas:**
- **Cargas atendidas:** conferir **uma a uma**, no local, se as **cargas críticas** têm energia (bomba de incêndio, drenagem, recalque). O que não está no gerador entra no ramo correspondente (**C, D, E**) e na **Fase 4**.
- **Combustível e autonomia:** anotar **nível e hora**; reler no intervalo definido ⚠ e **extrapolar**. **Acionar o fornecedor de diesel antes** de chegar no limite definido na ficha ⚠, e **não esperar** o alarme de nível baixo. **Reabastecer** conforme o procedimento do fornecedor e do fabricante ⚠ (risco de incêndio e de ar no sistema de combustível).
- **Ordem de partida de motores ⚠:** **não partir todas as bombas ao mesmo tempo** no gerador. Um motor por vez, com intervalo, na ordem da ficha, para **evitar sobrecarga e queda do gerador** (que derruba tudo). Se o QTA tem partida **escalonada**, confirmar que ela está **ativa**.
- **Cargas grandes não essenciais** (chiller, ar-condicionado, elevadores em excesso, equipamento de locatário): **só com ordem do nível 1** ⚠. Se o gerador **cai por sobrecarga**, retirar carga antes de religar.
- **Ronda no gerador:** combustível, temperatura, **ruído**, **vazamento**, **escape**, **ventilação** da sala, **bateria**, painel. **Sem encostar** em partes quentes ou giratórias.
- **Retorno da concessionária:** seguir a Fase 5, item 9. **Não** transferir de volta no primeiro instante.
- **Outros equipamentos que dependem de energia:** conferir a tabela da Fase 5 **quando a rede voltar**.

### Ramo B — Gerador NÃO parte, caiu ou a transferência falhou

**Perguntas de causa:**
1. O **painel do gerador** mostra alarme? **Parada de emergência** acionada? A chave está em **automático**, **manual** ou **desligado**?
2. **Combustível** no tanque? **Bateria** de partida? **Nível do líquido de arrefecimento** (se o gerador é arrefecido a água: C13)?
3. O **QTA/ATS** recebeu o comando? O **disjuntor do gerador** está ligado? Algum **intertravamento** impede a transferência?
4. A rede **voltou**, mas o QTA/ATS **não retornou** a carga? O gerador **continua rodando** sem necessidade (gastando diesel)?
5. A falha vem de **manutenção ou teste que não foi feito** (último teste em carga? ver a ficha)?

**Ações específicas:**
- **Segurança primeiro:** quadro do gerador e QTA **não se manobram** sem habilitação. Se há **fumaça, cheiro de queimado ou vazamento de combustível**: afastar, **Bombeiros 193** se houver fogo.
- **Acionar já o fornecedor do gerador** e a elétrica. **Não esperar** para "ver se parte".
- **Ação manual (só por pessoa habilitada)**, se a ficha tem instrução **escrita** de **partida manual do gerador** e de **transferência manual** no QTA/ATS: seguir **apenas** essa instrução ⚠. **Sem instrução na ficha, não improvisar**: aguardar o fornecedor. **Não** usar produto auxiliar de partida nem outro improviso.
- **Plano de cargas críticas** (modelo abaixo): **sem energia nenhuma**, as cargas críticas dependem do que tiver **bateria própria**. Conferir **agora** a **autonomia** de: iluminação de emergência, **central de alarme e detecção de incêndio**, **central de bombas**, no-break de BMS e telemetria, rádio. **O que a ficha não informa: assumir autonomia nenhuma.**
- **Prever o tempo:** somar **estimativa de retorno da rede** (concessionária) e do **conserto do gerador** (fornecedor). Se **passa** da autonomia das baterias e do reservatório, **o síndico decide** sobre **gerador de aluguel**, **bomba de aluguel** e comunicação ampliada.
- **Gerador de aluguel:** ver seção 7.3. **Nunca** ligar sem **chave de transferência** (seção 3).
- **Seguir os ramos C, D e E** para as cargas que ficaram sem energia, **em paralelo**.
- **Se o QTA/ATS falhou e a rede está presente:** **não** religar "no braço" sem habilitado. O fornecedor faz a manobra e confere **antes** de religar.

**Plano de cargas críticas (modelo para a ficha ⚠).** A ficha preenche por condomínio; o procedimento é genérico:

| Carga | ID | Atendida pelo gerador? (ficha: S/N/?) | Prioridade | Se **não** atendida |
|---|---|---|---|---|
| Iluminação de emergência, sinalização de saída | — | | Vida | Bateria própria: autonomia na ficha ⚠; ronda com lanterna |
| Central de alarme e detecção de incêndio | D | | Vida | No-break/bateria: autonomia na ficha ⚠ |
| **Bomba de incêndio** (principal, jockey, diesel) | D2, D12, D14 | | **Incêndio** | Ramo C; vigilância reforçada |
| **Drenagem de subsolo, casa de máquinas, fosso, rampa** | E6, E19, E21, E3 | | **Alagamento** | Ramo D; bomba portátil; isolar quadros |
| **Recalque e pressurização** | A5, A8, A20 | | Água | Ramo E; reservatórios; consumo restrito |
| **Esgoto** (poço de recalque, triturador) | E3, E24 | | Esgoto | Ramo D se o nível ameaça o subsolo |
| Dosagem e controle químico, UV, clorador | C35, A37, A38 | | Qualidade | Conferir na volta; Cenários 3 e 8 |
| Centrais de alarme, BMS, telemetria | H6 | | Informação | Ronda manual |
| Elevadores (retorno ao térreo, pessoa presa) | — | | Segurança | Fornecedor de elevadores ⚠ |
| Chiller, ar-condicionado, conforto | C1, C10 | | **Conforto** | Só com ordem do nível 1; evitar sobrecarga |

### Ramo C — Bomba de incêndio indisponível

**Liga com o Cenário 6.** Não substitui o Cenário 6: **comunicar e reforçar** é o que se faz aqui.

**Perguntas de causa:**
1. A bomba **principal** está em falha ou indisponível? A **reserva** (elétrica ou a diesel) existe e está disponível? A **jockey** parte sem parar (vazamento na rede)?
2. A bomba **a diesel** tem **combustível**, **bateria** e **arrefecimento** (D14)?
3. O **quadro** da bomba está em **automático**? Há **energia** no quadro (o gerador atende essa carga)?
4. As **válvulas de controle** estão abertas (D16)? A **reserva técnica** de incêndio tem volume (D1)? A rede está **pressurizada**?
5. A **central de alarme e detecção** está operando?

**Ações específicas:**
- **Comunicar imediatamente** ao **síndico**, à **gestão** e à **brigada**. Registrar a **hora** em que a bomba ficou indisponível.
- **Vigilância reforçada** (ronda mais frequente, com atenção a **fonte de ignição, carga de incêndio e saídas**) até normalizar ⚠: frequência e área definidas na ficha.
- **Restringir atividades de risco** (solda, corte, trabalho a quente, manutenção com chama) **enquanto a proteção está indisponível**, por decisão do nível 1 ou do síndico ⚠.
- **Partida manual da bomba reserva ou da bomba a diesel** **só por habilitado**, **conforme a instrução da ficha** ⚠. **Se não há instrução, não improvisar.**
- **Não desligar, não fechar e não colocar fora de serviço** nenhuma proteção (válvula, central, sprinkler) **sem decisão do síndico**. **Reabrir** válvula de controle fechada pode ser necessário, mas só **conforme a ficha** e com **registro**.
- **Avaliar com o síndico**, conforme a regra local e os contratos, se é preciso **comunicar o Corpo de Bombeiros** e a **seguradora** ⚠. **Não afirmar** exigência sem confirmar.
- **Acionar o fornecedor de incêndio** e, se a falta de energia for a causa, seguir **A ou B** em paralelo.
- **Ligar com o Cenário 6** (incêndio com reserva ou sistema indisponível).

### Ramo D — Drenagem de subsolo ou esgoto indisponível

**Liga com o Cenário 4.**

**Perguntas de causa e de situação:**
1. **Qual poço ou ponto** (E3, E6, E19, E21, E14, E24)? Há **bomba reserva** (ficha)? O **alarme de nível** funcionou? **Quem** foi avisado?
2. **Qual o nível agora** e **quanto subiu** desde a última leitura? **Quanto falta** para **transbordar** ou para **atingir quadro, gerador, elevador ou subsolo**? (Estimar pela **velocidade de subida** medida: anotar nível e hora **duas vezes**.)
3. **Há quadro, gerador, bomba ou elevador** em cota que a água pode **alcançar**?
4. A causa é **energia**, **bomba**, **boia/sensor** (A22) ou **entupimento**?

**Ações específicas:**
- **Monitorar o nível** de **fora** e **registrar a cada intervalo** ⚠. **Não entrar** no poço (seção 3). **Não** debruçar sobre a boca.
- **Reduzir a entrada de água no poço**: suspender lavagem, descarga de purga, esvaziamento de piscina, descarga de circuitos e **qualquer uso evitável** nos pavimentos que alimentam o poço ⚠. **Orientar** os ocupantes a **reduzir o uso de água e de descarga** quando for poço de esgoto.
- **Bomba reserva** (se existe): partir por habilitado, conforme a seção 7.1.
- **Bomba portátil ou submersível de aluguel** (seção 7.2): posicionar com **mangote** de descarga para **destino adequado** (esgoto para esgoto, pluvial para pluvial; **nunca** esgoto no pluvial nem no potável).
- **Isolar quadro elétrico em risco, por habilitado e antes que a água chegue**: **desenergizar** o quadro de subsolo, de bombas e de casa de máquinas que a água vai alcançar. **Não esperar a água tocar** o quadro.
- **Evitar acesso a área alagada com energia.** Sinalizar e isolar.
- **Elevadores:** se o **fosso** enche, **levar as cabines** para cima e **desligar** os elevadores afetados, por habilitado ou pelo fornecedor ⚠.
- **Poço de esgoto transbordando = risco biológico:** **EPI**, isolar a área, **não** deixar acesso de pessoas, **higienizar** depois. Se o esgoto **retornar por ralo** de andar: **Cenário 7**.
- **Se a causa é energia:** seguir **A ou B** em paralelo.
- **Ligar com o Cenário 4** (vazamento e alagamento).

### Ramo E — Recalque ou pressurização indisponível

**Liga com o Cenário 2.**

**Perguntas de causa e de situação:**
1. **Qual** bomba (A5 recalque, A20 booster, A19 hidropneumático, A8)? Há **reserva**? A boia ou o sensor (A22) **comandou**?
2. **Qual o nível** da **cisterna** (A4) e da **caixa superior** (A6) **agora**? **Quanto tempo** a caixa dura **sem recalcar** (ficha, ou medir pela queda de nível no intervalo ⚠)?
3. A causa é **energia** (ramos A ou B), **bomba**, **quadro** ou **inversor** (ramo F), ou **falta de água na cisterna** (Cenário 2)?
4. Há **circuito químico em operação** (água gelada, torre) com **reposição** ligada ao potável? A **pressão do potável** está **caindo**?

**Ações específicas:**
- **Medir os níveis** e **calcular a duração** pela queda de nível entre duas leituras ⚠. **Se vai acabar antes do conserto:** **consumo restrito** e **água alternativa** (Cenário 2).
- **Bomba reserva** (seção 7.1). **Booster com inversor em falha:** o modo de **by-pass** é **do habilitado**, com cuidado com a **pressão máxima** (risco de **rompimento** na rede, A8). **Sem habilitado, não improvisar.**
- **Hidropneumático** (A19): **ligar e desligar sem parar** indica **perda do colchão de ar** (bexiga rompida). **Parar** e acionar o fornecedor; **não** insistir.
- **Não** abrir a **válvula de transferência** da **reserva de incêndio** (D20, H11) para consumo **sem decisão escrita do síndico**: transforma o **Cenário 2** em **Cenário 6**.
- **Caminhão-pipa** (A3): **receber só em ponto fixo, acima do nível** (folga de ar), com **amostra** e certificado (Cenário 2, Cenário 9). **Nunca** mangueira dentro da boca de visita.
- **Se a pressão do potável cai e há circuito químico:** conferir que a **reposição do circuito** está **fechada** e **sem mangueira**; **olhar a sentinela**. **Cor ou odor** → **Cenário 1** (retrossifonagem e contrapressão: C3, C17, H13).
- **Reúso:** manter **fechado** qualquer ponto de **complementação** (B8) e **não** completar o reúso com potável por mangueira.
- **Ao voltar:** Fase 5, itens 1 a 7 (**purga de ar**, **turbidez**, **sentinela**).
- **Ligar com o Cenário 2** (falta de água).

### Ramo F — Quadro, inversor ou comando em falha, bomba com defeito, ou causa indefinida

**Tratar como o ramo mais restritivo:** considerar **C, D e E ao mesmo tempo** e **ficar no modo degradado** até a causa ser **confirmada**.

**Perguntas de causa:**
1. **Sinal elétrico:** disjuntor desarmado, térmico atuado, inversor em falha (qual código?), cheiro de queimado, quadro quente ou molhado?
2. **Sinal mecânico:** **ruído** (rolamento, cavitação), **vibração**, **aquecimento**, vazamento no **selo**?
3. **Gira, mas não recalca:** **sucção** com ar ou sem água (**bomba a seco**), **registro** fechado, **retenção** travada, **sentido de giro** invertido (após obra elétrica), **acoplamento** ou **rotor** quebrado?
4. **Comando:** **boia** ou **sensor** (A22) travado ou sujo; **modo manual** deixado depois de manutenção; **supervisório** sem comando?
5. **Houve intervenção recente** (manutenção, obra elétrica, troca de componente)?

**Ações específicas:**
- **Parar** a bomba que apresenta **ruído, vibração, aquecimento** ou que **gira sem recalcar** (se for possível com segurança ⚠), para **não agravar o dano**. **Passar para a reserva** (seção 7.1).
- **Não rearmar em sequência.** **Uma** tentativa, por habilitado ⚠.
- **Não** colocar bomba em **by-pass** do inversor ou do contator **sem habilitado e sem autorização** do nível 1.
- **Acionar o fornecedor** de elétrica ou de bombas e, se a causa **segue indefinida**, o **consultor** (por decisão do síndico).
- **Seguir C, D e E** conforme as cargas afetadas.
- **Não** liberar para operação normal **sem causa identificada** ou, se não for possível identificar, **sem parecer** do fornecedor ou do consultor.

## 7. Recursos de contingência

### 7.1 Bomba reserva, rodízio e partida manual

- **Bomba reserva** existe? (ficha: S/N/?). **Não sei = não existe.**
- **Rodízio (revezamento):** bombas que **nunca alternam** deixam a reserva **parada por anos** e ela **não parte** quando precisa. Conferir se o **revezamento** está **ativo** e se **a reserva já partiu** neste período ⚠.
- **Partida manual:** só por **pessoa habilitada**, **conforme instrução escrita** na ficha ou no fornecedor ⚠. Antes: **sucção cheia**, **registros** certos, **sentido de giro**, **nível**. Depois: observar **pressão**, **ruído**, **corrente**. **Voltar ao automático** ao final e **registrar** quem, quando e **por que** ficou manual.
- **Modo manual esquecido** é causa clássica de bomba que não parte no incidente seguinte. **Anotar na passagem de turno.**

### 7.2 Bomba de aluguel ou portátil

- **Quando:** a falha **não será corrigida** a tempo de evitar **alagamento** (ramo D) ou **falta de água** (ramo E), por decisão do **nível 1** ou do **síndico**.
- **Kit de bomba portátil** (prevenção, seção 10): bomba submersível, **mangotes** na medida, **quadro ou extensão** adequados, **corda** para recolher, **lanterna**.
- **Ligação elétrica por habilitado**, em tomada ou quadro **adequado e protegido**, **fora da água**; **sem emenda improvisada**; **nunca** em quadro molhado.
- **Descarga** para **destino adequado** (esgoto, pluvial ou ralo, conforme o fluido). **Nunca** ligada ao **potável**; **nunca** com **mangueira** entre potável e circuito.
- **Monitorar** a bomba (sobreaquecimento, entrada de lixo, bomba a seco) e o nível; **anotar** início e fim.
- **Água potável:** bomba de **transferência** só **entre reservatórios**, **com folga de ar na entrada** (separação atmosférica), **sem mangueira conectada à torneira**. Ver a regra de reposição segura do **Cenário 1** (ramo A) e **Cenário 2**.

### 7.3 Gerador de aluguel

- **Posição ao ar livre**, **longe de aberturas** (portas, janelas, tomadas de ar), **nunca** em subsolo ou garagem fechada (**monóxido de carbono**).
- **Conexão elétrica** por **habilitado**, em **ponto de conexão previsto** (ficha: S/N/?) ou **com chave de transferência** adequada ⚠. **Nunca** ligar "direto" no quadro (retorno de energia para a rede, seção 3).
- **Combustível** e **aterramento** conforme o fornecedor ⚠.
- **Prazo:** o contrato de emergência (H21) deve dizer o **tempo de chegada** ⚠ (definir com o fornecedor).

## 8. Quadro: o que não fazer

| Não faça | Porque |
|---|---|
| **Manobrar quadro molhado, quente ou com fumaça**, ou sem habilitação | Choque, arco elétrico, incêndio |
| **Rearmar disjuntor em sequência** | Queima motor, solda contato, causa incêndio |
| **Entrar em poço, cisterna ou fosso** | Espaço confinado: gás e falta de oxigênio |
| **Entrar em área alagada com energia** | Choque |
| **Ligar gerador portátil ou de aluguel direto no quadro** | Retorno de energia mata quem trabalha na rede da concessionária |
| **Gerador em subsolo, garagem fechada ou sem ventilação** | Monóxido de carbono |
| **Partir todas as bombas ao mesmo tempo** | Pico de corrente: derruba o gerador |
| **Partir bomba a seco ou com ar na linha** | Destrói selo e rotor; perde pressão |
| **Abrir ou fechar registro de recalque de golpe** | Golpe de aríete; rompe tubo |
| **Desligar ou "pular" proteção de incêndio sem decisão do síndico** | Prédio fica sem proteção sem ninguém saber |
| **Abrir a válvula de transferência da reserva de incêndio para consumo** | Esvazia a reserva (Cenário 2 vira Cenário 6) |
| **Mangueira ligada entre potável e circuito para "encher"** | É a causa do episódio 2 (Cenário 1) |
| **Religar bomba de circuito químico sem ler a pressão** | Contrapressão sobre a rede potável |
| **Voltar para a rede no primeiro instante** | Retorno instável derruba a transferência |
| **Esperar o alarme de diesel baixo para ligar ao fornecedor** | Gerador para e leva tudo |
| **Deixar a bomba em manual depois do conserto** | Não parte no próximo incidente |
| **Afirmar a causa** antes de confirmada | Gera passivo e perde credibilidade |

## 9. Modelos de comunicação

**Aviso ao ocupante (curto):**
> **AVISO — Falha de energia / bomba.** Identificamos [falta de energia / falha em equipamento de água] em [local]. A equipe técnica está atuando. **Pode haver [falta de água / queda de pressão / elevadores parados / ar-condicionado desligado]** em [andares/áreas]. Por favor, **reduza o uso de água** e **não use os elevadores** até novo aviso. Em caso de emergência, procure [local/contato da central]. Próxima atualização às [hora].

**Ao restaurante / loja de alimentos:** acrescentar "**cuide dos alimentos refrigerados e do gelo**, **suspenda o preparo** se a água ou a energia faltarem, e **não use** a água da rede para alimento e gelo **se houver cor, odor ou turbidez**". A decisão sobre descarte de alimento é do **estabelecimento**, conforme as **boas práticas** dele.

**Ao proprietário (resumo):** o que parou e quando; o que ainda funcionava (gerador, bombas, incêndio); o que foi feito; o que **está em risco** (proteção de incêndio, subsolo, abastecimento); a causa **quando confirmada**; o que muda para não repetir. **Sem culpar fornecedor ou pessoa antes da análise.**

**Quando a proteção de incêndio está indisponível (ao síndico e à brigada):**
> **ALERTA — Bomba de incêndio indisponível** desde [hora]. Motivo provável: [ ]. Medidas: vigilância reforçada em [áreas], trabalhos a quente suspensos, fornecedor acionado às [hora]. Previsão de normalização: [ ]. **Nenhuma proteção deve ser desligada sem decisão do síndico.**

## 10. Prevenção (o que impede ou reduz este cenário)

- **Teste periódico do gerador em carga**, não só "a vazio" ⚠: frequência, duração e carga definidas pelo **responsável técnico**. **Registrar** em livro ou planilha.
- **Nível e qualidade do diesel** ⚠: combustível parado **envelhece** e pode contaminar-se; **conferir** nível, aspecto e **validade** conforme o fornecedor; **contrato de fornecimento de emergência** (H21).
- **Bateria do gerador** e das **centrais de alarme e de incêndio, do no-break e da iluminação de emergência**: **testar** e **trocar** conforme o fabricante ⚠.
- **Teste de transferência (QTA/ATS)**, com a **transferência real** (rede → gerador → rede) ⚠, e **registro**.
- **Bomba reserva** e **rodízio**: conferir que o revezamento **está ativo** e que **a reserva já partiu**; **bomba reserva** existe? (ficha); evitar **bomba única** em poço, recalque e incêndio.
- **Manutenção preventiva das bombas** (selo, rolamento, acoplamento, retenção) e dos **quadros** (aperto, termografia ⚠) pelo fornecedor.
- **Nível de alarme** em poços, fosso e rampa (alarme de **nível alto**), **com destinatário** (H6): alarme que ninguém ouve **não é alarme**. Se **não há alarme**, a **ronda** é o alarme: registrar o nível.
- **Kit de bomba portátil** na casa de máquinas: bomba submersível, mangotes, extensão ou quadro adequado (por habilitado), lanterna, EPI.
- **Plano de cargas críticas** na ficha: **o que o gerador atende**, **a ordem de partida**, **a autonomia** medida.
- **Autonomia de combustível** ⚠: **medida**, não só calculada, no teste em carga.
- **Quadros protegidos contra alagamento** (cota, vedação) e **mapeados**; **mapa de quadros e desligamentos** na sala de máquinas.
- **Instrução escrita de partida manual** (gerador, QTA/ATS, bomba reserva, bomba de incêndio) na **ficha**, assinada pelo responsável técnico ⚠.
- **Contratos de emergência** (H21): eletricista habilitado, gerador de aluguel, bomba de aluguel, fornecedor de diesel, elevadores.
- **Treinamento da ronda** neste cenário e **simulado** (H20), inclusive **às 3h** e **com a escada de escalonamento**.
- **Registro dos testes** na planilha-mestre (família 2, bombas; família 10, incêndio; família 11, esgoto e drenagem), e no relatório mensal dos fornecedores, com o **checklist padrão** (teste de bomba de incêndio **semanal**, pedido).

## 11. Registro de incidente (modelo)

| Campo | Preencher |
|---|---|
| Condomínio / data / hora do alerta | |
| Quem relatou / como | |
| O que parou e o que continuou funcionando | |
| Pessoas em risco / atendimento (choque, elevador, alagamento) | |
| Ramo(s) identificado(s) (A–F) e por quê | |
| Cargas críticas: atendidas pelo gerador? por quanto tempo? | |
| Combustível: nível no início, no fim, autonomia medida | |
| Ações de contenção e de segurança (o que, quem, hora) | |
| Quem manobrou quadro, gerador ou QTA (habilitação) | |
| Escalonamento (níveis acionados, hora) | |
| Fornecedores acionados / hora de chegada | |
| Proteção de incêndio indisponível? por quanto tempo? medidas | |
| Nível de poço / reservatório: leituras (hora, nível) | |
| Bomba reserva, bomba portátil, gerador de aluguel usados | |
| Causa confirmada / como foi verificada | |
| Correção (o que, quem, quando) | |
| Restabelecimento: ordem de partida, intervalo, observações | |
| Verificação de pressão circuito × potável (valores, quem leu) | |
| Cor ou odor na sentinela após o retorno | |
| Comunicações enviadas | |
| Lições e atualizações na ficha | |

## 12. O que precisa de validação técnica antes de ser oficial ⚠

- **Tempos-alvo** das fases e **intervalos de ronda** em modo degradado.
- **Prioridade de atendimento** (incluindo tratar poço de esgoto no subsolo como alagamento) e **quais cargas** são "críticas".
- **Ordem e intervalo de partida de motores** no gerador e no retorno da rede, por **tipo de partida** (direta, soft-starter, inversor).
- **Autonomia** de combustível (gerador e bomba de incêndio a diesel), das **baterias** (centrais, no-break, iluminação de emergência) e **como medi-la**.
- **Instrução de partida manual** do gerador, do QTA/ATS, da bomba reserva e da bomba de incêndio.
- **Quantas tentativas de rearme** são aceitáveis e em que condições.
- **Frequência e método** dos testes: gerador em carga, transferência, bomba reserva, alarme de nível, baterias; **qualidade do diesel**.
- **Exigências de segurança elétrica** (NR-10 ◻ a confirmar escopo) e de **espaço confinado** (NR-33) e **altura** (NR-35) no prédio.
- **Quando comunicar** o Corpo de Bombeiros e a seguradora em caso de proteção de incêndio indisponível; **restrição de trabalho a quente**.
- **Posição e conexão** do gerador de aluguel; **ponto de conexão previsto** e **chave de transferência**.
- **Instruções de partida** para evitar **golpe de aríete** (registro parcial ou não) e **escorva** por tipo de bomba.
- **Estimativa de duração** da caixa d'água sem recalque (por prédio).
- **Referências:** NBR 5626:2020, NBR 16783:2019 e Portaria GM/MS nº 888/2021 tiveram existência e escopo conferidos; **NR-10, NR-13, NR-33, NR-35, NBR 13714 e NBR 10897** devem ser lidas no texto vigente por responsável técnico antes de virarem exigência. Este cenário **não cita número de norma para parâmetro elétrico, de combustível ou de bombeamento**: todos são "definir na ficha / validar com responsável técnico".
