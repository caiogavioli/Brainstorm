/**
 * Popula o banco com:
 *  - o catálogo de itens do checklist (idempotente, upsert por `codigo`);
 *  - os condomínios de exemplo e seus usuários;
 *  - ~90 dias de boletins, ocorrências e planos de ação sintéticos,
 *    para que o dashboard já abra com dados.
 *
 * Rodar: npm run db:seed
 * O trecho de dados de demonstração só executa se ainda não houver boletins.
 */

import { PrismaClient, type Criticidade, type StatusOcorrencia } from "@prisma/client";
import bcrypt from "bcryptjs";

import { GRUPO_EQUIPES } from "../src/lib/checklist";
import { sincronizarCatalogo } from "../scripts/sincronizar-catalogo";

const prisma = new PrismaClient();

const SENHA_PADRAO = process.env.SEED_PASSWORD ?? "condominio123";

/** PRNG determinístico, para que o seed gere sempre a mesma massa de dados. */
function criarRandom(semente: number) {
  let estado = semente;
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296;
    return estado / 4294967296;
  };
}
const rand = criarRandom(20260809);

function escolher<T>(lista: readonly T[]): T {
  return lista[Math.floor(rand() * lista.length)];
}

function referenciaDe(data: Date): string {
  return data.toISOString().slice(0, 10);
}

async function seedChecklist() {
  const r = await sincronizarCatalogo(prisma);
  console.log(
    `✔ Catálogo de checklist: ${r.total} itens (${r.desativados} item(ns) fora do catálogo desativado(s))`,
  );
}

async function seedCondominios() {
  const dados = [
    {
      nome: "Atrium Office",
      endereco: "Av. das Nações Unidas, 12.901 — Brooklin, São Paulo/SP",
      gerenteResponsavel: "Marcos Vinícius Andrade",
      telefone: "(11) 3045-8800",
      email: "operacoes@atriumoffice.com.br",
    },
    {
      nome: "Edifício Centenário",
      endereco: "Rua Líbero Badaró, 425 — Centro, São Paulo/SP",
      gerenteResponsavel: "Sandra Regina Lopes",
      telefone: "(11) 3107-4520",
      email: "gerencia@edificiocentenario.com.br",
    },
    {
      nome: "Passeio Paulista",
      endereco: "Av. Paulista, 2.100 — Bela Vista, São Paulo/SP",
      gerenteResponsavel: "Rafael Teixeira Nunes",
      telefone: "(11) 3251-9090",
      email: "predial@passeiopaulista.com.br",
    },
  ];

  const condominios = [];
  for (const c of dados) {
    const existente = await prisma.condominio.findFirst({ where: { nome: c.nome } });
    condominios.push(
      existente
        ? await prisma.condominio.update({ where: { id: existente.id }, data: c })
        : await prisma.condominio.create({ data: c }),
    );
  }
  console.log(`✔ Condomínios: ${condominios.length}`);
  return condominios;
}

async function seedUsuarios(condominioIds: number[]) {
  const senhaHash = await bcrypt.hash(SENHA_PADRAO, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: "sindico@condominios.com.br" },
    update: { nome: "Síndico Profissional", papel: "ADMIN", ativo: true },
    create: {
      nome: "Síndico Profissional",
      email: "sindico@condominios.com.br",
      senhaHash,
      papel: "ADMIN",
    },
  });

  // Um usuário por condomínio, com acesso restrito ao seu prédio.
  const gestores = [
    { nome: "Gerente — Atrium Office", email: "gestor.atrium@condominios.com.br" },
    { nome: "Gerente — Edifício Centenário", email: "gestor.centenario@condominios.com.br" },
    { nome: "Gerente — Passeio Paulista", email: "gestor.paulista@condominios.com.br" },
  ];

  for (const [i, g] of gestores.entries()) {
    const usuario = await prisma.usuario.upsert({
      where: { email: g.email },
      update: { nome: g.nome, papel: "GESTOR", ativo: true },
      create: { nome: g.nome, email: g.email, senhaHash, papel: "GESTOR" },
    });
    await prisma.usuarioCondominio.upsert({
      where: {
        usuarioId_condominioId: { usuarioId: usuario.id, condominioId: condominioIds[i] },
      },
      update: {},
      create: { usuarioId: usuario.id, condominioId: condominioIds[i] },
    });
  }

  console.log(`✔ Usuários: 1 admin + ${gestores.length} gerentes (senha: ${SENHA_PADRAO})`);
  return admin;
}

