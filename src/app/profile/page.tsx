import Link from "next/link";

import { Avatar } from "@/components/ui/avatar";
import { IconGear, IconPen } from "@/components/ui/icons";
import { routes } from "@/constants/routes";
import { getMyProfile } from "@/features/profile/actions/profile-actions";
import { requireCompletedAppUser } from "@/lib/session";

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
              <h2 style={{ margin: "0 0 8px" }}>{profile.displayName}</h2>
              <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>@{profile.userId}</p>
              <p style={{ margin: 0, color: "var(--muted)" }}>{profile.realName}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href={routes.profileEdit}
              aria-label="Edit profile"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
                background: "transparent",
              }}
            >
              <IconPen size={22} />
            </Link>
            <Link
              href={routes.account}
              aria-label="Account settings"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
                background: "transparent",
              }}
            >
              <IconGear size={22} />
            </Link>
          </div>
        </div>
        {profile.bio ? (
          <p
            style={{
              margin: 0,
              color: "rgba(255,255,255,0.88)",
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            {profile.bio}
          </p>
        ) : null}
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
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }} />
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
        ) : null}
      </section>

    </section>
  );
}
