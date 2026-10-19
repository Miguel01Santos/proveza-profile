"use client";

import { useMemo, useState } from "react";

type Stats = {
  generatedAt: string;
  total: number;
  firstDay: string | null;
  byGroup: Record<string, number>;
  byYear: Record<string, number>;
  days: Record<string, number>;
};

// Mesmos tons do gráfico de contribuições do GitHub no tema escuro.
const LEVELS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const WEEKDAYS = ["", "Seg", "", "Qua", "", "Sex", ""];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const DAY = 86_400_000;
const toKey = (d: Date) => d.toISOString().slice(0, 10);
const parse = (key: string) => new Date(`${key}T00:00:00Z`);

// Faixas por quartis dos dias com commit (como o GitHub), para que um dia fora da
// curva não deixe todo o resto do gráfico apagado.
function quartiles(counts: number[]) {
  const sorted = counts.filter((c) => c > 0).sort((a, b) => a - b);
  const q = (p: number) => sorted[Math.floor((sorted.length - 1) * p)] ?? 1;
  return [q(0.25), q(0.5), q(0.75)];
}

function level(count: number, [q1, q2, q3]: number[]) {
  if (count === 0) return 0;
  if (count <= q1) return 1;
  if (count <= q2) return 2;
  if (count <= q3) return 3;
  return 4;
}

export function CommitGraph({ stats }: { stats: Stats }) {
  const years = Object.keys(stats.byYear).sort().reverse();
  const [range, setRange] = useState<string>("last");
  const [hover, setHover] = useState<{ key: string; count: number } | null>(null);

  const { weeks, total, bands, monthLabels } = useMemo(() => {
    const end = range === "last" ? parse(stats.generatedAt) : parse(`${range}-12-31`);
    const start = range === "last" ? new Date(end.getTime() - 364 * DAY) : parse(`${range}-01-01`);
    // a grade começa no domingo da primeira semana, como no GitHub
    const gridStart = new Date(start.getTime() - start.getUTCDay() * DAY);

    const weeks: { key: string; count: number; inRange: boolean }[][] = [];
    const monthLabels: { col: number; label: string }[] = [];
    let total = 0;
    const counts: number[] = [];
    for (let d = gridStart, col = 0; d <= end; col++) {
      const week = [];
      for (let i = 0; i < 7; i++, d = new Date(d.getTime() + DAY)) {
        const key = toKey(d);
        const inRange = d >= start && d <= end;
        const count = inRange ? (stats.days[key] ?? 0) : 0;
        if (inRange) {
          total += count;
          counts.push(count);
          if (d.getUTCDate() === 1 || (col === 0 && i === start.getUTCDay())) {
            monthLabels.push({ col, label: MONTHS[d.getUTCMonth()] });
          }
        }
        week.push({ key, count, inRange });
      }
      weeks.push(week);
    }
    // descarta o rótulo do mês parcial do início quando não há espaço antes do próximo
    if (monthLabels.length > 1 && monthLabels[1].col - monthLabels[0].col < 3) monthLabels.shift();
    return { weeks, total, bands: quartiles(counts), monthLabels };
  }, [range, stats]);

  const caption =
    range === "last" ? "nos últimos 12 meses" : `em ${range}`;

  const formatDay = (key: string) => {
    const d = parse(key);
    return `${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="mb-6 flex items-center justify-between font-mono text-xs">
        <span className="uppercase tracking-widest text-accent">commits</span>
        <span className="text-muted">pessoais + Field · atualizado em {formatDay(stats.generatedAt)}</span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <p className="mb-3 text-sm text-foreground">
            <span className="font-semibold">{total.toLocaleString("pt-BR")} commits</span>{" "}
            <span className="text-muted">{caption}</span>
          </p>

          <div className="overflow-x-auto rounded-md border border-border p-4">
            <div className="inline-grid gap-[3px]" style={{ gridTemplateColumns: `24px repeat(${weeks.length}, 10px)` }}>
              {/* meses */}
              <span />
              {weeks.map((_, col) => (
                <span key={col} className="relative h-4 font-mono text-[10px] text-muted">
                  <span className="absolute left-0 whitespace-nowrap">
                    {monthLabels.find((m) => m.col === col)?.label}
                  </span>
                </span>
              ))}

              {/* dias da semana × semanas */}
              {WEEKDAYS.map((label, row) => (
                <Row key={row} label={label}>
                  {weeks.map((week) => {
                    const cell = week[row];
                    if (!cell.inRange) return <span key={cell.key} className="h-[10px] w-[10px]" />;
                    return (
                      <span
                        key={cell.key}
                        title={`${cell.count} ${cell.count === 1 ? "commit" : "commits"} em ${formatDay(cell.key)}`}
                        onMouseEnter={() => setHover(cell)}
                        onMouseLeave={() => setHover(null)}
                        className="h-[10px] w-[10px] rounded-[2px] outline-1 -outline-offset-1 outline-white/5 hover:outline-foreground/60"
                        style={{ background: LEVELS[level(cell.count, bands)] }}
                      />
                    );
                  })}
                </Row>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[11px] text-muted">
              <span className="min-h-4">
                {hover ? `${hover.count} ${hover.count === 1 ? "commit" : "commits"} em ${formatDay(hover.key)}` : ""}
              </span>
              <span className="flex items-center gap-1">
                menos
                {LEVELS.map((c) => (
                  <span key={c} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: c }} />
                ))}
                mais
              </span>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-4 font-mono text-xs sm:grid-cols-4">
            <Stat label="total" value={stats.total} />
            <Stat label="na Field" value={stats.byGroup.field ?? 0} />
            <Stat label="pessoais" value={stats.byGroup.pessoal ?? 0} />
            <Stat label="dias com commit" value={Object.keys(stats.days).length} />
          </dl>
        </div>

        {/* seletor de ano, como na lateral do perfil do GitHub */}
        <ul className="flex gap-2 font-mono text-xs lg:w-24 lg:flex-col">
          {["last", ...years].map((y) => (
            <li key={y}>
              <button
                type="button"
                onClick={() => setRange(y)}
                className={`w-full rounded-md px-3 py-2 text-left transition ${
                  range === y ? "bg-accent text-background" : "text-muted hover:bg-border hover:text-foreground"
                }`}
              >
                {y === "last" ? "12 meses" : y}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <span className="h-[10px] font-mono text-[9px] leading-[10px] text-muted">{label}</span>
      {children}
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value.toLocaleString("pt-BR")}</dd>
    </div>
  );
}
