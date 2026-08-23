# Colocar este sistema num VPS próprio

Passo a passo para subir esta cópia do sistema (branch `claude/hostinger-kvm`)
num servidor próprio — Hostinger, Contabo, DigitalOcean, tanto faz: o que segue
vale para qualquer VPS com Ubuntu.

Leva cerca de uma hora, a maior parte dela esperando. Não é preciso saber Linux:
todo comando está escrito para copiar e colar.

> **Isto não desliga nada.** O sistema que já está no ar na Vercel + Neon
> (branch `claude/condominio-boletim-gestao-ougoqd`) continua funcionando
> exatamente como está — este guia sobe um segundo sistema, independente, no
> seu próprio servidor. Os dois passam a existir em paralelo, cada um com seu
> próprio banco de dados.
>
> **Sobre os dados do passo 8 (copiar do Neon):** ele é opcional. Faça-o só se
> você quiser que este servidor comece com os condomínios e usuários que já
> existem hoje; a partir da cópia, os dois bancos seguem cada um por conta
> própria — o que for lançado num não aparece no outro. Se preferir que este
> servidor comece vazio (por exemplo, para atender só os condomínios novos daqui
> para frente), pule o passo 8 e vá direto para o passo 9.

---

## O que você precisa ter em mãos

| | |
|---|---|
| **Um VPS** | Ubuntu 24.04, mínimo 2 GB de RAM e 2 vCPU. Menos que isso não compila a aplicação. |
| **Um domínio** | Ex.: `boletim.suaempresa.com.br`. Pode ser um subdomínio de um domínio que você já tem. |
| **A URL do banco no Neon** | Só se for copiar os dados existentes (passo 8) — no painel do Neon, *Connection string*. Começa com `postgresql://`. |
| **Acesso ao repositório** | O código está em `caiogavioli/Brainstorm`, branch `claude/hostinger-kvm`. |

---

## Passo 1 — Criar o servidor

No painel da Hostinger (ou de quem for), crie um VPS com:

- **Sistema:** Ubuntu 24.04 LTS
- **Plano:** o menor com **2 GB de RAM ou mais**

Anote o **IP** e a **senha de root** que aparecerem no fim.

> Por que 2 GB: o `next build` roda dentro do servidor e é a parte mais pesada
> do processo. Com 1 GB ele costuma ser morto pelo sistema no meio, com uma
> mensagem que não explica o que houve.

---

## Passo 2 — Entrar no servidor e criar o seu usuário

No seu computador, abra o terminal (no Windows, o PowerShell) e entre:

```bash
ssh root@SEU_IP
```

Crie um usuário para o dia a dia — trabalhar como root o tempo todo é como
andar com a chave mestra do prédio no bolso:

```bash
adduser boletim          # ele vai pedir uma senha; anote
usermod -aG sudo boletim
```

Feche (`exit`) e entre de novo já como esse usuário:

```bash
ssh boletim@SEU_IP
```

### Fechar as portas que não serão usadas

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

Só três portas respondem de fora: SSH, HTTP e HTTPS. **O banco de dados não fica
exposto** — ele só é alcançável de dentro do próprio servidor.

---

## Passo 3 — Instalar o Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Saia e entre de novo (`exit`, depois `ssh` outra vez) para o grupo valer.
Confira:

```bash
docker run --rm hello-world
```

Se aparecer *"Hello from Docker!"*, está pronto. Nada mais precisa ser
instalado — nem Node, nem PostgreSQL: eles vêm dentro dos containers.

---

## Passo 4 — Apontar o domínio para o servidor

No painel onde seu domínio está registrado, crie um registro:

| Tipo | Nome | Valor |
|---|---|---|
| `A` | `boletim` (ou `@` para o domínio raiz) | o IP do seu VPS |

