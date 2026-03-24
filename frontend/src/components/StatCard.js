export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-soft">
      <p className="text-sm text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}
