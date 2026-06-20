import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { inspections } from "@/lib/constants/SampleData";

export default function InspectionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inspection Center</h1>
            <p className="text-slate-500">Төлөвлөгөөт, төлөвлөгөөт бус, хамтарсан хяналт шалгалт</p>
          </div>
          <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">+ Шинэ ХШ</button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {["Төрийн ХШ", "Шөнийн ХШ", "Хамтарсан ХШ", "Төлөвлөгөөт бус"].map((x) => (
            <ModuleCard key={x} title={x} description="Хяналтын төрөл">
              <div className="text-3xl font-bold text-slate-900">12</div>
              <div className="mt-2 h-2 rounded bg-slate-100">
                <div className="h-2 w-2/3 rounded bg-blue-600" />
              </div>
            </ModuleCard>
          ))}
        </div>

        <ModuleCard title="Хяналт шалгалтын жагсаалт" description="Төлөвлөгөөтэй харьцуулсан гүйцэтгэл">
          <SimpleTable
            columns={["Нэр", "Төрөл", "Төлөв", "Хувь"]}
            rows={inspections.map((x) => ({
              Нэр: x.name,
              Төрөл: x.type,
              Төлөв: x.status,
              Хувь: x.progress,
            }))}
          />
        </ModuleCard>

        <div className="grid gap-4 xl:grid-cols-2">
          <ModuleCard title="Checklist Builder" description="Хяналтын хуудас үүсгэх">
            <div className="space-y-3">
              {["Yes/No", "Score", "Text", "Photo Required", "GPS", "File Upload"].map((x) => (
                <div key={x} className="rounded-xl border p-3">{x}</div>
              ))}
            </div>
          </ModuleCard>

          <ModuleCard title="CAPA" description="Зөрчил, арга хэмжээ, follow-up">
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border p-4">Зөрчил бүртгэх</div>
              <div className="rounded-xl border p-4">Арга хэмжээ оноох</div>
              <div className="rounded-xl border p-4">Дахин шалгах</div>
            </div>
          </ModuleCard>
        </div>
      </div>
    </DashboardLayout>
  );
}