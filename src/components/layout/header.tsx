"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  onOpenMobile: () => void;
};

export default function Header({ onOpenMobile }: Props) {
  const supabase = createClient();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user?.id) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        setProfile(data);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg border px-3 py-2 text-slate-700 md:hidden"
        >
          ☰
        </button>

        <div>
          <p className="font-semibold text-slate-900">
            Internal Control Platform
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Байгууллагын workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Link
          href="/ai"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white md:px-4"
        >
          AI
        </Link>

        <button
          onClick={handleLogout}
          className="rounded-lg border px-3 py-2 text-sm text-slate-700 md:px-4"
        >
          Logout
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 font-bold"
          >
            {(profile?.full_name || user?.email || "U").slice(0, 1).toUpperCase()}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border bg-white shadow-xl">
              <div className="border-b p-4">
                <div className="font-bold">
                  {profile?.full_name || user?.email || "User"}
                </div>
                <div className="text-sm text-slate-500">
                  {user?.email || "-"}
                </div>
              </div>

              <div className="p-2">
                <Link href="/settings" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
                  👤 My Profile
                </Link>

                <Link href="/settings" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
                  ⚙ Settings
                </Link>

                <Link href="/settings" className="block rounded-lg px-3 py-2 hover:bg-slate-100">
                  🔐 Security
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}