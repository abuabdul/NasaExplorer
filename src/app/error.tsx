'use client';

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Mars transmission error:", error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-red-500 p-8" role="alert">
      <AlertOctagon size={48} className="mb-4" />
      <h2 className="text-3xl font-bold mb-4">Interstellar Error</h2>
      <p className="mb-6 text-center">{error.message || "Something went wrong."}</p>
      <button
        onClick={() => {
            reset();
            setTimeout(() => location.reload(), 100);
        }}
        className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded text-white"
      >
        Retry Mission
      </button>
    </div>
  );
}
