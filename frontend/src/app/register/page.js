"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import AuthCard from "@/components/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ full_name: "", username: "", mobile_number: "", password: "" });
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
      const { data } = await api.post("/api/auth/register", form);
      setAuth({ token: data.token, user: data.student, role: "student" });
      router.push("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-temple-pattern grid place-items-center px-4 py-8">
      <AuthCard
        title="Create Student Account"
        subtitle="Begin your devotional practice with clarity"
        footer={
          <p>
            Already registered? <Link className="text-[var(--saffron)]" href="/login">Login here</Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full name"
            className="w-full rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--saffron)]/30"
            required
          />
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full rounded-xl border border-[var(--line)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--saffron)]/30"
            required
          />
          <input
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleChange}
            placeholder="Mobile number"
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </AuthCard>
    </div>
  );
}
