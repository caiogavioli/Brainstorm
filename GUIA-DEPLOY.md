# Como colocar o sistema no ar

O sistema precisa de duas coisas para funcionar: **um lugar onde rodar** e **um
banco de dados**. Abaixo estão três caminhos, do mais simples ao mais autônomo.
Escolha **um**.

| | Caminho | Bom quando | Dificuldade |
|---|---|---|---|
| **A** | [Render.com](#caminho-a--rendercom) | Você quer um endereço na internet, como seria na Vercel | Baixa |
| **B** | [Docker num computador](#caminho-b--docker) | Você tem um PC ou servidor que fica ligado | Média |
| **C** | [Node direto num PC](#caminho-c--node-direto) | Você quer testar antes de decidir | Baixa |

> **As fotos das ocorrências foram removidas.** O sistema não depende mais de
> nenhum serviço de armazenamento de imagens. Descrição, plano de ação,
> criticidade, prazo e histórico continuam iguais. Dá para reativar as fotos
> depois — a tabela continua no banco.

---

## O banco de dados (vale para os caminhos A e C)

Os dois precisam de um PostgreSQL. O gratuito mais simples é o **Neon**, criado
direto no site deles — **não** pelo painel de outra plataforma:

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

## Caminho A — Render.com

Mesma ideia da Vercel: conecta no GitHub e publica sozinho. Plano gratuito, sem
cartão.

**1. Criar a conta**
Acesse [render.com](https://render.com) → **Get Started** → entre com o GitHub.

**2. Criar o serviço**
No painel: **New + → Web Service** → **Build and deploy from a Git repository**
→ conecte e escolha **Brainstorm**.

**3. Preencher a configuração**

| Campo | Valor |
|---|---|
| Name | `boletim-diario` |
| Branch | `claude/condominio-boletim-gestao-ougoqd` |
| Runtime | `Node` |
| Build Command | `npm ci && npm run build` |
| Start Command | `npm start` |
| Instance Type | `Free` |

**4. Variáveis de ambiente**
Ainda nessa tela, em **Environment Variables**, adicione:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | a connection string do Neon |
| `AUTH_SECRET` | um texto aleatório de 40+ caracteres |
| `ADMIN_EMAIL` | seu e-mail (será o login) |
| `ADMIN_SENHA` | uma senha de 10+ caracteres |
| `ADMIN_NOME` | seu nome |

**5. Publicar**
Clique em **Create Web Service** e aguarde de 3 a 6 minutos. O build aplica as
migrações do banco automaticamente.

**6. Criar seu usuário**
Abra a aba **Shell** do serviço no painel do Render e rode:

```bash
npm run producao:init
```

Ele usa as variáveis `ADMIN_*` que você já preencheu. Se a aba Shell não estiver
disponível no plano gratuito, use a alternativa sem terminal: adicione a
variável `SETUP_TOKEN` com uma senha temporária, republique e acesse
`SEU-ENDERECO.onrender.com/configuracao-inicial`.

> **Sobre o plano gratuito do Render:** o serviço hiberna após 15 minutos sem
> acesso. O primeiro acesso depois disso demora ~40 segundos para responder;
> os seguintes são normais. Para um boletim preenchido uma vez por dia, é
> tolerável — mas avise os gerentes para não acharem que travou.

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
3. Mande o endereço para a equipe. No celular, **Compartilhar → Adicionar à Tela
   de Início** deixa um ícone como o de um aplicativo.

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

---

## Perguntas frequentes

**Vai custar alguma coisa?**
Não, nos três caminhos. Neon e Render têm planos gratuitos sem cartão, e o
Docker roda numa máquina que você já tem.

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
