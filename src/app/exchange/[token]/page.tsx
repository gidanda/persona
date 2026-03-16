import { notFound } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { getExchangeProfile } from "@/features/exchange/actions/exchange-actions";

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
          <p style={{ margin: 0, color: "var(--muted)" }}>{exchange.partner.bio}</p>
        ) : null}
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
