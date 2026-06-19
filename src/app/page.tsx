import Link from "next/link";

const items = ["Улсын хууль", "Дүрэм, журам", "Стандарт", "Хяналтын хуудас", "Сургалт", "AI хайлт"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-slate-900">INSPECT.MN</div>
          <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
            {items.map((item) => <span key={item}>{item}</span>)}
          </nav>
          <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-white">
            Нэвтрэх
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="mb-4 font-semibold text-blue-600">AI-driven Governance Platform</p>
          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Дотоод хяналт шалгалтын нэгдсэн платформ
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Хууль, дүрэм, журам, стандарт, хяналт шалгалт, эрсдэл, AI assistant,
            Telegram bot бүхий байгууллагын ухаалаг ERP.
          </p>

          <div className="mt-8 flex gap-3">
            <Link href="/login" className="rounded-xl bg-blue-600 px-6 py-3 text-white">
              Байгууллагаар нэвтрэх
            </Link>
            <button className="rounded-xl border bg-white px-6 py-3 text-slate-700">
              AI-аас асуух
            </button>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-4 rounded-xl bg-slate-100 p-4 text-slate-500">
            Хууль, журам, стандарт хайх...
          </div>
          <div className="grid gap-3">
            {["Уул уурхай", "ХАБЭА", "Байгаль орчин", "Барилга", "Тээвэр"].map((x) => (
              <div key={x} className="rounded-xl border p-4 font-medium">{x}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}