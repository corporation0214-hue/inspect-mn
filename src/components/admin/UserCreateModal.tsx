"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function UserCreateModal({
  open,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
    position: "",
    phone: "",
  });

  if (!open) return null;

  async function createUser() {
    if (!form.email || !form.password) {
      alert("Email болон password заавал оруулна уу");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "User үүсгэхэд алдаа гарлаа");
        return;
      }

      alert("User амжилттай үүслээ");
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Шинэ хэрэглэгч</h2>
            <p className="text-sm text-slate-500">Auth + Profile үүсгэнэ</p>
          </div>

          <button onClick={onClose} className="rounded-lg border px-3 py-1">
            ×
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="rounded-xl border p-3"
            placeholder="Full name"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="rounded-xl border p-3"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            className="rounded-xl border p-3"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="inspector">Inspector</option>
            <option value="employee">Employee</option>
            <option value="user">User</option>
          </select>

          <input
            className="rounded-xl border p-3"
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />

          <input
            className="rounded-xl border p-3"
            placeholder="Position"
            value={form.position}
            onChange={(e) =>
              setForm({ ...form, position: e.target.value })
            }
          />

          <input
            className="rounded-xl border p-3 md:col-span-2"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-4 py-2">
            Болих
          </button>

          <button
            onClick={createUser}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
          >
            {loading ? "Үүсгэж байна..." : "User үүсгэх"}
          </button>
        </div>
      </div>
    </div>
  );
}