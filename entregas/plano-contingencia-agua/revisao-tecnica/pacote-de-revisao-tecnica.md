# Pacote de revisão técnica — plano de contingência da água

**Projeto:** plano-contingencia-agua · **Versão do pacote:** 0.1 · **Data:** 2026-10-02
**Para:** responsável técnico (engenheiro ou consultor especialista) e síndico
**Material sob revisão:** catálogo v2, cenários 1 a 9 e o **T** (comunicação de crise), checklists e planilha-mestre, todos em **rascunho v0.1**

> **O que se pede.** Que o responsável técnico responda, item por item, se **aprova, ajusta ou não se aplica**. Nada neste material é oficial antes dessa revisão. O kit **orienta e organiza**; **não substitui** responsável técnico, laudo nem projeto. A decisão de adotar é do síndico.
>
> **Por que existe.** Os procedimentos foram escritos de propósito **sem nenhum valor numérico** (cloro, temperatura, tempo, concentração, periodicidade legal). Todo valor ficou como "definir na ficha / validar com responsável técnico". Este pacote junta, num lugar só e por prioridade, **tudo o que depende de validação**.

## Como responder

Para cada item, marque na coluna **Resposta**: **A** = aprovo como está · **J** = ajusto (escreva como, na coluna Obs.) · **N** = não se aplica a este prédio · **?** = preciso de mais informação. Pode responder neste arquivo (Word) ou por voz ao usuário, citando o código do item (por exemplo "R-04: J, tempo de contato é X").

**Ordem de leitura sugerida (1 hora):** (1) este pacote, partes 1 e 2; (2) os **fluxogramas A3** dos dez cenários (1 página cada); (3) o **procedimento do Cenário 1** e o **checklist de autovistoria**; (4) o **mapa de interconexões críticas** do catálogo; (5) o restante, conforme os itens abaixo apontarem.

---

## Parte 1 — O que foi construído, em uma página

| Camada | O que é | Onde |
|---|---|---|
| **Catálogo** | 195 sistemas de água que podem existir em prédio comercial ou logístico, com mecanismo de falha, cenários em que entra, 16 famílias de manutenção e **18 interligações críticas** (o que não pode se tocar e o que o dispositivo de proteção **não** garante) | `catalogo/catalogo-v2.md` |
| **Cenários** | Procedimento por fases e ramos condicionais, mais fluxograma de 1 página: **T** comunicação de crise · **1** contaminação cruzada · **2** falta de água · **3** água fora do padrão · **4** vazamento e alagamento · **5** falha de bomba ou energia · **6** incêndio com reserva indisponível · **7** refluxo de esgoto · **8** falha do tratamento químico · **9** contaminação do reservatório | `cenarios/` |
| **Checklists** | Autovistoria dos 5 tipos de ponto de contaminação cruzada (42 itens); relatório mensal padrão dos fornecedores; ronda com torneira sentinela | `cenarios/01-.../`, `rotinas/` |
| **Planilha-mestre** | Ficha por condomínio (em branco): catálogo S/N/?, matriz item × cenário, manutenção por família, autovistoria, contatos, incidentes e resumo | `planilha-mestre/` |

**Princípios que atravessam tudo** (convém o revisor confirmar que concorda):
1. **Saúde primeiro:** suspender o consumo antes de investigar.
2. **Evidência antes de limpeza:** coletar antes de descarregar.
3. **"Não sei" = pior caso:** o que a ficha não confirma é tratado como inexistente.
4. **Nenhum caminho de água contínuo entre o potável e qualquer circuito.** A reposição manual segura é por **tanque com folga de ar + bomba**, nunca mangueira ligada à torneira.
5. **A ronda contém, avisa e aciona.** Não improvisa química, quadro elétrico nem entrada em reservatório.
6. **Liberar só com:** causa eliminada, trecho limpo e desinfetado, análise conforme, parecer técnico e **autorização escrita do síndico**.

**Origem dos procedimentos:** os dois episódios reais (reúso × potável por erro de obra; água gelada do chiller na prumada por **contrapressão**, após reposição manual com mangueira deixada conectada).

---

## Parte 2 — Prioridade 1: segurança e saúde (validar antes de qualquer uso operacional)

