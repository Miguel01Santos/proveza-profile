import { cacheLife } from "next/cache";

export type WakaLanguage = { name: string; percent: number; seconds: number };

export type WakaTimeStats = {
  totalSeconds: number;
  languages: WakaLanguage[];
  since: string | null;
};

// Tempo de código registrado pelo plugin do WakaTime no editor, desde a instalação.
// Precisa da chave da API (wakatime.com/settings/api-key) em WAKATIME_API_KEY.
export async function getWakaTimeStats(): Promise<WakaTimeStats | null> {
  "use cache";
  cacheLife("minutes");

  const key = process.env.WAKATIME_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://wakatime.com/api/v1/users/current/stats/all_time", {
      headers: { Authorization: `Basic ${Buffer.from(key).toString("base64")}` },
    });
    if (!res.ok) throw new Error(`WakaTime ${res.status}`);
    const { data } = await res.json();

    return {
      totalSeconds: data.total_seconds ?? 0,
      since: data.start ?? null,
      languages: (data.languages ?? []).map((l: { name: string; percent: number; total_seconds: number }) => ({
        name: l.name,
        percent: l.percent,
        seconds: l.total_seconds,
      })),
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
