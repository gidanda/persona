"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconMe, IconPeople, IconScan, IconShared } from "@/components/ui/icons";

const icons = {
  me: IconMe,
  people: IconPeople,
  scan: IconScan,
  shared: IconShared,
} as const;

type BottomNavItem = {
  href: string;
  label: string;
  icon: keyof typeof icons;
  highlight: boolean;
};

type BottomNavClientProps = {
  items: BottomNavItem[];
};

export type { BottomNavItem };

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavClient({ items }: BottomNavClientProps) {
  const pathname = usePathname();

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
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        padding: "6px 10px",
        border: "1px solid var(--line)",
        borderRadius: 999,
        background: "var(--surface)",
        backdropFilter: "blur(24px)",
        boxShadow: "var(--shadow)",
      }}
    >
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = icons[item.icon];

        return (
          <Link
            href={item.href}
            key={item.href}
            aria-current={active ? "page" : undefined}
            style={{
              textAlign: "center",
              padding: "6px 8px",
              borderRadius: item.highlight ? 999 : 0,
              background: "transparent",
              fontSize: 14,
              color: active ? "var(--text)" : "var(--muted)",
              display: "grid",
              gap: 6,
              justifyItems: "center",
              width: item.highlight ? 56 : "auto",
              height: item.highlight ? 56 : "auto",
              margin: "0 auto",
              textShadow: active ? "0 0 14px rgba(255, 255, 255, 0.8)" : "none",
              transform: active ? "translateY(-1px)" : "none",
              transition: "color 180ms ease, transform 180ms ease, text-shadow 180ms ease",
            }}
          >
            <span
              style={{
                display: "inline-grid",
                placeItems: "center",
                filter: active ? "drop-shadow(0 0 10px rgba(255, 255, 255, 0.85))" : "none",
                transition: "filter 180ms ease",
              }}
            >
              <Icon />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
