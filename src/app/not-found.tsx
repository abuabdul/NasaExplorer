import { SatelliteDish } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <SatelliteDish size={48} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">404 - Not Found</h2>
      <p className="text-center text-zinc-400 max-w-md">
        The page you&apos;re trying to reach has drifted into deep space. Try navigating back to a known route.
      </p>
    </div>
  );
}
