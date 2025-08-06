"use client";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function WatneyMessage({
  children,
  onRetry,
  isLoading,
}: {
  children?: ReactNode;
  onRetry?: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="max-w-xl mx-auto text-center p-6 mt-10 bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-orange-700 dark:text-orange-300 tracking-tight">
        <span className="italic">Final Log Entry</span>
      </h2>

      <p className="text-sm text-justify text-zinc-600 dark:text-zinc-300 leading-relaxed italic whitespace-pre-line">
        {"At some point, everything's gonna go south on you... and you're gonna say, 'This is it. This is how I end.' "}
        {"Now you can either accept that... or you can get to work. "}
        {"You do the math. You solve one problem… and you solve the next one… and then the next. "}
        {"And if you solve enough problems, you get to come home. "}
      </p>

      <div className="mt-4 text-md text-right text-zinc-500 dark:text-zinc-400 italic">
        - Mark Watney<br />
        <span className="not-italic text-sm">Space Pirate</span>
      </div>

      {onRetry && (
        <div className="mt-6">
          <Button variant="default" disabled={isLoading} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

