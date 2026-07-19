"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Имэйл хаягаа оруулна уу.");
      return;
    }

    setLoading(true);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage(
      "Хэрэв энэ имэйлээр хэрэглэгч бүртгэлтэй бол password шинэчлэх холбоос илгээгдлээ."
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-5 text-white">
      <div className="inspect-animated-bg">
        <div className="inspect-gradient" />
        <div className="inspect-grid" />
        <span className="inspect-orb inspect-orb-a" />
        <span className="inspect-orb inspect-orb-b" />
        <span className="inspect-orb inspect-orb-c" />
        <span className="inspect-scan" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 shadow-[0_0_45px_rgba(6,182,212,.12)] backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            Нууц үг сэргээх
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Бүртгэлтэй имэйл хаягаа оруулна уу. Нууц үг шинэчлэх
            холбоос таны имэйлд очно.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-slate-300">
              Имэйл
            </label>

            <div className="relative mt-2">
              <Mail
                size={18}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="name@company.mn"
                className="w-full rounded-xl border border-cyan-500/20 bg-[#071124] py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm leading-6 text-green-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 py-4 font-semibold transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <Loader2 size={18} className="animate-spin" />
            )}

            {loading
              ? "Илгээж байна..."
              : "Reset холбоос илгээх"}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Нэвтрэх хуудас руу буцах
          </Link>
        </div>
      </div>
    </main>
  );
}