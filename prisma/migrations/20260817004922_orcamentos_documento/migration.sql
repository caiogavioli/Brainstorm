-- Módulo de Orçamentos, fase 2: o documento.
--
-- Aditiva como a anterior: cria duas tabelas e um tipo, sem alterar coluna
-- nenhuma das tabelas existentes.
--
-- `token` e `numero` nascem com UNIQUE desde a criação, de propósito. Acrescentar
-- uma coluna única depois, numa tabela que já tem linhas, obrigaria a inventar
-- valor para o passado — e um token inventado é um link que alguém pode adivinhar.

-- CreateEnum
CREATE TYPE "StatusOrcamento" AS ENUM ('RASCUNHO', 'ENVIADO', 'VISUALIZADO', 'ACEITO', 'RECUSADO', 'AJUSTE_SOLICITADO', 'EXPIRADO');

-- CreateTable
CREATE TABLE "Orcamento" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "status" "StatusOrcamento" NOT NULL DEFAULT 'RASCUNHO',
    "versao" INTEGER NOT NULL DEFAULT 1,
    "subtotalCentavos" INTEGER NOT NULL DEFAULT 0,
    "descontoCentavos" INTEGER NOT NULL DEFAULT 0,
    "totalCentavos" INTEGER NOT NULL DEFAULT 0,
    "condicoesPagamento" TEXT,
    "prazoExecucao" TEXT,
    "observacoes" TEXT,
    "validoAte" TIMESTAMP(3),
    "token" TEXT NOT NULL,
    "enviadoEm" TIMESTAMP(3),
    "primeiraVisualizacaoEm" TIMESTAMP(3),
    "ultimaVisualizacaoEm" TIMESTAMP(3),
    "totalVisualizacoes" INTEGER NOT NULL DEFAULT 0,
    "respondidoEm" TIMESTAMP(3),
    "respostaMensagem" TEXT,
    "criadoPorId" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrcamentoItem" (
    "id" SERIAL NOT NULL,
    "orcamentoId" INTEGER NOT NULL,
    "servicoCatalogoId" INTEGER,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "descricao" TEXT NOT NULL,
    "detalhe" TEXT,
    "unidade" TEXT NOT NULL DEFAULT 'un',
    "quantidadeMilesimos" INTEGER NOT NULL DEFAULT 1000,
    "valorUnitarioCentavos" INTEGER NOT NULL DEFAULT 0,
    "totalCentavos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OrcamentoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Orcamento_numero_key" ON "Orcamento"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Orcamento_token_key" ON "Orcamento"("token");

-- CreateIndex
CREATE INDEX "Orcamento_status_criadoEm_idx" ON "Orcamento"("status", "criadoEm");

-- CreateIndex
CREATE INDEX "Orcamento_clienteId_criadoEm_idx" ON "Orcamento"("clienteId", "criadoEm");

-- CreateIndex
CREATE INDEX "Orcamento_status_validoAte_idx" ON "Orcamento"("status", "validoAte");

-- CreateIndex
CREATE INDEX "OrcamentoItem_orcamentoId_ordem_idx" ON "OrcamentoItem"("orcamentoId", "ordem");

-- CreateIndex
CREATE INDEX "OrcamentoItem_servicoCatalogoId_idx" ON "OrcamentoItem"("servicoCatalogoId");

-- AddForeignKey
ALTER TABLE "Orcamento" ADD CONSTRAINT "Orcamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orcamento" ADD CONSTRAINT "Orcamento_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrcamentoItem" ADD CONSTRAINT "OrcamentoItem_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "Orcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrcamentoItem" ADD CONSTRAINT "OrcamentoItem_servicoCatalogoId_fkey" FOREIGN KEY ("servicoCatalogoId") REFERENCES "ServicoCatalogo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
