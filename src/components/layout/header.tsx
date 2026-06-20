import Link from "next/link";

export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="font-semibold text-slate-700">
        Internal Control Platform
      </div>

      <div className="flex gap-3 items-center">
        <Link href="/ai" className="px-4 py-2 rounded bg-blue-600 text-white">
          AI Assistant
        </Link>

        <Link href="/logout" className="px-4 py-2 rounded border text-slate-700">
          Logout
        </Link>

        <div className="w-10 h-10 rounded-full bg-slate-300" />
      </div>
    </header>
  );
}