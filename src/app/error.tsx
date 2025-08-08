"use client";

import { Button } from "@/components/Button";

export default function Error({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error: _,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-5xl">
        An unexpected error occurred. Please try again later.
      </h1>
      <Button onClick={reset} className="mt-8 px-4 py-2 rounded">
        Try Again
      </Button>
    </div>
  );
}
