import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white">
      <div className="p-5 text-xl font-bold">
        INSPECT.MN
      </div>

      <nav className="space-y-1 px-3">

        <Link href="/dashboard" className="block p-3 rounded hover:bg-slate-800">
          Dashboard
        </Link>

        <Link href="/inspection" className="block p-3 rounded hover:bg-slate-800">
          Inspection Center
        </Link>

        <Link href="/compliance" className="block p-3 rounded hover:bg-slate-800">
          Compliance Center
        </Link>

        <Link href="/research" className="block p-3 rounded hover:bg-slate-800">
          Research & Development
        </Link>

        <Link href="/voice" className="block p-3 rounded hover:bg-slate-800">
          Employee Voice
        </Link>

        <Link href="/ai" className="block p-3 rounded hover:bg-slate-800">
          AI Center
        </Link>

        <Link href="/settings" className="block p-3 rounded hover:bg-slate-800">
          Settings
        </Link>

      </nav>
    </aside>
  );
}