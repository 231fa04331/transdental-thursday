"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function StudentGalleryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/api/gallery").then((res) => setItems(res.data.data || [])).catch(() => setItems([]));
  }, []);

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Gallery">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-[var(--line)] bg-white p-3 shadow-soft">
              {item.type === "video" ? (
                <video src={item.url} controls className="h-48 w-full rounded-xl object-cover" />
              ) : (
                <Image
                  src={item.url}
                  alt={item.title || "Gallery"}
                  width={600}
                  height={320}
                  unoptimized
                  className="h-48 w-full rounded-xl object-cover"
                />
              )}
              <p className="mt-2 text-sm">{item.title || "Untitled"}</p>
              <a href={item.url} download className="mt-2 inline-block text-sm text-[var(--saffron)]">Download</a>
            </div>
          ))}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
