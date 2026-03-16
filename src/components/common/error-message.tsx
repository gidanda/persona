type ErrorMessageProps = {
  message: string;
  tone?: "error" | "success";
};

export function ErrorMessage({ message, tone = "error" }: ErrorMessageProps) {
  const style =
    tone === "success"
      ? {
          background: "rgba(74, 222, 128, 0.14)",
          color: "#bbf7d0",
        }
      : {
          background: "rgba(248, 113, 113, 0.14)",
          color: "#fecaca",
        };

  return (
    <p
      style={{
        padding: "12px 14px",
        borderRadius: 18,
        border: "1px solid var(--line)",
        backdropFilter: "blur(16px)",
        ...style,
      }}
    >
      {message}
    </p>
  );
}
