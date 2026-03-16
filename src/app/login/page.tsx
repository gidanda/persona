import Link from "next/link";

import { routes } from "@/constants/routes";
import { LoginForm } from "@/features/auth/components/login-form";
import { redirectAuthenticatedUser } from "@/lib/session";

export default async function LoginPage() {
  await redirectAuthenticatedUser();

  return (
    <div style={{ marginTop: 40 }}>
    <section
      style={{
        display: "grid",
        gap: 18,
        maxWidth: 560,
        padding: 28,
        borderRadius: 30,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div style={{ display: "grid", gap: 8 }}>
        <h2 style={{ marginBottom: 8 }}>ログイン</h2>
      </div>
      <LoginForm />
      <Link href={routes.signup} style={{ color: "#fbcfe8" }}>
        新規登録へ
      </Link>
    </section>
    </div>
  );
}
