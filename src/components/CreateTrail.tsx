"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import * as z from "zod";
import { Card } from "./Cards";
import { useForm } from "@/form";
import TextInput from "./TextInput";
import { Button } from "./Button";
import { CopyAll } from "@mui/icons-material";
import { shortenString } from "@/utils";
import LoadingCircle from "./LoadingCircle";

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
    <Card className="max-w-md w-full">
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create a Trail
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Trail URL
          </label>
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
              !form.hasChanged ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!form.hasChanged || submitting}
          >
            {submitting ? <LoadingCircle /> : "Create Trail"}
          </button>
        </div>
      </form>
    </Card>
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
    <Card className="max-w-md w-full mt-8 grid gap-4 relative">
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
    </Card>
  );
};

const CreateTrail = () => {
  const [trail, setTrail] = useState<TrailResponse | undefined>(undefined);

  const handleSubmit = useCallback(
    async (data: z.infer<typeof TrailInputSchema>) => {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/pave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // TODO: handle errors properly
      console.debug("Response:", response);

      if (!response.ok) {
        console.error("Failed to create trail:", response.statusText);
        return;
      }

      const result = await response.json().then(
        (data) =>
          ({
            id: data.trail_id,
            token: data.token,
          }) as TrailResponse,
      );

      setTrail(result);
    },
    [],
  );

  if (trail === undefined) return <CreateTrailForm onSubmit={handleSubmit} />;
  return <ShowTrail trail={trail} onNew={() => setTrail(undefined)} />;
};

export default CreateTrail;
