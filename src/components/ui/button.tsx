import type { ButtonHTMLAttributes, CSSProperties, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const style: CSSProperties =
    variant === "primary"
      ? {
          background: "var(--accent)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 12px 28px rgba(76, 29, 149, 0.28)",
        }
      : {
          background: "rgba(255,255,255,0.08)",
          color: "var(--text)",
          border: "1px solid var(--line)",
          backdropFilter: "blur(18px)",
        };

  return (
    <button
      className={className}
      style={{
        borderRadius: 999,
        padding: "12px 18px",
        fontWeight: 700,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "transform 140ms ease, opacity 140ms ease",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
        isolation: "isolate",
        ...style,
      }}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
