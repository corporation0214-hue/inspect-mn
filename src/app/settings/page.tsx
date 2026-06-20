import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";

export default function SettingsPage() {
  const settings = [
    "Байгууллагын мэдээлэл",
    "Алба, хэлтэс",
    "Албан тушаал",
    "Хэрэглэгч",
    "Эрхийн тохиргоо",
    "Dashboard Builder",
    "Checklist Builder",
    "Workflow Builder",
    "AI Knowledge Base",
    "Telegram Bot Settings",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-500">Байгууллага өөрийн dashboard, workflow, checklist, AI сангаа тохируулна</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settings.map((x) => (
            <ModuleCard key={x} title={x} description="Тохиргооны модуль">
              <button className="mt-3 rounded-xl border px-4 py-2 text-sm">
                Нээх
              </button>
            </ModuleCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}