import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { PageContainer } from "@/components/layout/page-container";

import "./globals.css";

export const metadata: Metadata = {
  title: "Persona",
  description: "Digital profile exchange app",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ja">
      <body>
        <PageContainer>
          <Header />
          {children}
        </PageContainer>
        <BottomNav />
      </body>
    </html>
  );
}
