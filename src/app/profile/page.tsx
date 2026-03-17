import Link from "next/link";
import Image from "next/image";

import { Avatar } from "@/components/ui/avatar";
import { IconGear, IconPen } from "@/components/ui/icons";
import { routes } from "@/constants/routes";
import { getMyProfile } from "@/features/profile/actions/profile-actions";
import { requireCompletedAppUser } from "@/lib/session";

function buildPresenceLabel(profile: {
  bio: string;
  thinkingNow: string;
  doingNow: string;
  interests: { label: string }[];
  snsLinks: unknown[];
}) {
  if (profile.bio) {
    return "公開プロフィール";
  }

  if (profile.interests.length > 0 || profile.thinkingNow || profile.doingNow) {
    return "更新中のプロフィール";
  }

  if (profile.snsLinks.length > 0) {
    return "リンク中心のプロフィール";
  }

  return "プロフィールを育てる";
}

export default async function ProfilePage() {
  await requireCompletedAppUser();
  const profile = await getMyProfile();

  if (!profile) {
    return null;
  }

  return (
    <section style={{ display: "grid", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gap: 22,
          padding: "6px 2px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "grid", gap: 16, flex: "1 1 420px" }}>
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "var(--muted)",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {buildPresenceLabel(profile)}
            </span>
            <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
              <Avatar label={profile.displayName} size={96} />
              <div style={{ display: "grid", gap: 6 }}>
                <h2 style={{ margin: 0, fontSize: 34, lineHeight: 1.05 }}>{profile.displayName}</h2>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: 16 }}>@{profile.userId}</p>
                <p style={{ margin: 0, color: "var(--muted)" }}>{profile.realName}</p>
              </div>
            </div>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.88)",
                fontSize: profile.bio ? 18 : 16,
                lineHeight: 1.7,
                maxWidth: 620,
              }}
            >
              {profile.bio || "まだ自己紹介はありません。編集から少しだけ自分の輪郭を足せます。"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href={routes.profileEdit}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 999,
                border: "1px solid var(--line)",
                color: "var(--text)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
              }}
            >
              <IconPen size={22} />
              Edit
            </Link>
            <Link
              href={routes.account}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                minHeight: 40,
                padding: "0 14px",
                borderRadius: 999,
                border: "1px solid var(--line)",
                color: "var(--text)",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
              }}
            >
              <IconGear size={22} />
              Account
            </Link>
          </div>
        </div>
        {(profile.thinkingNow || profile.doingNow) ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {profile.thinkingNow ? (
              <div
                style={{
                  padding: 16,
                  borderRadius: 22,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                }}
              >
                <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 12, letterSpacing: "0.08em" }}>
                  THINKING
                </p>
                <strong style={{ lineHeight: 1.5 }}>{profile.thinkingNow}</strong>
              </div>
            ) : null}
            {profile.doingNow ? (
              <div
                style={{
                  padding: 16,
                  borderRadius: 22,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
                }}
              >
                <p style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: 12, letterSpacing: "0.08em" }}>
                  DOING
                </p>
                <strong style={{ lineHeight: 1.5 }}>{profile.doingNow}</strong>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <section style={{ display: "grid", gap: 14 }}>
        <h3 style={{ margin: 0 }}>Interests</h3>
        {profile.interests.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {profile.interests.map((interest) => (
              <a
                href={interest.deeplinkUrl ?? undefined}
                key={`${interest.category}-${interest.label}`}
                rel="noreferrer"
                target={interest.deeplinkUrl ? "_blank" : undefined}
                style={{
                  display: "grid",
                  gridTemplateColumns: interest.imageUrl ? "56px 1fr" : "1fr",
                  gap: 12,
                  alignItems: "center",
                  minWidth: 220,
                  padding: "10px 12px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.05)",
                  textDecoration: "none",
                }}
              >
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
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: 16, lineHeight: 1.2 }}>{interest.label}</strong>
                  {interest.subtitle ? <span style={{ color: "var(--muted)", fontSize: 13 }}>{interest.subtitle}</span> : null}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)" }}>気になっているものを追加すると、プロフィールの輪郭が見えやすくなります。</p>
        )}
      </section>

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
                  background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
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
          <p style={{ margin: 0, color: "var(--muted)" }}>SNSリンクはまだ登録されていません。</p>
        )}
      </section>

    </section>
  );
}
