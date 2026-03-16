import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/constants/routes";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { getCurrentAppUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentAppUser();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 28,
        padding: "16px 18px",
        borderRadius: 28,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(22px)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div>
        <p style={{ margin: 0, color: "var(--muted)", fontSize: 12, letterSpacing: "0.08em" }}>
          DIGITAL PROFILE EXCHANGE
        </p>
        <h1 style={{ margin: "6px 0 0", fontSize: 34 }}>Persona</h1>
      </div>
      {user ? (
        <div style={{ display: "grid", justifyItems: "end", gap: 10 }}>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14 }}>{user.displayName}</p>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              Logout
            </Button>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Link href={routes.login}>
            <Button variant="secondary">Login</Button>
          </Link>
          <Link href={routes.signup}>
            <Button>Signup</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
