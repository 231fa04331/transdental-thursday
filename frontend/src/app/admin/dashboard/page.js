"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import StatCard from "@/components/StatCard";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalStudents: 0, totalClasses: 0 });

  useEffect(() => {
    const loadData = async () => {
      const { data } = await api.get("/api/students?page=1&limit=100");
      const students = data.data || [];
      const attendanceRequests = students.map((student) => api.get(`/api/attendance/${student._id}`));
      const attendanceResults = await Promise.all(attendanceRequests);
      const totalClasses = attendanceResults.reduce((sum, res) => sum + (res.data.totalClasses || 0), 0);

      setStats({ totalStudents: data.pagination?.total || students.length, totalClasses });
    };

    loadData().catch(() => setStats({ totalStudents: 0, totalClasses: 0 }));
  }, []);

  return (
    <ProtectedPage allowedRoles={["admin"]}>
      <AppShell role="admin" title="Admin Dashboard">
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard label="Total Students" value={stats.totalStudents} />
          <StatCard label="Total Classes" value={stats.totalClasses} />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
