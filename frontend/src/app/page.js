"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const { token, role } = useAuthStore();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }

    router.replace("/student/dashboard");
  }, [token, role, router]);

  return (
    <div className="min-h-screen bg-temple-pattern grid place-items-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-[var(--line)] bg-white/90 p-8 text-center shadow-soft backdrop-blur md:p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Hare Krishna</p>
        <h1 className="mt-2 font-heading text-4xl text-[var(--text)] md:text-5xl">Temple Spiritual Management</h1>
        <p className="mt-4 text-[var(--text-muted)]">A peaceful digital space to manage attendance, chanting, readings, events, and spiritual growth.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="rounded-xl bg-[var(--saffron)] px-6 py-3 text-white transition hover:brightness-95">
            Login
          </Link>
          <Link href="/register" className="rounded-xl border border-[var(--line)] bg-[var(--sun)] px-6 py-3 text-[var(--text)] transition hover:brightness-95">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
