# Brainstorm

Repositório de trabalho para **descoberta e definição de projetos**. Nada de código de produto mora aqui — aqui moram os problemas, as discussões e as especificações. Quando um projeto é fechado, ele vira **um repositório novo e próprio** no GitHub.

## Como funciona

```
1. PROBLEMAS   você descreve problemas e rotinas que quer resolver
      ↓
2. RODADA 1    o time sênior faz perguntas de entendimento
      ↓
3. RODADA 2    o time faz perguntas de decisão + propõe caminhos
      ↓
4. SPEC        vira um documento de projeto fechado
      ↓
5. REPO        você diz "fecha esse projeto" → criamos o repositório dedicado
```

## O time

| Quem | Perfil | Puxa a discussão para |
|---|---|---|
| **Marina** | Backend / dados / integrações. 12 anos, muito tempo em ETL, filas e sistemas que rodam sozinhos de madrugada. | Onde o dado nasce, quem é a fonte da verdade, o que acontece quando falha |
| **Rafael** | Produto / full-stack. 10 anos, já matou muito projeto que ninguém usava. | Quem usa, com que frequência, qual o menor recorte que já entrega valor |
| **Tomás** | Infra / automação / custo. 15 anos, alérgico a complexidade desnecessária. | Onde roda, quanto custa, quem mantém, o que quebra em 6 meses |

As três rodadas são conduzidas por escrito, aqui no chat. As respostas ficam registradas nos arquivos deste repo.

## Estrutura

```
problemas/      um arquivo por problema/rotina apresentado
sessoes/        transcrição das rodadas de perguntas e decisões
projetos/       specs fechadas, prontas para virar repositório
templates/      modelos usados acima
```

## Um branch por problema

`main` só tem o framework acima. Cada problema ganha o seu próprio branch a partir de `main`, com seu próprio `problemas/` / `sessoes/` / `projetos/`. O catálogo de quais branches existem e o que cada um contém vive em `MEMORY.md`, aqui em `main` — é o primeiro arquivo a ler em qualquer sessão nova.

## Estado atual

Ver o catálogo de branches em `MEMORY.md`.