**Faça isso agora, antes de subir o sistema.** O certificado HTTPS é emitido
automaticamente, mas para isso a Let's Encrypt precisa conseguir resolver o
domínio até este servidor. Se o DNS ainda não tiver propagado, o sistema sobe
mesmo assim — só sem HTTPS, e você precisará reiniciar o proxy depois.

Confira se já propagou (pode levar de minutos a algumas horas):

```bash
dig +short boletim.suaempresa.com.br
```

Tem que responder o IP do seu VPS.

---

## Passo 5 — Trazer o código

```bash
cd ~
git clone https://github.com/caiogavioli/Brainstorm.git boletim
cd boletim
git checkout claude/hostinger-kvm
```

Se o repositório for privado, o `git` vai pedir usuário e senha — use um
**Personal Access Token** do GitHub no lugar da senha (Settings → Developer
settings → Personal access tokens).

---

## Passo 6 — Criar o arquivo de configuração

Gere uma chave de sessão forte:

```bash
openssl rand -base64 32
```

Copie o resultado e crie o arquivo `.env`:

```bash
nano .env
```

Cole isto, **trocando os valores**:

```ini
# Senha do banco de dados. Invente uma longa; você não vai digitá-la de novo.
POSTGRES_PASSWORD=troque-por-uma-senha-longa-e-aleatoria

# A chave que assina as sessões — cole aqui o resultado do openssl acima.
# Trocar esta chave depois desloga todo mundo.
AUTH_SECRET=cole-aqui-o-resultado-do-openssl

# Seu domínio, exatamente como no DNS.
DOMINIO=boletim.suaempresa.com.br

# Administrador inicial. Depois de entrar a primeira vez, pode apagar
# estas três linhas do arquivo.
ADMIN_EMAIL=voce@suaempresa.com.br
ADMIN_SENHA=umaSenhaForteDeNoMinimo10
ADMIN_NOME=Seu Nome
```

Salve com `Ctrl+O`, `Enter`, e saia com `Ctrl+X`.

Proteja o arquivo — ele tem as senhas:

```bash
chmod 600 .env
```

---

## Passo 7 — Subir só o banco de dados

Ainda **não** suba o sistema inteiro. Primeiro o banco vazio:

```bash
docker compose up -d banco
```

---

## Passo 8 — Trazer os dados do Neon (opcional)

**Pule este passo inteiro se quiser que este servidor comece com o banco
vazio** — por exemplo, se ele vai atender só condomínios novos, separados dos
que já usam o sistema na Vercel. Vá direto para o passo 9.

Se for copiar os dados existentes, este é o passo que não pode dar errado. Vá
com calma — e lembre que copiar não move nem apaga nada no Neon, só lê.

### 8.1 Descobrir a versão do Postgres no Neon

```bash
docker run --rm postgres:16-alpine \
  psql "SUA_URL_DO_NEON" -t -c "SHOW server_version;"
```

Se responder **17.x**, troque `postgres:16-alpine` por `postgres:17-alpine` nos
comandos seguintes. A ferramenta de cópia recusa bancos mais novos que ela.

### 8.2 Copiar o banco inteiro

```bash
docker run --rm postgres:16-alpine \
  pg_dump "SUA_URL_DO_NEON" --no-owner --no-privileges -Fc \
  > ~/neon-backup.dump
```

Confira que o arquivo não veio vazio:

```bash
ls -lh ~/neon-backup.dump
```

Alguns megabytes é o esperado. Se vier com poucos bytes, algo falhou — não siga
adiante.

> Guarde esse arquivo mesmo depois de tudo pronto. É a sua rede de segurança:
> enquanto ele existir, dá para recomeçar do zero.

### 8.3 Restaurar no servidor novo

```bash
docker compose cp ~/neon-backup.dump banco:/tmp/neon.dump
docker compose exec banco \
  pg_restore -U condominios -d condominios --no-owner --no-privileges /tmp/neon.dump
```

Algumas mensagens de aviso são normais (extensões que já existem). Erros
começando com `ERROR: relation ... already exists`, não — significa que o banco
não estava vazio.