/**
 * Gera boletins dos últimos `dias` dias para cada condomínio.
 * Cada item tem uma probabilidade pequena de vir "Não Conforme"; quando isso
 * acontece, a ocorrência correspondente é criada — a mesma regra do app.
 */
async function seedMovimento(condominioIds: number[], adminId: number, dias = 90) {
  const jaTemDados = await prisma.boletim.count();
  if (jaTemDados > 0) {
    console.log("• Boletins já existem — dados de demonstração não foram recriados.");
    return;
  }

  const itens = await prisma.checklistItem.findMany({ orderBy: { id: "asc" } });

  // Itens propositalmente mais problemáticos, para o gráfico "por setor"
  // mostrar concentração realista em vez de ruído uniforme.
  const pesoPorCodigo: Record<string, number> = {
    elevadores: 5,
    "portas-portoes": 4,
    refrigeracao: 3.5,
    "controle-acesso": 3,
    "bombas-recalque": 2.5,
    vazamentos: 2.5,
    "rede-internet": 2,
    "iluminacao-emergencia": 2,
    "equipe-limpeza": 2,
    nobreak: 1.5,
    "obras-reformas": 1.5,
  };

  const descricoes: Record<string, string[]> = {
    elevadores: [
      "Elevador social 02 parado entre os pavimentos 7 e 8, com passageiro retido. Resgate feito pela equipe de manutenção.",
      "Ruído anormal na casa de máquinas do elevador de serviço; porta do 3º andar não fecha completamente.",
      "Botoeira do elevador panorâmico sem resposta nos andares 12 a 15.",
    ],
    "portas-portoes": [
      "Porta automática do hall principal travando ao abrir; sensor de presença intermitente.",
      "Fechadura eletromagnética da entrada de serviço não energiza — acesso liberado manualmente.",
      "Mola hidráulica da porta corta-fogo do subsolo com vazamento.",
    ],
    refrigeracao: [
      "Fancoil do 9º pavimento com vazamento de água na bandeja de condensado.",
      "Ar-condicionado do salão de festas sem refrigerar; suspeita de falta de gás.",
      "Compressor da unidade condensadora 03 desarmando por sobrecarga térmica.",
    ],
    "controle-acesso": [
      "Catraca 02 da portaria não lê cartões de proximidade.",
      "Software de controle de acesso fora do ar; liberação manual registrada em livro.",
      "Leitor biométrico da garagem com falha de reconhecimento recorrente.",
    ],
    "bombas-recalque": [
      "Bomba de recalque 01 desarmando o disjuntor; operação mantida com a bomba reserva.",
      "Vazamento na conexão de saída da bomba de reuso.",
      "Bomba do sistema de sprinklers sem pressurização automática.",
    ],
    vazamentos: [
      "Infiltração no teto da garagem G2, abaixo da área da piscina.",
      "Vazamento na prumada hidráulica entre o 8º e o 9º pavimento.",
    ],
    "equipe-limpeza": [
      "Dois auxiliares de limpeza faltaram; áreas comuns cobertas em regime reduzido.",
      "Falta da encarregada de limpeza; escala remanejada com a equipe da manhã.",
    ],
    "rede-internet": [
      "Queda do link principal de internet; operação em link secundário.",
      "Wi-Fi das áreas comuns instável no período da tarde.",
    ],
    "iluminacao-emergencia": [
      "Três blocos autônomos de iluminação de emergência da escada B sem carga.",
      "Luminária de emergência do subsolo 2 queimada.",
    ],
    nobreak: [
      "Nobreak da sala de CFTV sinalizando bateria em fim de vida.",
      "Nobreak do rack de automação desligou durante a queda de energia.",
    ],
    "obras-reformas": [
      "Obra da unidade 142 gerando ruído fora do horário permitido.",
      "Entulho da reforma do 5º andar depositado em área comum.",
    ],
  };

  const planosAcao = [
    "Empresa especializada acionada; chamado aberto sob protocolo. Aguardando visita técnica.",
    "Equipe de manutenção predial executou reparo provisório. Peça definitiva solicitada ao fornecedor.",
    "Orçamento encaminhado ao síndico para aprovação; execução prevista após liberação.",
    "Item isolado e sinalizado. Correção programada para a próxima janela de manutenção.",
  ];

  const hoje = new Date();
  let totalBoletins = 0;
  let totalOcorrencias = 0;

  for (const condominioId of condominioIds) {
    for (let d = dias - 1; d >= 0; d--) {
      const data = new Date(hoje);
      data.setUTCDate(data.getUTCDate() - d);
      data.setUTCHours(11, Math.floor(rand() * 59), 0, 0);
      const referencia = referenciaDe(data);

      // Nem todo dia tem boletim — fins de semana falham mais.
      const diaSemana = data.getUTCDay();
      const chanceDeRegistro = diaSemana === 0 || diaSemana === 6 ? 0.55 : 0.95;
      if (rand() > chanceDeRegistro) continue;

      const naoConformes: { itemId: number; codigo: string; observacao: string }[] = [];
      const criacoesItens = itens.map((item) => {
        const peso = pesoPorCodigo[item.codigo] ?? 1;
        const chance = 0.006 * peso;
        const sorteio = rand();

        if (sorteio < chance) {
          const opcoes = descricoes[item.codigo] ?? [
            `Não conformidade identificada em ${item.nome} durante a ronda operacional.`,
          ];
          const observacao = escolher(opcoes);
          naoConformes.push({ itemId: item.id, codigo: item.codigo, observacao });
          return { checklistItemId: item.id, situacao: "NAO_CONFORME" as const, observacao };
        }
        if (rand() < 0.02) {
          return { checklistItemId: item.id, situacao: "NAO_APLICAVEL" as const };
        }
        return { checklistItemId: item.id, situacao: "CONFORME" as const };
      });

      // Faltas são derivadas: item do grupo EQUIPES marcado como não conforme.
      const equipesComFalta = naoConformes.filter(
        (n) => itens.find((i) => i.id === n.itemId)?.grupo === GRUPO_EQUIPES,
      );

      const temCritico = naoConformes.some(
        (n) => itens.find((i) => i.id === n.itemId)?.criticidadePadrao === "ALTA",
      );
      const statusGeral =
        naoConformes.length === 0
          ? ("EM_CONFORMIDADE" as const)
          : temCritico || naoConformes.length >= 3
            ? ("OCORRENCIA_CRITICA" as const)
            : ("OCORRENCIA_PONTUAL" as const);

      const boletim = await prisma.boletim.create({
        data: {
          condominioId,
          dataRegistro: data,
          dataReferencia: referencia,
          statusGeral,
          houveFaltas: equipesComFalta.length > 0,
          qtdeFaltas: equipesComFalta.length,
          setoresFaltas:
            equipesComFalta.length > 0
              ? equipesComFalta
                  .map((n) => itens.find((i) => i.id === n.itemId)?.nome ?? "")
                  .join(", ")
              : null,
          criadoPorId: adminId,
          itens: { create: criacoesItens },
        },
        include: { itens: true },
      });
      totalBoletins++;

      for (const nc of naoConformes) {
        const boletimItem = boletim.itens.find((i) => i.checklistItemId === nc.itemId)!;

        const catalogoItem = itens.find((i) => i.id === nc.itemId)!;
        const criticidade: Criticidade = catalogoItem.criticidadePadrao;

        // Ocorrências antigas têm mais chance de já estarem concluídas.
        const idade = d;
        const sorteioStatus = rand();
        let status: StatusOcorrencia = "PENDENTE";
        if (idade > 30) status = sorteioStatus < 0.85 ? "CONCLUIDO" : "EM_ANDAMENTO";
        else if (idade > 10) status = sorteioStatus < 0.6 ? "CONCLUIDO" : sorteioStatus < 0.85 ? "EM_ANDAMENTO" : "PENDENTE";
        else status = sorteioStatus < 0.3 ? "CONCLUIDO" : sorteioStatus < 0.7 ? "EM_ANDAMENTO" : "PENDENTE";

        /*
         * Prazo dos dados de exemplo.
         *
         * Vive aqui, e não no código da aplicação, porque a aplicação NÃO
         * calcula prazo: quem preenche informa, ou fica sem. O seed precisa de
         * datas plausíveis para o dashboard ter o que mostrar, e uma parte
         * fica deliberadamente sem previsão, que é o caso real de "ainda não
         * combinamos quando".
         */
        const prazoDias = { ALTA: 3, MEDIA: 7, BAIXA: 15 }[criticidade];
        const semPrazo = rand() < 0.2;
        const previsao = new Date(data);
        previsao.setUTCDate(previsao.getUTCDate() + prazoDias);

        const conclusao =
          status === "CONCLUIDO"
            ? new Date(data.getTime() + (1 + Math.floor(rand() * (prazoDias + 3))) * 86_400_000)
            : null;

        // Mesma regra da aplicação: um problema já em aberto não vira uma nova
        // ocorrência — vira recorrência da existente.
        const emAberto = await prisma.ocorrencia.findFirst({
          where: {
            condominioId,
            checklistItemId: nc.itemId,
            status: { in: ["PENDENTE", "EM_ANDAMENTO"] },
          },
          orderBy: { dataAbertura: "asc" },
          select: { id: true },
        });

        if (emAberto) {
          await prisma.ocorrenciaRecorrencia.create({
            data: {
              ocorrenciaId: emAberto.id,
              boletimId: boletim.id,
              dataReferencia: referencia,
              observacao: nc.observacao,
            },
          });
          await prisma.ocorrencia.update({
            where: { id: emAberto.id },
            data: {
              ultimaRecorrenciaEm: data,
              totalRecorrencias: { increment: 1 },
            },
          });
          continue;
        }

        const ocorrencia = await prisma.ocorrencia.create({
          data: {
            condominioId,
            checklistItemId: nc.itemId,
            descricao: nc.observacao,
            planoAcao: rand() < 0.8 ? escolher(planosAcao) : null,
            criticidade,
            status,
            previsaoFinalizacao: semPrazo ? null : previsao,
            dataConclusao: conclusao,
            dataAbertura: data,
            origem: "BOLETIM",
            boletimId: boletim.id,
            boletimItemId: boletimItem.id,
            abertaPorId: adminId,
          },
        });
        totalOcorrencias++;

        await prisma.ocorrenciaLog.create({
          data: {
            ocorrenciaId: ocorrencia.id,
            usuarioId: adminId,
            mensagem: `Ocorrência aberta automaticamente pelo boletim de ${referencia}.`,
            criadoEm: data,
          },
        });
        if (status !== "PENDENTE") {
          await prisma.ocorrenciaLog.create({
            data: {
              ocorrenciaId: ocorrencia.id,
              usuarioId: adminId,
              mensagem:
                status === "CONCLUIDO"
                  ? "Status alterado para Concluído após validação do reparo."
                  : "Status alterado para Em Andamento — fornecedor acionado.",
              campo: "status",
              valorAntes: "PENDENTE",
              valorDepois: status,
              criadoEm: conclusao ?? new Date(data.getTime() + 86_400_000),
            },
          });
        }
      }
    }
  }

  console.log(`✔ Boletins: ${totalBoletins} | Ocorrências: ${totalOcorrencias}`);
}

