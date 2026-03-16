"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  if (pathname?.startsWith("/scan")) {
    return null;
  }

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background:
          "linear-gradient(180deg, rgba(9,17,31,0.94) 0%, rgba(9,17,31,0.55) 55%, rgba(9,17,31,0) 100%)",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: 1080,
          margin: "0 auto",
          padding: "16px 18px 28px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: "0.02em" }}>persona</h1>
      </div>
    </header>
  );
}
