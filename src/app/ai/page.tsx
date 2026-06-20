"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";

export default function AIPage() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("Сайн байна уу. Би Inspect AI. Хяналт шалгалт, журам, эрсдэл, судалгааны талаар асуугаарай.");

  async function askAI() {
    if (!message.trim()) return;

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module: "general", message }),
    });

    const data = await res.json();
    setAnswer(data.answer || "AI хариу авахад алдаа гарлаа.");
    setMessage("");
  }

  return (
    <DashboardLayout>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Inspect AI Center</h1>
            <p className="text-slate-500">AI Inspector, Compliance Analyst, Risk Analyst, Research Analyst</p>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="min-h-[420px] rounded-xl bg-slate-50 p-5 text-slate-700">
              {answer}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 rounded-xl border px-4 py-3"
                placeholder="AI-аас асуух..."
              />
              <button onClick={askAI} className="rounded-xl bg-blue-600 px-6 py-3 text-white">
                Илгээх
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[
            "Энэ сарын ХШ тайлан гарга",
            "Журмын биелэлт яагаад буурсан бэ?",
            "Өндөр эрсдэлтэй 5 зөрчил харуул",
            "WiFi Mesh төслийн SWOT гарга",
          ].map((x) => (
            <ModuleCard key={x} title={x} description="Quick prompt" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}