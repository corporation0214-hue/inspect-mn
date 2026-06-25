"use client";

import { useMemo, useState } from "react";
import VoiceItemModal from "@/components/voice/VoiceItemModal";
import VoiceKpiDetailModal from "@/components/voice/VoiceKpiDetailModal";

type Props = {
  organizationId: string;
  items: any[];
};

const typeLabels: Record<string, string> = {
  suggestion: "Санал",
  complaint: "Гомдол",
  risk: "Эрсдэл",
  violation: "Зөрчил",
  confidential: "Нууц",
};

function normalizeVoiceType(value: any) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "suggestion" || v === "санал") return "suggestion";
  if (v === "complaint" || v === "гомдол") return "complaint";
  if (v === "risk" || v === "эрсдэл") return "risk";
  if (v === "violation" || v === "зөрчил") return "violation";
  if (v === "confidential" || v === "нууц" || v === "нууц мэдээлэл")
    return "confidential";

  return v;
}

function getItemType(item: any) {
  return normalizeVoiceType(item.type || item.category);
}

function matchCategory(item: any, key: string) {
  if (key === "all") return true;

  const normalizedKey = normalizeVoiceType(key);
  const type = normalizeVoiceType(item.type);
  const category = normalizeVoiceType(item.category);

  return type === normalizedKey || category === normalizedKey;
}

