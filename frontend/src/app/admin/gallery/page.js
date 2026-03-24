"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function AdminGalleryPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("image");
  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    if (file) {
      formData.append("file", file);
    }

    await api.post("/api/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setTitle("");
    setType("image");
    setFile(null);
  };

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Gallery Upload">
        <form onSubmit={submit} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft space-y-3">
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-[var(--line)] px-3 py-2">
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
          <button className="rounded-lg bg-[var(--saffron)] px-4 py-2 text-white">Upload</button>
        </form>
      </AppShell>
    </ProtectedPage>
  );
}
