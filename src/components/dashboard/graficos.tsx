"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { STATUS_DIA_LABEL } from "@/lib/labels";
import { formatarDataReferencia } from "@/lib/datas";
import { useTokensViz } from "@/components/dashboard/tokens";

/* -------------------------------------------------------------------------
   Tooltip compartilhado — texto sempre em tinta neutra; a cor fica só na
   marca ao lado do rótulo, nunca no número.
   ------------------------------------------------------------------------- */

type ItemTooltip = { name?: string; value?: number | string; color?: string };

function Tooltipzinho({
  active,
  payload,
  label,
  sufixo,
}: {
  active?: boolean;
  payload?: ItemTooltip[];
  label?: string;
  sufixo?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="viz-tooltip">
      {label ? (
        <div className="font-semibold mb-1.5 text-xs">{label}</div>
      ) : null}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ background: item.color }}
            />
            {item.name}
          </span>
          <span className="num font-semibold">
            {item.value}
            {sufixo ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------
   1. Ocorrências por Setor — barras horizontais, série única.
      Série única não leva legenda: o título já nomeia a medida. O valor vai
      direto na ponta de cada barra, então a leitura não depende da cor.
   ------------------------------------------------------------------------- */

export function GraficoSetores({
  dados,
}: {
  dados: { setor: string; total: number }[];
}) {
  const t = useTokensViz();

  if (dados.length === 0) {
    return <VazioGrafico texto="Nenhuma ocorrência registrada no período." />;
  }

  const maximo = Math.max(...dados.map((d) => d.total));

  return (
    <ResponsiveContainer width="100%" height={Math.max(dados.length * 38 + 24, 180)}>
      <BarChart
        data={dados}
        layout="vertical"
        margin={{ top: 4, right: 40, bottom: 4, left: 4 }}
        barCategoryGap="22%"
      >
        <CartesianGrid horizontal={false} stroke={t.grade} strokeDasharray="0" />
        <XAxis
          type="number"
          domain={[0, Math.ceil(maximo * 1.15)]}
          tick={{ fill: t["tinta-3"], fontSize: 11 }}
          axisLine={{ stroke: t.eixo }}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="setor"
          width={140}
          tick={{ fill: t["tinta-2"], fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<Tooltipzinho />}
          cursor={{ fill: t["superficie-2"] }}
        />
        <Bar
          dataKey="total"
          name="Ocorrências"
          fill={t["serie-1"]}
          radius={[0, 4, 4, 0]}
          maxBarSize={18}
          label={{
            position: "right",
            fill: t["tinta-2"],
            fontSize: 11,
            fontWeight: 600,
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* -------------------------------------------------------------------------
   2. Linha do tempo — volume diário de ocorrências, série única.
   ------------------------------------------------------------------------- */

export function GraficoLinhaTempo({
  dados,
}: {
  dados: { dia: string; rotulo: string; ocorrencias: number }[];
}) {
  const t = useTokensViz();
  const maximo = Math.max(...dados.map((d) => d.ocorrencias), 1);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={dados} margin={{ top: 8, right: 12, bottom: 4, left: -18 }}>
        <CartesianGrid vertical={false} stroke={t.grade} />
        <XAxis
          dataKey="rotulo"
          tick={{ fill: t["tinta-3"], fontSize: 10 }}
          axisLine={{ stroke: t.eixo }}
          tickLine={false}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: t["tinta-3"], fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          domain={[0, Math.max(Math.ceil(maximo * 1.2), 2)]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const ponto = payload[0].payload as { dia: string; ocorrencias: number };
            return (
              <div className="viz-tooltip">
                <div className="font-semibold mb-1 text-xs num">
                  {formatarDataReferencia(ponto.dia)}
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{ background: t["serie-1"] }}
                    />
                    Ocorrências abertas
                  </span>
                  <span className="num font-semibold">{ponto.ocorrencias}</span>
                </div>
              </div>
            );
          }}
          cursor={{ stroke: t.eixo, strokeWidth: 1 }}
        />
        <Line
          type="monotone"
          dataKey="ocorrencias"
          name="Ocorrências abertas"
          stroke={t["serie-1"]}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: t.superficie }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* -------------------------------------------------------------------------
   3. Abertas x Concluídas por mês — duas séries categóricas (azul + aqua),
      par validado em claro e escuro. Legenda presente por serem 2 séries.
   ------------------------------------------------------------------------- */

export function GraficoHistoricoMensal({
  dados,
}: {
  dados: { rotuloCurto: string; abertas: number; concluidas: number }[];
}) {
  const t = useTokensViz();

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={dados} margin={{ top: 8, right: 8, bottom: 4, left: -18 }}>
        <CartesianGrid vertical={false} stroke={t.grade} />
        <XAxis
          dataKey="rotuloCurto"
          tick={{ fill: t["tinta-3"], fontSize: 11 }}
          axisLine={{ stroke: t.eixo }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: t["tinta-3"], fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<Tooltipzinho />} cursor={{ fill: t["superficie-2"] }} />
        <Legend
          verticalAlign="top"
          align="left"
          height={28}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: t["tinta-2"] }}
        />
        {/* barGap 2 mantém a folga de 2px entre barras adjacentes. */}
        <Bar
          dataKey="abertas"
          name="Abertas"
          fill={t["serie-1"]}
          radius={[4, 4, 0, 0]}
          maxBarSize={22}
        />
        <Bar
          dataKey="concluidas"
          name="Concluídas"
          fill={t["serie-2"]}
          radius={[4, 4, 0, 0]}
          maxBarSize={22}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* -------------------------------------------------------------------------
   4. Distribuição do status do dia — rampa ordinal de um único matiz
      (conformidade → crítica é severidade ordenada, não identidade).
      Cada fatia leva rótulo próprio, então a cor é reforço, não a informação.
   ------------------------------------------------------------------------- */

export function BarraConformidade({
  dados,
}: {
  dados: { chave: "EM_CONFORMIDADE" | "OCORRENCIA_PONTUAL" | "OCORRENCIA_CRITICA"; total: number }[];
}) {
  const t = useTokensViz();
  const total = dados.reduce((s, d) => s + d.total, 0);
  const cores = [t["ordinal-1"], t["ordinal-2"], t["ordinal-3"]];

  if (total === 0) {
    return <VazioGrafico texto="Nenhum boletim lançado no período." />;
  }

  return (
    <div>
      <div
        className="flex h-8 w-full overflow-hidden rounded-lg"
        role="img"
        aria-label={dados
          .map((d) => `${STATUS_DIA_LABEL[d.chave]}: ${d.total} dias`)
          .join("; ")}
      >
        {dados.map((d, i) =>
          d.total === 0 ? null : (
            <div
              key={d.chave}
              className="flex items-center justify-center text-xs font-bold num"
              style={{
                width: `${(d.total / total) * 100}%`,
                background: cores[i],
                color: i === 0 ? "#0b0b0b" : "#ffffff",
                // Folga de 2px na cor da superfície entre segmentos.
                marginRight: i < dados.length - 1 ? 2 : 0,
              }}
              title={`${STATUS_DIA_LABEL[d.chave]}: ${d.total}`}
            >
              {(d.total / total) * 100 >= 8 ? d.total : ""}
            </div>
          ),
        )}
      </div>

      <ul className="mt-3 space-y-1.5">
        {dados.map((d, i) => (
          <li key={d.chave} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2" style={{ color: "var(--tinta-2)" }}>
              <span
                aria-hidden
                className="h-2.5 w-2.5 flex-none rounded-full"
                style={{ background: cores[i] }}
              />
              {STATUS_DIA_LABEL[d.chave]}
            </span>
            <span className="num font-semibold">
              {d.total}
              <span className="font-normal ml-1" style={{ color: "var(--tinta-3)" }}>
                ({total > 0 ? Math.round((d.total / total) * 100) : 0}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------
   5. Planos de ação por status — barra ordinal compacta.
   ------------------------------------------------------------------------- */

export function GraficoPlanos({
  dados,
}: {
  dados: { status: string; total: number }[];
}) {
  const t = useTokensViz();
  const cores = [t["ordinal-3"], t["ordinal-2"], t["ordinal-1"]];

  if (dados.every((d) => d.total === 0)) {
    return <VazioGrafico texto="Nenhum plano de ação cadastrado." />;
  }

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart
        data={dados}
        layout="vertical"
        margin={{ top: 4, right: 36, bottom: 4, left: 4 }}
        barCategoryGap="24%"
      >
        <CartesianGrid horizontal={false} stroke={t.grade} />
        <XAxis
          type="number"
          tick={{ fill: t["tinta-3"], fontSize: 10 }}
          axisLine={{ stroke: t.eixo }}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="status"
          width={96}
          tick={{ fill: t["tinta-2"], fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<Tooltipzinho />} cursor={{ fill: t["superficie-2"] }} />
        <Bar
          dataKey="total"
          name="Planos"
          radius={[0, 4, 4, 0]}
          maxBarSize={16}
          label={{ position: "right", fill: t["tinta-2"], fontSize: 11, fontWeight: 600 }}
        >
          {dados.map((_, i) => (
            <Cell key={i} fill={cores[i] ?? t["serie-1"]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* -------------------------------------------------------------------------
   6. Condomínio x boletins x ocorrências — duas séries categóricas no mesmo
      par validado (azul + aqua). Barras horizontais porque o rótulo é o nome
      do condomínio, que é longo e não cabe girado no eixo X.
   ------------------------------------------------------------------------- */

export type LinhaCondominio = {
  id: number;
  nome: string;
  ativo: boolean;
  boletins: number;
  boletinsEsperados: number;
  cobertura: number | null;
  diasConformes: number;
  ocorrencias: number;
  criticas: number;
  emAberto: number;
  atrasadas: number;
};

export function GraficoCondominios({ dados }: { dados: LinhaCondominio[] }) {
  const t = useTokensViz();

  if (dados.length === 0) {
    return <VazioGrafico texto="Nenhum condomínio no filtro atual." />;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(dados.length * 46 + 40, 200)}>
      <BarChart
        data={dados}
        layout="vertical"
        margin={{ top: 4, right: 36, bottom: 4, left: 4 }}
        barCategoryGap="26%"
      >
        <CartesianGrid horizontal={false} stroke={t.grade} />
        <XAxis
          type="number"
          tick={{ fill: t["tinta-3"], fontSize: 10 }}
          axisLine={{ stroke: t.eixo }}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="nome"
          width={140}
          tick={{ fill: t["tinta-2"], fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<Tooltipzinho />} cursor={{ fill: t["superficie-2"] }} />
        <Legend
          verticalAlign="top"
          align="left"
          height={28}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: t["tinta-2"] }}
        />
        <Bar
          dataKey="boletins"
          name="Boletins preenchidos"
          fill={t["serie-1"]}
          radius={[0, 4, 4, 0]}
          maxBarSize={14}
          label={{ position: "right", fill: t["tinta-2"], fontSize: 10, fontWeight: 600 }}
        />
        <Bar
          dataKey="ocorrencias"
          name="Ocorrências abertas"
          fill={t["serie-2"]}
          radius={[0, 4, 4, 0]}
          maxBarSize={14}
          label={{ position: "right", fill: t["tinta-2"], fontSize: 10, fontWeight: 600 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function VazioGrafico({ texto }: { texto: string }) {
  return (
    <div
      className="flex h-32 items-center justify-center rounded-lg text-sm"
      style={{ background: "var(--superficie-2)", color: "var(--tinta-3)" }}
    >
      {texto}
    </div>
  );
}
