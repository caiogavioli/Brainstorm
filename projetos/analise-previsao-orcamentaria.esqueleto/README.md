# analise-previsao-orcamentaria

Kit de análise e parecer das **previsões orçamentárias de condomínios** enviadas pelas administradoras.

## Problema

As administradoras mandam a previsão em Excel, apresentação e outros documentos, num formato diferente por administradora e por condomínio. É preciso conferir linha a linha — reajustes, índices, somas, fórmulas, comparação com o ano anterior — e emitir um parecer ao proprietário. São ~30 condomínios por ciclo, e cada um leva dias. O erro que mais importa é **valor calculado errado**.

## O que este repositório faz

1. **Extrai** as tabelas dos arquivos da administradora (`.xlsx`, `.pptx`, PDF com texto) e avisa o que não conseguiu ler.
2. **Verifica** de forma determinística (sem IA): recalcula reajustes, somas, totais, custo por m², fundos, consistência entre abas, variação contra o ano anterior e percentuais citados nas observações.
3. **Interpreta e redige** (IA, guiada por `prompts/`): classifica os achados em erro de conta, pedido de esclarecimento ou observação, e escreve o parecer.
4. **Entrega** um parecer curto em Word (conclusão: *pode ser aprovado* / *não pode ser aprovado*) e um anexo de achados em Excel.

## Fora do escopo da v1

App web, banco, servidor; conferir o valor do índice da categoria (quem informa é a administradora); conferir o realizado do ano anterior (vem colado na planilha); cruzar contratos; OCR; controle de status das previsões.

## Como se usa

O usuário roda o Claude Code **no próprio Windows**, com este repositório clonado e a pasta do OneDrive sincronizada. Os arquivos das administradoras ficam no OneDrive, **nunca neste repositório**. As saídas (parecer e anexo) voltam para a pasta do OneDrive do condomínio, onde a equipe lê.

```
OneDrive/<condominio>/<ano>/   arquivos da administradora, mapeamento.yaml, saídas
```

## Estrutura

```
.
├── CLAUDE.md                contexto para a sessão de desenvolvimento e de análise
├── README.md
├── pyproject.toml
├── config.exemplo.toml      copiar para config.local.toml (ignorado pelo git)
├── dados/
│   └── indices.csv          IPCA, IGP-M: valor, fonte, data-base (mantida pelo time)
├── prompts/
│   ├── analise.md           instruções de análise
│   └── parecer.md           regras de redação do parecer e da conclusão
├── src/previsao/            extrator, verificador, geração de saída
├── tests/                   os casos do piloto viram teste de regressão
└── docs/
    └── casos-piloto-atrium-2027.md
```

## Estado

Esqueleto. Nenhum código de produto ainda — o desenvolvimento do extrator e do verificador começa pelo piloto (Atrium Santo André, PO 2027). A spec completa mora no repositório de descoberta: `caiogavioli/Brainstorm`, `projetos/analise-previsao-orcamentaria.md`.
