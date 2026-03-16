// Reusable terminal chrome wrapper — gives the VSCode / macOS terminal look
export default function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "var(--surface2)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* macOS-style dots */}
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f85149", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#d29922", display: "inline-block" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
        {title && (
          <span style={{ color: "var(--muted)", fontSize: "12px", marginLeft: "8px" }}>
            {title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
