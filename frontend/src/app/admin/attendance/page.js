"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function AdminAttendancePage() {
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/api/students?page=1&limit=100").then((res) => setStudents(res.data.data || [])).catch(() => setStudents([]));
  }, []);

  const setPresent = (studentId, present) => {
    setRecords((prev) => ({ ...prev, [studentId]: present }));
  };

  const submit = async () => {
    if (!date) {
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        students.map((student) =>
          api.post("/api/attendance", {
            studentId: student._id,
            date,
            present: records[student._id] ?? false,
          })
        )
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Attendance Management">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-soft">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border border-[var(--line)] px-3 py-2" />
            <button onClick={submit} disabled={saving || !date} className="rounded-lg bg-[var(--saffron)] px-4 py-2 text-white disabled:opacity-70">{saving ? "Submitting..." : "Submit Attendance"}</button>
          </div>
          <div className="space-y-2">
            {students.map((student) => (
              <div key={student._id} className="flex items-center justify-between rounded-lg border border-[var(--line)] px-3 py-2">
                <p className="text-sm">{student.full_name}</p>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={records[student._id] || false} onChange={(e) => setPresent(student._id, e.target.checked)} />
                  Present
                </label>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
