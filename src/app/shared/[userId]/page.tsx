import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/constants/routes";
import { getSharedTopicsByPartner } from "@/features/shared/actions/shared-actions";
import { formatOriginLabel } from "@/features/shared/utils/topic";

type SharedPartnerPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SharedPartnerPage({ params }: SharedPartnerPageProps) {
  const { userId } = await params;
  const shared = await getSharedTopicsByPartner(userId);

  if (!shared) {
    notFound();
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: 18,
          borderRadius: 24,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <Avatar label={shared.partner.displayName} size={60} />
        <div style={{ display: "grid", gap: 4 }}>
          <strong>{shared.partner.displayName}</strong>
          <span style={{ color: "var(--muted)" }}>@{shared.partner.userId}</span>
        </div>
      </div>

      {shared.topics.length === 0 ? (
        <EmptyState title="Shared Topic はまだありません" description="プロフィールで反応すると追加されます。" />
      ) : (
        shared.topics.map((topic) => (
          <Link
            href={`${routes.shared}/topic/${topic.id}`}
            key={topic.id}
            style={{
              display: "grid",
              gap: 8,
              padding: 18,
              borderRadius: 24,
              border: "1px solid var(--line)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong>{topic.topicLabel}</strong>
              <span style={{ color: "var(--muted)", fontSize: 13 }}>
                {new Date(topic.lastActivityAt).toLocaleDateString("ja-JP")}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {topic.topicType}
              </span>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {formatOriginLabel(topic.origin)}
              </span>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontSize: 12,
                  color: "var(--muted)",
                }}
              >
                {topic.messageCount > 0 ? "会話あり" : "会話なし"}
              </span>
            </div>
          </Link>
        ))
      )}
    </section>
  );
}
