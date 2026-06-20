import Link from "next/link";

type Props = {
  onOpenMobile: () => void;
};

export default function Header({ onOpenMobile }: Props) {
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

        <Link
          href="/logout"
          className="rounded-lg border px-3 py-2 text-sm text-slate-700 md:px-4"
        >
          Logout
        </Link>

        <div className="h-9 w-9 rounded-full bg-slate-300" />
      </div>
    </header>
  );
}