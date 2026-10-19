import { profile } from "@/data/profile";
import { Section } from "@/components/Section";
import { Typewriter } from "@/components/Typewriter";
import { CodeStats } from "@/components/CodeStats";
import { Suspense } from "react";

const nav = [
  { id: "sobre", label: "sobre" },
  { id: "codigo", label: "código" },
  { id: "projetos", label: "projetos" },
  { id: "experiencia", label: "experiência" },
  { id: "contato", label: "contato" },
];

export default function Home() {
  const { contact } = profile;
  const links = [
    contact.email && { label: "email", href: `mailto:${contact.email}` },
    contact.github && { label: "github", href: contact.github },
    contact.linkedin && { label: "linkedin", href: contact.linkedin },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 font-mono text-sm">
          <a href="#" className="text-foreground">
            <span className="text-accent">~/</span>
            {profile.handle}
          </a>
          <ul className="hidden gap-6 sm:flex">
            {nav.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-muted transition hover:text-accent">
                  <span className="text-accent">0{i + 1}.</span> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="relative flex-1">
        <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[600px]" />

        <div className="relative mx-auto max-w-5xl px-6">
          {/* Hero */}
          <section className="flex min-h-[80vh] flex-col justify-center py-24">
            <p className="font-mono text-sm text-accent">$ whoami</p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-4 font-mono text-xl text-muted sm:text-2xl">
              <Typewriter words={[profile.role, "Angular + Node.js", "web & mobile", "automatizador de tarefas chatas"]} />
            </p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{profile.headline}</p>
            <div className="mt-10 flex flex-wrap gap-4 font-mono text-sm">
              <a
                href="#projetos"
                className="rounded border border-accent px-5 py-3 text-accent transition hover:bg-accent/10"
              >
                ver projetos →
              </a>
              <a
                href="#contato"
                className="rounded border border-border px-5 py-3 text-foreground transition hover:border-muted"
              >
                fale comigo
              </a>
            </div>
          </section>

          {/* Sobre */}
          <Section id="sobre" index="01" title="sobre mim">
            <div className="space-y-12">
              <div className="max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
                {profile.about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="divide-y divide-border rounded-lg border border-border bg-surface/50">
                {profile.skills.map((s) => (
                  <div key={s.group} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-accent sm:w-36 sm:shrink-0">
                      {s.group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.items.map((item) => (
                        <span
                          key={item}
                          className="rounded border border-border bg-surface px-2.5 py-1 font-mono text-xs text-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Código */}
          <Section id="codigo" index="02" title="código">
            <Suspense
              fallback={<p className="font-mono text-sm text-muted">carregando estatísticas…</p>}
            >
              <CodeStats githubUser={profile.contact.githubUser} />
            </Suspense>
          </Section>

          {/* Projetos */}
          <Section id="projetos" index="03" title="projetos">
            <div className="grid gap-4 sm:grid-cols-2">
              {profile.projects.map((p) => {
                const Card = p.link ? "a" : "div";
                return (
                  <Card
                    key={p.title}
                    {...(p.link ? { href: p.link, target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-accent/60"
                  >
                    <div className="mb-4 flex items-center justify-between font-mono text-muted">
                      <span className="text-accent">{"</>"}</span>
                      {p.link && <span className="transition group-hover:text-accent">↗</span>}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent">{p.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-muted">{p.description}</p>
                    <ul className="mt-6 flex flex-wrap gap-3 font-mono text-xs text-muted">
                      {p.tags.map((t) => (
                        <li key={t}>#{t}</li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </Section>

          {/* Experiência */}
          <Section id="experiencia" index="04" title="experiência">
            <ol className="relative space-y-10 border-l border-border pl-8">
              {profile.experience.map((e) => (
                <li key={e.title + e.org} className="relative">
                  <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
                  {e.period && <p className="font-mono text-xs text-muted">{e.period}</p>}
                  <h3 className="mt-1 text-lg font-semibold text-foreground">
                    {e.title} <span className="text-accent">@ {e.org}</span>
                  </h3>
                  <p className="mt-2 max-w-2xl leading-relaxed text-muted">{e.description}</p>
                </li>
              ))}
            </ol>
          </Section>

          {/* Contato */}
          <Section id="contato" index="05" title="contato">
            <div className="max-w-xl">
              <p className="text-lg leading-relaxed text-muted">
                Tem um projeto, uma vaga ou só quer trocar uma ideia? Minha caixa de entrada está aberta.
              </p>
              <div className="mt-8 rounded-lg border border-border bg-surface p-5 font-mono text-sm">
                <p className="text-muted">
                  <span className="text-accent">$</span> cat contato.txt
                </p>
                <ul className="mt-3 space-y-2">
                  {links.map((l) => (
                    <li key={l.label}>
                      <span className="whitespace-pre text-muted">{l.label.padEnd(9, " ")}→ </span>
                      <a href={l.href} target="_blank" rel="noreferrer" className="text-foreground hover:text-accent">
                        {l.href.replace(/^mailto:|^https?:\/\/(www\.)?/, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>
      </main>

      <footer className="border-t border-border py-8 text-center font-mono text-xs text-muted">
        feito com Next.js por {profile.name}
      </footer>
    </>
  );
}
