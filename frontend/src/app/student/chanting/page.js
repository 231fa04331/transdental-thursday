"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import useAuthStore from "@/store/authStore";

export default function StudentChantingPage() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const [form, setForm] = useState({ date: "", rounds: "" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) {
      return;
    }
    const { data } = await api.get(`/api/chanting/${userId}`);
    setRows(data.history || []);
  }, [userId]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        await loadData();
      } catch (error) {
        if (!cancelled) {
          setRows([]);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/chanting", {
        date: form.date || undefined,
        rounds: Number(form.rounds),
      });
      setForm({ date: "", rounds: "" });
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Daily Chanting">
        <div className="grid gap-4 md:grid-cols-2">
          <form onSubmit={submit} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft space-y-3">
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            <input type="number" min="0" placeholder="Rounds" value={form.rounds} onChange={(e) => setForm((p) => ({ ...p, rounds: e.target.value }))} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" required />
            <button disabled={loading} className="rounded-lg bg-[var(--saffron)] px-4 py-2 text-white">{loading ? "Saving..." : "Add Chanting"}</button>
          </form>
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-[var(--sun)]"><tr><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Rounds</th></tr></thead>
              <tbody>
                {rows.map((r) => <tr key={r._id} className="border-t border-[var(--line)]"><td className="px-3 py-2">{formatDate(r.date)}</td><td className="px-3 py-2">{r.rounds}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