### 8.4 Conferir que os dados chegaram

```bash
docker compose exec banco psql -U condominios -d condominios -c \
  "SELECT (SELECT count(*) FROM \"Boletim\") AS boletins,
          (SELECT count(*) FROM \"Ocorrencia\") AS ocorrencias,
          (SELECT count(*) FROM \"Condominio\") AS condominios,
          (SELECT count(*) FROM \"Usuario\") AS usuarios;"
```

Os números têm que bater com o que você vê hoje no sistema. **Se não baterem,
pare aqui** e me chame antes de continuar.

---

## Passo 9 — Subir o sistema

```bash
docker compose -f docker-compose.yml -f docker-compose.producao.yml up -d --build
```

A primeira vez demora — de 5 a 15 minutos — porque a imagem é construída dentro
do servidor. Acompanhe:

```bash
docker compose logs -f app
```

Quando aparecer `✔ Pronto. Servidor em http://0.0.0.0:3000`, pode sair com
`Ctrl+C` (isso encerra só o acompanhamento, não o sistema).

Abra `https://boletim.suaempresa.com.br` no navegador. Deve cair na tela de
login, **com cadeado**.

> **O comando é sempre com os dois `-f`.** O segundo arquivo é o que fecha a
> porta 3000 e põe o HTTPS na frente. Rodar só `docker compose up -d` deixa o
> sistema exposto em HTTP puro na porta 3000.

---

## Passo 10 — Conferir que o servidor novo está de pé

Entre e confira, um por um:

- [ ] A tela de login abre, com cadeado.
- [ ] Se copiou os dados do Neon (passo 8): o login funciona com o seu usuário
      de sempre, o dashboard mostra os boletins e números que você conhece, e
      as ocorrências em aberto estão lá com as datas certas.
- [ ] Se começou vazio: `/configuracao-inicial` (ou `ADMIN_EMAIL`/`ADMIN_SENHA`
      no `.env`) cria o primeiro administrador normalmente.
- [ ] Um preenchedor consegue entrar e lançar um boletim de teste.
- [ ] O resumo do WhatsApp é gerado.

---

## Passo 11 — Backup automático

Sem isso, um disco com problema leva o histórico inteiro. O Neon fazia isso por
você; agora é sua responsabilidade.

Crie o script:

```bash
mkdir -p ~/backups
nano ~/backup-boletim.sh
```

Cole:

```bash
#!/bin/bash
# Backup diário do banco. Guarda 14 dias e apaga o resto.
set -e
cd ~/boletim
ARQUIVO=~/backups/boletim-$(date +%Y-%m-%d).sql.gz
docker compose exec -T banco pg_dump -U condominios condominios | gzip > "$ARQUIVO"
find ~/backups -name 'boletim-*.sql.gz' -mtime +14 -delete
echo "$(date '+%F %T') backup ok: $ARQUIVO"
```

Torne executável e teste **agora**:

```bash
chmod +x ~/backup-boletim.sh
~/backup-boletim.sh
ls -lh ~/backups
```

Agende para todo dia às 3 da manhã:

```bash
crontab -e
```

Acrescente a linha:

```
0 3 * * * /home/boletim/backup-boletim.sh >> /home/boletim/backups/log.txt 2>&1
```

### Testar a restauração

Um backup que nunca foi restaurado não é um backup — é um arquivo. Faça este
teste uma vez, com calma, e você dorme tranquilo:

```bash
# Cria um banco temporário e restaura o backup mais recente nele
docker compose exec -T banco createdb -U condominios teste_restauracao
gunzip -c ~/backups/boletim-$(date +%Y-%m-%d).sql.gz | \
  docker compose exec -T banco psql -U condominios -d teste_restauracao

# Confere que os dados vieram
docker compose exec banco psql -U condominios -d teste_restauracao -c \
  'SELECT count(*) FROM "Boletim";'

# Apaga o banco de teste
docker compose exec -T banco dropdb -U condominios teste_restauracao
```

