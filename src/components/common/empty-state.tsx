type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section
      style={{
        padding: 24,
        borderRadius: 28,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(22px)",
        boxShadow: "var(--shadow)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {description ? <p style={{ marginBottom: 0, color: "var(--muted)" }}>{description}</p> : null}
    </section>
  );
}
