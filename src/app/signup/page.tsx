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
      </div>
      <SignupForm />
    </section>
  );
}
