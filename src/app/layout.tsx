import "./globals.css";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";

  return (
    <html
      lang="mn"
      className={theme === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <body className="bg-slate-50">{children}</body>
    </html>
  );
}