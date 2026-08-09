# Imagem de produção do Boletim Diário.
#
# Build em três estágios para que a imagem final não carregue o código-fonte
# nem as dependências de desenvolvimento — só o necessário para rodar.

# --------------------------------------------------------------- dependências
FROM node:22-alpine AS deps
WORKDIR /app

# Só os manifestos primeiro: enquanto eles não mudarem, o Docker reaproveita
# esta camada e pula a instalação inteira.
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ------------------------------------------------- dependências de produção
# Instalação separada, sem as devDependencies. Copiar esta árvore inteira é
# mais seguro do que escolher pacotes a dedo: o Prisma carrega dependências
# transitivas (os engines, por exemplo) que uma lista manual esquece — e a
# falha só apareceria ao subir o container, não no build.
FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

# --------------------------------------------------------------------- build
FROM node:22-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# O Prisma Client é gerado no build; as migrações rodam no start (entrypoint),
# quando o banco realmente existe.
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
# Liga a saída "standalone" (ver next.config.ts) — só o build do Docker a usa.
ENV DOCKER_BUILD=1
# DATABASE_URL de fachada: `next build` importa módulos que instanciam o
# PrismaClient, mas nenhuma consulta é executada nesta etapa.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx next build

# ------------------------------------------------------------------ produção
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# `openssl` é exigido pelo Prisma; `su-exec` deixa o entrypoint largar o root.
RUN apk add --no-cache openssl su-exec

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# Dependências de produção completas (inclui o CLI do Prisma e o tsx, usados
# pelo entrypoint para migrar o banco e criar o administrador).
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Cliente do Prisma já gerado no build, para não regenerar no start.
COPY --from=build --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Saída standalone: o servidor e o que ele carrega em runtime.
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

# Necessários para aplicar migrações e criar o administrador no start.
COPY --from=build --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=build --chown=nextjs:nodejs /app/src/lib/checklist.ts ./src/lib/checklist.ts
COPY --from=build --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json

COPY --chown=nextjs:nodejs docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "server.js"]
