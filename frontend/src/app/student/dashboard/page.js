"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import StatCard from "@/components/StatCard";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";

export default function StudentDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({ totalClasses: 0, totalChanting: 0 });

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const [attendanceRes, chantingRes] = await Promise.all([
          api.get(`/api/attendance/${user.id}`),
          api.get(`/api/chanting/${user.id}`),
        ]);

        setStats({
          totalClasses: attendanceRes.data.totalClasses || 0,
          totalChanting: chantingRes.data.totalChanting || 0,
        });
      } catch (error) {
        setStats({ totalClasses: 0, totalChanting: 0 });
      }
    };

    loadData();
  }, [user?.id]);

  return (
    <ProtectedPage allowedRoles={["student"]}>
      <AppShell role="student" title="Student Dashboard">
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard label="Total Classes Attended" value={stats.totalClasses} />
          <StatCard label="Total Chanting Rounds" value={stats.totalChanting} />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
