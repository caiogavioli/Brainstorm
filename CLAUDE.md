# CLAUDE.md — Projeto Brainstorm

Este arquivo é lido automaticamente pelo Claude Code no início de cada sessão.
Ele define o contexto, as regras e os padrões do projeto.

---

## 1. Contexto humano (leia isto antes de tudo)

O dono do projeto **não é programador**. Isso não é um detalhe — é a restrição
mais importante deste repositório e afeta cada decisão técnica.

**Regras de comunicação, obrigatórias:**

- Responda **sempre em português do Brasil**.
- Explique **o que** foi feito e **por quê**, em linguagem comum. Nada de jargão
  sem tradução. Se usar um termo técnico, defina-o na primeira vez.
- Nunca peça para o usuário "só ajustar essa função" ou "corrigir o import".
  Ele não vai conseguir. **Você** faz a alteração.
- Quando precisar que ele execute algo, dê o comando **completo, copiável**, e
  diga o que deve aparecer na tela se der certo.
- Ao terminar uma tarefa, sempre informe: **o que ele consegue ver ou fazer
  agora que não conseguia antes.**
- Se algo falhar, mostre o erro real. Não esconda e não minimize.

**Regras de decisão técnica:**

- Prefira o **chato e estável** ao moderno e frágil. Sem dependências exóticas.
- Prefira **menos peças**. Cada biblioteca nova é algo que ele não vai saber
  consertar sozinho.
- Se houver duas soluções e a mais simples resolver 90% do caso, use a simples
  e registre a limitação no `roadmap.md`.
- Escolhas arquiteturais relevantes: apresente as opções ao usuário com
  prós/contras em linguagem simples antes de decidir.

---

## 2. O que é o projeto

Um sistema web interno de **análise e relatórios**.

| Aspecto | Definição |
|---|---|
| Objetivo | Reunir dados em um banco e gerar relatórios e gráficos |
| Usuários | 2 a 10 pessoas, com login individual |
| Permissões | Todos iguais — todos veem e editam tudo (v1) |
| Fontes de dados | (a) formulários preenchidos pela equipe, (b) API externa com chave de acesso |
| Interface | Navegador (páginas geradas no servidor) |
| Hospedagem | Nuvem, acessível por link com HTTPS |
| Volume | Desconhecido — arquitetura deve suportar crescimento |
| Primeira entrega | A tela de relatório com gráfico |

**Ainda não definido:** o *domínio* dos dados (qual assunto está sendo
analisado). Ver "Decisões pendentes" no `roadmap.md`. Até que isso seja
respondido, o modelo de dados usa entidades de exemplo claramente marcadas
como provisórias.

---

## 3. Stack (decidido — não trocar sem discutir com o usuário)

| Camada | Tecnologia | Por que foi escolhida |
|---|---|---|
| Linguagem | Python 3.12 | Pedido do usuário; ecossistema de dados maduro |
| Gerenciador de pacotes | `uv` | Rápido, um arquivo só (`pyproject.toml`), sem venv na mão |
| Banco de dados | PostgreSQL 16 | Vários usuários simultâneos; volume desconhecido |
| Acesso ao banco | SQLAlchemy 2.0 (estilo declarativo, tipado) | Evita SQL concatenado e SQL injection |
| Migrações | Alembic | Alterar tabelas sem perder dados |
| Servidor web | FastAPI + Uvicorn | Valida dados sozinho; documentação automática |
| Telas | Jinja2 + HTMX | Interatividade sem projeto JavaScript separado |
| Gráficos | Plotly | Gráficos interativos direto no HTML |
| Autenticação | Cookie de sessão assinado + Argon2 (via `passlib`) | Simples e seguro para 2-10 pessoas |
| Cliente HTTP | `httpx` | Chamadas à API externa, com timeout e retry |
| Configuração | `pydantic-settings` lendo `.env` | Segredos fora do código |
| Testes | `pytest` + `pytest-asyncio` | Rede de segurança para quem não lê código |
| Formatação/lint | `ruff` (format + check) | Uma ferramenta só |
| Ambiente local | Docker Compose | Um comando sobe banco + aplicação |
| Produção | Plataforma gerenciada (Render ou Railway), mesmo Dockerfile | Sem administrar servidor Linux |

**Explicitamente fora de escopo:** React/Vue/Next, Celery/Redis, Kubernetes,
microsserviços, GraphQL, ORM alternativo. Se algum desses parecer necessário,
**pare e discuta com o usuário** antes de introduzir.

---

## 4. Estrutura de pastas

