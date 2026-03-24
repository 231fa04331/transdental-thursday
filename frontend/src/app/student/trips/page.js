"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function StudentTripsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/api/trips").then((res) => setItems(res.data.data || [])).catch(() => setItems([]));
  }, []);

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Trips & Events">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((trip) => (
            <article key={trip._id} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <h3 className="font-semibold text-lg">{trip.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{formatDate(trip.date)} | {trip.location}</p>
              <p className="mt-2 text-sm">{trip.description}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Cost: {trip.cost || 0}</p>
            </article>
          ))}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
