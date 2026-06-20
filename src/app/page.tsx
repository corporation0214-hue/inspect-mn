import Link from "next/link";

const modules = [
  "Хяналт шалгалт",
  "Журмын хэрэгжилт",
  "Эрсдэлийн удирдлага",
  "Судалгаа хөгжүүлэлт",
  "Employee Voice",
  "AI Assistant",
];

const sectors = ["Уул уурхай", "ХАБЭА", "Байгаль орчин", "Барилга", "Тээвэр"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">INSPECT.MN</h1>
            <p className="text-xs text-slate-500">Smart Internal Control Platform</p>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 lg:flex">
            <span>Улсын хууль</span>
            <span>Дүрэм, журам</span>
            <span>Стандарт</span>
            <span>Хяналтын хуудас</span>
            <span>Сургалт</span>
            <span>AI хайлт</span>
          </nav>

          <Link
            href="/login"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Нэвтрэх
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-6 inline-flex rounded-full border bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            AI-driven Governance, Risk & Compliance Platform
          </div>

          <h2 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Дотоод хяналт шалгалтын нэгдсэн платформ
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Хууль, дүрэм, журам, стандарт, хяналт шалгалт, эрсдэл,
            судалгаа хөгжүүлэлт, ажилтны санал хүсэлт, AI assistant,
            Telegram bot бүхий байгууллагын ухаалаг систем.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Байгууллагаар нэвтрэх
            </Link>

            <button className="rounded-xl border bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-100">
              AI-аас асуух
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-3">
            {modules.map((item) => (
              <div key={item} className="rounded-2xl border bg-white p-4 text-sm font-semibold shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border bg-white p-6 shadow-xl">
          <div className="rounded-2xl bg-slate-100 p-4 text-slate-500">
            Хууль, журам, стандарт хайх...
          </div>

          <div className="mt-4 space-y-3">
            {sectors.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl border p-4 font-medium hover:bg-slate-50"
              >
                <span>{item}</span>
                <span className="text-slate-400">→</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-300">Inspect AI</p>
            <h3 className="mt-2 text-xl font-bold">Өнөөдрийн зөвлөмж</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Журмын хэрэгжилт, хяналт шалгалтын төлөвлөгөө, эрсдэлийн
              түвшинг AI-аар нэгтгэн дүгнэнэ.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}