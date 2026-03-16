"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScanForm } from "@/features/exchange/components/scan-form";
import { QrCodePanelClient } from "@/features/qr/components/qr-code-panel-client";

type ScanSwitcherProps = {
  qrValue: string;
};

export function ScanSwitcher({ qrValue }: ScanSwitcherProps) {
  const [mode, setMode] = useState<"camera" | "qr">("camera");

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyHeight = document.body.style.height;
    const prevHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.documentElement.style.height = "100%";

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.height = prevBodyHeight;
      document.documentElement.style.height = prevHtmlHeight;
    };
  }, []);

  return (
    <section style={{ display: "grid", gap: 16 }}>
      {mode === "camera" ? (
        <>
          <ScanForm autoStart minimal />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <Button onClick={() => setMode("qr")} variant="secondary">
              自分のQRを表示
            </Button>
          </div>
        </>
      ) : (
        <>
          <QrCodePanelClient value={qrValue} fullBleed />
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <Button onClick={() => setMode("camera")} variant="secondary">
              カメラに切り替える
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
