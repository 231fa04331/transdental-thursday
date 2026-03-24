"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";
import { formatDate } from "@/lib/format";
import useAuthStore from "@/store/authStore";

export default function StudentAttendancePage() {
  const user = useAuthStore((state) => state.user);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        return;
      }
      const { data } = await api.get(`/api/attendance/${user.id}`);
      setRows(data.history || []);
    };

    loadData().catch(() => setRows([]));
  }, [user?.id]);

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Attendance History">
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--sun)] text-[var(--text)]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3">{formatDate(row.date)}</td>
                  <td className="px-4 py-3">{row.present ? "Present" : "Absent"}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-[var(--text-muted)]" colSpan={2}>
                    No attendance records yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
