import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { getMyProfile } from "@/features/profile/actions/profile-actions";
import { QrCodePanel } from "@/features/qr/components/qr-code-panel";
import { buildProfileShareValue } from "@/features/qr/utils/qr";
import { requireCompletedAppUser } from "@/lib/session";

export default async function ProfilePage() {
  await requireCompletedAppUser();
  const profile = await getMyProfile();

  if (!profile) {
    return null;
  }

  const qrValue = buildProfileShareValue(profile.userId);

  return (
    <section style={{ display: "grid", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gap: 16,
          padding: 28,
          borderRadius: 32,
          background:
            "radial-gradient(circle at 18% 12%, rgba(251,191,36,0.2), transparent 20%), radial-gradient(circle at 84% 14%, rgba(168,85,247,0.24), transparent 20%), rgba(255,255,255,0.08)",
          border: "1px solid var(--line)",
          backdropFilter: "blur(24px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Avatar label={profile.displayName} size={88} />
            <div>
              <p
                style={{
                  margin: "0 0 10px",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 12,
                  letterSpacing: "0.12em",
                }}
              >
                YOUR PERSONA
              </p>
              <h2 style={{ margin: "0 0 8px" }}>{profile.displayName}</h2>
              <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>@{profile.userId}</p>
              <p style={{ margin: 0, color: "var(--muted)" }}>{profile.realName}</p>
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.76)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Share Ready
          </div>
        </div>
        <p
          style={{
            margin: 0,
            color: "rgba(255,255,255,0.88)",
            fontSize: 18,
            lineHeight: 1.6,
          }}
        >
          {profile.bio || "自己紹介はまだ設定されていません。プロフィール編集から追加できます。"}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 12, letterSpacing: "0.08em" }}>
              PROFILE ID
            </p>
            <strong>@{profile.userId}</strong>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 12, letterSpacing: "0.08em" }}>
              REAL NAME
            </p>
            <strong>{profile.realName}</strong>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 12, letterSpacing: "0.08em" }}>
              SNS LINKS
            </p>
            <strong>{profile.snsLinks.length} connected</strong>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href={routes.profileEdit}>
            <Button>編集する</Button>
          </Link>
          <Link href={routes.scan}>
            <Button variant="secondary">QRを使う</Button>
          </Link>
        </div>
      </div>

      <section
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
        <div style={{ display: "grid", gap: 6 }}>
          <h3 style={{ margin: 0 }}>SNS Links</h3>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            交換後に相手がそのままアクセスできるリンクです。
          </p>
        </div>
        {profile.snsLinks.length > 0 ? (
          <div style={{ display: "grid", gap: 10 }}>
            {profile.snsLinks.map((link) => (
              <a
                href={link.url}
                key={`${link.type}-${link.url}`}
                rel="noreferrer"
                target="_blank"
                style={{
                  display: "grid",
                  gap: 6,
                  padding: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <strong style={{ textTransform: "capitalize" }}>{link.type}</strong>
                <span style={{ color: "var(--muted)", wordBreak: "break-all" }}>{link.url}</span>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)" }}>SNS リンクはまだ設定されていません。</p>
        )}
      </section>

      <QrCodePanel value={qrValue} />

      <section
        style={{
          padding: 20,
          borderRadius: 24,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Account</h3>
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0 }}>Display Name: {profile.displayName}</p>
          <p style={{ margin: 0, color: "var(--muted)" }}>User ID: @{profile.userId}</p>
          <p style={{ margin: 0, color: "var(--muted)" }}>Real Name: {profile.realName}</p>
        </div>
      </section>
    </section>
  );
}
