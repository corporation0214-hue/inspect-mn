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
      <div className="home-bg">
        <div className="home-gradient" />
        <div className="home-grid" />

        <span className="home-orb orb-a" />
        <span className="home-orb orb-b" />
        <span className="home-orb orb-c" />

        <span className="home-particle p-a" />
        <span className="home-particle p-b" />
        <span className="home-particle p-c" />
        <span className="home-particle p-d" />
        <span className="home-particle p-e" />
        <span className="home-particle p-f" />

        <span className="home-scan" />
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
        <div>
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
          <div className="ai-orb-home">
            <div className="ai-core-home">
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
          <ModuleCard icon={<Building2 />} title="Employee Voice" />
          <ModuleCard icon={<Bot />} title="AI Assistant" />
        </div>
      </section>

      <style jsx global>{`
        .home-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .home-gradient {
          position: absolute;
          inset: -35%;
          background:
            radial-gradient(circle at 18% 28%, rgba(6, 182, 212, 0.42), transparent 28%),
            radial-gradient(circle at 82% 18%, rgba(147, 51, 234, 0.42), transparent 30%),
            radial-gradient(circle at 52% 78%, rgba(37, 99, 235, 0.42), transparent 35%);
          animation: homeGradientMove 8s ease-in-out infinite alternate;
        }

        .home-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: homeGridMove 5s linear infinite;
          opacity: 0.4;
        }

        .home-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(60px);
          opacity: 0.55;
          animation: homeOrbFloat 6s ease-in-out infinite;
        }

        .orb-a {
          width: 340px;
          height: 340px;
          left: -90px;
          top: 18%;
          background: rgba(6, 182, 212, 0.65);
        }

        .orb-b {
          width: 460px;
          height: 460px;
          right: -140px;
          top: 10%;
          background: rgba(147, 51, 234, 0.6);
          animation-delay: 1.5s;
        }

        .orb-c {
          width: 400px;
          height: 400px;
          left: 35%;
          bottom: -160px;
          background: rgba(37, 99, 235, 0.6);
          animation-delay: 3s;
        }

        .home-particle {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: #22d3ee;
          box-shadow: 0 0 20px #22d3ee;
          animation: homeParticleMove 6s linear infinite;
        }

        .p-a { left: 8%; top: 85%; animation-delay: 0s; }
        .p-b { left: 22%; top: 75%; animation-delay: 1s; }
        .p-c { left: 40%; top: 90%; animation-delay: 2s; }
        .p-d { left: 58%; top: 80%; animation-delay: 3s; }
        .p-e { left: 74%; top: 88%; animation-delay: 4s; }
        .p-f { left: 90%; top: 72%; animation-delay: 5s; }

        .home-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: -20%;
          height: 180px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(34, 211, 238, 0.18),
            transparent
          );
          animation: homeScanMove 4s linear infinite;
        }

        .ai-orb-home {
          width: 360px;
          height: 360px;
          border-radius: 9999px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(circle, rgba(34, 211, 238, 0.3), transparent 55%),
            linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(168, 85, 247, 0.3));
          border: 1px solid rgba(34, 211, 238, 0.45);
          box-shadow:
            0 0 90px rgba(34, 211, 238, 0.45),
            inset 0 0 70px rgba(99, 102, 241, 0.35);
          animation: aiOrbFloatHome 5s ease-in-out infinite;
        }

        .ai-orb-home::before,
        .ai-orb-home::after {
          content: "";
          position: absolute;
          inset: -28px;
          border-radius: 9999px;
          border: 1px solid rgba(34, 211, 238, 0.35);
          animation: aiOrbitHome 8s linear infinite;
        }

        .ai-orb-home::after {
          inset: -55px;
          border-color: rgba(168, 85, 247, 0.35);
          animation-duration: 12s;
          animation-direction: reverse;
        }

        .ai-core-home {
          width: 150px;
          height: 150px;
          border-radius: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: linear-gradient(135deg, #2563eb, #06b6d4, #9333ea);
          box-shadow: 0 0 55px rgba(34, 211, 238, 0.8);
          animation: aiCorePulseHome 3s ease-in-out infinite;
        }

        @keyframes homeGradientMove {
          0% { transform: translate3d(-4%, -3%, 0) scale(1); }
          50% { transform: translate3d(5%, 4%, 0) scale(1.1); }
          100% { transform: translate3d(-2%, 5%, 0) scale(1.04); }
        }

        @keyframes homeGridMove {
          from { background-position: 0 0; }
          to { background-position: 64px 64px; }
        }

        @keyframes homeOrbFloat {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-55px) translateX(45px) scale(1.15); }
        }

        @keyframes homeParticleMove {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-620px) translateX(160px); opacity: 0; }
        }

        @keyframes homeScanMove {
          from { transform: translateY(0); }
          to { transform: translateY(145vh); }
        }

        @keyframes aiOrbFloatHome {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.04); }
        }

        @keyframes aiOrbitHome {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes aiCorePulseHome {
          0%, 100% { transform: scale(1); box-shadow: 0 0 45px rgba(34, 211, 238, 0.7); }
          50% { transform: scale(1.06); box-shadow: 0 0 80px rgba(168, 85, 247, 0.9); }
        }
      `}</style>
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