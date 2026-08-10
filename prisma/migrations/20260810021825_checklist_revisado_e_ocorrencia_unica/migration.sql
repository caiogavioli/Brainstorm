/*
  Warnings:

  - Changed the type of `grupo` on the `ChecklistItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ChecklistItem" ADD COLUMN     "criticidadePadrao" "Criticidade" NOT NULL DEFAULT 'MEDIA',
ADD COLUMN     "grupoOrdem" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "grupo",
ADD COLUMN     "grupo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ocorrencia" ADD COLUMN     "totalRecorrencias" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ultimaRecorrenciaEm" TIMESTAMP(3);

-- DropEnum
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

-- CreateIndex
CREATE INDEX "ChecklistItem_grupo_ordem_idx" ON "ChecklistItem"("grupo", "ordem");

-- AddForeignKey
ALTER TABLE "OcorrenciaRecorrencia" ADD CONSTRAINT "OcorrenciaRecorrencia_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "Ocorrencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcorrenciaRecorrencia" ADD CONSTRAINT "OcorrenciaRecorrencia_boletimId_fkey" FOREIGN KEY ("boletimId") REFERENCES "Boletim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
