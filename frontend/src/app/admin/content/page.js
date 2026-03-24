"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function AdminContentPage() {
  const [form, setForm] = useState({ title: "", url: "", description: "" });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/content", form);
    setForm({ title: "", url: "", description: "" });
  };

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Add Content Links">
        <form onSubmit={submit} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft space-y-3">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          <input required type="url" placeholder="URL" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" rows={4} />
          <button className="rounded-lg bg-[var(--saffron)] px-4 py-2 text-white">Add Content</button>
        </form>
      </AppShell>
    </ProtectedPage>
  );
}