Estes itens podem **machucar ou contaminar alguém** se estiverem errados. Revisar primeiro.

| Cód. | O que validar | Onde está | Quem decide | Resposta | Obs. |
|---|---|---|---|---|---|
| **R-01** | **Reposição manual segura** de circuito (água gelada, torre, caldeira): (1) potável enche **tanque com folga de ar** e **bomba** leva ao circuito; (2) funil/tanque com folga de ar em circuito **aberto ou à pressão atmosférica**; (3) se não houver estrutura, **não repor com potável**. Qual é viável em cada tipo de circuito? Circuito pressurizado aceita funil? | Cen. 1, ramo A; Cen. 2, seção 8 | RT (hidráulica / ar-condicionado) | | |
| **R-02** | **Comparar pressões antes de conectar** qualquer reposição: "se a do circuito for maior ou igual à do potável, não conectar nada". Como medir na prática (manômetros, pontos de leitura)? A regra é suficiente? | Cen. 1, ramo A; Cen. 2, seção 8; Cen. 5, fase 5 | RT | | |
| **R-03** | Com ligação aberta entre potável e circuito pressurizado que não dá para fechar na hora: **parar as bombas do circuito** reduz a pressão que empurra a água? É seguro recomendar? | Cen. 1, fase 1 | RT / fornecedor de AC | | |
| **R-04** | **Desinfecção** de reservatório, rede e trechos afetados: produto, concentração, tempo de contato, enxágue, descarga; **choque térmico** (quando e como); desinfecção da rede quando a água contaminada chegou às prumadas | Cen. 1 f.4; Cen. 3 ramos A, D; Cen. 9 seção 8 | RT | | |
| **R-05** | **Destino do efluente** (água com produto químico, desinfecção, esvaziamento de reservatório, derrame, purga e drenagem de torre): esgoto, pluvial, solo? Exige autorização ou notificação (concessionária, órgão ambiental)? | Cen. 1 f.4; Cen. 8 seção 9; Cen. 9 seção 8 | RT + regra local | | |
| **R-06** | **Legionella:** o que desligar ou interditar para reduzir aerossol (torre, fonte, nebulização, chuveiros); **critério de suspeita clínica**; técnica e pontos de coleta; monitoramento posterior. **Não encontramos norma brasileira específica para água quente sanitária** (ASHRAE 188 e Guideline 12 são estrangeiras). Existe regra municipal ou estadual? | Cen. 3 ramo D; Cen. 8 ramo A | RT + vigilância sanitária | | |
| **R-07** | **Parâmetros analíticos e critérios de liberação** da água após incidente (potabilidade, produto químico a partir da FISPQ, microbiologia): quais parâmetros, quais pontos, qual valor libera | Cen. 1 f.3 e 5; Cen. 3; Cen. 8 seção 8; Cen. 9 | RT + laboratório | | |
| **R-08** | **Segurança elétrica:** uma tentativa de rearme, por habilitado; partida manual do gerador e do QTA/ATS só com instrução escrita na ficha; **gerador portátil ou de aluguel só com chave de transferência**; desenergizar quadro **antes** de a água chegar; gerador nunca em subsolo ou garagem fechada. Escopo da NR-10 no prédio | Cen. 5 seções 2, 3, ramo B, 7.3 | RT elétrico | | |
| **R-09** | **Entrada e inspeção de reservatório e torre:** a ronda inspeciona **só por fora** (não abre tampa, não se debruça, não entra); quem cai não é socorrido por quem entra (liga 193 e 192). Pontos seguros de coleta; se a ronda pode abrir a tampa sem entrar. NR-33 e NR-35: treinamento, vigia, resgate | Cen. 9; Cen. 8; Cen. 5 seção 3 | RT / segurança do trabalho | | |
| **R-10** | **Proteção de incêndio:** nada autoriza usar a **RTI** para consumo; **o que comunicar** ao Corpo de Bombeiros, à brigada e à seguradora quando uma bomba ou a reserva fica indisponível; **restringir trabalho a quente** nessa condição | Cen. 2 seção 6; Cen. 5 ramo C; Cen. 9 ramo D | Síndico + RT incêndio | | |
| **R-11** | **Química e a ronda:** o que a ronda **pode** fazer com dosadora, controlador, registros e kit de derrame; EPI por produto (FISPQ); **nunca misturar produtos** (exemplo do catálogo: hipoclorito com ácido libera cloro) | Cen. 8 seção 3.1 e princípios | Fornecedor de tratamento + segurança do trabalho | | |
| **R-12** | **Parada e retomada de torre e chiller:** sequência, purga, tratamento químico durante a parada, **Legionella no retorno**, **tempo de parada que exige limpeza ou amostra antes de religar**; plano alternativo dos pontos críticos (data center, clínicas); chiller a água depende da torre | Cen. 2 seções 6 e 8; Cen. 8 seção 6 | Fornecedor + RT | | |
| **R-13** | **Proporcionalidade da suspensão do consumo:** quando suspender **só o ponto**, o **trecho** ou o **prédio** (tabela do Cenário 3, seção 5); **gravidade alta × média** do reservatório e o prazo de T+1 h para suspender; **restaurantes**: quando parar e voltar, descarte de gelo | Cen. 3 seção 5; Cen. 9 seções 1 e 4; Cen. 2 seção 6 | Síndico + RT + vigilância sanitária local | | |
| **R-14** | **Abastecimento alternativo:** critério de **origem e de tanque** do caminhão-pipa (documento aceito, certificação), cloro na chegada, **contraprova**, ponto fixo de recebimento acima do nível com folga de ar | Cen. 2 seção 7 | RT | | |
| **R-15** | **Isolar setor de incêndio para estancar alagamento** (sprinkler disparado, rede rompida): fechar a válvula do setor **tensiona** o princípio de nunca fechar proteção sem o síndico. Vale **pré-autorização do nível 1 na ficha** ou só decisão do síndico? Quem decide se o síndico não é localizado? Tempo máximo sem proteção? Recolocação por tipo de rede (seca, pré-ação) | Cen. 4 ramo F; Cen. 6 ramo D | Síndico + RT incêndio | | |
| **R-16** | **Gases de esgoto e atmosfera em poço, caixa e subsolo:** a ronda tem detector? quem usa, como? EPI e proteção respiratória; conduta em contato com mucosa ou ferida. (A nota de que o gás pode ser tóxico e inflamável e que o cheiro deixa de ser percebido está **sem fonte** e precisa de confirmação) | Cen. 7 seção 3 | RT / segurança do trabalho | | |
| **R-17** | **Restringir uso de água e descarga a montante** quando a coluna está entupida, e **quando cortar o abastecimento do trecho** em vez de só avisar (critério de "pavimentos a montante"); tamponar ralos do subsolo | Cen. 7 fase 1 e ramo B | RT + nível 1 | | |
| **R-18** | **Desenergizar sem habilitado disponível** (isolar a área e esperar o fornecedor?) e **verificar e religar quadro ou motor molhado**: testes, quando recuperar, quando trocar. Lista de quadros no caminho da água por prédio | Cen. 4 seções 3 e 12 | RT elétrico | | |
| **R-19** | **Higienização de área atingida por esgoto ou água contaminada** (produto, diluição, tempo de contato) e **descarte de materiais porosos e resíduo contaminado** (enquadramento, embalagem, comprovante) | Cen. 4; Cen. 7 seção 9 | RT | | |
| **R-20** | **Rede de incêndio:** reabrir válvula fechada (ficha, registro, segunda pessoa), **encher a rede** (golpe de aríete, purga, rede seca e pré-ação), **troca de sprinkler**, o que a ronda pode **silenciar, habilitar e reabilitar** na central de alarme | Cen. 6 seções 5, 6 e 11 | RT incêndio / fornecedor | | |

