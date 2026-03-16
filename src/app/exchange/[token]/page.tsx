import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
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
        <p style={{ margin: 0, color: "var(--muted)" }}>
          {exchange.partner.bio || "プロフィール文はまだ設定されていません。"}
        </p>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
          Exchanged at: {new Date(exchange.exchangedAt).toLocaleString("ja-JP")}
        </p>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href={routes.contacts}>
            <Button>交換済み一覧へ</Button>
          </Link>
          <Link href={routes.scan}>
            <Button variant="secondary">別の相手と交換する</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
