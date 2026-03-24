"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function AdminStudentDetailsPage() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    api.get(`/api/students/${id}`).then((res) => setDetails(res.data)).catch(() => setDetails(null));
  }, [id]);

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Student Details">
        {details ? (
          <div className="space-y-4">
            <section className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <h2 className="font-semibold">Basic Info</h2>
              <p className="text-sm mt-1">{details.student.full_name} ({details.student.username})</p>
              <p className="text-sm mt-1 text-[var(--text-muted)]">Mobile: {details.student.mobile_number || "-"}</p>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <h3 className="mb-2 font-semibold">Attendance</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="text-left py-2">Date</th><th className="text-left py-2">Status</th></tr></thead><tbody>{(details.attendanceHistory || []).map((a) => <tr key={a._id} className="border-t border-[var(--line)]"><td className="py-2">{formatDate(a.date)}</td><td className="py-2">{a.present ? "Present" : "Absent"}</td></tr>)}</tbody></table></div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <h3 className="mb-2 font-semibold">Chanting</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="text-left py-2">Date</th><th className="text-left py-2">Rounds</th></tr></thead><tbody>{(details.chantingHistory || []).map((c) => <tr key={c._id} className="border-t border-[var(--line)]"><td className="py-2">{formatDate(c.date)}</td><td className="py-2">{c.rounds}</td></tr>)}</tbody></table></div>
            </section>

            <section className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft">
              <h3 className="mb-2 font-semibold">Book Reading</h3>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="text-left py-2">Date</th><th className="text-left py-2">Book</th></tr></thead><tbody>{(details.bookReadingHistory || []).map((b) => <tr key={b._id} className="border-t border-[var(--line)]"><td className="py-2">{formatDate(b.date)}</td><td className="py-2">{b.book_name}</td></tr>)}</tbody></table></div>
            </section>
          </div>
        ) : (
          <p className="text-[var(--text-muted)]">Loading details...</p>
        )}
      </AppShell>
    </ProtectedPage>
  );
}
