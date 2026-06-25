"use client";

import { useMemo, useState } from "react";
import UserCard from "@/components/admin/UserCard";
import UserEditModal from "@/components/admin/UserEditModal";
import UserCreateModal from "@/components/admin/UserCreateModal";
import TelegramUserEditModal from "@/components/admin/TelegramUserEditModal";
import TelegramInviteModal from "@/components/admin/TelegramInviteModal";
import { createClient } from "@/lib/supabase/client";

export default function UsersClient({
  users,
  telegramUsers,
  systemSettings,
}: {
  users: any[];
  telegramUsers: any[];
  systemSettings: any[];
}) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedTelegramUser, setSelectedTelegramUser] = useState<any | null>(
  null
);
  const [filter, setFilter] = useState("all");

  const supabase = createClient();

const getSetting = (key: string, fallback = "") =>
  systemSettings.find((x) => x.key === key)?.value ?? fallback;

const [reportSettings, setReportSettings] = useState({
  daily_report_enabled: getSetting("daily_report_enabled", "true"),
  daily_report_time: getSetting("daily_report_time", "08:00"),

  weekly_report_enabled: getSetting("weekly_report_enabled", "true"),
  weekly_report_day: getSetting("weekly_report_day", "monday"),
  weekly_report_time: getSetting("weekly_report_time", "08:30"),

  monthly_report_enabled: getSetting("monthly_report_enabled", "false"),
  monthly_report_day: getSetting("monthly_report_day", "1"),
  monthly_report_time: getSetting("monthly_report_time", "09:00"),

  report_telegram_enabled: getSetting("report_telegram_enabled", "true"),
  report_email_enabled: getSetting("report_email_enabled", "false"),

  report_include_dashboard: getSetting("report_include_dashboard", "true"),
  report_include_inspection: getSetting("report_include_inspection", "true"),
  report_include_findings: getSetting("report_include_findings", "true"),
  report_include_compliance: getSetting("report_include_compliance", "true"),
  report_include_voice: getSetting("report_include_voice", "true"),
  report_include_risk: getSetting("report_include_risk", "true"),
  report_include_research: getSetting("report_include_research", "true"),

  daily_include_inspection: getSetting("daily_include_inspection", "true"),
  daily_include_findings: getSetting("daily_include_findings", "true"),
  daily_include_voice: getSetting("daily_include_voice", "true"),
  daily_include_high_risk: getSetting("daily_include_high_risk", "true"),
  daily_include_actions: getSetting("daily_include_actions", "true"),
  daily_include_ai_summary: getSetting("daily_include_ai_summary", "true"),

  weekly_include_inspection_trend: getSetting("weekly_include_inspection_trend", "true"),
  weekly_include_findings_progress: getSetting("weekly_include_findings_progress", "true"),
  weekly_include_voice_breakdown: getSetting("weekly_include_voice_breakdown", "true"),
  weekly_include_risk_trend: getSetting("weekly_include_risk_trend", "true"),
  weekly_include_compliance_score: getSetting("weekly_include_compliance_score", "true"),
  weekly_include_top_issues: getSetting("weekly_include_top_issues", "true"),
  weekly_include_ai_summary: getSetting("weekly_include_ai_summary", "true"),

  monthly_include_kpi_summary: getSetting("monthly_include_kpi_summary", "true"),
  monthly_include_department_performance: getSetting("monthly_include_department_performance", "true"),
  monthly_include_compliance_trend: getSetting("monthly_include_compliance_trend", "true"),
  monthly_include_repeated_findings: getSetting("monthly_include_repeated_findings", "true"),
  monthly_include_risk_plan_status: getSetting("monthly_include_risk_plan_status", "true"),
  monthly_include_voice_trend: getSetting("monthly_include_voice_trend", "true"),
  monthly_include_ai_summary: getSetting("monthly_include_ai_summary", "true"),
  monthly_include_pdf_attachment: getSetting("monthly_include_pdf_attachment", "true"),
});

