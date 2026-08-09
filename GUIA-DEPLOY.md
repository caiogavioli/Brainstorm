# Guia de publicação na Vercel

Passo a passo para colocar o sistema no ar, do zero, sem usar terminal.
Ao final você terá um endereço `https://...` que abre no celular de qualquer
zelador.

**Tempo estimado:** 30 a 40 minutos.
**Custo:** R$ 0 nos planos gratuitos da Vercel e do banco de dados.

Você vai precisar de: sua conta do GitHub e um cartão **não** é necessário.

---

## Antes de começar: o que é cada peça

O sistema tem três partes, e cada uma vive num lugar:

| Peça | Onde fica | Para que serve |
|---|---|---|
| **O código** | GitHub (já está lá) | As telas e as regras |
| **O banco de dados** | Neon (PostgreSQL) | Guarda boletins, ocorrências, usuários |
| **As fotos** | Vercel Blob | Guarda as imagens das ocorrências |

A Vercel junta as três e publica o endereço.

> **Por que não dá para ser só um arquivo HTML?** Porque o sistema precisa
> *guardar* o que o zelador enviou e *devolver* isso para o síndico depois. Um
> arquivo HTML sozinho não tem onde guardar nada.

---

## Passo 1 — Criar a conta na Vercel

1. Acesse **[vercel.com/signup](https://vercel.com/signup)**.
2. Clique em **Continue with GitHub** e autorize.
3. Quando perguntar o tipo de conta, escolha **Hobby** (é o plano gratuito) e
   informe seu nome.

---

## Passo 2 — Importar o projeto

1. No painel da Vercel, clique em **Add New… → Project**.
2. Na lista de repositórios, encontre **Brainstorm** e clique em **Import**.
   - Se ele não aparecer, clique em **Adjust GitHub App Permissions** e libere
     o acesso ao repositório.
3. Na tela de configuração, **atenção a um campo**:
   - Em **Git Branch**, selecione `claude/condominio-boletim-gestao-ougoqd`
     (é a branch onde o sistema está).
4. **Ainda não clique em Deploy.** Vamos criar o banco antes — sem ele, a
   primeira publicação falha. Deixe esta aba aberta.

---

## Passo 3 — Criar o banco de dados

1. Abra outra aba no painel da Vercel e vá em **Storage**.
2. Clique em **Create Database → Neon (Serverless Postgres) → Continue**.
3. Dê o nome `condominios`, escolha a região mais próxima
   (**AWS São Paulo / sa-east-1**, se disponível) e confirme.
4. Quando o banco for criado, abra a aba **Quickstart** ou **Connect** e
   localize as duas strings de conexão. Elas se parecem com:

   ```
   postgresql://usuario:senha@ep-algo-pooler.sa-east-1.aws.neon.tech/condominios?sslmode=require
   postgresql://usuario:senha@ep-algo.sa-east-1.aws.neon.tech/condominios?sslmode=require
   ```

   A primeira (com **`-pooler`** no endereço) é a *pooled*.
   A segunda (sem `-pooler`) é a *direta* / *unpooled*.

5. **Copie as duas** para um bloco de notas. Você vai colar no passo 5.

> Se o seu provedor mostrar só uma string, use a mesma nas duas variáveis.
> Funciona igual.

---

## Passo 4 — Criar o armazenamento das fotos

1. Ainda em **Storage**, clique em **Create Database → Blob → Continue**.
2. Nome: `fotos-ocorrencias`. Confirme.
3. Conecte-o ao projeto **Brainstorm** quando a Vercel perguntar.

A Vercel cria sozinha a variável `BLOB_READ_WRITE_TOKEN` — você **não** precisa
copiar nada.

> **Por que isso é necessário:** na Vercel, o disco do servidor é apagado a cada
> publicação. Uma foto salva "na pasta do site" sumiria. O Blob é um lugar
> permanente para elas.

---

## Passo 5 — Preencher as variáveis de ambiente

Volte para a aba do **Passo 2** (a tela de importação) e abra a seção
**Environment Variables**. Adicione **quatro** variáveis, uma por vez —
digite o nome à esquerda e cole o valor à direita:

| Nome | Valor |
|---|---|
| `DATABASE_URL` | a string **com `-pooler`** do Passo 3 |
| `DIRECT_URL` | a string **sem `-pooler`** do Passo 3 |
| `AUTH_SECRET` | um texto aleatório longo — veja abaixo |
| `SETUP_TOKEN` | uma senha temporária que só você conhece |

**Como gerar o `AUTH_SECRET`:** precisa ser um texto aleatório de pelo menos 40
caracteres. Use o gerador de senhas do seu navegador ou do seu gerenciador de
senhas, ou simplesmente digite muitas letras e números sem sentido. Exemplo do
formato (**não use este**): `7Kq2mZ...` — invente o seu.

**O `SETUP_TOKEN`** é usado uma única vez, no Passo 7, para você criar o primeiro
administrador. Pode ser algo como `configuracao-inicial-2026`. Vamos removê-lo
depois.

> ⚠️ Nunca compartilhe o `AUTH_SECRET`. Quem o tiver consegue forjar um login.

---

## Passo 6 — Publicar

1. Clique em **Deploy**.
2. Aguarde de 2 a 4 minutos. A Vercel vai instalar tudo, **criar as tabelas do
   banco automaticamente** e compilar o sistema.
3. Quando terminar, você verá "Congratulations" e o endereço do site, algo como
   `https://brainstorm-abc123.vercel.app`.

**Se falhar:** clique em **View Build Logs** e procure a mensagem em vermelho.
As causas mais comuns são:

| Mensagem contém | Causa | Solução |
|---|---|---|
| `Can't reach database server` | `DATABASE_URL` errada | Confira se copiou a string inteira, sem espaços |
| `P1000` / `authentication failed` | senha do banco incorreta | Copie a string de conexão de novo |
| `Environment variable not found: DIRECT_URL` | faltou a variável | Adicione em Settings → Environment Variables e republique |

Depois de corrigir, vá em **Deployments → ⋯ → Redeploy**.

---

## Passo 7 — Criar seu usuário administrador

1. Abra `SEU-ENDERECO.vercel.app/configuracao-inicial`
   (por exemplo: `https://brainstorm-abc123.vercel.app/configuracao-inicial`).
2. Preencha:
   - **Token de configuração**: o `SETUP_TOKEN` que você definiu no Passo 5;
   - seu nome, seu e-mail e uma senha de no mínimo 10 caracteres.
3. Clique em **Criar administrador**.

Você será levado à tela de login. Entre com o e-mail e a senha que acabou de
criar.

> Essa tela **se fecha sozinha** depois de criar o primeiro administrador —
> ninguém consegue usá-la de novo, mesmo sabendo o endereço.

---

## Passo 8 — Remover o token de configuração

Já que a configuração terminou, tire o `SETUP_TOKEN` do ar:

1. Na Vercel: **Settings → Environment Variables**.
2. Encontre `SETUP_TOKEN`, clique nos três pontinhos e em **Remove**.
3. Vá em **Deployments → ⋯ → Redeploy** para aplicar.

---

## Passo 9 — Cadastrar seus condomínios e sua equipe

Já logado no sistema:

1. **Condomínios** → preencha nome, endereço, responsável e telefone.
   Cadastre todos os prédios que você administra.
2. **Usuários** → crie uma conta para cada zelador:
   - **Perfil: Gestor local** — ele só vê os condomínios que você marcar e não
     enxerga o dashboard gerencial;
   - **Perfil: Administrador** — vê tudo, como você.
   - Defina uma senha inicial, combine com a pessoa por telefone e peça que
     você a troque depois (você pode redefinir a qualquer momento nessa tela).

3. Mande para cada zelador o endereço do sistema. No celular, ele pode tocar em
   **Compartilhar → Adicionar à Tela de Início** para ficar com um ícone igual
   ao de um aplicativo.

---

## Como fica o dia a dia

- **Zelador**, todo dia: abre o link, toca em **Novo boletim**, passa pelas 6
  etapas (todos os itens já vêm marcados como *Conforme*, ele só toca onde há
  falha) e envia. Leva cerca de 2 minutos.
- **Você**: abre o **Dashboard**, vê os KPIs do mês, a matriz de risco de prazos
  e a fila de prioridade; entra em cada ocorrência para atualizar status, plano
  de ação e prazo.

Cada item marcado como **Não Conforme** abre uma ocorrência automaticamente —
ninguém precisa lançar duas vezes.

---

## Publicando mudanças depois

Toda vez que o código da branch mudar no GitHub, a Vercel republica sozinha em
poucos minutos. Você não precisa fazer nada.

---

## Perguntas frequentes

**Vai custar alguma coisa?**
Nos volumes de um punhado de condomínios, não. O plano Hobby da Vercel e o plano
gratuito do Neon dão conta com folga. Fique de olho apenas se o número de fotos
crescer muito — o Blob gratuito tem limite de armazenamento.

**Os dados ficam seguros?**
As senhas são guardadas com *hash* (bcrypt), nunca em texto puro. A sessão fica
num cookie assinado. Cada gestor só enxerga os condomínios vinculados a ele,
inclusive se tentar mexer no endereço do navegador.

**Posso usar meu próprio domínio?**
Sim. Na Vercel: **Settings → Domains → Add**, e siga as instruções para apontar
o DNS.

**Como faço backup?**
O Neon mantém histórico automático (*point-in-time restore*). No painel do Neon,
veja **Branches** e **Restore**.

**E se eu esquecer minha senha de administrador?**
Se houver outro administrador, ele redefine em **Usuários**. Se você for o único,
será preciso rodar o comando `npm run producao:init` apontando para o banco de
produção — nesse caso, peça ajuda a alguém técnico.

---

## Rodando na sua máquina (opcional)

Só se você quiser mexer no código. Precisa do
[Node.js 20+](https://nodejs.org):

```bash
git clone https://github.com/caiogavioli/Brainstorm.git
cd Brainstorm
git checkout claude/condominio-boletim-gestao-ougoqd
npm install
cp .env.example .env      # cole a DATABASE_URL e a DIRECT_URL do Neon
npm run setup             # cria as tabelas e popula dados de demonstração
npm run dev               # abre em http://localhost:3000
```

⚠️ O `npm run setup` inclui **dados de demonstração** (condomínios e boletins
fictícios). Aponte-o para um banco de testes, **nunca** para o de produção. Para
um banco de produção, use `npm run producao:init`.
