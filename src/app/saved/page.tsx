"use client";

import * as z from "zod";
import { CopyButton } from "@/components/CopyButton";
import { IconButton } from "@/components/IconButton";
import {
  Modal,
  ModalActions,
  ModalContent,
  ModalTitleWithClose,
} from "@/components/Modal";
import {
  getSavedTrails,
  SavedTrailWithId,
  saveTrail,
  unsaveTrail,
} from "@/savedTrails";
import { trailIdToUrl } from "@/utils";
import {
  AddOutlined,
  DeleteOutlined,
  Link as LinkIcon,
  Key as KeyIcon,
} from "@mui/icons-material";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "@/form";
import { LabeledTextInput } from "@/components/TextInput";
import { useSafeCallback } from "@/components/ErrorBoundary";
import { apiSend } from "@/api/utils";
import Link from "next/link";

export default function Page() {
  const iteratorRef =
    useRef<Generator<SavedTrailWithId, void, unknown>>(undefined);
  const [trails, setTrails] = useState<SavedTrailWithId[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [trailToUnsave, setTrailToUnsave] = useState<string | undefined>(
    undefined,
  );
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback((count: number) => {
    if (!iteratorRef.current) {
      return;
    }

    const newItems: SavedTrailWithId[] = [];
    let result: IteratorResult<SavedTrailWithId>;

    for (let i = 0; i < count; i++) {
      result = iteratorRef.current.next();
      if (result.done) {
        setHasMore(false);
        break;
      }
      newItems.push(result.value);
    }

    setTrails((prev) => [...prev, ...newItems]);
  }, []);

  const closeModal = useCallback(() => setTrailToUnsave(undefined), []);

  const handleUnsaveTrail = useCallback(() => {
    if (trailToUnsave === undefined) return;
    unsaveTrail(trailToUnsave);

    // TODO: maybe a bit more efficient way to update the list?
    setTrails((prev) => prev.filter((trail) => trail.id !== trailToUnsave));

    setTrailToUnsave(undefined);
  }, [trailToUnsave]);

  const handleSavedTrail = useCallback(
    (trail: SavedTrailWithId) => setTrails((prev) => [trail, ...prev]),
    [],
  );

  useEffect(() => {
    return () => {
      setTrails([]);
    };
  }, []);

  useEffect(() => {
    iteratorRef.current = getSavedTrails();
    loadMore(10);
  }, [loadMore]);

  useEffect(() => {
    if (!loaderRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore) {
          loadMore(10);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loaderRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  return (
    <div className="page">
      <div className="flex flex-col gap-2 items-center mb-8">
        <div className="flex items-center justify-center relative">
          <h1>Saved Trails</h1>
          <AddTrailToSaved onSaved={handleSavedTrail} />
        </div>
        <PageDescription />
      </div>
      <ul className="flex flex-col gap-4">
        {trails.map((trail) => (
          <SavedTrailCard
            key={trail.id}
            trail={trail}
            trailToUnsave={trailToUnsave}
            setTrailToUnsave={setTrailToUnsave}
          />
        ))}
      </ul>
      {hasMore && <div ref={loaderRef} className="h-[1px]" />}
      {!hasMore && trails.length === 0 && <p>You have no saved Trails</p>}
      <UnsaveTrailModal
        trailToUnsave={trailToUnsave}
        closeModal={closeModal}
        handleUnsaveTrail={handleUnsaveTrail}
      />
    </div>
  );
}

const PageDescription = () => (
  <p>
    Trails that you created using this device will be listed here. You can save
    additional Trails if you have their ID and Token. Saved Trails can be
    deleted permanently on their <Link href="/info">info</Link> page.
  </p>
);

type UnsaveTrailModalProps = {
  trailToUnsave: string | undefined;
  closeModal: () => void;
  handleUnsaveTrail: () => void;
};

const UnsaveTrailModal = ({
  trailToUnsave,
  closeModal,
  handleUnsaveTrail,
}: UnsaveTrailModalProps) => (
  <Modal isOpen={trailToUnsave !== undefined} onCloseAction={closeModal}>
    <ModalTitleWithClose onCloseAction={closeModal}>
      Unsave Trail
    </ModalTitleWithClose>
    <ModalContent>
      <p>
        <span>Are you sure you want to unsave Trail </span>
        <span className="text-primary">{trailToUnsave}</span>?
      </p>
      <p className="mt-4">
        This action will not delete the Trail itself, but it will not be
        accessible from the saved Trails list anymore.
      </p>
    </ModalContent>
    <ModalActions>
      <button className="button error" onClick={handleUnsaveTrail}>
        Unsave
      </button>
    </ModalActions>
  </Modal>
);

type SavedTrailCardProps = {
  trail: SavedTrailWithId;
  setTrailToUnsave: (trailId: string) => void;
  trailToUnsave?: string;
};

const SavedTrailCard = ({
  trail,
  setTrailToUnsave,
  trailToUnsave,
}: SavedTrailCardProps) => (
  <li key={trail.id} className="card">
    <div className="flex flex-col gap-4 justify-center items-center">
      <h3 className="text-2xl flex gap-2">
        <span>Trail</span>
        <span className="text-primary">{trail.id}</span>
        <CopyButton toCopy={trailIdToUrl(trail.id)} icon={<LinkIcon />} />
      </h3>
      <a href={trail.url} className="canwrap text-2xl">
        {trail.url}
      </a>
      <div className="flex gap-4">
        <IconButton
          onClick={() => setTrailToUnsave(trail.id)}
          disabled={trailToUnsave !== undefined}
          cooldown={2000}
          className="error"
        >
          <DeleteOutlined />
        </IconButton>
        <div className="card bg-primary-dark p-2">
          <a href={`/info/${trail.id}`} className="text-default">
            Show Info
          </a>
        </div>
        <CopyButton toCopy={trail.token} icon={<KeyIcon />} />
      </div>
    </div>
  </li>
);

type AddTrailToSavedProps = {
  /** To update the saved Trails list in-place */
  onSaved: (trail: SavedTrailWithId) => void;
};

const AddTrailToSaved = ({ onSaved }: AddTrailToSavedProps) => {
  const [formIsOpen, setFormIsOpen] = useState(false);

  return (
    <>
      <IconButton
        className="absolute right-[-2rem]"
        onClick={() => setFormIsOpen(true)}
      >
        <AddOutlined />
      </IconButton>
      <AddTrailForm
        isOpen={formIsOpen}
        onCloseAction={() => setFormIsOpen(false)}
        onSaved={onSaved}
      />
    </>
  );
};

const SaveTrailInputSchema = z.object({
  id: z.string().min(1, "Trail ID is required"),
  token: z.string().min(1, "Trail Token is required"),
});

type AddTrailFormProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onSaved: (trail: SavedTrailWithId) => void;
};

const AddTrailForm = ({
  isOpen,
  onCloseAction,
  onSaved,
}: AddTrailFormProps) => {
  const form = useForm(
    SaveTrailInputSchema,
    { id: "", token: "" },
    { autoValidate: true },
  );
  const [trailIdExists, setTrailIdExists] = useState(true);
  const [saving, setSaving] = useState(false);

  const trailIdErrors = useMemo(() => {
    const errors = form.errors?.properties?.id?.errors || [];
    if (!trailIdExists) {
      errors.push("Trail ID does not exist");
    }
    return errors;
  }, [form.errors?.properties?.id?.errors, trailIdExists]);

  const handleSave = useSafeCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!form.valid) return;
      setTrailIdExists(true);
      setSaving(true);

      const { id, token } = form.values;

      const response = await apiSend("/peek/{trail_id}", "get", {
        pathParams: { trail_id: id },
        gracefulNotFound: true,
      });

      switch (response.code) {
        case 404: {
          setTrailIdExists(false);
          break;
        }
        case 422: {
          console.error("Validation error, this should not happen", response);
          break;
        }
        case 200: {
          const url = response.data;
          const trail: SavedTrailWithId = { id, url, token };
          saveTrail(trail);
          onSaved(trail);
          onCloseAction();
          form.reset();
          break;
        }
      }

      setSaving(false);
    },
    [],
  );

  return (
    <Modal isOpen={isOpen} onCloseAction={onCloseAction}>
      <ModalTitleWithClose onCloseAction={onCloseAction}>
        Save a Trail
      </ModalTitleWithClose>
      <form onSubmit={handleSave} noValidate>
        <ModalContent>
          <LabeledTextInput
            label="Trail ID"
            value={form.values.id}
            onChange={(id) => {
              form.setValues({ id });
              if (!trailIdExists) {
                setTrailIdExists(true);
              }
            }}
            placeholder="Trail ID"
            errors={trailIdErrors}
            required
            className="w-full"
            disabled={saving}
          />
          <LabeledTextInput
            label="Trail Token"
            value={form.values.token}
            onChange={(token) => form.setValues({ token })}
            placeholder="Trail Token"
            errors={form.errors?.properties?.token?.errors}
            required
            className="w-full"
            disabled={saving}
          />
        </ModalContent>
        <ModalActions>
          <button
            type="submit"
            className="button"
            disabled={saving || !form.valid}
          >
            Save
          </button>
        </ModalActions>
      </form>
    </Modal>
  );
};
