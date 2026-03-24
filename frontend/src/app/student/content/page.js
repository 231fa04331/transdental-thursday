"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function StudentContentPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/api/content").then((res) => setItems(res.data.data || [])).catch(() => setItems([]));
  }, []);

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Content Links">
        <div className="space-y-3">
          {items.map((item) => (
            <a key={item._id} href={item.url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft hover:bg-[var(--sun)]">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{item.description}</p>
            </a>
          ))}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
