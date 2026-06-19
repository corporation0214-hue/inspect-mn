import DashboardLayout from "@/components/layout/dashboard-layout";

export default function AIPage() {
  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold">
        Inspect AI
      </h1>

      <div className="bg-white rounded-xl border p-6 mt-6 h-[600px]">
        Chat Window
      </div>

    </DashboardLayout>
  );
}