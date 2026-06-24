"use client";

import { useState } from "react";

export default function UserEditModal({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  if (!user) return null;
 

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [role, setRole] = useState(user?.role || "employee");
  const [department, setDepartment] = useState(user?.department || "");
  const [position, setPosition] = useState(user?.position || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [status, setStatus] = useState(user?.status || "active");

  const [receiveDailyReport, setReceiveDailyReport] = useState(
    user?.receive_daily_report || false
  );
  const [receiveWeeklyReport, setReceiveWeeklyReport] = useState(
    user?.receive_weekly_report || false
  );
  const [receiveMonthlyReport, setReceiveMonthlyReport] = useState(
    user?.receive_monthly_report || false
  );

  async function saveUser() {
    const res = await fetch("/api/admin/users/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        full_name: fullName,
        role,
        department,
        position,
        phone,
        status,

        receive_daily_report: receiveDailyReport,
        receive_weekly_report: receiveWeeklyReport,
        receive_monthly_report: receiveMonthlyReport,

        actor_id: user.id,
        actor_name: fullName || user.email || "Admin",
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "User update failed");
      return;
    }

    alert("User updated");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">User Profile Edit</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border p-3"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            value={user.email || ""}
            disabled
          />

          <select
            className="rounded-xl border p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="inspector">Inspector</option>
            <option value="employee">Employee</option>
            <option value="user">User</option>
          </select>

          <select
            className="rounded-xl border p-3"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>

          <input
            className="rounded-xl border p-3"
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <input
            className="rounded-xl border p-3 md:col-span-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

          <div className="rounded-xl border p-4 md:col-span-2">
            <p className="mb-3 font-semibold">Report Distribution</p>

            <div className="grid gap-2 md:grid-cols-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={receiveDailyReport}
                  onChange={(e) => setReceiveDailyReport(e.target.checked)}
                />
                Daily Report
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={receiveWeeklyReport}
                  onChange={(e) => setReceiveWeeklyReport(e.target.checked)}
                />
                Weekly Report
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={receiveMonthlyReport}
                  onChange={(e) => setReceiveMonthlyReport(e.target.checked)}
                />
                Monthly Report
              </label>
            </div>
          </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button
            onClick={saveUser}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );
}