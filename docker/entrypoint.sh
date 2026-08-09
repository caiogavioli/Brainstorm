#!/bin/sh
# Preparação do container antes de subir o servidor.
#
#   1. espera o banco aceitar conexões (o Postgres do compose demora a subir);
#   2. aplica as migrações pendentes;
#   3. cria o administrador inicial, se ADMIN_EMAIL e ADMIN_SENHA existirem.
#
# Só então larga o root e entra o processo do Next.

set -e

if [ -z "$DATABASE_URL" ]; then
  echo "✖ DATABASE_URL não definida. Configure-a antes de subir o container." >&2
  exit 1
fi

echo "→ Aguardando o banco de dados…"
tentativas=0
until npx prisma migrate deploy >/tmp/migrate.log 2>&1; do
  tentativas=$((tentativas + 1))
  if [ "$tentativas" -ge 30 ]; then
    echo "✖ O banco não respondeu após 30 tentativas. Último erro:" >&2
    cat /tmp/migrate.log >&2
    exit 1
  fi
  sleep 2
done
echo "✔ Migrações aplicadas."

# Cria o administrador apenas quando as duas variáveis vêm juntas. O script é
# idempotente: se o usuário já existir, apenas redefine a senha.
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_SENHA" ]; then
  echo "→ Garantindo o usuário administrador…"
  npx tsx scripts/init-producao.ts || echo "⚠ Não foi possível criar o administrador (siga por /configuracao-inicial)."
fi

echo "✔ Pronto. Servidor em http://0.0.0.0:${PORT:-3000}"

# Descarta privilégios de root para rodar a aplicação.
if [ "$(id -u)" = "0" ]; then
  exec su-exec nextjs "$@"
fi
exec "$@"
