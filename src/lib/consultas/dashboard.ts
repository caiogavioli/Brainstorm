import "server-only";

import type { Criticidade, Prisma, StatusOcorrencia } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  dataReferenciaDe,
  diasDoIntervalo,
  formatarDataReferencia,
  intervaloDeDatas,
  intervaloDoMes,
  rotuloDiaCurto,
  rotuloIntervalo,
  rotuloMes,
  ultimosMeses,
} from "@/lib/datas";

export type FiltroDashboard = {
  /** null = todos os condomínios do escopo do usuário. */
  condominioId: number | null;
  /**
   * Intervalo analisado, "YYYY-MM-DD" nas duas pontas, inclusive.
   *
   * A análise operacional é diária — a pergunta de toda manhã é "quem mandou o
   * boletim ontem" — mas quase nunca cai certinho num mês do calendário. Um
   * intervalo livre atende os dois casos: `de === ate` é a leitura do dia.
   */
  de: string;
  ate: string;
  /** Escopo do usuário (null = ADMIN, vê todos). */
  escopo: number[] | null;
};

/**
 * Acima disso a linha do tempo vira um borrão de barras de um pixel, então ela
 * passa a agregar por mês. Dois meses de dias ainda são legíveis.
 */
const MAXIMO_DIAS_NA_LINHA = 62;

export type DadosDashboard = Awaited<ReturnType<typeof carregarDashboard>>;

/**
 * O condomínio pedido é sempre intersectado com o escopo do usuário — um
 * `?condominio=` fora do escopo não pode ampliar o que ele enxerga.
 */
function whereCondominio(filtro: FiltroDashboard) {
  if (filtro.condominioId != null) {
    if (filtro.escopo === null) return { condominioId: filtro.condominioId };
    return filtro.escopo.includes(filtro.condominioId)
      ? { condominioId: filtro.condominioId }
      : { condominioId: { in: [] as number[] } };
  }
  if (filtro.escopo) return { condominioId: { in: filtro.escopo } };
  return {};
}

/** O mesmo recorte, aplicado à tabela de condomínios (onde a coluna é `id`). */
function whereCondominioEntidade(filtro: FiltroDashboard): Prisma.CondominioWhereInput {
  const recorte = whereCondominio(filtro) as {
    condominioId?: number | { in: number[] };
  };
  return recorte.condominioId === undefined ? {} : { id: recorte.condominioId };
}

