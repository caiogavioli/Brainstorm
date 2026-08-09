# roadmap.md — Projeto Brainstorm

Plano de trabalho, em ordem de execução.
Cada fase entrega **algo visível**. Nada de três semanas sem ver resultado.

Legenda: `[ ]` a fazer · `[x]` concluído · `[~]` em andamento

---

## Resumo em uma frase

Um sistema web para 2 a 10 pessoas que reúne dados de uma **API externa** e de
**formulários preenchidos pela equipe** num banco PostgreSQL, e transforma isso
em **relatórios e gráficos** acessíveis por um link na internet.

---

## Decisões pendentes (precisam de resposta sua)

Estas não travam o início do trabalho, mas quanto antes forem respondidas,
melhor. Elas estão ordenadas por urgência.

| # | Pergunta | Trava qual fase? | Por que importa |
|---|---|---|---|
| 1 | **Qual é o assunto dos dados?** Vendas? Produção? Indicadores? Estoque? Projetos? Sensores? | Fase 1 | Define as tabelas reais. Até lá usamos um modelo de exemplo provisório. |
| 2 | Que informações você quer ver no relatório principal? (ex.: "total por mês", "ranking por cliente", "comparação com o mês anterior") | Fase 1 | Define os cálculos e o gráfico |
| 3 | Qual é a API externa exatamente? Nome do serviço e link da documentação | Fase 5 | Define como coletar e com que frequência |
| 4 | Com que frequência os dados da API precisam ser atualizados? (tempo real, de hora em hora, 1x por dia) | Fase 5 | Define a estratégia de agendamento |
| 5 | Quantas pessoas exatamente e quais são os e-mails delas? | Fase 2 | Criar os usuários iniciais |
| 6 | Existe algum dado pessoal/sensível (CPF, saúde, financeiro de terceiros)? | Fase 7 | Muda exigências de LGPD e de backup |

> **Nota da Marina:** a pergunta 1 é o maior buraco em aberto do projeto.
> As fases 0, 2 e 3 são idênticas em qualquer domínio, então começamos por elas
> sem risco. A primeira tarefa da Fase 1 é substituir o modelo de exemplo pelo
> domínio real.

---

## Fase 0 — Fundação

**Objetivo:** ter o esqueleto do projeto rodando na sua máquina.
**Você vai ver:** uma página em branco escrito "Brainstorm está no ar" e o
banco de dados funcionando.

- [ ] Criar `pyproject.toml` com as dependências e configuração do `ruff`
- [ ] Criar `Dockerfile` e `docker-compose.yml` (aplicação + PostgreSQL 16)
- [ ] Criar `.env.example` e `.gitignore` (garantindo que `.env` fique de fora)
- [ ] Criar `src/app/config.py` lendo as variáveis de ambiente
- [ ] Criar `src/app/db.py` com a conexão SQLAlchemy
- [ ] Criar `src/app/main.py` (FastAPI) com uma rota `/saude` e a página inicial
- [ ] Configurar Alembic e gerar a migração inicial (banco vazio, mas versionado)
- [ ] Criar `tests/test_saude.py` — primeiro teste automatizado
- [ ] Escrever um `README.md` de 10 linhas: como subir o projeto

**Critério de aceite:** você roda `docker compose up`, abre
`http://localhost:8000` no navegador e vê a página. `docker compose run --rm app pytest`
passa.

**Risco:** primeira instalação do Docker pode dar trabalho no seu computador.
Se travar, resolvemos juntos antes de seguir.

---

## Fase 1 — Modelo de dados e a primeira tela de relatório ⭐

**Objetivo:** provar o valor do projeto. É a sua prioridade número 1.
**Você vai ver:** uma tela com um gráfico e uma tabela de números, alimentada
por dados de exemplo.

