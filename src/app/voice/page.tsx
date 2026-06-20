import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { voiceCases } from "@/lib/constants/SampleData";

export default function VoicePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employee Voice</h1>
            <p className="text-slate-500">Санал, хүсэлт, гомдол, зөрчил, эрсдэлийн мэдээлэл</p>
          </div>
          <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">+ Санал бүртгэх</button>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {["Санал", "Гомдол", "Зөрчил", "Эрсдэл", "Нууц мэдээлэл"].map((x) => (
            <ModuleCard key={x} title={x} description="Ангилал">
              <div className="text-3xl font-bold">24</div>
            </ModuleCard>
          ))}
        </div>

        <ModuleCard title="Case Management" description="Шийдвэрлэлтийн урсгал">
          <SimpleTable
            columns={["Гарчиг", "Төрөл", "Төлөв"]}
            rows={voiceCases.map((x) => ({
              Гарчиг: x.title,
              Төрөл: x.type,
              Төлөв: x.status,
            }))}
          />
        </ModuleCard>

        <div className="grid gap-4 xl:grid-cols-2">
          <ModuleCard title="QR Reporting" description="Талбайгаас шууд мэдээлэх">
            <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed text-slate-500">
              QR placeholder
            </div>
          </ModuleCard>

          <ModuleCard title="AI Voice Analyst" description="Санал хүсэлтийн автомат ангилал">
            <div className="space-y-2 text-sm">
              <p>Замын асуудал — 31%</p>
              <p>Гэрэлтүүлэг — 22%</p>
              <p>Хоол — 16%</p>
              <p>Засвар үйлчилгээ — 14%</p>
            </div>
          </ModuleCard>
        </div>
      </div>
    </DashboardLayout>
  );
}