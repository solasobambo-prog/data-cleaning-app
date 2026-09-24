import { getHealthStatus } from "@/lib/health";

export default function HealthPage() {
  const data = getHealthStatus();
  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">System Health</h1>
      <p className="mt-2 text-slate-600">Status: {data.status}</p>
      <p className="text-sm text-slate-400">Checked at: {data.timestamp}</p>
    </div>
  );
}