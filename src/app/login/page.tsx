"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

import {
  Home,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Bot,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("admin@inspect.mn");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="login-gradient" />
        <div className="login-grid" />
        <span className="login-orb orb-a" />
        <span className="login-orb orb-b" />
        <span className="login-orb orb-c" />
        <span className="login-particle p-a" />
        <span className="login-particle p-b" />
        <span className="login-particle p-c" />
        <span className="login-particle p-d" />
        <span className="login-particle p-e" />
        <span className="login-scan" />
      </div>

      <div className="absolute right-8 top-8 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-white/5 px-5 py-3 text-sm backdrop-blur-md transition hover:bg-white/10"
        >
          <Home size={18} />
          Нүүр хуудас
        </Link>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
        <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2">
          <div className="hidden flex-col justify-center lg:flex">
            <div className="mb-4 inline-flex w-fit rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
              AI Powered Governance Platform
            </div>

            <h1 className="text-6xl font-black leading-tight">INSPECT.MN</h1>

            <h2 className="mt-4 text-4xl font-bold">
              Smart Internal Control Platform
            </h2>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
              Хууль, журам, стандарт, эрсдэлийн удирдлага, хяналт шалгалт
              болон AI Agent бүхий байгууллагын дотоод хяналтын нэгдсэн систем.
            </p>

            <div className="mt-10 space-y-4 text-slate-300">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
                <span>AI Agent Online</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="text-cyan-400" />
                <span>Enterprise Security Enabled</span>
              </div>

              <div className="flex items-center gap-3">
                <Bot className="text-purple-400" />
                <span>24/7 Intelligent Assistant</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 p-8 shadow-[0_0_60px_rgba(6,182,212,.15)] backdrop-blur-xl">
              <div className="text-center">
                <h2 className="text-4xl font-bold">Нэвтрэх</h2>
                <p className="mt-2 text-slate-400">
                  Байгууллагын workspace руу нэвтрэх
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="text-sm text-slate-300">Имэйл</label>
                  <div className="relative mt-2">
                    <Mail size={18} className="absolute left-4 top-4 text-slate-400" />
                    <input
                      className="w-full rounded-xl border border-cyan-500/20 bg-[#071124] py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400"
                      placeholder="Имэйл"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Нууц үг</label>
                  <div className="relative mt-2">
                    <Lock size={18} className="absolute left-4 top-4 text-slate-400" />
                    <input
                      className="w-full rounded-xl border border-cyan-500/20 bg-[#071124] py-4 pl-12 pr-12 text-white outline-none transition focus:border-cyan-400"
                      placeholder="Нууц үг"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 py-4 font-semibold transition hover:scale-[1.02] disabled:opacity-70"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
                </button>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <ShieldCheck size={16} />
                  Protected by INSPECT AI Security Layer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .login-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .login-gradient {
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.4), transparent 28%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.4), transparent 30%),
            radial-gradient(circle at 50% 80%, rgba(37, 99, 235, 0.4), transparent 35%);
          animation: loginGradientMove 8s ease-in-out infinite alternate;
        }

        .login-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: loginGridMove 5s linear infinite;
          opacity: 0.4;
        }

        .login-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(60px);
          opacity: 0.55;
          animation: loginOrbFloat 6s ease-in-out infinite;
        }

        .orb-a {
          width: 320px;
          height: 320px;
          left: -80px;
          top: 18%;
          background: rgba(6, 182, 212, 0.65);
        }

        .orb-b {
          width: 420px;
          height: 420px;
          right: -120px;
          top: 8%;
          background: rgba(147, 51, 234, 0.6);
          animation-delay: 1.5s;
        }

        .orb-c {
          width: 380px;
          height: 380px;
          left: 38%;
          bottom: -150px;
          background: rgba(37, 99, 235, 0.6);
          animation-delay: 3s;
        }

        .login-particle {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 9999px;
          background: #22d3ee;
          box-shadow: 0 0 20px #22d3ee;
          animation: loginParticleMove 6s linear infinite;
        }

        .p-a { left: 10%; top: 85%; animation-delay: 0s; }
        .p-b { left: 25%; top: 75%; animation-delay: 1s; }
        .p-c { left: 45%; top: 90%; animation-delay: 2s; }
        .p-d { left: 65%; top: 80%; animation-delay: 3s; }
        .p-e { left: 85%; top: 88%; animation-delay: 4s; }

        .login-scan {
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
          animation: loginScanMove 4s linear infinite;
        }

        @keyframes loginGradientMove {
          0% {
            transform: translate3d(-4%, -3%, 0) scale(1);
          }
          50% {
            transform: translate3d(5%, 4%, 0) scale(1.1);
          }
          100% {
            transform: translate3d(-2%, 5%, 0) scale(1.04);
          }
        }

        @keyframes loginGridMove {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 64px 64px;
          }
        }

        @keyframes loginOrbFloat {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-55px) translateX(45px) scale(1.15);
          }
        }

        @keyframes loginParticleMove {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translateY(-620px) translateX(160px);
            opacity: 0;
          }
        }

        @keyframes loginScanMove {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(145vh);
          }
        }
      `}</style>
    </main>
  );
}