"use client";

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
      <button onClick={reset} className="button mt-8">
        Try Again
      </button>
    </div>
  );
}
