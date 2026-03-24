"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import useAuthStore from "@/store/authStore";

export default function StudentBooksPage() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;
  const [form, setForm] = useState({ date: "", book_name: "" });
  const [rows, setRows] = useState([]);

  const loadData = useCallback(async () => {
    if (!userId) {
      return;
    }
    const { data } = await api.get(`/api/books/${userId}`);
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
    await api.post("/api/books", {
      date: form.date || undefined,
      book_name: form.book_name,
    });
    setForm({ date: "", book_name: "" });
    await loadData();
  };

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Book Reading">
        <div className="grid gap-4 md:grid-cols-2">
          <form onSubmit={submit} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft space-y-3">
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
            <input type="text" placeholder="Book name" value={form.book_name} onChange={(e) => setForm((p) => ({ ...p, book_name: e.target.value }))} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" required />
            <button className="rounded-lg bg-[var(--saffron)] px-4 py-2 text-white">Add Reading</button>
          </form>
          <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-[var(--sun)]"><tr><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Book</th></tr></thead>
              <tbody>
                {rows.map((r) => <tr key={r._id} className="border-t border-[var(--line)]"><td className="px-3 py-2">{formatDate(r.date)}</td><td className="px-3 py-2">{r.book_name}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
