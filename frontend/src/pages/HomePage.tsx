import { useHealth } from "../hooks/useHealth";

export function HomePage() {
  const { data, error, isPending } = useHealth();

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome to OpsHub</h1>
      <p className="mt-2 text-slate-600">Incident and operations platform.</p>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="font-semibold">Backend connection</h2>
        {isPending && <p className="text-slate-500">Checking...</p>}
        {error && <p className="text-red-600">API unreachable: {error.message}</p>}
        {data && <p className="text-green-700">API status: {data.data.status}</p>}
      </section>
    </div>
  );
}
