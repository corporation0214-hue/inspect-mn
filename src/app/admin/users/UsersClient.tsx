"use client";

import { useMemo, useState } from "react";
import UserCard from "@/components/admin/UserCard";
import UserEditModal from "@/components/admin/UserEditModal";
import UserCreateModal from "@/components/admin/UserCreateModal";

export default function UsersClient({ users }: { users: any[] }) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    if (filter === "all") return users;
    return users.filter((x) => x.role === filter || x.status === filter);
  }, [users, filter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((x) => x.status === "active").length;
  const managers = users.filter((x) => x.role === "manager").length;
  const admins = users.filter((x) => x.role === "admin").length;
  const [showCreate,setShowCreate] = useState(false);
  
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
        
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <UserCard title="Нийт хэрэглэгч" value={totalUsers} />
        <UserCard title="Идэвхтэй" value={activeUsers} color="text-green-600" />
        <UserCard title="Manager" value={managers} color="text-blue-600" />
        <UserCard title="Admin" value={admins} color="text-purple-600" />
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

    </div>
  );
}