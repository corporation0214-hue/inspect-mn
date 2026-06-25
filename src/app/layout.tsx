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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem("theme") || "light";
                  document.documentElement.classList.toggle("dark", theme === "dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}