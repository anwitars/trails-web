"use client";

import { useForm } from "@/form";
import { LabeledTextInput } from "./TextInput";
import * as z from "zod";
import { useState } from "react";
import { useSafeCallback } from "./ErrorBoundary";
import { apiSend } from "@/api/utils";

const TrailSearchSchema = z.object({
  trailId: z.string(),
});

type TrailSearcherProps = {
  buttonLabel: string;
  onFoundAction: (trail: string) => void;
  apiEndpoint: "/info/{trail_id}" | "/peek/{trail_id}";
};

export const TrailSearcher = ({
  buttonLabel,
  onFoundAction,
  apiEndpoint,
}: TrailSearcherProps) => {
  const form = useForm(TrailSearchSchema, { trailId: "" });
  const [searching, setSearching] = useState(false);
  const [backendErrors, setBackendErrors] = useState<string[]>([]);

  const handleSearch = useSafeCallback(async () => {
    setSearching(true);
    setBackendErrors([]);

    const response = await apiSend(apiEndpoint, "get", {
      pathParams: { trail_id: form.values.trailId },
      gracefulNotFound: true,
    });

    switch (response.code) {
      case 200: {
        onFoundAction(form.values.trailId);
        break;
      }
      case 404: {
        setBackendErrors(["Trail not found or has been expired"]);
        break;
      }
      case 422: {
        setBackendErrors(
          response.data.detail.map((e: { msg: string }) => e.msg),
        );
        break;
      }
    }

    setSearching(false);
  }, []);

  return (
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
          onClick={handleSearch}
          disabled={!form.hasChanged || searching}
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
};
