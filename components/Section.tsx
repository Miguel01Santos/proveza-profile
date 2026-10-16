export function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-20">
      <h2 className="mb-10 flex items-center gap-4 font-mono text-sm text-muted">
        <span className="text-accent">{index}.</span>
        <span className="text-xl font-semibold text-foreground">{title}</span>
        <span className="h-px flex-1 bg-border" />
      </h2>
      {children}
    </section>
  );
}
