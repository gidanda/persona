import QRCode from "qrcode";

type QrCodePanelProps = {
  value: string;
};

export async function QrCodePanel({ value }: QrCodePanelProps) {
  const dataUrl = await QRCode.toDataURL(value, {
    width: 512,
    margin: 4,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return (
    <div
      style={{
        display: "grid",
        gap: 14,
        padding: 20,
        borderRadius: 24,
        border: "1px solid var(--line)",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "var(--shadow)",
      }}
    >
      <h3 style={{ margin: 0 }}>My QR</h3>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          padding: 22,
          borderRadius: 24,
          background: "#ffffff",
          border: "1px solid rgba(255,255,255,0.28)",
        }}
      >
        <img
          alt="Profile QR code"
          src={dataUrl}
          style={{
            width: "100%",
            maxWidth: 280,
            height: "auto",
            display: "block",
            imageRendering: "pixelated",
          }}
        />
      </div>
      <code
        style={{
          display: "block",
          padding: 14,
          borderRadius: 18,
          background: "rgba(15,23,42,0.44)",
          border: "1px solid rgba(255,255,255,0.22)",
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </code>
    </div>
  );
}
