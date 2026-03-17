import { notFound } from "next/navigation";

import { ThreadComposer } from "@/features/shared/components/thread-composer";
import { getSharedTopicDetail } from "@/features/shared/actions/shared-actions";
import { formatOriginLabel, formatSourceContextLabel } from "@/features/shared/utils/topic";

type SharedTopicPageProps = {
  params: Promise<{
    topicId: string;
  }>;
};

export default async function SharedTopicPage({ params }: SharedTopicPageProps) {
  const { topicId } = await params;
  const topic = await getSharedTopicDetail(topicId);

  if (!topic) {
    notFound();
  }

  return (
    <section style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gap: 10,
          padding: 20,
          borderRadius: 24,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ margin: 0 }}>{topic.topicLabel}</h2>
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
            {formatSourceContextLabel(topic.sourceContext)}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          padding: 20,
          borderRadius: 24,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        {topic.messages.length === 0 ? (
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ margin: 0, color: "var(--muted)" }}>まだ会話は始まっていません。</p>
            <ThreadComposer sharedTopicId={topic.id} />
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gap: 10 }}>
              {topic.messages.map((message) => {
                const isOwn = message.senderUserId === topic.currentUserId;

                return (
                  <div
                    key={message.id}
                    style={{
                      display: "grid",
                      justifyItems: isOwn ? "end" : "start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "80%",
                        padding: "12px 14px",
                        borderRadius: 18,
                        border: "1px solid var(--line)",
                        background: isOwn ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: 6, fontSize: 12, color: "var(--muted)" }}>
                        {message.senderDisplayName}
                      </strong>
                      <span>{message.body}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <ThreadComposer sharedTopicId={topic.id} />
          </>
        )}
      </div>
    </section>
  );
}