```
Brainstorm/
├── CLAUDE.md                  # este arquivo
├── roadmap.md                 # plano de trabalho por fases
├── docker-compose.yml         # sobe Postgres + app localmente
├── Dockerfile                 # imagem usada em dev e em produção
├── .env.example               # modelo de configuração (versionado)
├── .env                       # configuração real com segredos (NUNCA versionar)
├── pyproject.toml             # dependências
├── alembic.ini                # config das migrações
├── migrations/                # histórico de alterações do banco
├── src/app/
│   ├── main.py                # ponto de entrada da aplicação
│   ├── config.py              # leitura das variáveis de ambiente
│   ├── db.py                  # conexão e sessão do banco
│   ├── models/                # tabelas (SQLAlchemy)
│   │   ├── base.py
│   │   ├── raw.py             # CAMADA BRUTA — dados crus da API
│   │   └── core.py            # CAMADA DE TRABALHO — dados tratados
│   ├── schemas/               # validação de entrada/saída (Pydantic)
│   ├── services/              # regras de negócio (cálculos, agregações)
│   ├── repositories/          # consultas ao banco
│   ├── routers/               # endereços das páginas e da API
│   ├── ingest/                # coleta da API externa
│   ├── templates/             # HTML (Jinja2)
│   └── static/                # CSS e imagens
└── tests/                     # testes automatizados
```

---

## 5. Regra de ouro do banco de dados: duas camadas

Esta é a decisão de arquitetura mais importante do projeto. **Não misture as
duas camadas.**

**Camada bruta (`models/raw.py`)** — o que chegou da API externa, sem tratamento:

- Guarda a resposta original em coluna `JSONB`.
- Colunas de controle: `fonte`, `coletado_em`, `hash_conteudo`, `status`.
- **Nunca é editada nem apagada.** É o registro histórico.
- Existe para que, quando a API externa mudar de formato (e ela vai mudar),
  seja possível **reprocessar** em vez de perder dados.

**Camada de trabalho (`models/core.py`)** — os dados tratados que alimentam
relatórios e formulários:

- Colunas tipadas de verdade (data, número, texto), com chaves estrangeiras.
- Alimentada por duas vias: transformação da camada bruta **ou** formulário
  preenchido por uma pessoa.
- Toda tabela desta camada tem: `id`, `criado_em`, `atualizado_em`,
  `criado_por_id` (referência ao usuário), `origem` (`'manual'` ou `'api'`).

**Motivo de existir `origem`:** com duas fontes alimentando as mesmas tabelas,
é preciso saber a procedência de cada linha para resolver conflitos e auditar
números que pareçam errados.

---

## 6. Convenções de código

- **Idioma:** nomes de tabelas, colunas e campos em **português**
  (`data_lancamento`, `valor_total`). Palavras-chave e nomes de bibliotecas
  ficam em inglês, naturalmente. Consistência importa mais que a escolha.
- **Tabelas:** plural, snake_case (`lancamentos`, `usuarios`).
- **Type hints obrigatórios** em toda função. `ruff` reclama se faltar.
- **Docstring curta em português** em toda função pública, dizendo o que ela
  faz em uma frase.
- **Camadas:** `routers` → `services` → `repositories` → `models`.
  Um router **nunca** faz consulta ao banco diretamente.
- **Nada de SQL em string concatenada.** Sempre SQLAlchemy ou parâmetros
  vinculados.
- **Datas sempre em UTC no banco**, convertidas para o fuso do usuário só na
  hora de exibir.
- **Dinheiro sempre em `Numeric`/`Decimal`**, nunca `float`.
- Funções acima de ~40 linhas devem ser quebradas.

---

## 7. Segurança (não negociável)

- **`.env` nunca vai para o Git.** Já está no `.gitignore`. Se você perceber
  que uma chave foi commitada, **avise imediatamente** e trate a chave como
  comprometida.
- Chaves de API e senha do banco vivem **apenas** em variáveis de ambiente,
  lidas por `config.py`. Nunca escritas dentro de um arquivo `.py`.
- Senhas de usuário são gravadas **apenas como hash Argon2**. Nunca em texto.
- Cookie de sessão: `httponly=True`, `secure=True` em produção, `samesite=lax`.
- Todo formulário passa por validação Pydantic antes de tocar o banco.
- Nunca exiba mensagem de erro bruta do banco na tela do usuário final —
  registre no log e mostre uma mensagem amigável.
- Não gere migração que apague coluna ou tabela sem avisar o usuário e
  confirmar. Perda de dados é irreversível.

---

## 8. Comandos do dia a dia

Todos assumem que o usuário está na pasta do projeto.

