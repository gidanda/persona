import { Button } from "@/components/ui/button";
import { getMyProfile } from "@/features/profile/actions/profile-actions";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { requireCompletedAppUser } from "@/lib/session";

export default async function AccountPage() {
  await requireCompletedAppUser();
  const profile = await getMyProfile();

  if (!profile) {
    return null;
  }

  return (
    <section style={{ display: "grid", gap: 16, maxWidth: 680 }}>
      <div
        style={{
          padding: 20,
          borderRadius: 24,
          border: "1px solid var(--line)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "var(--shadow)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Account</h2>
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0 }}>Display Name: {profile.displayName}</p>
          <p style={{ margin: 0, color: "var(--muted)" }}>User ID: @{profile.userId}</p>
          <p style={{ margin: 0, color: "var(--muted)" }}>Real Name: {profile.realName}</p>
        </div>
      </div>
      <form action={logoutAction}>
        <Button type="submit" variant="secondary">
          Logout
        </Button>
      </form>
    </section>
  );
}