async function seedPlanosAcao(condominioIds: number[]) {
  if ((await prisma.planoAcao.count()) > 0) return;

  const modelos = [
    { local: "Fachada / Envidraçamento", descricao: "Recuperação do rejunte e substituição de selantes da fachada norte, com laudo de estanqueidade.", criticidade: "MEDIA" as const },
    { local: "Casa de Máquinas — Elevadores", descricao: "Modernização do quadro de comando dos elevadores sociais 01 e 02 (troca de inversores e botoeiras).", criticidade: "ALTA" as const },
    { local: "Subsolo 2 — Elétrica", descricao: "Adequação do quadro geral de baixa tensão à NBR 5410, incluindo mapeamento e identificação de circuitos.", criticidade: "ALTA" as const },
    { local: "Reservatório Superior", descricao: "Impermeabilização e limpeza técnica do reservatório superior, com nova tampa de inspeção.", criticidade: "MEDIA" as const },
    { local: "Áreas Comuns — Iluminação", descricao: "Retrofit de iluminação para LED nas garagens e escadas, com estudo de retorno de investimento.", criticidade: "BAIXA" as const },
    { local: "Central de Segurança", descricao: "Ampliação do CFTV com 12 novas câmeras e substituição do gravador por unidade com 30 dias de retenção.", criticidade: "MEDIA" as const },
    { local: "Sistema de Incêndio", descricao: "Recarga e teste hidrostático dos extintores e revisão geral da rede de sprinklers.", criticidade: "ALTA" as const },
    { local: "Cobertura / Torre de Resfriamento", descricao: "Tratamento químico e substituição de eliminadores de gotas da torre de resfriamento.", criticidade: "BAIXA" as const },
  ];

  const hoje = new Date();
  let total = 0;

  for (const condominioId of condominioIds) {
    for (const modelo of modelos) {
      if (rand() < 0.25) continue;

      const criacao = new Date(hoje);
      criacao.setUTCDate(criacao.getUTCDate() - Math.floor(rand() * 120));
      const previsao = new Date(criacao);
      previsao.setUTCDate(previsao.getUTCDate() + 30 + Math.floor(rand() * 120));

      const sorteio = rand();
      const status: StatusOcorrencia =
        sorteio < 0.3 ? "CONCLUIDO" : sorteio < 0.7 ? "EM_ANDAMENTO" : "PENDENTE";

      await prisma.planoAcao.create({
        data: {
          condominioId,
          dataCriacao: criacao,
          local: modelo.local,
          descricao: modelo.descricao,
          criticidade: modelo.criticidade,
          status,
          previsaoFinalizacao: previsao,
          dataConclusao: status === "CONCLUIDO" ? previsao : null,
          responsavel: escolher([
            "Engenharia Predial", "Administradora", "Fornecedor externo", "Equipe de manutenção",
          ]),
        },
      });
      total++;
    }
  }
  console.log(`✔ Planos de ação: ${total}`);
}

async function main() {
  console.log("Populando o banco...\n");
  await seedChecklist();
  const condominios = await seedCondominios();
  const ids = condominios.map((c) => c.id);
  const admin = await seedUsuarios(ids);
  await seedMovimento(ids, admin.id);
  await seedPlanosAcao(ids);

  console.log("\nAcesso de demonstração:");
  console.log(`  Admin  → sindico@condominios.com.br / ${SENHA_PADRAO}`);
  console.log(`  Gerente → gestor.atrium@condominios.com.br / ${SENHA_PADRAO}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
