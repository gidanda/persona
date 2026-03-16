type AvatarProps = {
  label: string;
  size?: number;
};

export function Avatar({ label, size = 64 }: AvatarProps) {
  return (
    <div
      aria-label={label}
      style={{
        width: size,
        height: size,
        borderRadius: "24px",
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontWeight: 700,
        background:
          "linear-gradient(135deg, rgba(244,114,182,0.96) 0%, rgba(139,92,246,0.92) 52%, rgba(56,189,248,0.9) 100%)",
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.3)",
      }}
    >
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}
