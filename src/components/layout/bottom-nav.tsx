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
    { href: routes.contacts, label: "People", icon: IconPeople, highlight: false },
    { href: routes.scan, label: "Scan", icon: IconScan, highlight: true },
    { href: routes.profile, label: "Me", icon: IconMe, highlight: false },
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
        padding: "6px 10px",
        border: "1px solid var(--line)",
        borderRadius: 999,
        background: "var(--surface)",
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
            padding: "6px 8px",
            borderRadius: item.highlight ? 999 : 0,
            background: item.highlight ? "var(--surface-strong)" : "transparent",
            fontSize: 14,
            color: "var(--muted)",
            display: "grid",
            gap: 6,
            justifyItems: "center",
            width: item.highlight ? 56 : "auto",
            height: item.highlight ? 56 : "auto",
            margin: "0 auto",
          }}
        >
          <item.icon />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
