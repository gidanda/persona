"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname?.startsWith("/scan")) {
    return null;
  }

  return (
    <header style={{ height: 88, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: 1080,
            margin: "0 auto",
            padding: "14px 18px 24px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 30, letterSpacing: "0.02em" }}>persona</h1>
        </div>
      </div>
    </header>
  );
}
