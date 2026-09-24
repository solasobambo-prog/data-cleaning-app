import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "data-cleaning-app",
  description: "Privacy-first, client-side data quality engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3 sm:gap-6">
            <span className="font-bold">data-cleaning-app</span>
            <a href="/" className="text-sm text-slate-600 hover:text-slate-900">Home</a>
            <a href="/profile" className="text-sm text-slate-600 hover:text-slate-900">Profile</a>
            <a href="/clean" className="text-sm text-slate-600 hover:text-slate-900">Clean</a>
            <a href="/insights" className="text-sm text-slate-600 hover:text-slate-900">Insights</a>
            <a href="/health" className="text-sm text-slate-600 hover:text-slate-900">Health</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}