## Parte 3 — Prioridade 2: valores que **nenhum documento traz** e precisam ser fixados

Preencher na **ficha** de cada condomínio (ou no padrão do portfólio, quando fizer sentido).

| Cód. | Valor a definir | Aparece em | Quem define | Valor / critério definido |
|---|---|---|---|---|
| **V-01** | **Cloro residual mínimo** para liberar consumo e na chegada do caminhão-pipa; pontos e **frequência** de medição | Cen. 2, 3, 9 | RT (Portaria 888/2021, ◻ cláusulas e aplicabilidade a condomínio) | |
| **V-02** | **Temperaturas de referência da água quente** (armazenamento, retorno, ponto de uso) e faixa de risco | Cen. 3 | RT | |
| **V-03** | **Autonomia mínima** do reservatório (horas) e níveis de **alerta** e **crítico**; duração da caixa d'água **sem recalque** (por prédio) | Cen. 2, 5 | RT + manutenção | |
| **V-04** | **Autonomia de diesel** (gerador e bomba de incêndio), das **baterias** (centrais, no-break, iluminação de emergência) e **como medi-la** | Cen. 5 | RT elétrico | |
| **V-05** | **Faixas do tratamento químico** (dosagem, condutividade, pH, ORP, purga, biocida), **estoque mínimo** e **SLA** do fornecedor | Cen. 8 | Fornecedor + RT | |
| **V-06** | **Tempos-alvo T+** das fases de cada cenário (hoje são sugestões marcadas ⚠) | Todos | RT + síndico | |
| **V-07** | **Período do monitoramento reforçado** após incidente (Cenários 1 e 9 sugerem **30 dias**; o Cenário 3 deixa "definido pelo consultor": **uniformizar**) | Cen. 1, 3, 9 | RT | |
| **V-08** | **Cadência de limpeza e desinfecção** de reservatórios por tipo de ocupação e a **regra local** (nenhum prazo legal está citado) | Cen. 9 | RT + regra local | |
| **V-09** | **Frequência e método de testes:** gerador em carga, transferência, bomba reserva, alarme de nível, baterias; **qualidade do diesel** | Cen. 5 | RT elétrico / fornecedor | |
| **V-10** | **Ordem e intervalo de partida de motores** (gerador e retorno da rede), por tipo de partida; **golpe de aríete e escorva** por tipo de bomba | Cen. 5 | RT elétrico / hidráulico | |
| **V-11** | **Descarga de pontos mortos e fim de rede:** tempo e critério; frequência de acionamento de **chuveiros e lava-olhos** | Cen. 2, 3 | RT | |
| **V-12** | **Frequência da autovistoria** (sugestão: na implantação, após incidente e semestral) e da **torneira sentinela** (sugestão: a cada ronda; diária, com registro, por um período após incidente) | Autovistoria; Ronda | RT + síndico | |
| **V-13** | **Ensaio de estanqueidade** de reservatório e laje | Cen. 9 | RT | |
| **V-14** | **Laboratório:** escopo da acreditação ISO/IEC 17025 (inclui Legionella?), conservação e prazo das amostras, temperatura de transporte, **contraprova** | Cen. 1, 3, 8, 9 | RT | |
| **V-15** | **Telefones:** Disque-Intoxicação (0800 722 6001 **não confirmado**, aparece só no Cenário 1), centro toxicológico, concessionária, vigilância sanitária local | Cen. 1, 8; ficha | Administração | |
| **V-16** | **Secagem e mofo:** método, equipamento, prazo para retirar material molhado e critério para dar por seco | Cen. 4 | RT | |
| **V-17** | **Válvula de retenção e comporta** da rede de esgoto: instrução de manobra, teste e periodicidade; **limpeza de caixa de gordura e de inspeção** e **desentupimento**: método e periodicidade | Cen. 7 | RT / fornecedor | |
| **V-18** | **RTI:** volume e nível mínimo; critério de **qualidade da água de reposição** (origem, tanque, cloro), estagnação e renovação; se se pode receber água pela siamesa | Cen. 6 | RT incêndio | |
| **V-19** | **Flexíveis** (vida útil, critério de troca, registro de bloqueio nos equipamentos dos locatários) e **gatilho de ronda preventiva em chuva forte** (sem citar fonte de alerta) | Cen. 4 | RT / manutenção | |
| **V-20** | **Vigilância reforçada de incêndio:** frequência da ronda (dupla à noite), intervalo de leitura do nível da RTI, período de vigilância reforçada após o retorno, escopo do **trabalho a quente** e quem autoriza o retorno | Cen. 6 | Síndico + RT incêndio | |

