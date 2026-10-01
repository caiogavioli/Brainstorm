# analise-previsao-orcamentaria

**Origem:** P-001 (branch `claude/budget-forecast-analysis-ujaw4z`)
**Status:** fechado em 2026-10-01 — esqueleto publicado; desenvolvimento segue no repositório novo
**Repositório:** [caiogavioli/analise-previsao-orcamentaria](https://github.com/caiogavioli/analise-previsao-orcamentaria) (privado), commit inicial `9d6ebca`

## Problema que resolve

As administradoras mandam a previsão orçamentária de cada condomínio em Excel, apresentação e outros documentos, num formato diferente por administradora e por condomínio. O usuário precisa conferir tudo linha a linha, mostrar ao condomínio o que está errado para ele corrigir e, quando estiver tudo certo, emitir um parecer ao proprietário dizendo que a previsão pode ser aprovada. São ~30 condomínios por ciclo, a partir do 2º trimestre, e cada um leva "alguns dias". O erro que mais importa é **valor calculado errado** contra o ano anterior e contra o índice de reajuste.

## Escopo da v1

Entra:
- Extração das tabelas de planilhas (`.xlsx`), apresentações (`.pptx`) e PDFs com texto, **avisando** o que não conseguiu ler (imagem/escaneado) em vez de ignorar em silêncio.
- **Verificador determinístico** que recalcula e confere (ver "Arquitetura"): reajuste de cada linha, % declarado vs. % efetivo, somas e subtotais, total anual, custo por m² (CMQ), fundos, consistência entre abas, **apresentação × planilha** (total, CMQ, fundos, % de reajuste, área), % ou base digitados dentro de fórmula, variação vs. ano anterior, percentuais citados no texto das observações, erros de planilha (`#REF!`, rótulo desalinhado de valor).
- Mapeamento de contas para categorias comuns, **uma vez por condomínio**, aprovado pelo usuário e reaproveitado no ano seguinte.
- Tabela de índices (IPCA, IGP-M) mantida pelo time, com valor, fonte e data-base.
- Prompt de análise: a IA interpreta os achados do verificador, avalia razoabilidade (variação grande sem justificativa, linha nova, mudança de escopo) e redige.
- Saída em **dois documentos, nesta ordem** (decisão de 2026-10-01):
  1. **Relatório de apontamentos** ao **condomínio e à administradora**. Lista **todos os problemas** (técnicos, numéricos e conceituais) numa **matriz de riscos** (crítico / moderado / baixo, por impacto × certeza), com sugestão de correção e ação (corrigir, esclarecer, enviar). Abre com um **resumo dos itens a corrigir** (índice de uma página: ID, criticidade, item, onde, ação). Inclui "o que foi conferido e está correto" e os limites da análise. Sai como **rascunho com anexo interno** (critérios, perguntas, checklist Concordo/Ajustar/Retirar por apontamento); só depois da validação do usuário vira a versão ao condomínio. **Repete a cada reapresentação.**
  2. **Parecer final ao proprietário** (Word, 1–2 páginas), só com **zero críticos abertos** e moderados corrigidos ou justificados por escrito. Conclusão binária: "**pode ser aprovada**" ou "**não pode ser aprovada na forma apresentada**".
  Os dois acompanham um **anexo de achados** (Excel): linha, aba/célula, valor declarado, valor recalculado, diferença, regra, criticidade.
- **Questionário à administradora** (planilha, sai junto com o relatório): uma linha por apontamento, com perguntas específicas e respondíveis com um fato ou documento. A administradora preenche reconhece? (sim/não/parcialmente), resposta, o que será feito e documento de suporte; o usuário preenche depois **Concordo / Não concordo**. A resposta sozinha **não fecha** apontamento: um "Esclarecer" só fecha com o *Concordo* do usuário.
- **Ciclo de rodadas:** cada apontamento tem uma **chave estável** e, a cada reapresentação (Vs.02, Vs.03…), é marcado como resolvido, persistente, parcial ou novo. Toda reapresentação é conferida por inteiro.
- Reajuste acima do índice, sem contrato à mão, sai como **pedido de esclarecimento** à administradora, não como erro.
- Reprodutibilidade: o anexo grava o hash do arquivo analisado, a versão da tabela de índices e a data da execução. Mesmo arquivo, mesmos achados.

Não entra (por decisão consciente):
- App web, banco de dados, servidor, fila, qualquer coisa que rode sem o usuário.
- Conferir o **valor** do índice da categoria (dissídio): quem informa é a própria administradora, nos arquivos. A v1 só confere se a **conta** com o índice informado está certa.
- Conferir o "realizado do ano anterior" contra fonte independente: não existe (vem colado na planilha da administradora). Os documentos declaram isso como **não verificável**.
- Cruzar contratos (o usuário não os tem à mão).
- OCR de PDF escaneado.
- Controle/acompanhamento de status das previsões (o usuário não tem hoje e não pediu).
- Dados de condomínio dentro do repositório.

## Usuários e uso

- **Quem opera:** o usuário, no computador (Windows). Uso em celular está fora do escopo.
- **Quem lê as saídas:** a equipe de 4 pessoas, abrindo os relatórios e o anexo na pasta do OneDrive. **As outras 3 não têm Claude Code pago**, então não rodam a análise. Esta é a diferença em relação ao D8 original (ver tabela de decisões).
- **Quando:** a partir do 2º trimestre, ~30 previsões por ano, sendo que cada previsão pode chegar em mais de uma versão (ex.: o piloto traz `Vs.01_Rev.Cleber_Rev.Joao` no nome).
- **Quem recebe:** o relatório de apontamentos vai ao condomínio e à administradora; o parecer final vai ao proprietário, por email ou apresentação presencial.

## Arquitetura escolhida

Tudo em texto, sem serviço no meio:

```
OneDrive (pasta sincronizada no Windows do usuário)
  <condominio>/<ano>/  ← arquivos da administradora, mapeamento.yaml, saídas
        │
        ▼
1. EXTRAÇÃO   script lê .xlsx duas vezes (fórmulas e valores), .pptx e PDF → tabelas normalizadas
        │      (o que não consegue ler vira aviso, não silêncio)
        ▼
2. MAPEAMENTO contas do condomínio → categorias comuns; arquivo por condomínio, na pasta do OneDrive
        │
        ▼
3. VERIFICADOR script determinístico (sem IA) → achados.json + achados.xlsx
        │      usa dados/indices.csv (tabela do time, versionada)
        ▼
4. IA         lê achados + tabelas + prompts/analise.md → classifica (erro de conta /
        │      pedido de esclarecimento / observação), avalia razoabilidade, redige
        ▼
5. SAÍDA      relatorio-apontamentos-rodada-N.docx (rascunho + anexo interno → validação do usuário → versão ao condomínio)
                + achados.xlsx; reapresentação volta ao passo 1
                parecer-final.docx (ao proprietário) só com zero críticos abertos
```

**Modo de execução recomendado: local.** O usuário clona o repositório no Windows e roda o Claude Code lá. Os arquivos são lidos direto da pasta do OneDrive sincronizada, sem upload e sem limite prático de 50 MB, e o script enxerga as fórmulas. A caminho de cada condomínio fica em `config.local.toml` (ignorado pelo git).

**Modo alternativo: sessão web + conector Microsoft 365.** Testado no piloto: o conector lê o `.xlsx` anexo do email e devolve **texto com valores, sem fórmulas**. Serve para uma leitura rápida, **não** para auditar fórmula. Fica como plano B.

**Dados de condomínio nunca entram no git.** O `.gitignore` bloqueia `entrada/`, `saida/`, `*.xlsx`, `*.pptx`, `*.pdf`, `*.docx` e `config.local.toml`. A IA vê o conteúdo que o usuário mandar analisar; isso é parte do uso e foi aceito.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Linguagem | Python 3.12 | Ecossistema maduro para Excel/PPT/PDF; script de linha de comando, sem servidor |
| Excel | `openpyxl` | Lê fórmula e valor em cache da mesma célula; é o que permite achar fórmula quebrada ou valor colado |
| PowerPoint | `python-pptx` | Texto e tabelas de slide sem depender de Office instalado |
| PDF | `pdfplumber` | Texto e tabelas; detecta página sem texto para avisar |
| Word (saída) | `python-docx` | Parecer em `.docx`, formato que o usuário já envia/apresenta |
| Excel (saída) | `openpyxl` | Anexo de achados |
| Mapeamento | YAML (`PyYAML`) | Legível e editável à mão pelo usuário |
| Índices | CSV versionado no repositório | Tabela do time, sem dado sensível, com histórico no git |
| Testes | `pytest` | Os casos do piloto viram teste de regressão do verificador |
| IA | Claude Code (só o usuário) | Interpretação e redação; a conta fica fora da IA |
| Onde roda | PC Windows do usuário | Zero custo de infra; sem peça móvel |

Custo recorrente: nenhum além da assinatura do Claude Code que o usuário já usa.

## Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---|---|---|
| D1 — Script determinístico recalcula; a IA interpreta e redige | A IA ler as planilhas e conferir | IA lê mal planilha grande e erra aritmética; mesmo arquivo pode render dois resultados. A conta é a mesma sempre que reprocessar e é o que se mostra à administradora |
| D2 — Tabela de índices mantida pelo time (valor, fonte, data-base) | Buscar o índice em fonte pública a cada execução (proposta do Tomás: gravar valor e data no relatório) | Parecer de hoje tem de ser refazível em seis meses com o mesmo número. Risco aceito: tabela envelhece; mitigado fazendo o verificador **recusar rodar** com tabela vencida |
| D3 — Mapeamento de contas uma vez por condomínio, aprovado pelo usuário | Mapear de novo a cada previsão | No ano seguinte a comparação não recomeça do zero; mapeamento é onde erro silencioso nasce, vale o usuário ver uma vez |
| D4 (revisado em 2026-10-01) — **Dois documentos**: relatório de apontamentos (ao condomínio, com matriz de riscos) primeiro, parecer final (ao proprietário, conclusão binária) depois | Um único parecer ao proprietário | O usuário precisa mostrar primeiro ao condomínio que a análise foi feita e o que está errado; só depois de corrigido faz sentido dizer ao proprietário que está tudo certo. O anexo de achados é o que se abre quando a administradora contestar |
| Criticidade por **impacto**, em três níveis: crítico (altera o número deliberado/rateado ou ≥ 1% do total anual), moderado (0,1% a 1% ou compromete justificativa), baixo | Dois níveis; ou classificar por gosto | Com dois níveis o moderado vira crítico e enfraquece o relatório, ou vira não crítico e passa batido. Limites de 1% e 0,1% são ponto de partida a calibrar. Ver `docs/matriz-de-risco.md` |
| **Questionário em planilha** à administradora, com listas suspensas e colunas separadas para quem responde e para o analista | Perguntas soltas no corpo do relatório ou email | Dá ao usuário base objetiva para o Concordo / Não concordo; a planilha preenchida volta como insumo da rodada seguinte, sem redigitar. A resposta sozinha não fecha item |
| Relatório de apontamentos **sempre validado pelo usuário antes do envio** (anexo interno com Concordo/Ajustar/Retirar) | Gerar e enviar direto | O relatório acusa erro de terceiro: o usuário precisa poder retirar ou ajustar cada apontamento |
| D5 — Piloto com casos reais, **com o script desde o dia 1** | Prompt primeiro, script só depois do piloto (proposta do Rafael) | Decisão do usuário: parecer com conta errada é o custo mais temido, e o script é barato |
| D6 — Reajuste acima do índice sem contrato = pedido de esclarecimento | Tratar como erro | Sem contrato, afirmar erro é chute |
| D7 — Arquivos no OneDrive, fora do GitHub | Google Drive; subir o arquivo na conversa; GitHub | Já paga Microsoft 365; dado de terceiro fora do git |
| D8 (ajustado em 2026-10-01) — **Só o usuário opera**; a equipe consome as saídas no OneDrive | Cada uma das 4 pessoas abrir uma sessão de Claude Code | As outras 3 não têm Claude Code pago. Ver risco 1 |
| D9 — O script extrai só as tabelas; arquivo grande não vai inteiro para a conversa | Passar o arquivo inteiro à IA | Custo, velocidade e precisão |
| Execução **local** (Windows + OneDrive sincronizado) | Sessão web com conector | O conector devolve texto sem fórmulas; local enxerga fórmula e não tem limite de upload |
| Saída em Word + Excel | Markdown, PDF ou apresentação | O usuário já envia por email ou apresenta; Word se edita antes de enviar. PDF pode ser exportado depois |
| Sem OCR na v1 | Incluir OCR | Peça móvel a mais; o extrator avisa o arquivo ilegível e o usuário decide |

## Casos reais do piloto

Previsão **PO 2027 do Atrium Santo André (setor Office), Innova**, recebida em 29/09/2026: planilha de 9 abas e apresentação de 22 slides. Conferida em 2026-10-01 **no arquivo real, com fórmulas**, por script descartável (a leitura anterior, por conector, só tinha texto).

**Resultado:** dos 9 casos levantados à mão, **8 se confirmaram** e 1 não é verificável no arquivo ("Realizado 2026" sem rótulo de período, que segue como pedido de esclarecimento). A conferência por fórmula achou **mais 8**, entre eles a divergência **apresentação × planilha**: total mensal ~0,14% acima, CMQ 16,22 × 16,20, reajuste 9,25% × 9,10%, e área privativa citada de dois jeitos na mesma apresentação.

Os casos mais relevantes, em uma linha cada (detalhe com endereço de célula em `docs/casos-piloto-atrium-2027.md` do repositório novo):

1. **Premissa × aplicado:** Limpeza com premissa de 9% e linha usando 8%, digitado dentro da fórmula.
2. **% declarado × efetivo:** Bombas/Motores declara 5% e a fórmula aplica 6%; Materiais Hidráulicos declara 0% e sobe 5%.
3. **% de grupo é média simples** das linhas, não a variação do grupo.
4. **Texto × número:** observação cita +14,3%, a planilha calcula +7,9%.
5. **Área privativa divergente** (17.115,66 × 17.155,66 m²), inclusive dentro da própria apresentação.
6. **`#REF!`** e referências para linha errada em "Principais Alterações" (bloco de modelo antigo).
7. **"Saving" que só existe contra a previsão do ano anterior**; contra o realizado a variação é positiva.
8. **Apresentação × planilha** divergem em total, CMQ e % de reajuste.
9. **Portaria +13,4%** com observação "dentro das premissas" (8%).

**Passou limpo** (o verificador não pode acusar): total anual = soma dos meses nas 56 linhas, 14 grupos fecham com os itens, fundos e CMQ conferem com as premissas.

**Para a decisão:** o teste mostrou que o piloto é um caso em que o verificador teria achado coisa relevante, e que parte dos achados (comparar apresentação com planilha) só aparece se o extrator de `.pptx` entrar na v1.

## Riscos

1. **Operador único.** Se o usuário não puder rodar, a análise para; as outras 3 só leem. É o preço de a equipe não ter Claude Code. Mitigação v2: o verificador é um script independente de IA — pode ser empacotado para as 3 rodarem só a parte determinística.
2. **Layout de cada administradora.** O extrator é heurístico; a primeira previsão de cada condomínio exige conferir o mapeamento. O piloto mede o quanto isso custa.
3. **Fórmula não visível no modo web.** Só o modo local audita fórmulas. Se o usuário acabar usando só o web, perde essa classe de achado.
4. **Tabela de índices velha.** O verificador recusa rodar com data-base vencida, em vez de conferir contra número velho.
5. **Critérios mal calibrados.** Os cortes de 1% e 0,1% do total anual, e a regra "divergência no número deliberado é sempre crítica", são ponto de partida, **a calibrar no piloto com o usuário**. O parecer final só sai com zero críticos abertos; na dúvida, não pode ser aprovada.
6. **Dado de terceiro.** Arquivos ficam no OneDrive e fora do git; o conteúdo analisado passa pela IA.
7. **Tabelas como imagem nos slides.** No piloto, os slides 8 e 10–14 são figuras de tabelas. Decisão do usuário (2026-10-01): isso é **apontamento crítico**, não baixo. A tabela colada como figura pode ter vindo de outra aba ou versão, ou ter sido editada à mão, e só dá para conferir com o Excel. A administradora envia as tabelas em Excel (ou o arquivo-fonte) com a aba e a versão de origem. Vale para qualquer conteúdo apresentado que a extração não consiga ler.
8. **Realizado não conferível.** Nenhuma regra pode validar o realizado; os documentos declaram a limitação em toda previsão.
9. **Correção introduz erro novo.** A reapresentação pode consertar o apontado e quebrar outra coisa. Por isso toda rodada reconfere tudo, não só a lista anterior.
10. **Relatório ao condomínio é peça de atrito.** Tom factual, sem acusação, com "o que foi conferido e está correto" para mostrar que a análise foi completa. O usuário valida cada apontamento antes do envio.

## Critério de pronto (v1)

- [ ] O piloto (Atrium Santo André, PO 2027) roda de ponta a ponta no Windows do usuário, lendo do OneDrive sincronizado
- [ ] O verificador reproduz, com teste sintético, os casos confirmados do piloto **e não acusa** o que passou limpo
- [ ] `achados.xlsx` cobre cada achado com aba/célula, valor declarado, valor recalculado e regra
- [ ] O gerador produz o **questionário** (com listas suspensas) e o leitor da planilha preenchida alimenta a rodada seguinte
- [ ] O usuário valida o rascunho do **relatório de apontamentos** do piloto (matriz, lista, anexo interno) e o gerador reproduz o formato
- [ ] A **comparação entre versões** funciona: dada a Vs.02, cada apontamento da Vs.01 sai como resolvido, persistente, parcial ou novo, pela chave estável
- [ ] O usuário aprova o modelo de **parecer final** (1–2 páginas, conclusão binária) feito a partir do piloto
- [ ] O mesmo arquivo reprocessado gera achados idênticos (hash do arquivo e versão dos índices no cabeçalho)
- [ ] Rodou em pelo menos 3 condomínios, de pelo menos 2 administradoras diferentes, com o mapeamento salvo
- [ ] O verificador recusa rodar com tabela de índices vencida
- [ ] Arquivo ilegível (imagem/escaneado) gera aviso explícito, nunca silêncio
- [ ] Tempo por previsão medido nos 3 casos e comparado com o "alguns dias" de hoje (meta a fixar após o piloto)
- [ ] `pytest` passa; `README` explica à equipe onde ficam os relatórios e o anexo

## Fora do escopo mas mapeado (v2+)

- Empacotar o verificador para as 3 pessoas sem Claude Code rodarem a parte determinística
- OCR para PDF escaneado
- Cruzar contratos de segurança e limpeza para validar cláusula de reajuste
- Painel/controle de status das ~30 previsões por ciclo
- Busca automática de IPCA/IGP-M como complemento à tabela do time (proposta do Tomás)

## Como o fechamento aconteceu

- A criação do repositório pela integração do GitHub voltou **403** (sem `Administration: write`, limitação já registrada em `MEMORY.md`). O usuário criou o repositório vazio e privado à mão e o esqueleto foi empurrado em seguida.
- Visibilidade: privado, padrão do `CLAUDE.md`. O repositório não guarda dados de condomínio.
- Nesta spec os "Casos reais do piloto" são resumos; o detalhe vive em `docs/casos-piloto-atrium-2027.md` do repositório novo.
