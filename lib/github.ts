import { cacheLife } from "next/cache";

export type LanguageShare = { name: string; repos: number; percent: number };

export type GitHubStats = {
  languages: LanguageShare[];
  repoCount: number;
  contributions: number | null;
  since: number;
};

const API = "https://api.github.com";

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`GitHub ${res.status} em ${url}`);
  return res.json();
}

// Soma as contribuições (commits, PRs, reviews, inclusive em repos privados quando o
// perfil mostra "private contributions") ano a ano, desde a criação da conta.
// A API GraphQL exige token; sem ele, o total fica de fora.
async function getContributions(username: string, since: number): Promise<number | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const now = new Date();
  const years: number[] = [];
  for (let y = since; y <= now.getUTCFullYear(); y++) years.push(y);

  const fields = years
    .map(
      (y) =>
        `y${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${
          y === now.getUTCFullYear() ? now.toISOString() : `${y}-12-31T23:59:59Z`
        }") { contributionCalendar { totalContributions } }`,
    )
    .join("\n");

  const res = await fetch(`${API}/graphql`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ query: `query { user(login: "${username}") { ${fields} } }` }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const user = json?.data?.user;
  if (!user) return null;
  return years.reduce((sum, y) => sum + (user[`y${y}`]?.contributionCalendar?.totalContributions ?? 0), 0);
}

export async function getGitHubStats(username: string): Promise<GitHubStats | null> {
  "use cache";
  cacheLife("hours");

  try {
    const user = await getJson<{ created_at: string }>(`${API}/users/${username}`);
    const since = new Date(user.created_at).getUTCFullYear();

    const repos = await getJson<{ name: string; fork: boolean; archived: boolean }[]>(
      `${API}/users/${username}/repos?per_page=100&type=owner`,
    );
    const own = repos.filter((r) => !r.fork);

    const perRepo = await Promise.all(
      own.map((r) => getJson<Record<string, number>>(`${API}/repos/${username}/${r.name}/languages`)),
    );

    // Cada repositório pesa igual: somar bytes brutos deixaria um repo com dependências
    // versionadas (ex.: um .venv) engolir todos os outros.
    const withCode = perRepo.filter((langs) => Object.keys(langs).length > 0);
    const totals = new Map<string, { share: number; repos: number }>();
    for (const langs of withCode) {
      const repoSum = Object.values(langs).reduce((a, b) => a + b, 0);
      for (const [name, bytes] of Object.entries(langs)) {
        const t = totals.get(name) ?? { share: 0, repos: 0 };
        totals.set(name, { share: t.share + bytes / repoSum, repos: t.repos + 1 });
      }
    }
    const languages = [...totals.entries()]
      .map(([name, t]) => ({ name, repos: t.repos, percent: (t.share / (withCode.length || 1)) * 100 }))
      .sort((a, b) => b.percent - a.percent);

    return {
      languages,
      repoCount: own.length,
      contributions: await getContributions(username, since),
      since,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