## Parte 4 — Prioridade 3: decisões de política (síndico e administração)

| Cód. | Decisão | Por que importa | Resposta / decisão |
|---|---|---|---|
| **Q-01** | **Lista de pessoas habilitadas** por prédio (eletricista, operador de gerador, quem manobra o quê) | Os cenários 5 e 8 só deixam manobrar quem é habilitado | |
| **Q-02** | **Escada de escalonamento** (níveis 1, 2 e 3): quem, em que horário, com que telefone | Todo procedimento começa aqui; vai na ficha | |
| **Q-03** | **Notificações externas:** quando comunicar vigilância sanitária, concessionária, Bombeiros, seguradora, órgão ambiental (regra local + jurídico) | Hoje todos os cenários dizem "decisão do síndico ⚠" | |
| **Q-04** | **Comunicação** ao proprietário e aos locatários: modelos dos cenários servem? Quem assina? | Há modelos de aviso nos cenários | |
| **Q-05** | **Pedido aos fornecedores** (via administradora): aceitar o checklist padrão no relatório mensal e **tentar a cadência semanal** nos 5 itens críticos | É pedido, não exigência; sem isso a ficha não atualiza | |
| **Q-06** | **Contratos de emergência:** caminhão-pipa pré-qualificado, aluguel de gerador e de bomba, estoque de produto químico, fornecedor 24h | Cenários 2, 5 e 8 dependem disso | |
| **Q-07** | **Critério para interditar andares** ou suspender restaurantes | Cen. 2 e 3 deixam em aberto | |
| **Q-08** | **Quem executa e quem assina a autovistoria** (manutenção, administração, síndico) e o que acontece com um item **vermelho** | O checklist manda "escalar ao síndico" | |
| **Q-09** | **Quem valida cada documento** (nome e registro profissional do RT) e **quando revisar** (após incidente, anualmente) | Sem isso o kit continua rascunho | |
| **Q-10** | **Condomínio piloto**: qual, e quem junta o mapeamento (as-built, diagrama do ar-condicionado com o ponto de reposição, esquema da água fria e do reúso) | O piloto testa os ramos do cenário 1 contra um prédio real | |
| **Q-11** | **Galpão logístico com ESFR:** quando **reduzir a carga de incêndio ou restringir a operação do setor** com proteção indisponível; papel do locatário e do contrato | Decisão que só o síndico (com o RT) pode tomar | |
| **Q-12** | **Abono e indenização a locatários afetados** (alagamento, esgoto, água suspensa) e **responsabilidade pela caixa de gordura do locatário** (contrato) | Os Cenários 4 e 7 deixam em aberto | |
| **Q-13** | **Seguro:** prazo e procedimento de comunicação conforme a **apólice** de cada condomínio; o que fotografar e guardar | Os procedimentos mandam ler a apólice e não citam prazo | |
| **Q-14** | **Vazamento antes do hidrômetro ou do cavalete:** responsabilidade da concessionária e contato de emergência na ficha | Cen. 4 | |
| **Q-15** | **Comunicação de crise (Cenário T):** classificação **G1, G2, G3** e quem pode reclassificar; **prazos** de primeiro aviso (G3 em até 15 min, G2 em até 1 h são sugestões), de atualização e de relatório ao proprietário; **quem é o porta-voz** e o substituto | Sem isso os avisos ficam sem dono nem prazo | |
| **Q-16** | **Dados pessoais de saúde** de quem passou mal (LGPD), **política com imprensa e redes sociais**, e **aprovação jurídica dos modelos** 9.1 a 9.11 do Cenário T, inclusive as respostas curtas ("posso lavar as mãos?") que dependem do responsável técnico | Risco legal e de saúde | |

