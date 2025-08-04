import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950 text-zinc-200">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 size={32} className="animate-spin" />
        <p className="text-xl">Launching your cosmic content...</p>
      </div>
    </div>
  );
}