async function saveReportSettings() {
  const res = await fetch("/api/admin/system-settings/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      settings: reportSettings,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    alert(result.error || "Report settings хадгалахад алдаа гарлаа");
    return;
  }

  alert("Report settings хадгалагдлаа");
  window.location.reload();
}

  const filteredUsers = useMemo(() => {
    if (filter === "all") return users;
    return users.filter((x) => x.role === filter || x.status === filter);
  }, [users, filter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((x) => x.status === "active").length;
  const managers = users.filter((x) => x.role === "manager").length;
  const admins = users.filter((x) => x.role === "admin").length;
  const totalTelegramUsers = telegramUsers.length;
  const activeTelegramUsers = telegramUsers.filter(
    (x) => x.status === "active"
  ).length;
  const ceoTelegramUsers = telegramUsers.filter(
    (x) => x.role === "ceo"
  ).length;
  const employeeTelegramUsers = telegramUsers.filter(
    (x) => x.role === "employee"
  ).length;
  const [showCreate,setShowCreate] = useState(false);
  const [showTelegramInvite, setShowTelegramInvite] = useState(false);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Center / Users</h1>
        <p className="text-slate-500">
          Хэрэглэгч, эрх, алба нэгж, төлөвийн удирдлага
        </p>
      </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white"
        >
          + User нэмэх
        </button>

        <UserCreateModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={() => window.location.reload()}
        />
        
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-4">
        <UserCard title="Нийт хэрэглэгч" value={totalUsers} />
        <UserCard title="Идэвхтэй" value={activeUsers} color="text-green-600" />
        <UserCard title="Manager" value={managers} color="text-blue-600" />
        <UserCard title="Admin" value={admins} color="text-purple-600" />
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 xl:grid-cols-4">
      <UserCard title="Telegram Users" value={totalTelegramUsers} />
      <UserCard title="Telegram Active" value={activeTelegramUsers} color="text-green-600" />
      <UserCard title="Telegram CEO" value={ceoTelegramUsers} color="text-purple-600" />
      <UserCard title="Telegram Employee" value={employeeTelegramUsers} color="text-blue-600" />
    </div>

      <div className="rounded-2xl border bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Users Registry</h2>
            <p className="text-sm text-slate-500">
              Profiles table-ээс уншиж байна
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              ["all", "Бүгд"],
              ["active", "Active"],
              ["inactive", "Inactive"],
              ["admin", "Admin"],
              ["manager", "Manager"],
              ["inspector", "Inspector"],
              ["employee", "Employee"],
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
        </div>

        <div className="max-h-[560px] overflow-auto rounded-xl border">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="sticky top-0 bg-slate-100">
              <tr>
                <th className="border px-4 py-3 text-left">Нэр</th>
                <th className="border px-4 py-3 text-left">Email</th>
                <th className="border px-4 py-3 text-left">Role</th>
                <th className="border px-4 py-3 text-left">Department</th>
                <th className="border px-4 py-3 text-left">Position</th>
                <th className="border px-4 py-3 text-left">Status</th>
                <th className="border px-4 py-3 text-left">Last Login</th>
                <th className="border px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="border px-4 py-3">
                    {user.full_name || "Unnamed User"}
                  </td>
                  <td className="border px-4 py-3">{user.email || "-"}</td>
                  <td className="border px-4 py-3">{user.role || "-"}</td>
                  <td className="border px-4 py-3">
                    {user.department || "-"}
                  </td>
                  <td className="border px-4 py-3">{user.position || "-"}</td>
                  <td className="border px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {user.status || "inactive"}
                    </span>
                  </td>
                  <td className="border px-4 py-3">
                    {user.last_login
                      ? String(user.last_login).slice(0, 16)
                      : "-"}
                  </td>
                  <td className="border px-4 py-3">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="rounded-lg border px-3 py-1 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Хэрэглэгч олдсонгүй.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="rounded-2xl border bg-white p-5">
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-xl font-bold">Telegram Users Registry</h2>
      <p className="text-sm text-slate-500">
        Telegram Bot хэрэглэгч, role, department, status
      </p>
    </div>
  </div>

  <button
    onClick={() => setShowTelegramInvite(true)}
    className="rounded-xl bg-blue-600 px-4 py-2 text-white"
  >
    Invite Telegram Users
  </button>

  <div className="max-h-[520px] overflow-auto rounded-xl border">
    <table className="w-full min-w-[1000px] text-sm">
      <thead className="sticky top-0 bg-slate-100">
        <tr>
          <th className="border px-4 py-3 text-left">Нэр</th>
          <th className="border px-4 py-3 text-left">Username</th>
          <th className="border px-4 py-3 text-left">Telegram ID</th>
          <th className="border px-4 py-3 text-left">Role</th>
          <th className="border px-4 py-3 text-left">Department</th>
          <th className="border px-4 py-3 text-left">Position</th>
          <th className="border px-4 py-3 text-left">Status</th>
          <th className="border px-4 py-3 text-left">Created</th>
          <th className="border px-4 py-3 text-left">Action</th>
        </tr>
      </thead>

      <tbody>
        {telegramUsers.map((user) => (
          <tr key={user.id} className="hover:bg-slate-50">
            <td className="border px-4 py-3">{user.full_name || "-"}</td>
            <td className="border px-4 py-3">
              {user.username ? `@${user.username}` : "-"}
            </td>
            <td className="border px-4 py-3">
              <code>{user.telegram_id}</code>
            </td>
            <td className="border px-4 py-3">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {user.role || "employee"}
              </span>
            </td>
            <td className="border px-4 py-3">{user.department || "-"}</td>
            <td className="border px-4 py-3">{user.position || "-"}</td>
            <td className="border px-4 py-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : user.status === "disabled"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {user.status || "-"}
              </span>
            </td>
            <td className="border px-4 py-3">
              {user.created_at ? String(user.created_at).slice(0, 16) : "-"}
            </td>
            <td className="border px-4 py-3">
              <button
                onClick={() => setSelectedTelegramUser(user)}
                className="rounded-lg border px-3 py-1 hover:bg-slate-100"
              >
                Edit
              </button>
            </td>
          </tr>
          
        ))
        }
        
        {telegramUsers.length === 0 && (
          <tr>
            <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
              Telegram хэрэглэгч олдсонгүй.
            </td>
          </tr>
          
        )}

        
      </tbody>
    </table>
  </div>
</div>

<div className="rounded-2xl border bg-white p-5">
  <div className="mb-5">
    <h2 className="text-xl font-bold">Report Settings</h2>
    <p className="text-sm text-slate-500">
      Daily, Weekly, Monthly тайлангийн автомат илгээлтийн тохиргоо
    </p>
  </div>

  <div className="grid gap-4 lg:grid-cols-3">
    <div className="rounded-xl border p-4">
      <label className="flex items-center gap-2 font-bold">
        <input
          type="checkbox"
          checked={reportSettings.daily_report_enabled === "true"}
          onChange={(e) =>
            setReportSettings({
              ...reportSettings,
              daily_report_enabled: String(e.target.checked),
            })
          }
        />
        Daily Report
      </label>

      <input
        type="time"
        className="mt-3 w-full rounded-xl border p-3"
        value={reportSettings.daily_report_time}
        onChange={(e) =>
          setReportSettings({
            ...reportSettings,
            daily_report_time: e.target.value,
          })
        }
      />
    </div>

    <div className="rounded-xl border p-4">
      <label className="flex items-center gap-2 font-bold">
        <input
          type="checkbox"
          checked={reportSettings.weekly_report_enabled === "true"}
          onChange={(e) =>
            setReportSettings({
              ...reportSettings,
              weekly_report_enabled: String(e.target.checked),
            })
          }
        />
        Weekly Report
      </label>

      <select
        className="mt-3 w-full rounded-xl border p-3"
        value={reportSettings.weekly_report_day}
        onChange={(e) =>
          setReportSettings({
            ...reportSettings,
            weekly_report_day: e.target.value,
          })
        }
      >
        <option value="monday">Monday</option>
        <option value="tuesday">Tuesday</option>
        <option value="wednesday">Wednesday</option>
        <option value="thursday">Thursday</option>
        <option value="friday">Friday</option>
      </select>

      <input
        type="time"
        className="mt-3 w-full rounded-xl border p-3"
        value={reportSettings.weekly_report_time}
        onChange={(e) =>
          setReportSettings({
            ...reportSettings,
            weekly_report_time: e.target.value,
          })
        }
      />
    </div>

    <div className="rounded-xl border p-4">
      <label className="flex items-center gap-2 font-bold">
        <input
          type="checkbox"
          checked={reportSettings.monthly_report_enabled === "true"}
          onChange={(e) =>
            setReportSettings({
              ...reportSettings,
              monthly_report_enabled: String(e.target.checked),
            })
          }
        />
        Monthly Report
      </label>

      <input
        type="number"
        min="1"
        max="31"
        className="mt-3 w-full rounded-xl border p-3"
        value={reportSettings.monthly_report_day}
        onChange={(e) =>
          setReportSettings({
            ...reportSettings,
            monthly_report_day: e.target.value,
          })
        }
      />

      <input
        type="time"
        className="mt-3 w-full rounded-xl border p-3"
        value={reportSettings.monthly_report_time}
        onChange={(e) =>
          setReportSettings({
            ...reportSettings,
            monthly_report_time: e.target.value,
          })
        }
      />
    </div>
  </div>

  <div className="mt-5 grid gap-4 xl:grid-cols-[320px_1fr]">
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 font-bold">Илгээх суваг</h3>

      <div className="space-y-3">
        {[
          ["report_telegram_enabled", "Telegram"],
          ["report_email_enabled", "Email"],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(reportSettings as any)[key] === "true"}
              onChange={(e) =>
                setReportSettings({
                  ...reportSettings,
                  [key]: String(e.target.checked),
                })
              }
            />
            {label}
          </label>
        ))}
      </div>
    </div>

    <div className="rounded-xl border p-4">
      <h3 className="mb-4 font-bold">Тайлангийн агуулгын тохиргоо</h3>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="">
          <h4 className="mb-3 font-bold">Daily Report</h4>

          {[
            ["daily_include_inspection", "Өнөөдрийн ХШ"],
            ["daily_include_findings", "Өнөөдрийн зөрчил"],
            ["daily_include_voice", "Өнөөдрийн ажилтны дуу хоолой"],
            ["daily_include_high_risk", "High/Critical эрсдэл"],
            ["daily_include_actions", "Нээлттэй арга хэмжээ"],
            ["daily_include_ai_summary", "AI Daily Summary"],
          ].map(([key, label]) => (
            <label key={key} className="mb-2 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={(reportSettings as any)[key] === "true"}
                onChange={(e) =>
                  setReportSettings({
                    ...reportSettings,
                    [key]: String(e.target.checked),
                  })
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="">
          <h4 className="mb-3 font-bold">Weekly Report</h4>

          {[
            ["weekly_include_inspection_trend", "7 хоногийн ХШ trend"],
            ["weekly_include_findings_progress", "Зөрчлийн гүйцэтгэл"],
            ["weekly_include_voice_breakdown", "Employee Voice ангилал"],
            ["weekly_include_risk_trend", "High/Critical risk trend"],
            ["weekly_include_compliance_score", "Compliance score"],
            ["weekly_include_top_issues", "Top 5 issue"],
            ["weekly_include_ai_summary", "AI Weekly Executive Summary"],
          ].map(([key, label]) => (
            <label key={key} className="mb-2 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={(reportSettings as any)[key] === "true"}
                onChange={(e) =>
                  setReportSettings({
                    ...reportSettings,
                    [key]: String(e.target.checked),
                  })
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="">
          <h4 className="mb-3 font-bold">Monthly Report</h4>

          {[
            ["monthly_include_kpi_summary", "Сарын нэгдсэн KPI"],
            ["monthly_include_department_performance", "Хэлтэс тус бүрийн performance"],
            ["monthly_include_compliance_trend", "Compliance trend"],
            ["monthly_include_repeated_findings", "Давтагдсан зөрчил"],
            ["monthly_include_risk_plan_status", "Risk treatment plan status"],
            ["monthly_include_voice_trend", "Employee Voice trend"],
            ["monthly_include_ai_summary", "AI Monthly Executive Summary"],
            ["monthly_include_pdf_attachment", "PDF хавсралт"],
          ].map(([key, label]) => (
            <label key={key} className="mb-2 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={(reportSettings as any)[key] === "true"}
                onChange={(e) =>
                  setReportSettings({
                    ...reportSettings,
                    [key]: String(e.target.checked),
                  })
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  </div>

  <div className="mt-5 flex justify-end">
    <button
      onClick={saveReportSettings}
      className="rounded-xl bg-blue-600 px-5 py-3 text-white"
    >
      Report Settings хадгалах
    </button>
  </div>
</div>

        <UserCreateModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            window.location.reload();
          }}
        />
      
        {selectedUser && (
          <UserEditModal
            user={selectedUser}
            onClose={() => {
              setSelectedUser(null);
              window.location.reload();
            }}
          />
        )}      

        {selectedTelegramUser && (
          <TelegramUserEditModal
            user={selectedTelegramUser}
            onClose={() => {
              setSelectedTelegramUser(null);
              window.location.reload();
            }}
          />
        )}

        {showTelegramInvite && (
          <TelegramInviteModal onClose={() => setShowTelegramInvite(false)} />
        )}
    </div>
  );
}