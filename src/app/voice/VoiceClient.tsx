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
  confidential: "Нууц мэдээлэл",
};

function getTopCategories(sourceItems: any[]) {
  return [
    {
      key: "suggestion",
      label: "Санал",
      count: sourceItems.filter((x) => x.category === "suggestion").length,
    },
    {
      key: "complaint",
      label: "Гомдол",
      count: sourceItems.filter((x) => x.category === "complaint").length,
    },
    {
      key: "risk",
      label: "Эрсдэл",
      count: sourceItems.filter((x) => x.category === "risk").length,
    },
    {
      key: "violation",
      label: "Зөрчил",
      count: sourceItems.filter((x) => x.category === "violation").length,
    },
    {
      key: "confidential",
      label: "Нууц",
      count: sourceItems.filter((x) => x.category === "confidential").length,
    },
  ]
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
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
    if (filter === "all") return items;
    return items.filter((x) => x.category === filter);
  }, [items, filter]);

  const total = items.length;
  const open = items.filter((x) => x.status !== "closed").length;
  const closed = items.filter((x) => x.status === "closed").length;
  const highPriority = items.filter(
    (x) => x.priority === "high" || x.priority === "critical"
  ).length;

  const openItems = items.filter((x) => x.status !== "closed");
  const closedItems = items.filter((x) => x.status === "closed");
  const highPriorityItems = items.filter(
    (x) => x.priority === "high" || x.priority === "critical"
  );

  const totalCount = total || 1;
  const openPercent = Math.round((open / totalCount) * 100);
  const closedPercent = Math.round((closed / totalCount) * 100);
  const highPriorityPercent = Math.round((highPriority / totalCount) * 100);

  const totalTopCategories = getTopCategories(items);
  const openTopCategories = getTopCategories(openItems);
  const closedTopCategories = getTopCategories(closedItems);
  const highPriorityTopCategories = getTopCategories(highPriorityItems);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Voice</h1>
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

      <div className="grid gap-4 md:grid-cols-4">
        <VoiceKpiCard
            title="Нийт бүртгэл"
            subtitle="Ажилтны нийт санал, гомдол"
            value={total}
            percent={100}
            topItems={totalTopCategories}
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
            barColor="bg-orange-600"
            topItems={openTopCategories}
            onExpand={() =>
            setSelectedKpi({
                title: "Нээлттэй Employee Voice бүртгэл",
                description: "Хаагдаагүй санал, гомдол, эрсдэлүүд",
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
            barColor="bg-green-600"
            topItems={closedTopCategories}
            onExpand={() =>
            setSelectedKpi({
                title: "Хаагдсан Employee Voice бүртгэл",
                description: "Шийдвэрлэгдсэн бүртгэлүүд",
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
            barColor="bg-red-600"
            topItems={highPriorityTopCategories}
            onExpand={() =>
            setSelectedKpi({
                title: "Өндөр ач холбогдолтой бүртгэл",
                description: "High болон Critical priority бүртгэлүүд",
                items: highPriorityItems,
            })
            }
        />
        </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ["all", "Бүгд"],
            ["suggestion", "Санал"],
            ["complaint", "Гомдол"],
            ["risk", "Эрсдэл"],
            ["violation", "Зөрчил"],
            ["confidential", "Нууц"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-xl border px-4 py-2 text-sm ${
                filter === key ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="mb-4 text-xl font-bold">Employee Voice Registry</h2>

        <div className="max-h-[520px] overflow-y-auto rounded-xl border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 bg-slate-100">
              <tr>
                <th className="border px-4 py-3 text-left">Гарчиг</th>
                <th className="border px-4 py-3 text-left">Төрөл</th>
                <th className="border px-4 py-3 text-left">Төлөв</th>
                <th className="border px-4 py-3 text-left">Priority</th>
                <th className="border px-4 py-3 text-left">Алба</th>
                <th className="border px-4 py-3 text-left">Хариуцагч</th>
                <th className="border px-4 py-3 text-left">Огноо</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <td className="border px-4 py-3">{item.title || "-"}</td>
                  <td className="border px-4 py-3">
                    {typeLabels[item.category] || item.category || "-"}
                  </td>
                  <td className="border px-4 py-3">{item.status || "-"}</td>
                  <td className="border px-4 py-3">{item.priority || "-"}</td>
                  <td className="border px-4 py-3">{item.department || "-"}</td>
                  <td className="border px-4 py-3">{item.assigned_to || "-"}</td>
                  <td className="border px-4 py-3">{item.voice_date || "-"}</td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
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
          organizationId={organizationId}
          item={selected}
          createMode={createMode}
          onClose={() => {
            setSelected(null);
            setCreateMode(false);
            location.reload();
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
  color = "text-slate-950",
  barColor = "bg-blue-600",
  topItems,
  onExpand,
}: {
  title: string;
  subtitle: string;
  value: number;
  percent: number;
  color?: string;
  barColor?: string;
  topItems: { label: string; count: number }[];
  onExpand: () => void;
}) {
  return (
    <div className="relative rounded-2xl border bg-white p-5">
      <button
        onClick={onExpand}
        className="absolute right-4 top-4 rounded-lg border px-2 py-1 text-xs hover:bg-slate-100"
        title="Дэлгэрэнгүй харах"
      >
        ⛶
      </button>

      <p className="pr-10 text-lg font-bold">{title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center text-sm">
        <div>
          <p className="text-slate-500">Нийт</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div>
          <p className="text-slate-500">Хувь</p>
          <p className="text-2xl font-bold">{percent}%</p>
        </div>
        <div>
          <p className="text-slate-500">Түвшин</p>
          <p className="text-sm font-bold">
            {percent >= 70 ? "Өндөр" : percent >= 30 ? "Дунд" : "Бага"}
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase text-slate-500">
          TOP 3 ангилал
        </p>

        <div className="space-y-1 text-sm">
          {topItems.map((x) => (
            <div key={x.label} className="flex justify-between">
              <span>{x.label}</span>
              <b>{x.count}</b>
            </div>
          ))}

          {topItems.length === 0 && (
            <p className="text-slate-500">Бүртгэл байхгүй</p>
          )}
        </div>
      </div>
    </div>
  );
}
