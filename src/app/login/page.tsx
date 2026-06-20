"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  function handleLogin() {
    localStorage.setItem("inspect_demo_auth", "true");
    localStorage.setItem("inspect_user", "С.Мөнхбаяр");
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">INSPECT.MN</h1>
        <p className="mt-2 text-slate-500">Байгууллагын workspace руу нэвтрэх</p>

        <div className="mt-8 space-y-4">
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Байгууллагын код" defaultValue="BTEG" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Имэйл" defaultValue="admin@inspect.mn" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Нууц үг" type="password" defaultValue="123456" />

          <button onClick={handleLogin} className="w-full rounded-xl bg-blue-600 py-3 text-white">
            Нэвтрэх
          </button>

          <button className="w-full rounded-xl border py-3">
            Telegram-р баталгаажуулах
          </button>
        </div>
      </div>
    </main>
  );
}