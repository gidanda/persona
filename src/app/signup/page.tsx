import { SignupForm } from "@/features/auth/components/signup-form";
import { redirectAuthenticatedUser } from "@/lib/session";

export default async function SignupPage() {
  await redirectAuthenticatedUser();

  return (
    <section
      style={{
        display: "grid",
        gap: 14,
        maxWidth: 600,
        padding: 28,
        borderRadius: 30,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <h2 style={{ marginBottom: 8 }}>新規登録</h2>
        <p style={{ color: "var(--muted)" }}>
          アカウント作成後、プロフィールを整えると交換の準備が完了します。
        </p>
      </div>
      <SignupForm />
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>
        user ID はあとで相手に見える識別子です。短く読みやすいものを推奨します。
      </p>
    </section>
  );
}
