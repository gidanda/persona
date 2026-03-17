import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/constants/routes";
import { getSharedPartners } from "@/features/shared/actions/shared-actions";

export default async function SharedPage() {
  const partners = await getSharedPartners();

  if (partners.length === 0) {
    return <EmptyState title="Shared はまだありません" description="People から相手の項目に反応すると、ここに共有話題が追加されます。" />;
  }

  return (
    <section style={{ display: "grid", gap: 14 }}>
      {partners.map((entry) => (
        <Link
          href={`${routes.shared}/${entry.partner.userId}`}
          key={entry.partner.id}
          style={{
            display: "grid",
            gap: 12,
            padding: 18,
            borderRadius: 24,
            border: "1px solid var(--line)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar label={entry.partner.displayName} size={56} />
            <div style={{ display: "grid", gap: 4 }}>
              <strong>{entry.partner.displayName}</strong>
              <span style={{ color: "var(--muted)" }}>@{entry.partner.userId}</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}>
            <span>{entry.topics.length} topics</span>
            <span>{new Date(entry.lastActivityAt).toLocaleDateString("ja-JP")}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {entry.topics.slice(0, 3).map((topic) => (
              <span
                key={topic.id}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  fontSize: 13,
                }}
              >
                {topic.topicLabel}
              </span>
            ))}
          </div>
        </Link>
      ))}
    </section>
  );
}