---

## Parte 5 — Referências a confirmar

**Conferidas só em existência e escopo geral** (nenhuma cláusula foi lida; ler o texto antes de virar exigência): **NBR 5626:2020** (sistemas prediais de água fria e quente; cláusulas de proteção contra refluxo, separação atmosférica e reservatório) · **NBR 16783:2019** (fontes alternativas de água não potável; identificação visual do reúso) · **Portaria GM/MS nº 888/2021** (potabilidade; cloro residual e carro-pipa).

**Em dúvida de vigência ou edição (◻):**

| Referência | Dúvida |
|---|---|
| **Resolução Anvisa RE 9/2003** e **NBR 17037:2023** | Fontes secundárias dizem que a RE 9/2003 foi **revogada em julho de 2024** (RDC 886/2024) e que a NBR 17037:2023 passou a ser a referência do PMOC. **O ato revogador não foi confirmado.** A Lei 13.589/2018 ainda manda seguir a RE 9/2003. Afeta torre e PMOC |
| **Lei 13.589/2018** e **Portaria 3.523/1998** | Vigência e exigência de PMOC por faixa de capacidade |
| **NBR 13714**, **NBR 8160**, **NBR 10844**, **NBR 5674**, **NBR 16401** | Qual edição vale (por exemplo NBR 8160: 1999 ou 2020) |
| **NBR 10897:2020** | Sprinklers; aplicação por tipo de risco |
| **NBR 17505** | Armazenamento de inflamáveis, se o produto químico ou o diesel se enquadrar |
| **NR-10, NR-13, NR-33, NR-35** | Versão vigente, escopo no prédio, exigência de vigia e resgate |
| **NBR ISO/IEC 17025** | Escopo da acreditação do laboratório |
| **RDC Anvisa 216/2004** | Aplicabilidade e periodicidade de limpeza de reservatório em restaurantes |
| **CONAMA 430/2011** | Aplicação ao lançamento em rede pública |
| **Instrução Técnica do Corpo de Bombeiros do estado** | Só **IT 22/2025 de São Paulo** foi conferida; cada estado tem a sua |
| **Legionella em água quente sanitária** | **Sem norma brasileira específica encontrada.** ASHRAE 188 e Guideline 12 são referências **estrangeiras** (não são norma brasileira) |
| **Portaria 888/2021** | O **cloro mínimo** (0,2 mg/L livre; 0,5 mg/L no carro-pipa) veio de fonte secundária, e **não se sabe se a Portaria obriga o condomínio abastecido pela concessionária** ou só serve de referência |

