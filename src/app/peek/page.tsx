"use client";

import { TrailSearcher } from "@/components/TrailSearcher";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function Page() {
  const router = useRouter();

  const onFound = useCallback(
    (trailId: string) => router.push(`/peek/${trailId}`),
    [router],
  );

  return (
    <div className="page">
      <h1 className="mb-8">Peek Trail</h1>
      <TrailSearcher
        buttonLabel="Peek Trail"
        onFoundAction={onFound}
        apiEndpoint="/peek/{trail_id}"
      />
    </div>
  );
}