export async function carregarDashboard(filtro: FiltroDashboard) {
  const { inicio, fim } = intervaloDeDatas(filtro.de, filtro.ate);
  const base = whereCondominio(filtro);

  // Boletim se filtra por `dataReferencia` — o dia a que ele se refere — e não
  // por `dataRegistro`, o instante em que a linha foi gravada. Quem preenche às
  // 21h30 o boletim de hoje não deve ver o registro cair no dia seguinte.
  const whereBoletim: Prisma.BoletimWhereInput = {
    ...base,
    dataReferencia: { gte: filtro.de, lte: filtro.ate },
  };
  const whereOcorrenciaAberta: Prisma.OcorrenciaWhereInput = {
    ...base,
    dataAbertura: { gte: inicio, lt: fim },
  };

  const [
    boletins,
    ocorrenciasDoMes,
    concluidasNoMes,
    ocorrenciasEmAberto,
    porSetorBruto,
    planos,
    condominiosDoFiltro,
  ] = await Promise.all([
    prisma.boletim.findMany({
      where: whereBoletim,
      select: {
        dataReferencia: true,
        statusGeral: true,
        houveFaltas: true,
        qtdeFaltas: true,
        condominioId: true,
      },
    }),

    prisma.ocorrencia.findMany({
      where: whereOcorrenciaAberta,
      select: {
        id: true,
        dataAbertura: true,
        criticidade: true,
        status: true,
        checklistItemId: true,
        condominioId: true,
      },
    }),

    // Concluídas DENTRO do mês — inclui ocorrências abertas em meses anteriores,
    // que é o número que interessa para "resolvemos o quê neste mês".
    prisma.ocorrencia.count({
      where: { ...base, dataConclusao: { gte: inicio, lt: fim } },
    }),

    // Backlog vivo: tudo que ainda não foi concluído, independente do mês de
    // abertura — é sobre isso que a matriz de risco e a fila de prioridade falam.
    prisma.ocorrencia.findMany({
      where: { ...base, status: { in: ["PENDENTE", "EM_ANDAMENTO"] } },
      orderBy: [{ criticidade: "desc" }, { previsaoFinalizacao: "asc" }],
      include: {
        condominio: { select: { nome: true } },
        checklistItem: { select: { nome: true } },
      },
    }),

    prisma.ocorrencia.groupBy({
      by: ["checklistItemId"],
      where: whereOcorrenciaAberta,
      _count: { _all: true },
    }),

    prisma.planoAcao.findMany({
      where: base,
      select: { status: true, criticidade: true, previsaoFinalizacao: true },
    }),

    prisma.condominio.findMany({
      where: whereCondominioEntidade(filtro),
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, ativo: true },
    }),
  ]);

  // ---------------------------------------------------------------- KPIs ---

  const totalBoletins = boletins.length;
  const diasConformes = boletins.filter(
    (b) => b.statusGeral === "EM_CONFORMIDADE",
  ).length;
  const percentualConformidade =
    totalBoletins > 0 ? (diasConformes / totalBoletins) * 100 : 0;

  // Cobertura: quantos dias do mês realmente receberam boletim. Sem isso, um mês
  // com 2 boletins e 2 dias conformes exibiria "100% de conformidade".
  const hoje = dataReferenciaDe();
  // Só os dias já decorridos contam como esperados: um intervalo que avança
  // para o futuro não gera dívida de boletim.
  const diasDoPeriodo = diasDoIntervalo(filtro.de, filtro.ate).filter((d) => d <= hoje);
  const condominiosNoFiltro = filtro.condominioId
    ? 1
    : (filtro.escopo?.length ??
      (await prisma.condominio.count({ where: { ativo: true } })));
  const boletinsEsperados = Math.max(diasDoPeriodo.length * condominiosNoFiltro, 1);
  const coberturaBoletins = Math.min((totalBoletins / boletinsEsperados) * 100, 100);

  const abertasNoMes = ocorrenciasDoMes.length;
  const criticasNoMes = ocorrenciasDoMes.filter((o) => o.criticidade === "ALTA").length;
  const taxaCriticas = abertasNoMes > 0 ? (criticasNoMes / abertasNoMes) * 100 : 0;

  const boletinsComFalta = boletins.filter((b) => b.houveFaltas).length;
  const totalFaltas = boletins.reduce((soma, b) => soma + b.qtdeFaltas, 0);

  // ------------------------------------------------- Ocorrências por setor ---

  const idsSetor = porSetorBruto
    .map((s) => s.checklistItemId)
    .filter((id): id is number => id !== null);
  const itens = await prisma.checklistItem.findMany({
    where: { id: { in: idsSetor } },
    select: { id: true, nome: true, grupo: true },
  });
  const nomePorId = new Map(itens.map((i) => [i.id, i.nome]));

  const porSetor = porSetorBruto
    .map((s) => ({
      setor:
        s.checklistItemId === null
          ? "Outros / avulsas"
          : (nomePorId.get(s.checklistItemId) ?? "—"),
      total: s._count._all,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // ------------------------------------------------------ Linha do tempo ----

  const todosOsDias = diasDoIntervalo(filtro.de, filtro.ate);
  const porMes = todosOsDias.length > MAXIMO_DIAS_NA_LINHA;

  const contagemPorChave = new Map<string, number>();
  for (const o of ocorrenciasDoMes) {
    const dia = dataReferenciaDe(o.dataAbertura);
    const chave = porMes ? dia.slice(0, 7) : dia;
    contagemPorChave.set(chave, (contagemPorChave.get(chave) ?? 0) + 1);
  }

  const linhaDoTempo = {
    agregadaPorMes: porMes,
    pontos: porMes
      ? [...new Set(todosOsDias.map((d) => d.slice(0, 7)))].map((mes) => ({
          rotulo: rotuloMes(mes).slice(0, 3),
          rotuloCompleto: rotuloMes(mes),
          ocorrencias: contagemPorChave.get(mes) ?? 0,
        }))
      : todosOsDias.map((dia) => ({
          rotulo: rotuloDiaCurto(dia),
          rotuloCompleto: formatarDataReferencia(dia),
          ocorrencias: contagemPorChave.get(dia) ?? 0,
        })),
  };

  // ----------------------------------------- Distribuição do status do dia ---

  const distribuicaoStatusDia = [
    {
      chave: "EM_CONFORMIDADE" as const,
      total: boletins.filter((b) => b.statusGeral === "EM_CONFORMIDADE").length,
    },
    {
      chave: "OCORRENCIA_PONTUAL" as const,
      total: boletins.filter((b) => b.statusGeral === "OCORRENCIA_PONTUAL").length,
    },
    {
      chave: "OCORRENCIA_CRITICA" as const,
      total: boletins.filter((b) => b.statusGeral === "OCORRENCIA_CRITICA").length,
    },
  ];

  // --------------------------------------- Abertas x concluídas (6 meses) ----

  // A tendência é sempre mensal e ancorada no fim do intervalo — ela existe
  // justamente para dar o contexto que o recorte escolhido não dá.
  const meses = ultimosMeses(filtro.ate.slice(0, 7), 6);
  const primeiroMes = intervaloDoMes(meses[0]).inicio;
  const [aberturasHistorico, conclusoesHistorico] = await Promise.all([
    prisma.ocorrencia.findMany({
      where: { ...base, dataAbertura: { gte: primeiroMes, lt: fim } },
      select: { dataAbertura: true },
    }),
    prisma.ocorrencia.findMany({
      where: { ...base, dataConclusao: { gte: primeiroMes, lt: fim } },
      select: { dataConclusao: true },
    }),
  ]);

  const chaveMes = (d: Date) => dataReferenciaDe(d).slice(0, 7);
  const aberturasPorMes = new Map<string, number>();
  for (const a of aberturasHistorico) {
    const k = chaveMes(a.dataAbertura);
    aberturasPorMes.set(k, (aberturasPorMes.get(k) ?? 0) + 1);
  }
  const conclusoesPorMes = new Map<string, number>();
  for (const c of conclusoesHistorico) {
    if (!c.dataConclusao) continue;
    const k = chaveMes(c.dataConclusao);
    conclusoesPorMes.set(k, (conclusoesPorMes.get(k) ?? 0) + 1);
  }
  const historicoMensal = meses.map((m) => ({
    mes: m,
    rotulo: rotuloMes(m).replace("/", "\n"),
    rotuloCurto: rotuloMes(m).slice(0, 3),
    abertas: aberturasPorMes.get(m) ?? 0,
    concluidas: conclusoesPorMes.get(m) ?? 0,
  }));

  // ------------------------------------------------------- Matriz de risco ---

  const referencia = new Date();
  const faixas = ["ATRASADA", "VENCE_3_DIAS", "NO_PRAZO", "SEM_PRAZO"] as const;
  type Faixa = (typeof faixas)[number];

  function faixaSLA(previsao: Date | null): Faixa {
    if (!previsao) return "SEM_PRAZO";
    const alvo = new Date(dataReferenciaDe(previsao));
    const hojeData = new Date(dataReferenciaDe(referencia));
    const dias = Math.round((alvo.getTime() - hojeData.getTime()) / 86_400_000);
    if (dias < 0) return "ATRASADA";
    if (dias <= 3) return "VENCE_3_DIAS";
    return "NO_PRAZO";
  }

  const criticidades: Criticidade[] = ["ALTA", "MEDIA", "BAIXA"];
  const matrizRisco = criticidades.map((criticidade) => {
    const linha = ocorrenciasEmAberto.filter((o) => o.criticidade === criticidade);
    const celulas = Object.fromEntries(
      faixas.map((f) => [
        f,
        linha.filter((o) => faixaSLA(o.previsaoFinalizacao) === f).length,
      ]),
    ) as Record<Faixa, number>;
    return { criticidade, celulas, total: linha.length };
  });

  const atrasadas = ocorrenciasEmAberto.filter(
    (o) => faixaSLA(o.previsaoFinalizacao) === "ATRASADA",
  ).length;

  // ------------------------------------------------- Fila de prioridade -----

  const filaPrioridade = ocorrenciasEmAberto
    .filter((o) => o.status === "PENDENTE" && o.criticidade !== "BAIXA")
    .slice(0, 15)
    .map((o) => ({
      id: o.id,
      condominio: o.condominio.nome,
      setor: o.checklistItem?.nome ?? o.setorLivre ?? "—",
      descricao: o.descricao,
      criticidade: o.criticidade,
      status: o.status,
      previsaoFinalizacao: o.previsaoFinalizacao,
    }));

  // ------------------------------------------ Condomínio x boletim/ocorrência

  // Os números do mês quebrados por prédio. É o que responde "quem não está
  // mandando boletim" e "quem está consumindo a operação", perguntas que os
  // totais agregados escondem: um condomínio silencioso parece saudável.
  const boletinsPorCondominio = new Map<number, number>();
  const conformesPorCondominio = new Map<number, number>();
  for (const b of boletins) {
    boletinsPorCondominio.set(
      b.condominioId,
      (boletinsPorCondominio.get(b.condominioId) ?? 0) + 1,
    );
    if (b.statusGeral === "EM_CONFORMIDADE") {
      conformesPorCondominio.set(
        b.condominioId,
        (conformesPorCondominio.get(b.condominioId) ?? 0) + 1,
      );
    }
  }

  const ocorrenciasPorCondominio = new Map<number, number>();
  const criticasPorCondominio = new Map<number, number>();
  for (const o of ocorrenciasDoMes) {
    ocorrenciasPorCondominio.set(
      o.condominioId,
      (ocorrenciasPorCondominio.get(o.condominioId) ?? 0) + 1,
    );
    if (o.criticidade === "ALTA") {
      criticasPorCondominio.set(
        o.condominioId,
        (criticasPorCondominio.get(o.condominioId) ?? 0) + 1,
      );
    }
  }

  const abertoPorCondominio = new Map<number, number>();
  const atrasadasPorCondominio = new Map<number, number>();
  for (const o of ocorrenciasEmAberto) {
    abertoPorCondominio.set(
      o.condominioId,
      (abertoPorCondominio.get(o.condominioId) ?? 0) + 1,
    );
    if (faixaSLA(o.previsaoFinalizacao) === "ATRASADA") {
      atrasadasPorCondominio.set(
        o.condominioId,
        (atrasadasPorCondominio.get(o.condominioId) ?? 0) + 1,
      );
    }
  }

  // Um condomínio desativado no meio do mês não "deve" boletins, mas o histórico
  // que ele já gerou continua contando.
  const esperadosPorCondominio = diasDoPeriodo.length;

  const porCondominio = condominiosDoFiltro
    .map((c) => {
      const enviados = boletinsPorCondominio.get(c.id) ?? 0;
      const esperados = c.ativo ? esperadosPorCondominio : 0;
      return {
        id: c.id,
        nome: c.nome,
        ativo: c.ativo,
        boletins: enviados,
        boletinsEsperados: esperados,
        cobertura: esperados > 0 ? Math.min((enviados / esperados) * 100, 100) : null,
        diasConformes: conformesPorCondominio.get(c.id) ?? 0,
        ocorrencias: ocorrenciasPorCondominio.get(c.id) ?? 0,
        criticas: criticasPorCondominio.get(c.id) ?? 0,
        emAberto: abertoPorCondominio.get(c.id) ?? 0,
        atrasadas: atrasadasPorCondominio.get(c.id) ?? 0,
      };
    })
    // Some da lista quem está inativo e não deixou nada no período.
    .filter((c) => c.ativo || c.boletins > 0 || c.ocorrencias > 0 || c.emAberto > 0)
    .sort((a, b) => b.ocorrencias - a.ocorrencias || a.nome.localeCompare(b.nome, "pt-BR"));

  // --------------------------------------- Preenchimento no período por prédio
  //
  // O quadro responde a pergunta operacional da manhã: quem mandou o boletim e
  // quem não mandou. Num intervalo de vários dias a pergunta não é mais sim ou
  // não, então vira contagem: vermelho é faltar ao menos um dia, amarelo é ter
  // mandado tudo mas deixar não conformidade sem plano.
  //
  // Só os dias já decorridos contam. Cobrar boletim de amanhã acenderia vermelho
  // no prédio inteiro e tornaria o quadro inútil justamente em quem consulta o
  // mês corrente.
  const umUnicoDia = diasDoPeriodo.length === 1;

  const boletinsDoPeriodo = await prisma.boletim.findMany({
    where: {
      ...base,
      dataReferencia: { gte: filtro.de, lte: filtro.ate },
    },
    select: {
      condominioId: true,
      dataReferencia: true,
      dataRegistro: true,
      preenchidoPor: true,
      itens: { where: { situacao: "NAO_CONFORME" }, select: { id: true } },
      ocorrencias: { select: { id: true, planoAcao: true } },
    },
  });

  const porPredio = new Map<number, typeof boletinsDoPeriodo>();
  for (const b of boletinsDoPeriodo) {
    const lista = porPredio.get(b.condominioId);
    if (lista) lista.push(b);
    else porPredio.set(b.condominioId, [b]);
  }

  const quadroPreenchimento = condominiosDoFiltro
    .filter((c) => c.ativo)
    .map((c) => {
      const doPredio = (porPredio.get(c.id) ?? []).filter((b) =>
        diasDoPeriodo.includes(b.dataReferencia),
      );

      /*
       * Amarelo = enviado, mas o tratamento não foi fechado.
       *
       * Uma não conformidade sem plano de ação é um problema que ninguém
       * assumiu. Contar isso como "preenchido" esconderia exatamente o que a
       * análise diária existe para encontrar. Prazo em branco NÃO conta como
       * pendência: ele é legitimamente opcional.
       */
      const semPlano = doPredio.reduce(
        (soma, b) =>
          soma +
          b.ocorrencias.filter((o) => !o.planoAcao || o.planoAcao.trim().length === 0)
            .length,
        0,
      );
      const naoConformes = doPredio.reduce((soma, b) => soma + b.itens.length, 0);
      const faltando = diasDoPeriodo.length - doPredio.length;

      const luz =
        faltando > 0 ? ("VERMELHA" as const)
        : semPlano > 0 ? ("AMARELA" as const)
        : ("VERDE" as const);

      return {
        id: c.id,
        nome: c.nome,
        luz,
        diasEsperados: diasDoPeriodo.length,
        diasPreenchidos: doPredio.length,
        semPlano,
        naoConformes,
        // Hora e autor só fazem sentido quando há um boletim único a apontar.
        enviadoEm: umUnicoDia ? (doPredio[0]?.dataRegistro ?? null) : null,
        preenchidoPor: umUnicoDia ? (doPredio[0]?.preenchidoPor ?? null) : null,
      };
    })
    .sort((a, b) => {
      // Vermelho primeiro: é o que exige ação hoje.
      const peso = { VERMELHA: 0, AMARELA: 1, VERDE: 2 };
      return peso[a.luz] - peso[b.luz] || a.nome.localeCompare(b.nome, "pt-BR");
    });

  // ------------------------------------------------------------- Planos -----

  const planosPorStatus = (["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"] as StatusOcorrencia[]).map(
    (s) => ({ status: s, total: planos.filter((p) => p.status === s).length }),
  );

  return {
    periodo: {
      de: filtro.de,
      ate: filtro.ate,
      rotulo: rotuloIntervalo(filtro.de, filtro.ate),
      dias: todosOsDias.length,
      diasDecorridos: diasDoPeriodo.length,
    },
    kpis: {
      percentualConformidade,
      diasConformes,
      totalBoletins,
      coberturaBoletins,
      boletinsEsperados,
      abertasNoMes,
      concluidasNoMes,
      taxaCriticas,
      criticasNoMes,
      boletinsComFalta,
      totalFaltas,
      emAberto: ocorrenciasEmAberto.length,
      atrasadas,
    },
    porSetor,
    linhaDoTempo,
    distribuicaoStatusDia,
    historicoMensal,
    matrizRisco,
    quadroPreenchimento,
    porCondominio,
    filaPrioridade,
    planosPorStatus,
    totalPlanos: planos.length,
  };
}
