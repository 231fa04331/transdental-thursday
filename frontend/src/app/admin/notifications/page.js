"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function AdminNotificationsPage() {
  const [form, setForm] = useState({ title: "", message: "" });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/api/notifications", form);
      setForm({ title: "", message: "" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Post Notifications">
        <form onSubmit={submit} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft space-y-3">
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Title" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" required />
          <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Message" className="w-full rounded-lg border border-[var(--line)] px-3 py-2" rows={4} required />
          <button disabled={saving} className="rounded-lg bg-[var(--saffron)] px-4 py-2 text-white">{saving ? "Posting..." : "Post Notification"}</button>
        </form>
      </AppShell>
    </ProtectedPage>
  );
}
