"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  ShieldCheck,
} from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email || "");
    }

    loadUser();
  }, [supabase]);

  async function handlePasswordChange(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Нууц үг хамгийн багадаа 8 тэмдэгттэй байна.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үг баталгаажуулалттай тохирохгүй байна.");
      return;
    }

    setLoading(true);

    const { error: updateError } =
      await supabase.auth.updateUser({
        password,
      });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setSuccess("Нууц үг амжилттай шинэчлэгдлээ.");
  }

  async function handleLogoutAll() {
    const confirmed = window.confirm(
      "Одоогийн session-оос гарах уу?"
    );

    if (!confirmed) return;

    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-3xl font-bold">
          Security
        </h1>

        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Нууц үг болон хэрэглэгчийн хамгаалалтын тохиргоо
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950">
              <KeyRound size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Нууц үг солих
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {email || "Хэрэглэгчийн имэйл"}
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePasswordChange}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-sm font-medium">
                Шинэ нууц үг
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Хамгийн багадаа 8 тэмдэгт"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Шинэ нууц үг давтах
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950"
                placeholder="Нууц үгээ дахин оруулна уу"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-300">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading && (
                <Loader2 size={17} className="animate-spin" />
              )}

              {loading
                ? "Шинэчилж байна..."
                : "Нууц үг шинэчлэх"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Session хамгаалалт
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Нэвтэрсэн session болон account хамгаалалт
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Одоогийн хэрэглэгч
            </p>

            <p className="mt-1 font-semibold">
              {email || "-"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogoutAll}
            className="mt-5 flex items-center gap-2 rounded-xl border border-red-500 px-4 py-3 font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            <LogOut size={17} />
            Одоогийн session-оос гарах
          </button>
        </section>
      </div>
    </div>
  );
}