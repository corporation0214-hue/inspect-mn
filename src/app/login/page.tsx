"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("admin@inspect.mn");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">INSPECT.MN</h1>
        <p className="mt-2 text-slate-500">Байгууллагын workspace руу нэвтрэх</p>

        <div className="mt-8 space-y-4">
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Имэйл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Нууц үг"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button onClick={handleLogin} className="w-full rounded-xl bg-blue-600 py-3 text-white">
            Нэвтрэх
          </button>
        </div>
      </div>
    </main>
  );
}