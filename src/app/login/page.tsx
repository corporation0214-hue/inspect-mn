import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">INSPECT.MN</h1>
        <p className="mt-2 text-slate-500">Байгууллагын workspace руу нэвтрэх</p>

        <div className="mt-8 space-y-4">
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Байгууллагын код" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Имэйл" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Нууц үг" type="password" />

          <Link href="/dashboard" className="block rounded-xl bg-blue-600 py-3 text-center text-white">
            Нэвтрэх
          </Link>

          <button className="w-full rounded-xl border py-3">
            Telegram-р баталгаажуулах
          </button>
        </div>
      </div>
    </main>
  );
}