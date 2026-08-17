-- Módulo de Orçamentos, fase 1: cadastros.
--
-- Puramente aditiva. Nenhuma tabela do módulo de boletins é alterada, nenhuma
-- coluna existente muda de tipo e nenhuma linha é reescrita — rodar isto num
-- banco com dados em produção cria quatro tabelas vazias e mais nada.
--
-- Valores em centavos e quantidades em milésimos, sempre INTEGER: ponto
-- flutuante não fecha soma de dinheiro. O porquê está no schema.prisma.

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "contato" TEXT,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "documento" TEXT,
    "endereco" TEXT,
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicoCatalogo" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "categoria" TEXT NOT NULL DEFAULT 'Geral',
    "unidade" TEXT NOT NULL DEFAULT 'un',
    "valorPadraoCentavos" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicoCatalogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeloOrcamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "condicoesPagamento" TEXT,
    "prazoExecucao" TEXT,
    "observacoes" TEXT,
    "validadeDias" INTEGER NOT NULL DEFAULT 15,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModeloOrcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeloOrcamentoItem" (
    "id" SERIAL NOT NULL,
    "modeloId" INTEGER NOT NULL,
    "servicoCatalogoId" INTEGER,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "descricao" TEXT NOT NULL,
    "detalhe" TEXT,
    "unidade" TEXT NOT NULL DEFAULT 'un',
    "quantidadeMilesimos" INTEGER NOT NULL DEFAULT 1000,
    "valorUnitarioCentavos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ModeloOrcamentoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE INDEX "Cliente_ativo_nome_idx" ON "Cliente"("ativo", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "ServicoCatalogo_codigo_key" ON "ServicoCatalogo"("codigo");

-- CreateIndex
CREATE INDEX "ServicoCatalogo_ativo_categoria_ordem_idx" ON "ServicoCatalogo"("ativo", "categoria", "ordem");

-- CreateIndex
CREATE INDEX "ModeloOrcamento_ativo_nome_idx" ON "ModeloOrcamento"("ativo", "nome");

-- CreateIndex
CREATE INDEX "ModeloOrcamentoItem_modeloId_ordem_idx" ON "ModeloOrcamentoItem"("modeloId", "ordem");

-- CreateIndex
CREATE INDEX "ModeloOrcamentoItem_servicoCatalogoId_idx" ON "ModeloOrcamentoItem"("servicoCatalogoId");

-- AddForeignKey
ALTER TABLE "ModeloOrcamentoItem" ADD CONSTRAINT "ModeloOrcamentoItem_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "ModeloOrcamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeloOrcamentoItem" ADD CONSTRAINT "ModeloOrcamentoItem_servicoCatalogoId_fkey" FOREIGN KEY ("servicoCatalogoId") REFERENCES "ServicoCatalogo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
