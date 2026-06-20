import DashboardLayout from "@/components/layout/DashboardLayout";
import KpiCard from "@/components/dashboard/KpiCard";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { kpis, inspections, procedures, voiceCases } from "@/lib/constants/SampleData";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ерөнхий самбар</h1>
          <p className="text-slate-500">Байгууллагын дотоод хяналт, эрсдэл, журам, санал хүсэлтийн нэгтгэл</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map((item) => (
            <KpiCard key={item.title} title={item.title} value={item.value} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ModuleCard title="Эрсдэлийн матриц" description="Магадлал × Үр нөлөө">
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-12 rounded ${
                    i > 18 ? "bg-red-200" : i > 11 ? "bg-orange-200" : i > 5 ? "bg-yellow-200" : "bg-green-200"
                  }`}
                />
              ))}
            </div>
          </ModuleCard>

          <ModuleCard title="Хяналт шалгалтын явц" description="Төлөвлөгөөт ба төлөвлөгөөт бус">
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

          <ModuleCard title="AI Executive Summary" description="Өнөөдрийн товч дүгнэлт">
            <div className="space-y-3 text-sm text-slate-700">
              <p>• Энэ сард 42 хяналт шалгалт бүртгэгдсэн.</p>
              <p>• 136 зөрчил илэрснээс 94 нь хаагдсан.</p>
              <p>• Засварын хэсэгт давтагдсан зөрчил өндөр байна.</p>
              <p>• 8 объект өндөр эрсдэлийн бүсэд байна.</p>
            </div>
          </ModuleCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ModuleCard title="Журмын хэрэгжилт" description="Хамгийн анхаарах журам">
            <SimpleTable
              columns={["Журам", "Хариуцагч", "Биелэлт", "Эрсдэл"]}
              rows={procedures.map((x) => ({
                Журам: x.title,
                Хариуцагч: x.owner,
                Биелэлт: x.score,
                Эрсдэл: x.risk,
              }))}
            />
          </ModuleCard>

          <ModuleCard title="Employee Voice" description="Ажилтны санал, хүсэлт, зөрчил">
            <SimpleTable
              columns={["Гарчиг", "Төрөл", "Төлөв"]}
              rows={voiceCases.map((x) => ({
                Гарчиг: x.title,
                Төрөл: x.type,
                Төлөв: x.status,
              }))}
            />
          </ModuleCard>
        </div>
      </div>
    </DashboardLayout>
  );
}