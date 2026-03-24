"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedPage({ children, allowedRoles }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, role } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    }
  }, [token, role, allowedRoles, router, pathname]);

  if (!token || (allowedRoles && !allowedRoles.includes(role))) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--bg-soft)]">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  return children;
}
