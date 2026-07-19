"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function SettingsClient({
  user,
  profile,
}: {
  user: any;
  profile: any;
}) {
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [role, setRole] = useState(profile?.role || "user");
  const [department, setDepartment] = useState(profile?.department || "");
  const [position, setPosition] = useState(profile?.position || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [language, setLanguage] = useState(profile?.language || "mn");
  const [theme, setTheme] = useState(profile?.theme || "light");
    useEffect(() => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        document.cookie = "theme=dark; path=/; max-age=31536000";
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        document.cookie = "theme=light; path=/; max-age=31536000";
      }
    }, [theme]);

  const [emailNotifications, setEmailNotifications] = useState(
    profile?.email_notifications ?? true
  );
  const [telegramNotifications, setTelegramNotifications] = useState(
    profile?.telegram_notifications ?? false
  );

  async function saveSettings() {
    if (!user?.id) {
      alert("User not found");
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
      full_name: fullName,
      phone,
      language,
      theme,
      email_notifications: emailNotifications,
      telegram_notifications: telegramNotifications,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Settings хадгалагдлаа");
    location.reload();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500">
          Хэрэглэгчийн тохиргоо, профайл, системийн сонголт
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 xl:col-span-1">
          <h2 className="text-xl font-bold">User Account</h2>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold">
              {(fullName || user?.email || "U").slice(0, 1).toUpperCase()}
            </div>

            <div>
              <p className="font-bold">{fullName || "Unnamed User"}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="mt-1 text-xs text-blue-600">{role}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-slate-500">Department</p>
              <p className="font-medium">{department || "-"}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-slate-500">Position</p>
              <p className="font-medium">{position || "-"}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-slate-500">Phone</p>
              <p className="font-medium">{phone || "-"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 xl:col-span-2">
          <h2 className="text-xl font-bold">Profile Settings</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border p-3"
              placeholder="Овог нэр"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Email"
              value={user?.email || ""}
              disabled
            />

            <input
    className="rounded-xl border bg-slate-100 p-3"
    value={role}
    disabled
/>

            <input
               className="rounded-xl border bg-slate-100 p-3"
              placeholder="Алба / хэлтэс"
              value={department}
              disabled
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Албан тушаал"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />

            <input
              className="rounded-xl border p-3"
              placeholder="Утас"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-xl font-bold">System Preferences</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <select
              className="rounded-xl border p-3"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="mn">Монгол</option>
              <option value="en">English</option>
            </select>

            <select
              className="rounded-xl border p-3"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h2 className="text-xl font-bold">Notifications</h2>

          <div className="mt-5 space-y-3">
            <label className="flex items-center justify-between rounded-xl border p-4">
              <span>Email notification</span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border p-4">
              <span>Telegram notification</span>
              <input
                type="checkbox"
                checked={telegramNotifications}
                onChange={(e) => setTelegramNotifications(e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          Settings хадгалах
        </button>
      </div>
    </div>
  );
}