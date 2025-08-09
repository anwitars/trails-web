"use client";

import { apiSend } from "@/api/utils";
import { useSafeCallback } from "@/components/ErrorBoundary";
import { LabeledTextInput } from "@/components/TextInput";
import { useForm } from "@/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";

const InfoInputSchema = z.object({
  trailId: z.string(),
});

export default function Page() {
  const router = useRouter();
  const form = useForm(InfoInputSchema, { trailId: "" });
  const [gettingInfo, setGettingInfo] = useState<boolean>(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

  const handleGetInfo = useSafeCallback(async () => {
    setGettingInfo(true);
    setBackendErrors([]);

    const response = await apiSend("/info/{trail_id}", "get", {
      pathParams: { trail_id: form.values.trailId },
      gracefulNotFound: true,
    });

    switch (response.code) {
      case 200: {
        router.push(`/info/${form.values.trailId}`);
        break;
      }
      case 404: {
        setBackendErrors(["Trail not found"]);
        break;
      }
      case 422: {
        setBackendErrors(
          response.data.detail.map((e: { msg: string }) => e.msg),
        );
        break;
      }
    }

    setGettingInfo(false);
  }, []);

  return (
    <div className="page">
      <h1 className="mb-8">Trail Info</h1>
      <form className="card">
        <LabeledTextInput
          label="Trail ID"
          value={form.values.trailId}
          onChange={(trailId) => form.setValues({ trailId })}
          errors={backendErrors}
        />
        <div className="flex justify-end">
          <button
            className="button"
            onClick={handleGetInfo}
            disabled={!form.hasChanged || gettingInfo}
          >
            Get Info
          </button>
        </div>
      </form>
    </div>
  );
}