> **Leve uma cópia para fora do servidor.** Backup no mesmo disco que os dados
> não protege contra o disco morrer. Uma vez por semana, baixe para o seu
> computador: `scp boletim@SEU_IP:~/backups/*.gz ./`

---

## Passo 12 — Vercel e Neon continuam no ar (a menos que você decida o contrário)

Este servidor é um sistema à parte — não há nada para desligar na Vercel ou no
Neon por causa dele. Os dois continuam servindo normalmente quem já usa o
sistema por lá.

Se um dia você **quiser mesmo assim** consolidar tudo num só lugar (por
exemplo, migrar todo mundo para este VPS e aposentar a Vercel), o caminho é:

1. Rodar o backup no Neon (passo 8.2) uma última vez e guardar o arquivo.
2. Restaurar esse backup aqui (passo 8.3) — vai sobrescrever o que este
   servidor tiver, então confirme antes que é isso mesmo que quer.
3. Na Vercel, pausar ou apagar o projeto.
4. No Neon, esperar alguns dias antes de apagar o banco — custa pouco manter e
   é o caminho de volta se algo aparecer.

Mas isso é uma decisão separada, para quando (e se) fizer sentido — não é parte
deste guia.

---

## Como atualizar quando eu publicar mudanças

```bash
cd ~/boletim
git pull
docker compose -f docker-compose.yml -f docker-compose.producao.yml up -d --build
```

As migrações do banco são aplicadas sozinhas na subida. O sistema fica fora do
ar por cerca de um minuto.

Rode um backup antes, se a mudança mexer no banco:

```bash
~/backup-boletim.sh
```

---

## Comandos do dia a dia

| O que você quer | Comando |
|---|---|
| Ver se está tudo de pé | `docker compose ps` |
| Ver o que a aplicação está fazendo | `docker compose logs -f app` |
| Reiniciar o sistema | `docker compose restart app` |
| Parar tudo | `docker compose stop` |
| Subir de novo | `docker compose -f docker-compose.yml -f docker-compose.producao.yml up -d` |
| Espaço em disco | `df -h` |

---

## Se der errado

**O site não abre, mas `docker compose ps` mostra tudo de pé.**
O DNS provavelmente ainda não propagou. Confira com `dig +short SEU_DOMINIO`. Se
o IP estiver certo mas continuar sem abrir, reinicie o proxy para ele tentar o
certificado de novo: `docker compose restart proxy` e veja
`docker compose logs proxy`.

**"Cadeado" não aparece / erro de certificado.**
A Let's Encrypt precisa alcançar a porta 80 de fora. Confira `sudo ufw status` —
80 e 443 têm que estar liberadas.

**O build morre no meio, sem erro claro.**
Falta memória. Crie um arquivo de troca:
```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**`✖ DATABASE_URL não definida`.**
Falta o `.env`, ou você está rodando de outra pasta. Ele fica em `~/boletim/.env`.

**Esqueci a senha do administrador.**
Ponha `ADMIN_EMAIL` e `ADMIN_SENHA` de volta no `.env` e reinicie: a senha é
redefinida na subida.
```bash
docker compose -f docker-compose.yml -f docker-compose.producao.yml up -d
```

---

## O que eu consegui verificar e o que não

**Verificado:** a configuração do `docker-compose.producao.yml` foi validada com
`docker compose config` — a porta 3000 realmente deixa de ser publicada quando o
arquivo de produção entra, e só o proxy expõe 80 e 443.

**Não verificado:** não consegui subir a pilha completa daqui — o ambiente onde
trabalho bloqueia o download de imagens do Docker Hub. O `Dockerfile` e o
`docker-compose.yml` base já existiam e são os mesmos que o `GUIA-DEPLOY.md`
descreve; o que acrescentei foi a camada do proxy com HTTPS.

Se algum passo travar, me mande a saída do comando e eu ajusto o guia.
