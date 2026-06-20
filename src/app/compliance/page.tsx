import DashboardLayout from "@/components/layout/DashboardLayout";
import ModuleCard from "@/components/dashboard/ModuleCard";
import SimpleTable from "@/components/dashboard/SimpleTable";
import { procedures } from "@/lib/constants/SampleData";

export default function CompliancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Compliance Center</h1>
          <p className="text-slate-500">Хууль, дүрэм, журам, стандарт, АБТ, процессын хэрэгжилт</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <ModuleCard title="Нийт журам" description="Байгууллагын сан">
            <div className="text-3xl font-bold">152</div>
          </ModuleCard>
          <ModuleCard title="Хэрэгжилт" description="Дундаж үнэлгээ">
            <div className="text-3xl font-bold">87%</div>
          </ModuleCard>
          <ModuleCard title="Шинэ журам" description="Танилцуулах шаардлагатай">
            <div className="text-3xl font-bold">12</div>
          </ModuleCard>
          <ModuleCard title="Өндөр эрсдэлтэй" description="Анхаарах журам">
            <div className="text-3xl font-bold">7</div>
          </ModuleCard>
        </div>

        <ModuleCard title="Журмын хэрэгжилтийн үнэлгээ" description="Зүйл заалт, ажлын байр, RACI, суурь шалтгаан">
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

        <div className="grid gap-4 xl:grid-cols-2">
          <ModuleCard title="Clause Mapping" description="Зүйл заалт бүрийг ажлын байртай холбох">
            <div className="rounded-xl border p-4">
              <p className="font-semibold">4.1 Өдөр тутмын үзлэг хийх</p>
              <p className="mt-2 text-sm text-slate-500">R: Мастер, A: Албаны дарга, C: Инженер, I: Оператор</p>
            </div>
          </ModuleCard>

          <ModuleCard title="Root Cause Engine" description="Суурь шалтгааны ангилал">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {["Мэдлэг дутмаг", "Хяналт сул", "Процесс тодорхойгүй", "Нөөц хүрэлцээгүй"].map((x) => (
                <div key={x} className="rounded-xl border p-3">{x}</div>
              ))}
            </div>
          </ModuleCard>
        </div>
      </div>
    </DashboardLayout>
  );
}