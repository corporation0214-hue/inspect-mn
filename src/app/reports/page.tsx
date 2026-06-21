import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient } from "@/lib/supabase/server";

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("code", "BAYANGOL")
    .maybeSingle();

  const orgId = org?.id ?? "";

  const { data: inspections } = await supabase
    .from("inspections")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: findings } = await supabase
    .from("findings")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: compliance } = await supabase
    .from("compliance_items")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const { data: research } = await supabase
    .from("research_projects")
    .select("*")
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  const inspectionCount = inspections?.length ?? 0;
  const findingCount = findings?.length ?? 0;
  const openFindings = findings?.filter((x) => x.status === "open").length ?? 0;
  const closedFindings = findings?.filter((x) => x.status === "closed").length ?? 0;

  const avgCompliance =
    compliance && compliance.length > 0
      ? Math.round(
          compliance.reduce(
            (sum, x) => sum + Number(x.compliance_score || 0),
            0
          ) / compliance.length
        )
      : 0;

  const activeResearch = research?.filter((x) => x.status === "active").length ?? 0;
  const urgentResearch = research?.filter((x) => x.is_urgent === true).length ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports / Тайлан</h1>
          <p className="text-slate-500">
            Хугацаа, төрөл, алба нэгж, ажилтнаар нэгтгэсэн тайлангийн хэсэг
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 text-xl font-bold">Тайлангийн хугацаа сонгох</h2>

          <div className="grid gap-3 md:grid-cols-4">
            <input type="date" className="rounded-xl border px-4 py-3" />
            <input type="date" className="rounded-xl border px-4 py-3" />

            <select className="rounded-xl border px-4 py-3">
              <option>Бүх модуль</option>
              <option>Inspection</option>
              <option>Findings</option>
              <option>Compliance</option>
              <option>Research & Development</option>
            </select>

            <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">
              Тайлан гаргах
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-slate-500">Нийт хяналт шалгалт</p>
            <p className="text-3xl font-bold">{inspectionCount}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-slate-500">Илэрсэн зөрчил</p>
            <p className="text-3xl font-bold text-red-600">{findingCount}</p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-slate-500">Compliance дундаж</p>
            <p className="text-3xl font-bold text-green-600">{avgCompliance}%</p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <p className="text-sm text-slate-500">Идэвхтэй R&D ажил</p>
            <p className="text-3xl font-bold text-blue-600">{activeResearch}</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-xl font-bold">Зөрчлийн төлөв</h2>

            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Нээлттэй</span>
                  <span>{openFindings}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{
                      width: `${findingCount > 0 ? (openFindings / findingCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Хаагдсан</span>
                  <span>{closedFindings}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-green-600"
                    style={{
                      width: `${findingCount > 0 ? (closedFindings / findingCount) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <h2 className="text-xl font-bold">R&D товч тайлан</h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Идэвхтэй</p>
                <p className="text-2xl font-bold">{activeResearch}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Нэн яаралтай</p>
                <p className="text-2xl font-bold text-red-600">{urgentResearch}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="mb-4 text-xl font-bold">Нэгдсэн ажлын жагсаалт</h2>

          <div className="max-h-[520px] overflow-y-auto rounded-xl border">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr>
                  <th className="border px-4 py-3 text-left">Модуль</th>
                  <th className="border px-4 py-3 text-left">Нэр</th>
                  <th className="border px-4 py-3 text-left">Төлөв</th>
                  <th className="border px-4 py-3 text-left">Төрөл / Ангилал</th>
                  <th className="border px-4 py-3 text-left">Хариуцагч</th>
                  <th className="border px-4 py-3 text-left">Огноо</th>
                </tr>
              </thead>

              <tbody>
                {(inspections ?? []).map((x) => (
                  <tr key={`inspection-${x.id}`}>
                    <td className="border px-4 py-3">Inspection</td>
                    <td className="border px-4 py-3">{x.title}</td>
                    <td className="border px-4 py-3">{x.status || "-"}</td>
                    <td className="border px-4 py-3">{x.type || x.category || "-"}</td>
                    <td className="border px-4 py-3">{x.performed_by || x.registered_by || "-"}</td>
                    <td className="border px-4 py-3">{x.inspection_date || "-"}</td>
                  </tr>
                ))}

                {(compliance ?? []).map((x) => (
                  <tr key={`compliance-${x.id}`}>
                    <td className="border px-4 py-3">Compliance</td>
                    <td className="border px-4 py-3">{x.title}</td>
                    <td className="border px-4 py-3">{x.status || "-"}</td>
                    <td className="border px-4 py-3">{x.item_type || x.framework || "-"}</td>
                    <td className="border px-4 py-3">{x.responsible_person || x.owner_department || "-"}</td>
                    <td className="border px-4 py-3">{x.next_review_date || "-"}</td>
                  </tr>
                ))}

                {(research ?? []).map((x) => (
                  <tr key={`research-${x.id}`}>
                    <td className="border px-4 py-3">R&D</td>
                    <td className="border px-4 py-3">{x.title}</td>
                    <td className="border px-4 py-3">{x.status || "-"}</td>
                    <td className="border px-4 py-3">{x.category || x.priority || "-"}</td>
                    <td className="border px-4 py-3">{x.owner || "-"}</td>
                    <td className="border px-4 py-3">{x.start_date || x.end_date || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}