"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import api from "@/lib/api";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ full_name: "", username: "", mobile_number: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await api.get("/api/students?page=1&limit=50");
      const rows = data.data || [];

      const enriched = await Promise.all(
        rows.map(async (student) => {
          const attendance = await api.get(`/api/attendance/${student._id}`);
          return {
            ...student,
            totalClasses: attendance.data.totalClasses || 0,
          };
        })
      );

      setStudents(enriched);
    };

    loadData().catch(() => setStudents([]));
  }, []);

  const startEdit = (student) => {
    setEditingId(student._id);
    setEditForm({
      full_name: student.full_name || "",
      username: student.username || "",
      mobile_number: student.mobile_number || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ full_name: "", username: "", mobile_number: "" });
  };

  const saveEdit = async () => {
    if (!editingId) {
      return;
    }

    setSaving(true);
    try {
      const { data } = await api.patch(`/api/students/${editingId}`, editForm);
      setStudents((prev) =>
        prev.map((student) =>
          student._id === editingId
            ? {
                ...student,
                full_name: data.student.full_name,
                username: data.student.username,
                mobile_number: data.student.mobile_number,
              }
            : student
        )
      );
      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Students Table">
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-soft">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--sun)]"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Username</th><th className="px-4 py-3">Mobile</th><th className="px-4 py-3">Total Classes</th><th className="px-4 py-3">Action</th></tr></thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t border-[var(--line)]">
                  <td className="px-4 py-3">
                    {editingId === student._id ? (
                      <input
                        value={editForm.full_name}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                        className="w-full rounded-lg border border-[var(--line)] px-2 py-1"
                      />
                    ) : (
                      student.full_name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === student._id ? (
                      <input
                        value={editForm.username}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
                        className="w-full rounded-lg border border-[var(--line)] px-2 py-1"
                      />
                    ) : (
                      student.username
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === student._id ? (
                      <input
                        value={editForm.mobile_number}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, mobile_number: e.target.value }))}
                        className="w-full rounded-lg border border-[var(--line)] px-2 py-1"
                      />
                    ) : (
                      student.mobile_number || "-"
                    )}
                  </td>
                  <td className="px-4 py-3">{student.totalClasses}</td>
                  <td className="px-4 py-3 space-x-3">
                    <Link href={`/admin/students/${student._id}`} className="text-[var(--saffron)]">View Details</Link>
                    {editingId === student._id ? (
                      <>
                        <button type="button" onClick={saveEdit} disabled={saving} className="text-[var(--saffron)]">
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={cancelEdit} className="text-[var(--text-muted)]">Cancel</button>
                      </>
                    ) : (
                      <button type="button" onClick={() => startEdit(student)} className="text-[var(--saffron)]">Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
