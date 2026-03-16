import Link from "next/link";

import { routes } from "@/constants/routes";
import { IconMe, IconPeople, IconScan } from "@/components/ui/icons";
import { getCurrentAppUser } from "@/lib/session";

export async function BottomNav() {
  const user = await getCurrentAppUser();

  if (!user || !user.profileCompleted) {
    return null;
  }

  const items = [
    { href: routes.contacts, label: "People", icon: IconPeople },
    { href: routes.scan, label: "Scan", icon: IconScan },
    { href: routes.profile, label: "Me", icon: IconMe },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        left: 20,
        right: 20,
        bottom: 20,
        margin: "0 auto",
        maxWidth: 720,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        padding: 10,
        border: "1px solid var(--line)",
        borderRadius: 26,
        background: "rgba(8,12,24,0.74)",
        backdropFilter: "blur(24px)",
        boxShadow: "var(--shadow)",
      }}
    >
      {items.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          style={{
            textAlign: "center",
            padding: "10px 12px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.06)",
            fontSize: 14,
            color: "var(--muted)",
            display: "grid",
            gap: 6,
            justifyItems: "center",
          }}
        >
          <item.icon />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
