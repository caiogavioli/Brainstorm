# CLAUDE.md

Instruções para qualquer sessão do Claude trabalhando neste repositório.

Idioma de trabalho: **português do Brasil**, em tudo — chat, arquivos, commits.

## O que é

Kit de análise das previsões orçamentárias de condomínios enviadas pelas administradoras. Veja `README.md` para o problema e o escopo, e a spec completa em `caiogavioli/Brainstorm` → `projetos/analise-previsao-orcamentaria.md`.

Há **dois tipos de sessão** aqui:

- **Desenvolvimento** — construir/ajustar o extrator, o verificador e a geração de saída (`src/previsao/`).
- **Análise** — o usuário aponta uma previsão e a sessão produz o parecer, seguindo `prompts/analise.md` e `prompts/parecer.md`.

## Regras duras

1. **Dado de condomínio nunca entra no git.** Nem planilha, nem apresentação, nem PDF, nem parecer gerado, nem valor copiado para dentro de teste ou documentação. O `.gitignore` já bloqueia `entrada/`, `saida/`, `*.xlsx`, `*.pptx`, `*.pdf`, `*.docx`, `config.local.toml`. Para teste, usar **arquivos sintéticos** criados no próprio teste.
2. **A IA não faz conta.** Todo número que aparece no parecer vem do verificador (`achados.json`). Se uma conta precisa ser conferida e o verificador não cobre, o caminho é **adicionar a regra ao verificador com teste**, não calcular de cabeça.
3. **Silêncio é proibido.** Arquivo ou aba que o extrator não conseguiu ler vira aviso explícito no parecer. Nunca "analisado" sem dizer o que ficou de fora.
4. **O verificador é determinístico.** Mesmo arquivo + mesma tabela de índices ⇒ mesmos achados. O anexo grava o hash SHA-256 do arquivo, a versão de `dados/indices.csv` e a data da execução.
5. **Tabela de índices vencida = recusa.** Se a data-base de `dados/indices.csv` for anterior à exigida para o ciclo, o verificador **não roda** e diz o que falta. Nunca conferir contra número velho.
6. **Reajuste acima do índice, sem contrato = pedido de esclarecimento**, não erro. O usuário não tem os contratos.
7. **O que não é verificável, o parecer diz que não é.** Em especial: (a) o "realizado do ano anterior" vem colado na planilha da administradora, sem fonte independente; (b) o valor do índice da categoria (dissídio) é informado pela administradora. O parecer confere a **conta**, não esses dois números.
8. **Conclusão do parecer é binária:** "pode ser aprovado" ou "não pode ser aprovado". Sempre listando o que a condiciona. Regra inicial em `prompts/parecer.md`, a calibrar no piloto.
9. Não criar repositório, branch de release nem Pull Request sem pedido explícito do usuário.

## Como o usuário trabalha

- Roda no **Windows**, com a pasta do OneDrive sincronizada. Usar `pathlib`, sem caminho com barra fixa.
- Só o usuário opera o Claude Code. A equipe (3 pessoas) lê parecer e anexo no OneDrive; não roda nada.
- Não usa celular para isso.
- Entrega por email ou presencial, para o **proprietário**. Parecer em Word, 1–2 páginas.

## Fluxo de análise (sessão de análise)

1. Ler `config.local.toml` para achar a pasta do condomínio/ano.
2. Rodar a extração; ler os avisos.
3. Se o condomínio não tem `mapeamento.yaml`, propor um e **pedir aprovação do usuário** antes de seguir.
4. Rodar o verificador; ler `achados.json`.
5. Classificar cada achado: **erro de conta** / **pedido de esclarecimento** / **observação**. Avaliar razoabilidade das variações (linha nova, mudança de escopo, variação grande sem justificativa).
6. Redigir o parecer (`prompts/parecer.md`) e gerar `parecer.docx` + `achados.xlsx` na pasta do condomínio.
7. Mostrar ao usuário um resumo e esperar o aval **antes** de qualquer envio.

## Piloto

Atrium Santo André (setor Office), PO 2027, Innova, recebida em 29/09/2026. Casos de erro já vistos à mão em `docs/casos-piloto-atrium-2027.md` — viram testes do verificador **depois de confirmados pelo script**.

## Primeiras tarefas de desenvolvimento

1. Extrator de `.xlsx` (fórmula e valor da mesma célula, via `openpyxl`) com avisos.
2. Verificador com as regras C1–C9 do `docs/casos-piloto-atrium-2027.md`, cada uma com teste.
3. Gerador de `achados.xlsx` e de `parecer.docx`.
4. `dados/indices.csv` preenchido e a checagem de vencimento.
5. Extratores de `.pptx` e PDF.

## Commits

Mensagem em português, imperativo, uma linha de assunto e corpo quando houver decisão.