## Parte 6 — Pendências conhecidas do próprio material

1. **Os cenários 4, 6, 7 e T foram escritos depois dos outros e ainda não foram conferidos contra os cenários 1 a 3, 5, 8 e 9** quanto a divergências de linguagem ou de limites. Os modelos de comunicação de cada cenário **não foram alinhados** com os modelos 9.1 a 9.11 do Cenário T.
2. **Período do monitoramento reforçado** é diferente entre cenários (ver V-07). O Cenário 7 também sugere 30 dias.
   **Disque-Intoxicação:** o número aparece só no Cenário 1; nos demais ficou "a confirmar na ficha" (V-15). Convém o Cenário 1 ficar igual aos outros.
3. **Cores dos traçadores** (rosa = água gelada; azul = reúso) aparecem como **exemplo do condomínio de referência**; cada ficha define as suas.
4. **Prioridade de atendimento** no Cenário 5 (vida > incêndio > drenagem de subsolo > recalque > esgoto > conforto), incluindo tratar poço de esgoto prestes a transbordar no subsolo como alagamento, é julgamento do projeto e precisa de confirmação (R-08).
5. A coluna **"Cenários"** do catálogo foi preenchida por critério técnico geral e deve ser **revisada na primeira ficha real**.
6. A planilha-mestre e os checklists não foram testados em campo. A **autovistoria** não certifica dispositivo antirretorno nem teste de pressão: isso exige profissional habilitado.
7. **Nenhum procedimento foi testado em simulado.** O passo seguinte natural, depois desta revisão, é um simulado com a ronda no Cenário 1.

## Parte 7 — O que acontece depois da revisão

1. O usuário registra as respostas (A / J / N / ?) e os valores definidos.
2. Os ajustes **J** viram nova versão dos procedimentos (v0.2).
3. Os valores da Parte 3 entram na **ficha** de cada condomínio, no OneDrive.
4. Os procedimentos revisados são impressos (fluxogramas A3 na sala de máquinas e na central) e a ronda é treinada.
5. Um **simulado** testa o Cenário 1, e o piloto valida os ramos contra um prédio real.

---

**Revisor:** nome e registro profissional …………………………… Data ………… / ………… / …………

**Síndico:** …………………………… Data ………… / ………… / …………
