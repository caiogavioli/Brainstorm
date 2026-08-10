-- Checklist revisado + ocorrência única por problema.
--
-- ATENÇÃO ao bloco do `grupo`: o SQL que o Prisma gera sozinho aqui é
-- `DROP COLUMN "grupo"` seguido de `ADD COLUMN "grupo" TEXT NOT NULL`, que só
-- funciona em banco vazio — com dados, a coluna obrigatória não tem valor para
-- as linhas existentes e a migração aborta. Trocamos por um ALTER ... USING,
-- que converte o enum em texto preservando o conteúdo. Os códigos antigos
-- ("QUADRO_OPERACIONAL", "SEGURANCA"…) sobrevivem como texto e são desativados
-- logo depois pelo sincronizador de catálogo, que roda no build.

-- AlterTable: colunas novas com default, seguras em tabela populada.
ALTER TABLE "ChecklistItem"
  ADD COLUMN "criticidadePadrao" "Criticidade" NOT NULL DEFAULT 'MEDIA',
  ADD COLUMN "grupoOrdem" INTEGER NOT NULL DEFAULT 0;

-- Converte o enum em texto sem perder as linhas existentes.
ALTER TABLE "ChecklistItem"
  ALTER COLUMN "grupo" TYPE TEXT USING "grupo"::TEXT;

-- AlterTable
ALTER TABLE "Ocorrencia"
  ADD COLUMN "totalRecorrencias" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "ultimaRecorrenciaEm" TIMESTAMP(3);

-- DropEnum: só depois que nenhuma coluna depende mais dele.
DROP TYPE "GrupoChecklist";

-- CreateTable
CREATE TABLE "OcorrenciaRecorrencia" (
    "id" SERIAL NOT NULL,
    "ocorrenciaId" INTEGER NOT NULL,
    "boletimId" INTEGER NOT NULL,
    "dataReferencia" TEXT NOT NULL,
    "observacao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OcorrenciaRecorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OcorrenciaRecorrencia_boletimId_idx" ON "OcorrenciaRecorrencia"("boletimId");

-- CreateIndex
CREATE UNIQUE INDEX "OcorrenciaRecorrencia_ocorrenciaId_boletimId_key" ON "OcorrenciaRecorrencia"("ocorrenciaId", "boletimId");

-- CreateIndex: o índice já existe desde a migração inicial e sobrevive ao
-- ALTER ... TYPE, então só é criado se faltar (banco novo).
CREATE INDEX IF NOT EXISTS "ChecklistItem_grupo_ordem_idx" ON "ChecklistItem"("grupo", "ordem");

-- AddForeignKey
ALTER TABLE "OcorrenciaRecorrencia" ADD CONSTRAINT "OcorrenciaRecorrencia_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "Ocorrencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcorrenciaRecorrencia" ADD CONSTRAINT "OcorrenciaRecorrencia_boletimId_fkey" FOREIGN KEY ("boletimId") REFERENCES "Boletim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
