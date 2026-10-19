import { getGitHubStats } from "@/lib/github";
import { getWakaTimeStats } from "@/lib/wakatime";
import { CommitGraph } from "@/components/CommitGraph";
import commitStats from "@/data/commit-stats.json";

type Bar = { name: string; percent: number; detail: string };

const TOP = 6;

function topWithOther(items: Bar[]): Bar[] {
  if (items.length <= TOP) return items;
  const rest = items.slice(TOP);
  const percent = rest.reduce((s, i) => s + i.percent, 0);
  return [...items.slice(0, TOP), { name: "Outras", percent, detail: `${rest.length} linguagens` }];
}

function formatHours(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h.toLocaleString("pt-BR")}h ${m}min` : `${m}min`;
}

function Bars({ items }: { items: Bar[] }) {
  const max = Math.max(...items.map((i) => i.percent), 1);
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.name} className="group" title={`${i.name}: ${i.percent.toFixed(1)}% · ${i.detail}`}>
          <div className="mb-1 flex justify-between font-mono text-xs">
            <span className="text-foreground">{i.name}</span>
            <span className="text-muted">
              <span className="hidden group-hover:inline">{i.detail} · </span>
              {i.percent.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent/80 transition group-hover:bg-accent"
              style={{ width: `${(i.percent / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Card({
  label,
  source,
  hero,
  heroCaption,
  children,
}: {
  label: string;
  source: string;
  hero: string;
  heroCaption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6">
      <div className="mb-6 flex items-center justify-between font-mono text-xs">
        <span className="uppercase tracking-widest text-accent">{label}</span>
        <span className="text-muted">{source}</span>
      </div>
      <p className="text-4xl font-bold tracking-tight text-foreground">{hero}</p>
      <p className="mt-1 mb-8 font-mono text-xs text-muted">{heroCaption}</p>
      {children}
    </div>
  );
}

export async function CodeStats({ githubUser }: { githubUser: string }) {
  const [waka, gh] = await Promise.all([getWakaTimeStats(), getGitHubStats(githubUser)]);

  return (
    <div className="space-y-4">
      <CommitGraph stats={commitStats} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card
          label="tempo de código"
          source="via WakaTime"
          hero={waka ? formatHours(waka.totalSeconds) : "em breve"}
          heroCaption={
            waka?.since
              ? `programando desde ${new Date(waka.since).toLocaleDateString("pt-BR")}`
              : "contagem começou dia 19/10/2026"
          }
        >
          {waka && waka.languages.length > 0 ? (
            <Bars
              items={topWithOther(
                waka.languages.map((l) => ({ name: l.name, percent: l.percent, detail: formatHours(l.seconds) })),
              )}
            />
          ) : (
            <p className="font-mono text-sm text-muted">
              <span className="text-accent">$</span> aguardando as primeiras horas registradas…
            </p>
          )}
        </Card>
  
        <Card
          label="linguagens no github"
          source={`@${githubUser}`}
          hero={gh?.contributions != null ? gh.contributions.toLocaleString("pt-BR") : String(gh?.repoCount ?? "—")}
          heroCaption={
            gh?.contributions != null
              ? `contribuições desde ${gh.since}`
              : `repositórios públicos${gh ? ` desde ${gh.since}` : ""}`
          }
        >
          {gh && gh.languages.length > 0 ? (
            <Bars
              items={topWithOther(
                gh.languages.map((l) => ({ name: l.name, percent: l.percent, detail: `${l.repos} ${l.repos === 1 ? "repo" : "repos"}` })),
              )}
            />
          ) : (
            <p className="font-mono text-sm text-muted">não foi possível carregar os dados do GitHub agora.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
