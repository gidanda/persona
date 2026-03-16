"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type QrCodePanelClientProps = {
  value: string;
  fullBleed?: boolean;
};

export function QrCodePanelClient({ value, fullBleed = false }: QrCodePanelClientProps) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(value, {
      width: 512,
      margin: 4,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    }).then((url) => {
      if (active) {
        setDataUrl(url);
      }
    });

    return () => {
      active = false;
    };
  }, [value]);

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        padding: fullBleed ? 0 : 22,
        borderRadius: fullBleed ? 0 : 24,
        border: fullBleed ? "none" : "1px solid var(--line)",
        background: fullBleed ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.08)",
        backdropFilter: fullBleed ? "none" : "blur(20px)",
        boxShadow: fullBleed ? "none" : "var(--shadow)",
        width: "100%",
        height: fullBleed ? "64vh" : "auto",
      }}
    >
      {dataUrl ? (
        <img
          alt="Profile QR code"
          src={dataUrl}
          style={{
            width: fullBleed ? "72%" : "100%",
            maxWidth: fullBleed ? 320 : 280,
            height: "auto",
            display: "block",
            imageRendering: "pixelated",
            background: "#ffffff",
            borderRadius: fullBleed ? 18 : 18,
            padding: fullBleed ? 18 : 16,
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: fullBleed ? "72%" : "100%",
            maxWidth: fullBleed ? 320 : 280,
            aspectRatio: "1 / 1",
            borderRadius: 18,
            background: "#ffffff",
          }}
        />
      )}
    </div>
  );
}
