export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-white/95 p-6 shadow-soft backdrop-blur md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Temple Spiritual Management</p>
      <h1 className="mt-2 font-heading text-3xl text-[var(--text)]">{title}</h1>
      <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
      <div className="mt-6 space-y-4">{children}</div>
      {footer ? <div className="mt-6 text-sm text-[var(--text-muted)]">{footer}</div> : null}
    </div>
  );
}
