import DuplicateRowDetector from "@/components/DuplicateRowDetector";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mb-10 max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">
          data-cleaning-app
        </h1>
        <p className="text-lg text-slate-600">
          Privacy-first data quality for sensitive CSV files. Parsing and
          duplicate checks run in the browser.
        </p>
        <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
          Local-first processing
        </div>
      </div>
      <DuplicateRowDetector />
    </main>
  );
}
