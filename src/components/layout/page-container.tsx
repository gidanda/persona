import type { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
  return (
    <main
      style={{
        width: "100%",
        maxWidth: 1080,
        margin: "0 auto",
        padding: "84px 18px 112px",
      }}
    >
      {children}
    </main>
  );
}
