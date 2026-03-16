import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { ScanForm } from "@/features/exchange/components/scan-form";
import { buildProfileShareValue } from "@/features/qr/utils/qr";
import { requireCompletedAppUser } from "@/lib/session";

export default async function ScanPage() {
  const user = await requireCompletedAppUser();
  const qrValue = buildProfileShareValue(user.userId);

  return (
    <section style={{ display: "grid", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gap: 14,
          padding: 20,
          borderRadius: 24,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ margin: 0 }}>QRスキャン</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>
          カメラ、画像アップロード、user ID 入力の3通りで交換できます。端末によっては画像アップロードの方が安定します。
        </p>
        <ScanForm />
      </div>
      <EmptyState title="あなたの共有コード" description={qrValue} />
      <div
        style={{
          display: "grid",
          gap: 12,
          padding: 18,
          borderRadius: 22,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ margin: 0 }}>使い方</h3>
        <div style={{ display: "grid", gap: 8, color: "var(--muted)" }}>
          <p style={{ margin: 0 }}>1. 相手の QR をカメラで読む</p>
          <p style={{ margin: 0 }}>2. 読めなければ、QR のスクリーンショットを画像アップロードする</p>
          <p style={{ margin: 0 }}>3. 最後の手段として `tanaka` のような user ID を直接入力する</p>
        </div>
        <Link href={`${routes.contacts}`}>
          <Button variant="secondary">交換済み一覧を見る</Button>
        </Link>
      </div>
    </section>
  );
}
