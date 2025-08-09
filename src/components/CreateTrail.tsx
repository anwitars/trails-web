"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import * as z from "zod";
import { useForm } from "@/form";
import { LabeledTextInput } from "./TextInput";
import { CopyAll } from "@mui/icons-material";
import { shortenString } from "@/utils";
import LoadingCircle from "./LoadingCircle";
import { useSafeCallback } from "./ErrorBoundary";
import { apiSend } from "@/api/utils";
import { useCooldown } from "@/cooldown";

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
          Create your Trail
        </h2>
        <LabeledTextInput
          label="Trail URL"
          value={form.values.url}
          onChange={(value) => form.setValues({ url: value })}
          placeholder="Enter URL"
          errors={form.errors?.properties?.url?.errors}
          required
          type="url"
          className="w-full"
          disabled={submitting}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="button"
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
        <CopyButton
          toCopy={`${process.env.NEXT_PUBLIC_API_URL}/t/${trail.id}`}
        />
      </div>
      <div className="flex justify-between items-center">
        <p id="trail-token">
          <strong>Trail Token:</strong> {trailToken}
        </p>
        <CopyButton toCopy={trail.token} />
      </div>
      <button className="button absolute top-4 right-4" onClick={onNew}>
        New
      </button>
    </div>
  );
};

const COPY_COOLDOWN = 2000 as const; // 2 seconds cooldown

const CopyButton = ({ toCopy }: { toCopy: string }) => {
  const cooldown = useCooldown(COPY_COOLDOWN);

  const handleCopy = useSafeCallback(async () => {
    if (cooldown.cooling) return;
    await navigator.clipboard.writeText(toCopy);
    cooldown.start();
  }, [toCopy, cooldown]);

  return (
    <button
      className={`icon-button ${cooldown.cooling ? "icon-button-disabled" : ""}`}
      onClick={handleCopy}
      disabled={cooldown.cooling}
    >
      <CopyAll />
    </button>
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
