import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { requireCompletedAppUser } from "@/lib/session";

export default async function HomePage() {
  await requireCompletedAppUser();

  return (
    <section style={{ display: "grid", gap: 24 }}>
      <div
        style={{
          display: "grid",
          gap: 18,
          padding: 28,
          borderRadius: 32,
          border: "1px solid var(--line)",
          background:
            "radial-gradient(circle at 20% 15%, rgba(251,191,36,0.22), transparent 22%), radial-gradient(circle at 82% 14%, rgba(168,85,247,0.26), transparent 22%), radial-gradient(circle at 50% 80%, rgba(56,189,248,0.18), transparent 24%), rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <Avatar label="Persona User" size={80} />
        <div>
          <h2 style={{ margin: 0, fontSize: 28 }}>人を知るためのデジタル名刺</h2>
          <p style={{ color: "var(--muted)", marginBottom: 0 }}>
            初回実装では、プロフィール作成、QR交換、交換済み一覧までを成立させます。
          </p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link href={routes.profile}>
            <Button>プロフィールを見る</Button>
          </Link>
          <Link href={routes.scan}>
            <Button variant="secondary">QRを読み取る</Button>
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <Card title="QR表示" description="自分のプロフィールへ遷移するQRの表示導線を用意します。" href={routes.profile} />
        <Card title="プロフィール編集" description="初回作成と通常編集を同じ画面で扱います。" href={routes.profileEdit} />
        <Card title="交換済み一覧" description="交換後に見返せる一覧画面を contacts として持ちます。" href={routes.contacts} />
      </div>
    </section>
  );
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: 20,
        borderRadius: 24,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(22px)",
        boxShadow: "var(--shadow)",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0, color: "var(--muted)" }}>{description}</p>
    </Link>
  );
}
