"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function StudentNotificationsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/api/notifications").then((res) => setItems(res.data.data || [])).catch(() => setItems([]));
  }, []);

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Notifications">
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item._id} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{item.message}</p>
            </article>
          ))}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