- [ ] **Definir o domínio real** com você (Decisão pendente #1) e desenhar as
      tabelas juntos, em linguagem simples, antes de escrever código
- [ ] Criar `models/base.py` com as colunas comuns (`id`, `criado_em`,
      `atualizado_em`, `origem`)
- [ ] Criar `models/core.py` — camada de trabalho, com as entidades reais
- [ ] Criar `models/raw.py` — camada bruta (JSONB), já preparada para a Fase 5
- [ ] Gerar e aplicar a migração Alembic
- [ ] Criar índices nas colunas usadas para filtrar (data, categoria, chaves
      estrangeiras)
- [ ] Criar `app/seed.py` — popula o banco com dados falsos realistas
- [ ] Criar `repositories/` e `services/` com as agregações do relatório
      (totais, por período, comparações)
- [ ] Criar o template da tela de relatório (Jinja2) com filtro de período
- [ ] Integrar Plotly: pelo menos um gráfico interativo
- [ ] Testes das agregações — os números precisam estar comprovadamente certos

**Critério de aceite:** você abre a tela, escolhe um período, e o gráfico e a
tabela mudam de acordo. Os números batem com o esperado.

**Nota do Rafael:** as tabelas nascem já com as duas camadas mesmo que a Fase 5
esteja distante. Encaixar isso depois custaria uma reescrita.

---

## Fase 2 — Login

**Objetivo:** saber quem é quem. Pré-requisito obrigatório para publicar na
internet.
**Você vai ver:** uma tela de login e seu nome no canto da tela.

- [ ] Criar `models/core.py::Usuario` (nome, e-mail, hash de senha, ativo)
- [ ] Hash de senha com Argon2 (`passlib`)
- [ ] Tela de login e de logout
- [ ] Sessão via cookie assinado (`httponly`, `samesite=lax`)
- [ ] Middleware: quem não estiver logado vai para a tela de login
- [ ] Comando para criar o primeiro usuário administrador pelo terminal
- [ ] Gravar `criado_por_id` nos registros — rastreabilidade de quem lançou o quê
- [ ] Deixar a coluna `papel` preparada (mas sem usar), para o dia em que você
      quiser perfis diferentes
- [ ] Testes: rota protegida sem login deve recusar o acesso

**Critério de aceite:** sem login, nenhuma página abre. Com login, tudo abre e
seu nome aparece na tela.

**Nota do Tomás:** login vem antes de publicar na nuvem, sem exceção. Um link
público sem senha é um vazamento esperando acontecer.

---

## Fase 3 — Publicação na nuvem (o primeiro link de verdade)

**Objetivo:** tirar o sistema do seu computador e colocar na internet.
**Você vai ver:** um endereço `https://...` que você manda no WhatsApp da
equipe e todo mundo acessa.

- [ ] Escolher a plataforma junto com você (recomendação da equipe: **Render**
      ou **Railway** — sobe pelo mesmo Dockerfile, HTTPS automático, Postgres
      gerenciado, ~US$ 5 a 15/mês)
- [ ] Criar o banco PostgreSQL gerenciado
- [ ] Configurar as variáveis de ambiente na plataforma (nada de segredo no Git)
- [ ] Publicar a aplicação e rodar as migrações em produção
- [ ] Confirmar HTTPS ativo e cookie com `secure=True`
- [ ] Criar os usuários reais da equipe
- [ ] Documentar o processo de publicação no `README.md`, passo a passo

**Critério de aceite:** um colega abre o link do celular, faz login e vê o
relatório.

**Nota do Tomás:** eu queria montar um servidor com Docker Compose, mas mudei
de posição — plataforma gerenciada elimina a necessidade de você administrar
Linux, atualizações e certificados.

---

## Fase 4 — Formulário de lançamento manual

**Objetivo:** a equipe começa a alimentar dados reais.
**Você vai ver:** telas de cadastrar, editar, listar e apagar.

- [ ] Schemas Pydantic para validação da entrada
- [ ] Formulário de criação com mensagens de erro em português claro
- [ ] Listagem com busca, filtro e paginação (HTMX, sem recarregar a página)
- [ ] Edição e exclusão, com confirmação antes de apagar
- [ ] Toda linha criada aqui recebe `origem='manual'` e `criado_por_id`
- [ ] Histórico simples de alterações (quem mudou o quê e quando)
- [ ] Testes dos casos de erro: campo vazio, data inválida, valor negativo

**Critério de aceite:** um colega cadastra um registro pelo navegador e ele
aparece no relatório da Fase 1 imediatamente.

---

## Fase 5 — Integração com a API externa

**Objetivo:** parar de digitar o que pode ser buscado sozinho.
**Você vai ver:** uma tela mostrando "última coleta: hoje às 08:00, 240
registros novos".

- [ ] Levantar a documentação da API com você (Decisões pendentes #3 e #4)
- [ ] Guardar a chave de acesso com segurança, via variável de ambiente
- [ ] Criar `ingest/cliente.py` com `httpx`: timeout, retry com espera
      progressiva e respeito a limite de requisições
- [ ] Gravar toda resposta **crua** em `raw.py` (JSONB + hash + data da coleta)
- [ ] Criar o transformador: camada bruta → camada de trabalho
- [ ] Deduplicação por hash — coletar duas vezes não pode duplicar dado
- [ ] Registrar `origem='api'` em tudo que vier daqui
- [ ] Agendamento automático (cron da plataforma de hospedagem — sem Celery)
- [ ] Tela de status das coletas: quando rodou, quantos registros, o que falhou
- [ ] Botão "coletar agora" para disparo manual
- [ ] Testes com respostas simuladas da API, incluindo erro e resposta malformada

**Critério de aceite:** você aperta "coletar agora", os dados chegam e aparecem
no relatório. Se a API estiver fora do ar, o sistema avisa em vez de quebrar.

**Nota do Rafael:** é aqui que a camada bruta se paga. Quando a API mudar de
formato — e ela vai mudar — reprocessamos o histórico em vez de perdê-lo.

---

## Fase 6 — Relatórios completos

**Objetivo:** transformar uma tela de relatório em uma ferramenta de análise.
**Você vai ver:** vários relatórios, filtros combinados e exportação.

- [ ] Relatórios adicionais definidos por você
- [ ] Filtros combinados (período + categoria + responsável)
- [ ] Comparações entre períodos (mês atual × mês anterior × mesmo mês do ano
      passado)
- [ ] Exportar para Excel e CSV
- [ ] Painel inicial com os 4 a 6 números mais importantes
- [ ] Revisão de desempenho: nenhuma consulta acima de 1 segundo
- [ ] Gráficos revisados para leitura fácil (cores acessíveis, rótulos claros)

**Critério de aceite:** você responde uma pergunta real do seu trabalho usando
o sistema, sem abrir o Excel.

---

## Fase 7 — Robustez e tranquilidade

**Objetivo:** poder dormir sossegado.
**Você vai ver:** uma rotina de backup que já foi testada de verdade.

- [ ] Backup automático diário do banco
- [ ] **Restaurar o backup num banco de teste e confirmar que funciona** —
      obrigatório, não opcional
- [ ] Logs estruturados: erros ficam registrados e localizáveis
- [ ] Monitoramento simples: aviso se o site cair ou a coleta falhar
- [ ] Página de erro amigável (nada de tela branca com texto técnico)
- [ ] Cobertura de testes nos caminhos críticos
- [ ] Revisão de segurança: dependências desatualizadas, segredos vazados,
      permissões de cookie
- [ ] Manual de uso em português, com imagens, para a equipe
- [ ] Documento "o que fazer se der problema"

**Critério de aceite:** um backup é restaurado com sucesso na frente de você, e
existe um documento que qualquer pessoa consegue seguir.

**Nota do Rafael:** backup que nunca foi restaurado não é backup — é esperança.
Esta fase não pode ser cortada por falta de tempo.

---

## Ideias para depois (fora do escopo atual)

Registradas para não serem esquecidas, mas **não** serão feitas agora:

- Perfis de permissão diferentes (administrador, lançador, visualizador)
- Alertas por e-mail quando um indicador sair do esperado
- Aplicativo de celular
- Importação de planilhas Excel
- API própria para outros sistemas consumirem
- Gráficos que se atualizam sozinhos em tempo real
- Múltiplas empresas/clientes no mesmo sistema

---

## Como acompanhar o progresso

Ao final de cada tarefa, este arquivo é atualizado com `[x]`. Para saber onde
o projeto está, procure o primeiro `[ ]` de cima para baixo — é a próxima
tarefa.

**Fase atual: Fase 0 — Fundação (não iniciada)**
