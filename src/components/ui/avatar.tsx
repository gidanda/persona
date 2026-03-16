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
        borderRadius: "999px",
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontWeight: 700,
        background: "linear-gradient(135deg, rgba(148,163,184,0.9) 0%, rgba(71,85,105,0.9) 100%)",
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.3)",
      }}
    >
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}
