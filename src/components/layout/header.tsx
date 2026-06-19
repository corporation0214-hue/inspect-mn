export default function Header() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>
        Internal Control Platform
      </div>

      <div className="flex gap-3 items-center">

        <button className="px-4 py-2 rounded bg-blue-600 text-white">
          AI Assistant
        </button>

        <div className="w-10 h-10 rounded-full bg-slate-300" />

      </div>

    </header>
  );
}