"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function AdminTripsPage() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    places_to_visit: "",
    cost: "",
    description: "",
    contact: "",
    last_date: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/trips", {
      ...form,
      cost: Number(form.cost || 0),
      places_to_visit: form.places_to_visit.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setForm({ title: "", date: "", location: "", places_to_visit: "", cost: "", description: "", contact: "", last_date: "" });
  };

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Create Trip/Event">
        <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft md:grid-cols-2">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input required type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input required placeholder="Location" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input placeholder="Places to visit (comma separated)" value={form.places_to_visit} onChange={(e) => setForm((p) => ({ ...p, places_to_visit: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input type="number" placeholder="Cost" value={form.cost} onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input placeholder="Contact" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <input type="date" value={form.last_date} onChange={(e) => setForm((p) => ({ ...p, last_date: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="rounded-lg border border-[var(--line)] px-3 py-2 md:col-span-2" rows={4} />
          <button className="rounded-lg bg-[var(--saffron)] px-4 py-2 text-white md:col-span-2">Create Trip</button>
        </form>
      </AppShell>
    </ProtectedPage>
  );
}
