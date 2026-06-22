"use client";

import { useEffect, useState } from "react";

export default function AIExecutiveSummary() {
  const [summary, setSummary] = useState("Уншиж байна...");

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const res = await fetch("/api/ai/executive-summary");

      const data = await res.json();

      setSummary(data.summary || "Мэдээлэл олдсонгүй");
    } catch {
      setSummary("AI summary ачаалж чадсангүй");
    }
  }

  return (
    <div className="whitespace-pre-wrap text-sm leading-6">
      {summary}
    </div>
  );
}