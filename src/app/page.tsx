"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Bot,
  Building2,
  ChartNoAxesCombined,
  FileSearch,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="inspect-animated-bg">
        <div className="inspect-gradient" />
        <div className="inspect-grid" />
        <span className="inspect-orb inspect-orb-a" />
        <span className="inspect-orb inspect-orb-b" />
        <span className="inspect-orb inspect-orb-c" />
        <span className="inspect-scan" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-black tracking-wide">INSPECT.MN</h1>
            <p className="text-sm text-cyan-300">
              Smart Internal Control Platform
            </p>
          </div>

          <nav className="hidden gap-8 text-sm text-slate-300 lg:flex">
            <Link href="#">Улсын хууль</Link>
            <Link href="#">Дүрэм, журам</Link>
            <Link href="#">Стандарт</Link>
            <Link href="#">Хяналтын хуудас</Link>
            <Link href="#">AI хайлт</Link>
          </nav>

          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 px-6 py-3 font-semibold shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]"
          >
            Нэвтрэх
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div className="inspect-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-300">
            <Sparkles size={16} />
            AI-driven Governance, Risk & Compliance Platform
          </div>

          <h2 className="text-5xl font-black leading-tight md:text-7xl">
            From Inspection <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              To Intelligence
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Хууль, журам, стандарт, хяналт шалгалт, эрсдэл, судалгаа
            хөгжүүлэлт болон AI Agent бүхий байгууллагын ухаалаг хяналтын
            систем.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 px-8 py-4 font-semibold shadow-xl shadow-blue-500/30 transition hover:scale-[1.02]"
            >
              Байгууллагаар нэвтрэх
              <ArrowRight size={18} />
            </Link>

            <button className="rounded-xl border border-cyan-400/40 bg-white/5 px-8 py-4 font-semibold backdrop-blur transition hover:bg-white/10">
              AI-аас асуух
            </button>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
            <Metric value="24/7" label="AI Agent" />
            <Metric value="99.9%" label="Uptime" />
            <Metric value="45K+" label="Checklist" />
            <Metric value="2.5K+" label="Workspace" />
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="inspect-ai-orb">
            <div className="inspect-ai-core">
              <Bot size={88} />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <ModuleCard icon={<ShieldCheck />} title="Хяналт шалгалт" />
          <ModuleCard icon={<FileSearch />} title="Журмын хэрэгжилт" />
          <ModuleCard icon={<ChartNoAxesCombined />} title="Эрсдэлийн удирдлага" />
          <ModuleCard icon={<GraduationCap />} title="Сургалт" />
          <ModuleCard icon={<Building2 />} title="Дуу хоолой" />
          <ModuleCard icon={<Bot />} title="AI Туслах" />
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-white/5 p-4 backdrop-blur">
      <div className="text-2xl font-black text-cyan-300">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

function ModuleCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-white/5 p-5 text-center backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-white/10">
      <div className="mb-3 flex justify-center text-cyan-300">{icon}</div>
      <div className="text-sm font-medium text-slate-200">{title}</div>
    </div>
  );
}