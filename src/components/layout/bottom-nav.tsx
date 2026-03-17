import { routes } from "@/constants/routes";
import { getCurrentAppUser } from "@/lib/session";
import { BottomNavClient } from "@/components/layout/bottom-nav-client";
import type { BottomNavItem } from "@/components/layout/bottom-nav-client";

export async function BottomNav() {
  const user = await getCurrentAppUser();

  if (!user || !user.profileCompleted) {
    return null;
  }

  const items: BottomNavItem[] = [
    { href: routes.contacts, label: "People", icon: "people", highlight: false },
    { href: routes.scan, label: "Scan", icon: "scan", highlight: true },
    { href: routes.shared, label: "Shared", icon: "shared", highlight: false },
    { href: routes.profile, label: "Me", icon: "me", highlight: false },
  ];

  return <BottomNavClient items={items} />;
}
