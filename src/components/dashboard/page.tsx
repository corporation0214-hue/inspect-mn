import DashboardLayout from "@/components/layout/dashboard-layout";
import KpiCard from "@/components/dashboard/kpi-card";

export default function DashboardPage() {
  return (
    <DashboardLayout>

      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Executive Dashboard
        </h1>

        <div className="grid grid-cols-4 gap-4">

          <KpiCard
            title="Inspections"
            value="126"
          />

          <KpiCard
            title="Compliance"
            value="87%"
          />

          <KpiCard
            title="Risks"
            value="14"
          />

          <KpiCard
            title="Employee Voice"
            value="523"
          />

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white border rounded-xl h-96 p-4">
            Risk Heatmap
          </div>

          <div className="bg-white border rounded-xl h-96 p-4">
            Compliance Trend
          </div>

        </div>

        <div className="bg-white border rounded-xl h-52 p-4">
          AI Executive Summary
        </div>

      </div>

    </DashboardLayout>
  );
}