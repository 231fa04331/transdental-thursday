"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState("student");
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "admin" ? "/api/auth/admin-login" : "/api/auth/login";
      const { data } = await api.post(endpoint, form);
      const role = mode === "admin" ? "admin" : "student";
      const user = mode === "admin" ? data.admin : data.student;

      setAuth({ token: data.token, user, role });

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8">
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue your spiritual journey"
        footer={
          <p>
            New student? <Link className="text-[var(--saffron)]" href="/register">Create account</Link>
          </p>
        }
      >
        <div className="flex rounded-xl bg-[var(--sun)] p-1">
          <button
            type="button"
            onClick={() => setMode("student")}
            className={`w-1/2 rounded-lg px-3 py-2 text-sm ${mode === "student" ? "bg-white shadow-soft" : ""}`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setMode("admin")}
            className={`w-1/2 rounded-lg px-3 py-2 text-sm ${mode === "admin" ? "bg-white shadow-soft" : ""}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--saffron)]/30"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--saffron)]/30"
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--saffron)] px-4 py-3 text-white transition hover:brightness-95 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