```bash
# Subir tudo (banco + aplicação). Depois abrir http://localhost:8000
docker compose up

# Parar tudo
docker compose down

# Criar uma migração após alterar as tabelas
docker compose run --rm app alembic revision --autogenerate -m "descrição"

# Aplicar as migrações no banco
docker compose run --rm app alembic upgrade head

# Rodar os testes
docker compose run --rm app pytest

# Formatar e verificar o código
docker compose run --rm app ruff format . && docker compose run --rm app ruff check --fix .

# Popular o banco com dados de exemplo
docker compose run --rm app python -m app.seed
```

> Se algum destes comandos ainda não existir, é porque a fase correspondente do
> `roadmap.md` não foi concluída. Não invente comando que não funciona.

---

## 9. Como trabalhar neste repositório

**Antes de começar qualquer tarefa:**

1. Leia o `roadmap.md` e identifique em que fase o projeto está.
2. Trabalhe **apenas** na fase atual. Não adiante fases futuras — o roadmap
   foi ordenado para o usuário ver valor cedo.
3. Se a tarefa pedida pertence a outra fase, diga isso e pergunte se ele quer
   reordenar.

**Ao terminar uma tarefa:**

1. Rode `ruff` e `pytest`. Só declare pronto se ambos passarem.
2. Marque o item correspondente no `roadmap.md` como concluído (`[x]`).
3. Faça commit com mensagem descritiva em português.
4. Escreva um resumo em linguagem simples: o que mudou e o que ele pode ver.

**Definição de pronto (uma fase só termina quando todos são verdade):**

- [ ] Os testes passam.
- [ ] `ruff format` e `ruff check` passam sem erro.
- [ ] O usuário consegue **ver ou fazer** algo novo no navegador.
- [ ] Existe migração Alembic para toda mudança de tabela.
- [ ] O `roadmap.md` está atualizado.
- [ ] O `.env.example` reflete qualquer variável nova.

---

## 10. Git

- Branch de desenvolvimento: `claude/python-sql-database-planning-k95885`.
- Commits em português, no imperativo: `adiciona tela de relatório mensal`.
- Commits pequenos e temáticos. Um assunto por commit.
- **Nunca** commitar: `.env`, `*.db`, `__pycache__/`, dumps de banco, planilhas
  com dados reais.
- Não abrir pull request sem o usuário pedir explicitamente.

---

## 11. Glossário para o dono do projeto

| Termo | O que significa aqui |
|---|---|
| **Banco de dados** | Onde as informações ficam guardadas de forma organizada, em tabelas |
| **SQL** | A linguagem usada para perguntar coisas ao banco |
| **Tabela** | Uma planilha dentro do banco: colunas fixas, muitas linhas |
| **Schema / modelo** | O desenho das tabelas: quais existem e como se relacionam |
| **Migração** | Uma alteração no desenho das tabelas, aplicada sem perder o que já existe |
| **ORM (SQLAlchemy)** | Ferramenta que deixa o Python conversar com o banco sem escrever SQL na mão |
| **API** | Um jeito de um programa pedir dados a outro programa pela internet |
| **Chave de API** | Uma senha longa que prova quem você é para esse outro programa |
| **Endpoint / rota** | Um endereço do sistema, tipo `/relatorios/mensal` |
| **Docker** | Uma "caixa" pronta com tudo instalado, para não instalar nada na mão |
| **Container** | Uma dessas caixas rodando |
| **Deploy / publicar** | Colocar o programa na internet para os outros usarem |
| **Commit** | Salvar um ponto na história do projeto, com possibilidade de voltar atrás |
| **Branch** | Uma linha paralela de trabalho, para não quebrar o que já funciona |
| **Hash de senha** | Senha embaralhada de forma irreversível — nem nós conseguimos ler |
| **Seed** | Encher o banco com dados falsos para testar as telas |
| **Log** | Diário do programa: o que ele fez e o que deu errado |

---

## 12. A equipe

Este projeto foi planejado por três perfis. Ao enfrentar decisões difíceis,
considere as três perspectivas antes de responder:

- **Marina Duarte — Arquitetura.** Pergunta: "isso vai doer daqui a seis meses?"
  Defende estrutura em camadas, código sustentável e decisões reversíveis.
- **Rafael Lima — Dados.** Pergunta: "e quando isso crescer ou a fonte mudar?"
  Defende integridade, separação bruto/tratado, backup verificado e índices.
- **Tomás Beckman — Experiência.** Pergunta: "o dono do projeto consegue usar
  isso hoje?" Defende entregas visíveis cedo e resistência a complexidade
  desnecessária.

Quando Marina e Tomás discordam, o critério de desempate é: **decisões
estruturais irreversíveis seguem Marina/Rafael; a ordem de entrega segue
Tomás.**
