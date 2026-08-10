# Como colocar o sistema no ar

O sistema precisa de duas coisas para funcionar: **um lugar onde rodar** e **um
banco de dados**. Abaixo estão três caminhos, do mais simples ao mais autônomo.
Escolha **um**.

| | Caminho | Bom quando | Dificuldade |
|---|---|---|---|
| **A** | [Vercel](#caminho-a--vercel) | O caminho principal: um endereço na internet, publicado a partir do GitHub | Baixa |
| **B** | [Docker num computador](#caminho-b--docker) | Você tem um PC ou servidor que fica ligado, e não quer criar conta nenhuma | Média |
| **C** | [Node direto num PC](#caminho-c--node-direto) | Você quer testar antes de decidir | Baixa |

Se a Vercel barrar de novo, veja as
[alternativas equivalentes](#alternativas-a-vercel) — Koyeb, Netlify, Render —
que usam exatamente a mesma configuração.

> **As fotos das ocorrências foram removidas.** O sistema não depende mais de
> nenhum serviço de armazenamento de imagens. Descrição, plano de ação,
> criticidade, prazo e histórico continuam iguais. Dá para reativar as fotos
> depois — a tabela continua no banco.

---

## O banco de dados (vale para os caminhos A e C)

Os dois precisam de um PostgreSQL. Crie o banco **direto no site do Neon** —
não pela aba *Storage* da Vercel.

> **Por que não pela Vercel:** a aba Storage passa pelo marketplace, que é onde
> costuma aparecer o pedido de cartão ou de verificação. Criando no Neon e
> colando a URL como variável de ambiente, o resultado é idêntico e a Vercel
> nem precisa saber de onde veio o banco.

1. Acesse **[neon.tech](https://neon.tech)** e entre com sua conta do GitHub ou
   Google. Não pede cartão.
2. Clique em **Create project**. Nome: `condominios`. Região: a mais próxima.
3. Na tela seguinte aparece a **connection string**, algo como:

   ```
   postgresql://usuario:senha@ep-algo.sa-east-1.aws.neon.tech/condominios?sslmode=require
   ```

4. **Copie e guarde.** É o valor de `DATABASE_URL` nos passos seguintes.

> Se a página oferecer duas versões (*pooled* e *direct*), pegue a **direct**
> (a que **não** tem `-pooler` no endereço).

Alternativas equivalentes, caso o Neon não funcione para você:
[Supabase](https://supabase.com) e [Aiven](https://aiven.io) também têm
PostgreSQL gratuito sem cartão.

---

## Caminho A — Vercel

**1. Criar a conta**
[vercel.com/signup](https://vercel.com/signup) → **Continue with GitHub** →
autorize. Escolha o plano **Hobby** (gratuito).

**2. Criar o banco antes de publicar**
Siga a seção [O banco de dados](#o-banco-de-dados-vale-para-os-caminhos-a-e-c)
acima e deixe a *connection string* copiada. Sem o banco, a primeira publicação
falha.

**3. Importar o projeto**
No painel: **Add New… → Project** → encontre **Brainstorm** → **Import**.

- Se o repositório não aparecer, clique em **Adjust GitHub App Permissions** e
  libere o acesso a ele.
- Em **Git Branch**, selecione `claude/condominio-boletim-gestao-ougoqd`.

**4. Variáveis de ambiente**
Ainda na tela de importação, abra **Environment Variables** e adicione:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | a connection string do Neon, com `&connection_limit=1` no final |
| `AUTH_SECRET` | um texto aleatório de 40+ caracteres |
| `SETUP_TOKEN` | uma senha temporária, só sua |

Sobre o `connection_limit=1`: a Vercel roda o sistema em funções que sobem e
descem sozinhas, e cada uma abre sua própria conexão com o banco. Esse
parâmetro limita cada função a uma conexão e evita o erro
*too many connections*. A URL fica assim:

```
postgresql://usuario:senha@ep-algo.sa-east-1.aws.neon.tech/condominios?sslmode=require&connection_limit=1
```

**Como gerar o `AUTH_SECRET`:** use o gerador de senhas do navegador ou do seu
gerenciador de senhas. Não reaproveite uma senha que você já usa — quem tiver
esse valor consegue forjar um login.

**5. Publicar**
Clique em **Deploy** e aguarde de 2 a 4 minutos. O build cria as tabelas do
banco automaticamente.

**6. Criar seu usuário**
Abra `SEU-ENDERECO.vercel.app/configuracao-inicial`, informe o `SETUP_TOKEN`,
seu nome, e-mail e uma senha de 10+ caracteres. Você cai na tela de login já
com a conta criada.

**7. Fechar a porta**
Em **Settings → Environment Variables**, remova o `SETUP_TOKEN` e republique em
**Deployments → ⋯ → Redeploy**. A tela de configuração também se tranca sozinha
assim que existe um administrador — a remoção é só higiene.

---

## Alternativas à Vercel

Se o cadastro barrar de novo, estas usam **exatamente a mesma configuração** do
caminho A — mesmo build, mesmas variáveis, mesma tela de configuração inicial:

| Plataforma | Observações |
|---|---|
| **[Koyeb](https://koyeb.com)** | Free tier sem hibernação. Aceita repositório ou imagem Docker. |
| **[Netlify](https://netlify.com)** | Suporte a Next.js nativo; detecta o projeto sozinho. |
| **[Render](https://render.com)** | No plano gratuito o serviço hiberna após 15 min sem acesso, e o primeiro acesso seguinte demora uns 40 s. |
| **[Railway](https://railway.app)** | Simples e já traz PostgreSQL junto, mas costuma pedir cartão. |

Nelas, informe manualmente o que a Vercel detecta sozinha:

| Campo | Valor |
|---|---|
| Runtime / Language | `Node` (versão 20 ou superior) |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Port | `3000` |

> ⚠️ **Não consigo verificar daqui** as condições atuais de cadastro de nenhuma
> delas — plano gratuito, exigência de cartão ou telefone mudam com frequência.
> Se todas barrarem, o **caminho B** não exige conta nenhuma.

---

## Caminho B — Docker

Um comando sobe **tudo**: aplicação e banco de dados. Não precisa de Neon, nem
de Node, nem de PostgreSQL instalado — só do Docker.

Serve para um PC que fique ligado na administração, ou para qualquer servidor
que você alugue depois.

**1. Instalar o Docker**
[Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows ou
Mac) ou `docker` e `docker compose` no Linux.

**2. Baixar o projeto**

```bash
git clone https://github.com/caiogavioli/Brainstorm.git
cd Brainstorm
git checkout claude/condominio-boletim-gestao-ougoqd
```

**3. Criar o arquivo de configuração**

```bash
cp .env.example .env
```

Abra o `.env` num editor de texto e preencha:

```dotenv
AUTH_SECRET="um-texto-aleatorio-longo-e-secreto-de-40-caracteres"
POSTGRES_PASSWORD="uma-senha-para-o-banco"
ADMIN_EMAIL="voce@suaempresa.com.br"
ADMIN_SENHA="umaSenhaForteDe10OuMais"
ADMIN_NOME="Seu Nome"
```

**4. Subir**

```bash
docker compose up -d
```

A primeira vez demora alguns minutos (ele compila o sistema). Depois:
**http://localhost:3000** — entre com o `ADMIN_EMAIL` e a `ADMIN_SENHA`.

**Comandos do dia a dia**

```bash
docker compose logs -f app     # ver o que está acontecendo
docker compose down            # desligar (os dados ficam salvos)
docker compose up -d           # ligar de novo
docker compose up -d --build   # atualizar depois de mudar o código
```

Os dados vivem num volume do Docker chamado `dados-postgres`. Desligar,
atualizar ou recriar o container **não** apaga nada. Só `docker compose down -v`
apaga — não use esse `-v` sem querer.

**5. Deixar acessível fora da rede local**

Sozinho, o `localhost:3000` só abre no próprio computador. Para os gerentes
acessarem do celular, a opção gratuita mais simples é o
[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/):
ele cria um endereço `https://...` público apontando para essa máquina, sem
mexer no roteador.

> ⚠️ Enquanto o computador estiver desligado, o sistema fica fora do ar.

---

## Caminho C — Node direto

Sem Docker. Bom para ver o sistema funcionando antes de decidir onde hospedar.

**1.** Instale o [Node.js 20 ou superior](https://nodejs.org) (versão LTS).
**2.** Crie o banco no Neon (seção acima).
**3.** No terminal:

```bash
git clone https://github.com/caiogavioli/Brainstorm.git
cd Brainstorm
git checkout claude/condominio-boletim-gestao-ougoqd
npm install
cp .env.example .env
```

**4.** Abra o `.env` e preencha `DATABASE_URL` (a do Neon) e `AUTH_SECRET`.

**5.** Escolha como quer começar:

```bash
# Opção 1 — com dados de demonstração, para explorar o sistema
npm run setup

# Opção 2 — banco limpo, para uso real
npx prisma migrate deploy
ADMIN_EMAIL=voce@empresa.com ADMIN_SENHA=umaSenhaForte123 npm run producao:init
```

**6.** Rode:

```bash
npm run dev
```

Abra **http://localhost:3000**.

> Se usou a opção 1, entre com `sindico@condominios.com.br` / `condominio123`.

---

## Depois de entrar, em qualquer caminho

1. **Condomínios** — cadastre cada prédio: nome, endereço, responsável, telefone.
2. **Usuários** — crie a conta de cada gerente predial.
   - *Gerente predial* só vê os condomínios que você marcar e não enxerga o
     dashboard gerencial.
   - *Administrador* vê tudo, como você.
   - Defina a senha inicial e combine com a pessoa. Você pode redefinir a
     qualquer momento nessa tela.
3. Mande **o endereço raiz** do sistema para a equipe (`https://SEU-ENDERECO/`).
   O boletim abre sem login: o gerente digita o nome, escolhe o condomínio na
   lista e responde. No celular, **Compartilhar → Adicionar à Tela de Início**
   deixa um ícone como o de um aplicativo.

> O painel (dashboard, ocorrências, planos, cadastros) continua exigindo login,
> em `/login`. Só o preenchimento do boletim é aberto.

**O dia a dia:** o gerente abre o link, toca em *Novo boletim* e passa pelas 6
etapas — tudo já vem marcado como *Conforme*, ele só toca onde há falha. Leva
cerca de 2 minutos. Cada item *Não Conforme* abre uma ocorrência
automaticamente, que aparece no seu dashboard.

---

## Se der erro

| Mensagem | Causa | Solução |
|---|---|---|
| `Can't reach database server` | `DATABASE_URL` errada ou banco fora do ar | Confira se colou a string inteira, sem espaços |
| `P1000` / `authentication failed` | senha do banco incorreta | Copie a connection string de novo |
| `Environment variable not found: DATABASE_URL` | faltou a variável | Confira o `.env` ou as variáveis do serviço |
| `AUTH_SECRET ausente ou muito curto` | segredo não definido | Defina um texto de 40+ caracteres |
| `defina AUTH_SECRET no arquivo .env` | Docker sem o `.env` preenchido | Rode `cp .env.example .env` e preencha |
| `too many connections` | muitas funções abrindo conexão ao mesmo tempo | Acrescente `&connection_limit=1` ao fim da `DATABASE_URL` |
| `P3009` / `failed migrations in the target database` | uma migração anterior abortou no meio e travou as seguintes | Veja abaixo |

### Destravar uma migração que falhou (P3009)

Quando uma migração aborta, o Prisma a marca como falha e **se recusa a aplicar
as próximas** — o build passa a falhar sempre, e a Vercel mantém no ar a versão
anterior. É por isso que uma correção pode "não aparecer" mesmo depois de
publicada.

Para destravar, abra o **SQL Editor do Neon** (painel do banco → *SQL Editor*) e
rode:

```sql
DELETE FROM "_prisma_migrations" WHERE finished_at IS NULL;
```

Isso apaga só o registro da tentativa que não terminou — nenhum dado seu é
tocado, porque a migração que falhou foi revertida pelo próprio Postgres. Depois
vá em **Deployments → ⋯ → Redeploy** na Vercel.

> Se você tiver terminal com a `DATABASE_URL` de produção, o equivalente é
> `npx prisma migrate resolve --rolled-back <nome-da-migração>`.

---

## Perguntas frequentes

**Vai custar alguma coisa?**
Não deveria, nos três caminhos: Vercel e Neon têm plano gratuito e o Docker roda
numa máquina que você já tem. Confira as condições no ato do cadastro — elas
mudam, e eu não consigo verificá-las daqui.

**Os dados ficam seguros?**
As senhas são guardadas com *hash* (bcrypt), nunca em texto puro. A sessão fica
num cookie assinado. Cada gestor só enxerga os condomínios vinculados a ele,
inclusive se tentar mexer no endereço do navegador.

**Como faço backup?**
No Neon, há restauração automática por ponto no tempo (*Branches → Restore*).
No Docker: `docker compose exec banco pg_dump -U condominios condominios > backup.sql`.

**Esqueci a senha de administrador.**
Se houver outro administrador, ele redefine em **Usuários**. Se você for o
único, rode `npm run producao:init` com as variáveis `ADMIN_*` apontando para o
mesmo banco — ele redefine a senha do e-mail informado.

**Posso voltar a usar as fotos?**
Sim. A tabela `OcorrenciaFoto` continua no banco e a galeria continua na tela de
detalhe. Falta apenas o envio, que depende de um lugar para guardar os arquivos.

**Quero usar meu próprio domínio.**
No Render: *Settings → Custom Domains*. No Docker com Cloudflare Tunnel: o
domínio é configurado no painel da Cloudflare.
