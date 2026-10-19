// Gera data/commit-stats.json com a contagem diária dos meus commits em todos os
// repositórios locais (pessoais e da Field). Só números agregados por dia: nenhum
// nome de repositório, mensagem ou código vai para o arquivo.
//
// Uso: npm run stats:commits [-- <pasta-dos-projetos>]   (padrão: ~/projetos)
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative } from "node:path";

const ROOT = process.argv[2] ?? join(homedir(), "projetos");
const EMAILS = new Set(["migueldossantos.pro@outlook.com", "168670334+miguel01santos@users.noreply.github.com"]);
const MAX_DEPTH = 4;

function findRepos(dir, depth = 0, found = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return found;
  }
  if (entries.includes(".git")) found.push(dir);
  if (depth >= MAX_DEPTH) return found;
  for (const name of entries) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const path = join(dir, name);
    try {
      if (statSync(path).isDirectory()) findRepos(path, depth + 1, found);
    } catch {}
  }
  return found;
}

const commits = new Map(); // hash -> { day, group }
for (const repo of findRepos(ROOT)) {
  let out = "";
  try {
    out = execFileSync("git", ["-C", repo, "log", "--all", "--no-merges", "--format=%H|%ae|%ad", "--date=format-local:%Y-%m-%d"], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    continue;
  }
  const group = relative(ROOT, repo).startsWith("field") ? "field" : "pessoal";
  for (const line of out.split("\n")) {
    const [hash, email, day] = line.split("|");
    if (hash && EMAILS.has(email.toLowerCase()) && !commits.has(hash)) commits.set(hash, { day, group });
  }
}

const days = {};
const byGroup = { field: 0, pessoal: 0 };
const byYear = {};
for (const { day, group } of commits.values()) {
  days[day] = (days[day] ?? 0) + 1;
  byGroup[group]++;
  const year = day.slice(0, 4);
  byYear[year] = (byYear[year] ?? 0) + 1;
}

const sortedDays = Object.keys(days).sort();
const stats = {
  generatedAt: new Date().toISOString().slice(0, 10),
  total: commits.size,
  firstDay: sortedDays[0] ?? null,
  byGroup,
  byYear,
  days: Object.fromEntries(sortedDays.map((d) => [d, days[d]])),
};

writeFileSync(new URL("../data/commit-stats.json", import.meta.url), JSON.stringify(stats, null, 2) + "\n");
console.log(`${stats.total} commits desde ${stats.firstDay} (field ${byGroup.field}, pessoal ${byGroup.pessoal})`);
