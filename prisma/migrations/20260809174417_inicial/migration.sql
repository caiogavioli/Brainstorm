-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('ADMIN', 'GESTOR');

-- CreateEnum
CREATE TYPE "GrupoChecklist" AS ENUM ('QUADRO_OPERACIONAL', 'ELETRICA_HIDRAULICA_REFRIGERACAO', 'SISTEMAS', 'SEGURANCA');

-- CreateEnum
CREATE TYPE "StatusGeralDia" AS ENUM ('EM_CONFORMIDADE', 'OCORRENCIA_PONTUAL', 'OCORRENCIA_CRITICA');

-- CreateEnum
CREATE TYPE "SituacaoItem" AS ENUM ('CONFORME', 'NAO_CONFORME', 'NAO_APLICAVEL');

-- CreateEnum
CREATE TYPE "Criticidade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "StatusOcorrencia" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "Condominio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT,
    "gerenteResponsavel" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Condominio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "Papel" NOT NULL DEFAULT 'GESTOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioCondominio" (
    "usuarioId" INTEGER NOT NULL,
    "condominioId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioCondominio_pkey" PRIMARY KEY ("usuarioId","condominioId")
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "grupo" "GrupoChecklist" NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Boletim" (
    "id" SERIAL NOT NULL,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataReferencia" TEXT NOT NULL,
    "condominioId" INTEGER NOT NULL,
    "statusGeral" "StatusGeralDia" NOT NULL DEFAULT 'EM_CONFORMIDADE',
    "houveFaltas" BOOLEAN NOT NULL DEFAULT false,
    "setoresFaltas" TEXT,
    "qtdeFaltas" INTEGER NOT NULL DEFAULT 0,
    "observacoes" TEXT,
    "criadoPorId" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Boletim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoletimItem" (
    "id" SERIAL NOT NULL,
    "boletimId" INTEGER NOT NULL,
    "checklistItemId" INTEGER NOT NULL,
    "situacao" "SituacaoItem" NOT NULL DEFAULT 'CONFORME',
    "observacao" TEXT,

    CONSTRAINT "BoletimItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ocorrencia" (
    "id" SERIAL NOT NULL,
    "dataAbertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominioId" INTEGER NOT NULL,
    "checklistItemId" INTEGER,
    "setorLivre" TEXT,
    "descricao" TEXT NOT NULL,
    "planoAcao" TEXT,
    "criticidade" "Criticidade" NOT NULL DEFAULT 'MEDIA',
    "status" "StatusOcorrencia" NOT NULL DEFAULT 'PENDENTE',
    "previsaoFinalizacao" TIMESTAMP(3),
    "dataConclusao" TIMESTAMP(3),
    "origem" TEXT NOT NULL DEFAULT 'BOLETIM',
    "boletimId" INTEGER,
    "boletimItemId" INTEGER,
    "abertaPorId" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OcorrenciaFoto" (
    "id" SERIAL NOT NULL,
    "ocorrenciaId" INTEGER NOT NULL,
    "caminho" TEXT NOT NULL,
    "nomeOriginal" TEXT,
    "mime" TEXT,
    "tamanho" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OcorrenciaFoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OcorrenciaLog" (
    "id" SERIAL NOT NULL,
    "ocorrenciaId" INTEGER NOT NULL,
    "usuarioId" INTEGER,
    "mensagem" TEXT NOT NULL,
    "campo" TEXT,
    "valorAntes" TEXT,
    "valorDepois" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OcorrenciaLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoAcao" (
    "id" SERIAL NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condominioId" INTEGER NOT NULL,
    "local" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "criticidade" "Criticidade" NOT NULL DEFAULT 'MEDIA',
    "status" "StatusOcorrencia" NOT NULL DEFAULT 'PENDENTE',
    "previsaoFinalizacao" TIMESTAMP(3),
    "dataConclusao" TIMESTAMP(3),
    "responsavel" TEXT,
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanoAcao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Condominio_ativo_idx" ON "Condominio"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "UsuarioCondominio_condominioId_idx" ON "UsuarioCondominio"("condominioId");

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistItem_codigo_key" ON "ChecklistItem"("codigo");

-- CreateIndex
CREATE INDEX "ChecklistItem_grupo_ordem_idx" ON "ChecklistItem"("grupo", "ordem");

-- CreateIndex
CREATE INDEX "Boletim_condominioId_dataRegistro_idx" ON "Boletim"("condominioId", "dataRegistro");

-- CreateIndex
CREATE INDEX "Boletim_dataReferencia_idx" ON "Boletim"("dataReferencia");

-- CreateIndex
CREATE UNIQUE INDEX "Boletim_condominioId_dataReferencia_key" ON "Boletim"("condominioId", "dataReferencia");

-- CreateIndex
CREATE INDEX "BoletimItem_checklistItemId_situacao_idx" ON "BoletimItem"("checklistItemId", "situacao");

-- CreateIndex
CREATE UNIQUE INDEX "BoletimItem_boletimId_checklistItemId_key" ON "BoletimItem"("boletimId", "checklistItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Ocorrencia_boletimItemId_key" ON "Ocorrencia"("boletimItemId");

-- CreateIndex
CREATE INDEX "Ocorrencia_condominioId_status_idx" ON "Ocorrencia"("condominioId", "status");

-- CreateIndex
CREATE INDEX "Ocorrencia_condominioId_dataAbertura_idx" ON "Ocorrencia"("condominioId", "dataAbertura");

-- CreateIndex
CREATE INDEX "Ocorrencia_status_criticidade_previsaoFinalizacao_idx" ON "Ocorrencia"("status", "criticidade", "previsaoFinalizacao");

-- CreateIndex
CREATE INDEX "OcorrenciaFoto_ocorrenciaId_idx" ON "OcorrenciaFoto"("ocorrenciaId");

-- CreateIndex
CREATE INDEX "OcorrenciaLog_ocorrenciaId_criadoEm_idx" ON "OcorrenciaLog"("ocorrenciaId", "criadoEm");

-- CreateIndex
CREATE INDEX "PlanoAcao_condominioId_status_idx" ON "PlanoAcao"("condominioId", "status");

-- CreateIndex
CREATE INDEX "PlanoAcao_status_previsaoFinalizacao_idx" ON "PlanoAcao"("status", "previsaoFinalizacao");

-- AddForeignKey
ALTER TABLE "UsuarioCondominio" ADD CONSTRAINT "UsuarioCondominio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioCondominio" ADD CONSTRAINT "UsuarioCondominio_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boletim" ADD CONSTRAINT "Boletim_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boletim" ADD CONSTRAINT "Boletim_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoletimItem" ADD CONSTRAINT "BoletimItem_boletimId_fkey" FOREIGN KEY ("boletimId") REFERENCES "Boletim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoletimItem" ADD CONSTRAINT "BoletimItem_checklistItemId_fkey" FOREIGN KEY ("checklistItemId") REFERENCES "ChecklistItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencia" ADD CONSTRAINT "Ocorrencia_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencia" ADD CONSTRAINT "Ocorrencia_checklistItemId_fkey" FOREIGN KEY ("checklistItemId") REFERENCES "ChecklistItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencia" ADD CONSTRAINT "Ocorrencia_boletimId_fkey" FOREIGN KEY ("boletimId") REFERENCES "Boletim"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencia" ADD CONSTRAINT "Ocorrencia_boletimItemId_fkey" FOREIGN KEY ("boletimItemId") REFERENCES "BoletimItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ocorrencia" ADD CONSTRAINT "Ocorrencia_abertaPorId_fkey" FOREIGN KEY ("abertaPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcorrenciaFoto" ADD CONSTRAINT "OcorrenciaFoto_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "Ocorrencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcorrenciaLog" ADD CONSTRAINT "OcorrenciaLog_ocorrenciaId_fkey" FOREIGN KEY ("ocorrenciaId") REFERENCES "Ocorrencia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OcorrenciaLog" ADD CONSTRAINT "OcorrenciaLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanoAcao" ADD CONSTRAINT "PlanoAcao_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "Condominio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
