"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

const studentLinks = [
  ["Dashboard", "/student/dashboard"],
  ["Attendance", "/student/attendance"],
  ["Chanting", "/student/chanting"],
  ["Book Reading", "/student/books"],
  ["Notifications", "/student/notifications"],
  ["Trips & Events", "/student/trips"],
  ["Gallery", "/student/gallery"],
  ["Content", "/student/content"],
  ["Chatbot", "/student/chatbot"],
];

const adminLinks = [
  ["Dashboard", "/admin/dashboard"],
  ["Students", "/admin/students"],
  ["Attendance Mgmt", "/admin/attendance"],
  ["Notifications", "/admin/notifications"],
  ["Trips", "/admin/trips"],
  ["Gallery Upload", "/admin/gallery"],
  ["Content", "/admin/content"],
];

export default function AppShell({ title, role, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const links = role === "admin" ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto w-full max-w-[1575px] px-3 py-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-[285px_1fr]">
          <aside className="rounded-2xl border border-[var(--line)] bg-white/90 p-5 shadow-soft backdrop-blur">
            <div className="mb-5 rounded-xl bg-gradient-to-r from-[var(--saffron)] to-[var(--gold)] p-3 text-white">
              <p className="font-heading text-xl">Temple SM</p>
              <p className="text-sm opacity-90">Spiritual Management</p>
            </div>
            <nav className="space-y-1">
              {links.map(([label, href]) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-[var(--saffron)] text-white"
                        : "text-[var(--text)] hover:bg-[var(--sun)]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 w-full rounded-lg bg-white px-3 py-2 text-sm text-[var(--text)] ring-1 ring-[var(--line)] hover:bg-[var(--sun)]"
            >
              Logout
            </button>
          </aside>

          <section className="space-y-5">
            <header className="rounded-2xl border border-[var(--line)] bg-white/90 p-5 shadow-soft backdrop-blur">
              <p className="text-sm text-[var(--text-muted)]">Hare Krishna, {user?.full_name || user?.username || "Devotee"}</p>
              <h1 className="font-heading text-2xl text-[var(--text)]">{title}</h1>
            </header>
            <main className="min-h-[76vh] rounded-2xl border border-[var(--line)] bg-white/70 p-4 shadow-soft backdrop-blur md:p-6">
              {children}
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}