function getTopCategories(sourceItems: any[]) {
  return Object.keys(typeLabels)
    .map((key) => ({
      key,
      label: typeLabels[key],
      count: sourceItems.filter((x) => matchCategory(x, key)).length,
    }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

function isClosed(item: any) {
  return [
    "closed",
    "approved",
    "resolved",
    "mitigated",
    "fixed",
    "reviewed",
  ].includes(String(item.status || "").toLowerCase());
}

export default function VoiceClient({ organizationId, items }: Props) {
  const [selected, setSelected] = useState<any | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [filter, setFilter] = useState("all");

  const [selectedKpi, setSelectedKpi] = useState<{
    title: string;
    description: string;
    items: any[];
  } | null>(null);

  const filteredItems = useMemo(() => {
    if (filter === "telegram") {
      return items.filter((x: any) => x.source === "telegram");
    }

    return items.filter((x) => matchCategory(x, filter));
  }, [items, filter]);

  const total = items.length;
  const closedItems = items.filter((x) => isClosed(x));
  const openItems = items.filter((x) => !isClosed(x));
  const highPriorityItems = items.filter(
    (x) =>
      String(x.priority || "").toLowerCase() === "high" ||
      String(x.priority || "").toLowerCase() === "critical"
  );

  const closed = closedItems.length;
  const open = openItems.length;
  const highPriority = highPriorityItems.length;

  const totalCount = total || 1;
  const openPercent = Math.round((open / totalCount) * 100);
  const closedPercent = Math.round((closed / totalCount) * 100);
  const highPriorityPercent = Math.round((highPriority / totalCount) * 100);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ажилтны дуу хоолой</h1>
          <p className="text-slate-500">
            Ажилтны санал, гомдол, эрсдэл, нууц мэдээллийн бүртгэл
          </p>
        </div>

        <button
          onClick={() => setCreateMode(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          + Санал бүртгэх
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <VoiceKpiCard
          title="Нийт бүртгэл"
          subtitle="Ажилтны нийт санал, гомдол"
          value={total}
          percent={100}
          color="text-blue-600"
          topItems={getTopCategories(items)}
          onExpand={() =>
            setSelectedKpi({
              title: "Нийт Employee Voice бүртгэл",
              description: "Бүх санал, гомдол, эрсдэл, зөрчлийн жагсаалт",
              items,
            })
          }
        />

        <VoiceKpiCard
          title="Нээлттэй"
          subtitle="Шийдвэрлэгдээгүй бүртгэл"
          value={open}
          percent={openPercent}
          color="text-orange-600"
          topItems={getTopCategories(openItems)}
          onExpand={() =>
            setSelectedKpi({
              title: "Нээлттэй Employee Voice бүртгэл",
              description: "Шийдвэрлэгдээгүй санал, гомдол, эрсдэл",
              items: openItems,
            })
          }
        />

        <VoiceKpiCard
          title="Хаагдсан"
          subtitle="Шийдвэрлэгдсэн бүртгэл"
          value={closed}
          percent={closedPercent}
          color="text-green-600"
          topItems={getTopCategories(closedItems)}
          onExpand={() =>
            setSelectedKpi({
              title: "Хаагдсан Employee Voice бүртгэл",
              description: "Үр дүн гарсан болон хаагдсан бүртгэлүүд",
              items: closedItems,
            })
          }
        />

        <VoiceKpiCard
          title="Өндөр ач холбогдол"
          subtitle="High / Critical санал"
          value={highPriority}
          percent={highPriorityPercent}
          color="text-red-600"
          topItems={getTopCategories(highPriorityItems)}
          onExpand={() =>
            setSelectedKpi({
              title: "Өндөр ач холбогдолтой Employee Voice",
              description: "High болон Critical priority бүртгэлүүд",
              items: highPriorityItems,
            })
          }
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["all", "Бүгд"],
            ["telegram", "Telegram"],
            ["suggestion", "Санал"],
            ["complaint", "Гомдол"],
            ["risk", "Эрсдэл"],
            ["violation", "Зөрчил"],
            ["confidential", "Нууц"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl border px-4 py-2 ${
                filter === key
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-bold">Ажилны дуу хоолойн бүртгэл</h2>

        <div className="max-h-[520px] overflow-auto rounded-xl border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              <tr>
                <th className="border px-4 py-3 text-left">Гарчиг</th>
                <th className="border px-4 py-3 text-left">Төрөл</th>
                <th className="border px-4 py-3 text-left">Төлөв</th>
                <th className="border px-4 py-3 text-left">Priority</th>
                <th className="border px-4 py-3 text-left">Эх үүсвэр</th>
                <th className="border px-4 py-3 text-left">Алба</th>
                <th className="border px-4 py-3 text-left">Хариуцагч</th>
                <th className="border px-4 py-3 text-left">Огноо</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => {
                const normalizedType = getItemType(item);

                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/70"
                  >
                    <td className="border px-4 py-3">{item.title || "-"}</td>
                    <td className="border px-4 py-3">{typeLabels[normalizedType] || item.category || item.type || "-"}</td>
                    <td className="border px-4 py-3">{item.status || "-"}</td>
                    <td className="border px-4 py-3">{item.priority || "-"}</td>
                    <td className="border px-4 py-3">{item.source === "telegram" ? "Telegram" : "Web"}</td>
                    <td className="border px-4 py-3">{item.department || "-"}</td>
                    <td className="border px-4 py-3">{item.assigned_to || "-"}</td>
                    <td className="border px-4 py-3">{item.voice_date || "-"}</td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Мэдээлэл олдсонгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(selected || createMode) && (
        <VoiceItemModal
          item={selected}
          organizationId={organizationId}
          createMode={createMode}
          onClose={() => {
            setSelected(null);
            setCreateMode(false);
            window.location.reload();
          }}
        />
      )}

      {selectedKpi && (
        <VoiceKpiDetailModal
          title={selectedKpi.title}
          description={selectedKpi.description}
          items={selectedKpi.items}
          onClose={() => setSelectedKpi(null)}
        />
      )}
    </div>
  );
}

function VoiceKpiCard({
  title,
  subtitle,
  value,
  percent,
  color = "text-blue-600",
  topItems,
  onExpand,
}: {
  title: string;
  subtitle: string;
  value: number;
  percent: number;
  color?: string;
  topItems: any[];
  onExpand: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>

        <button
          onClick={onExpand}
          className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ⛶
        </button>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
        <div className="grid grid-cols-3 text-center text-sm">
          <div>
            <p className="text-xs text-slate-500">Нийт</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Хувь</p>
            <p className="text-2xl font-bold">{percent}%</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Түвшин</p>
            <p className="font-bold">
              {percent >= 70 ? "Өндөр" : percent >= 30 ? "Дунд" : "Бага"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold text-slate-500">
          TOP 3 АНГИЛАЛ
        </p>

        <div className="space-y-1 text-sm">
          {topItems.length > 0 ? (
            topItems.map((x) => (
              <div key={x.key} className="flex justify-between">
                <span>{x.label}</span>
                <b>{x.count}</b>
              </div>
            ))
          ) : (
            <p className="text-slate-500">Мэдээлэл байхгүй.</p>
          )}
        </div>
      </div>
    </div>
  );
}