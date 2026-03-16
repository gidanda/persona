import type { InputHTMLAttributes } from "react";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "13px 15px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.22)",
        background: "rgba(15,23,42,0.44)",
        color: "var(--text)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(8,12,24,0.12)",
        outline: "none",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
}
