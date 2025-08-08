"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import * as z from "zod";
import { useForm } from "@/form";
import TextInput from "./TextInput";
import { Button } from "./Button";
import { CopyAll } from "@mui/icons-material";
import { shortenString } from "@/utils";
import LoadingCircle from "./LoadingCircle";
import { useSafeCallback } from "./ErrorBoundary";
import { apiSend } from "@/api/utils";

const MAX_TOKEN_DISPLAY_LENGTH = 16 as const;

const TrailInputSchema = z.object({
  url: z.url({ error: "Invalid URL" }).min(1, "URL is required"),
});
type TrailInput = z.infer<typeof TrailInputSchema>;

const CreateTrailForm = ({
  onSubmit,
}: {
  onSubmit: (data: TrailInput) => Promise<void>;
}) => {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm(TrailInputSchema, { url: "" }, { autoValidate: true });

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      await onSubmit(form.values);
      setSubmitting(false);
    },
    [form, onSubmit],
  );

  return (
    <div className="card max-w-md w-full">
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create a Trail
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Trail URL</label>
          <TextInput
            value={form.values.url}
            onChange={(value) => form.setValues({ url: value })}
            placeholder="Enter URL"
            errors={form.errors?.properties?.url?.errors}
            required
            type="url"
            className="w-full"
            disabled={submitting}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !form.hasChanged || !form.valid
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!form.hasChanged || submitting || !form.valid}
          >
            {submitting ? <LoadingCircle /> : "Create Trail"}
          </button>
        </div>
      </form>
    </div>
  );
};

type TrailResponse = {
  id: string;
  token: string;
};

type ShowTrailProps = {
  trail: TrailResponse;
  onNew: () => void;
};

const ShowTrail = ({ trail, onNew }: ShowTrailProps) => {
  const trailToken = useMemo(
    () => shortenString(trail.token, MAX_TOKEN_DISPLAY_LENGTH),
    [trail.token],
  );

  return (
    <div className="card max-w-md w-full mt-8 grid gap-4 relative">
      <h2 className="text-xl font-semibold mb-8 text-center">Trail Created</h2>
      <div className="flex justify-between items-center">
        <p id="trail-id">
          <strong>Trail ID:</strong> {trail.id}
        </p>
        <button
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
          onClick={() =>
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_API_URL}/t/${trail.id}`,
            )
          }
        >
          <CopyAll />
        </button>
      </div>
      <div className="flex justify-between items-center">
        <p id="trail-token">
          <strong>Trail Token:</strong> {trailToken}
        </p>
        <button
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
          onClick={() => navigator.clipboard.writeText(trail.token)}
        >
          <CopyAll />
        </button>
      </div>
      <Button className="absolute top-4 right-4" onClick={onNew}>
        New
      </Button>
    </div>
  );
};

const CreateTrail = () => {
  const [trail, setTrail] = useState<TrailResponse | undefined>(undefined);

  const handleSubmit = useSafeCallback(
    async (data: TrailInput) => {
      const response = await apiSend("/pave", "post", {
        body: data,
      });

      // probably this is never happen, as the form is validated
      if (response.code === 422) {
        console.error("Validation errors:", response.data.detail);
        return;
      }

      setTrail({
        id: response.data.trail_id,
        token: response.data.token,
      });
    },
    [setTrail],
  );

  if (trail === undefined) return <CreateTrailForm onSubmit={handleSubmit} />;
  return <ShowTrail trail={trail} onNew={() => setTrail(undefined)} />;
};

export default CreateTrail;
