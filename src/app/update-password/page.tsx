"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    const timeoutId = window.setTimeout(() => {
      if (!mounted) return;

      setCheckingSession(false);

      if (!recoveryReady) {
        setError(
          "Password recovery session үүссэнгүй. Шинэ recovery email ашиглана уу."
        );
      }
    }, 5000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event !== "PASSWORD_RECOVERY") {
        return;
      }

      if (!session?.user) {
        setError("Recovery хэрэглэгчийг тодорхойлж чадсангүй.");
        setCheckingSession(false);
        return;
      }

      setRecoveryEmail(session.user.email || "");
      setRecoveryReady(true);
      setCheckingSession(false);
      setError("");

      window.clearTimeout(timeoutId);
    });

    return () => {
      mounted = false;
      window.clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!recoveryReady || !recoveryEmail) {
      setError(
        "Зөв password recovery session байхгүй байна. Шинэ recovery email ашиглана уу."
      );
      return;
    }
    if (password.length < 8) {
      setError("Нууц үг хамгийн багадаа 8 тэмдэгттэй байна.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үг баталгаажуулалттай тохирохгүй байна.");
      return;
    }
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Recovery хэрэглэгчийн session хүчингүй байна.");
      return;
    }

    if (user.email?.toLowerCase() !== recoveryEmail.toLowerCase()) {
      setError(
        `Session хэрэглэгч зөрүүтэй байна. Одоогийн хэрэглэгч: ${
          user.email || "тодорхойгүй"
        }`
      );
      return;
    }

    setLoading(true);
    
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess("Нууц үг амжилттай шинэчлэгдлээ.");

    await supabase.auth.signOut();

    setTimeout(() => {
      router.replace("/login");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

        {recoveryEmail && (
          <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-200">
            Нууц үг шинэчлэх хэрэглэгч:
            <div className="mt-1 font-semibold">
              {recoveryEmail}
            </div>
          </div>
        )}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Нууц үг шинэчлэх</h1>

          <p className="mt-2 text-sm text-slate-400">
            INSPECT.MN хэрэглэгчийн шинэ нууц үгийг оруулна уу.
          </p>
        </div>

        {checkingSession ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
            <Loader2 className="animate-spin" size={18} />
            Recovery session шалгаж байна...
          </div>
        ) : !recoveryReady ? (
          <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Password recovery холбоос хүчингүй эсвэл хугацаа дууссан байна.
            Supabase-ээс шинэ recovery email илгээнэ үү.
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="mt-8 space-y-5">
            <div>
              <label className="text-sm text-slate-300">Шинэ нууц үг</label>

              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-4 pl-12 pr-12 outline-none focus:border-blue-500"
                  placeholder="Шинэ нууц үг"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white"
                  aria-label={
                    showPassword ? "Нууц үг нуух" : "Нууц үг харуулах"
                  }
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
              <label className="text-sm text-slate-300">
                Нууц үг давтах
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-4 outline-none focus:border-blue-500"
                placeholder="Шинэ нууц үгийг дахин оруулна уу"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}