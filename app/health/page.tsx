function getBaseUrl() {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
  }
  
  async function getHealth() {
    const res = await fetch(`${getBaseUrl()}/api/health`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Health check failed");
    }
    return res.json() as Promise<{ status: string; timestamp: string }>;
  }
  
  export default async function HealthPage() {
    const data = await getHealth();
    return (
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-bold">System Health</h1>
        <p className="mt-2 text-slate-600">Status: {data.status}</p>
        <p className="text-sm text-slate-400">Checked at: {data.timestamp}</p>
      </div>
    );
  }