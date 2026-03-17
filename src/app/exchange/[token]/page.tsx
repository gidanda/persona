import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { routes } from "@/constants/routes";
import { getExchangeProfile } from "@/features/exchange/actions/exchange-actions";
import { ReactionButtons } from "@/features/shared/components/reaction-buttons";

type ExchangePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ExchangePage({ params }: ExchangePageProps) {
  const { token } = await params;
  const exchange = await getExchangeProfile(token);

  if (!exchange) {
    notFound();
  }

  return (
    <section style={{ display: "grid", gap: 18 }}>
      <div
        style={{
          display: "grid",
          gap: 16,
          padding: 24,
          borderRadius: 28,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(22px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <p style={{ marginTop: 0, color: "var(--muted)" }}>EXCHANGED PROFILE</p>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Avatar label={exchange.partner.displayName} size={88} />
          <div>
            <h2 style={{ margin: "0 0 8px" }}>{exchange.partner.displayName}</h2>
            <p style={{ margin: "0 0 6px", color: "var(--muted)" }}>@{exchange.partner.userId}</p>
            <p style={{ margin: 0, color: "var(--muted)" }}>{exchange.partner.realName}</p>
          </div>
        </div>
        {exchange.partner.bio ? (
          <div
            style={{
              display: "grid",
              gap: 10,
              padding: 16,
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <strong>Bio</strong>
              <ReactionButtons
                partnerUserId={exchange.partner.userId}
                sourceContext="profile_bio"
                topicLabel={exchange.partner.bio}
                topicType="bio"
              />
            </div>
            <p style={{ margin: 0, color: "var(--muted)" }}>{exchange.partner.bio}</p>
          </div>
        ) : null}
        {(exchange.partner.thinkingNow || exchange.partner.doingNow) ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {exchange.partner.thinkingNow ? (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 16,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <strong>Thinking</strong>
                  <ReactionButtons
                    partnerUserId={exchange.partner.userId}
                    sourceContext="profile_thinking"
                    topicLabel={exchange.partner.thinkingNow}
                    topicType="thinking"
                  />
                </div>
                <p style={{ margin: 0, color: "var(--muted)" }}>{exchange.partner.thinkingNow}</p>
              </div>
            ) : null}
            {exchange.partner.doingNow ? (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  padding: 16,
                  borderRadius: 20,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <strong>Doing</strong>
                  <ReactionButtons
                    partnerUserId={exchange.partner.userId}
                    sourceContext="profile_doing"
                    topicLabel={exchange.partner.doingNow}
                    topicType="doing"
                  />
                </div>
                <p style={{ margin: 0, color: "var(--muted)" }}>{exchange.partner.doingNow}</p>
              </div>
            ) : null}
          </div>
        ) : null}
        {exchange.partner.interests.length > 0 ? (
          <section style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Interests</h3>
              <Link
                href={`${routes.shared}/${exchange.partner.userId}`}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid var(--line)",
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                View Shared
              </Link>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {exchange.partner.interests.map((interest) => (
                <div
                  key={interest.id}
                  style={{
                    display: "grid",
                    gap: 10,
                    padding: 16,
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div style={{ display: "grid", gridTemplateColumns: interest.imageUrl ? "56px 1fr" : "1fr", gap: 12, alignItems: "center", flex: 1 }}>
                      {interest.imageUrl ? (
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 14,
                            overflow: "hidden",
                            position: "relative",
                            background: "rgba(255,255,255,0.08)",
                          }}
                        >
                          <Image alt={interest.label} fill sizes="56px" src={interest.imageUrl} style={{ objectFit: "cover" }} unoptimized />
                        </div>
                      ) : null}
                      <div style={{ display: "grid", gap: 6 }}>
                        <strong>{interest.label}</strong>
                        {interest.subtitle ? (
                          <span style={{ color: "var(--muted)", fontSize: 13 }}>
                            {interest.subtitle}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <ReactionButtons
                      partnerUserId={exchange.partner.userId}
                      sourceContext="profile_interest"
                      topicLabel={interest.label}
                      topicType={interest.category}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link
              href={`${routes.shared}/${exchange.partner.userId}`}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid var(--line)",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              View Shared
            </Link>
          </div>
        )}
        {exchange.partner.snsLinks.length > 0 ? (
          <section style={{ display: "grid", gap: 10 }}>
            <h3 style={{ margin: 0 }}>SNS Links</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {exchange.partner.snsLinks.map((link) => (
                <a
                  href={link.url}
                  key={`${link.type}-${link.url}`}
                  rel="noreferrer"
                  target="_blank"
                  style={{
                    padding: 14,
                    borderRadius: 18,
                    border: "1px solid var(--line)",
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  {link.type}: {link.url}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
