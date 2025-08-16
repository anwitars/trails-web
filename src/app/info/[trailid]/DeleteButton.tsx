"use client";

import { apiSend } from "@/api/utils";
import { useSafeCallback } from "@/components/ErrorBoundary";
import {
  Modal,
  ModalActions,
  ModalContent,
  ModalTitleWithClose,
} from "@/components/Modal";
import { UnexpectedValidationError } from "@/errors";
import { getSavedTrail, unsaveTrail } from "@/savedTrails";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

type DeleteButtonProps = {
  trailId: string;
};

export const DeleteButton = ({ trailId }: DeleteButtonProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);

  const closeModal = () => setModalIsOpen(false);

  const handleDelete = useSafeCallback(async () => {
    if (token === null) return;

    const response = await apiSend("/t/{trail_id}", "delete", {
      pathParams: {
        trail_id: trailId,
      },
      headers: {
        "X-Trail-Token": token,
      },
      gracefulNotFound: true,
    });

    switch (response.code) {
      case 204: {
        unsaveTrail(trailId);
        redirect("/");
      }
      case 422: {
        console.error("Validation error, this should not happen", response);
        throw new UnexpectedValidationError();
      }
      // 404 in this case could mean the trail does not exist, has been expired, or the token is invalid.
      case 404: {
        setNotFoundError(true);
        break;
      }
    }
  }, []);

  useEffect(() => {
    const trail = getSavedTrail(trailId);
    if (trail) {
      setToken(trail.token);
    } else {
      setToken(null);
    }
  }, [trailId]);

  if (token === null) return null;

  return (
    <>
      <button className="button error" onClick={() => setModalIsOpen(true)}>
        Delete
      </button>
      <Modal isOpen={modalIsOpen} onCloseAction={closeModal}>
        <ModalTitleWithClose onCloseAction={closeModal}>
          Delete Trail
        </ModalTitleWithClose>
        <ModalContent>
          <p>
            <span>Are you sure you want to delete Trail </span>
            <span className="text-primary">{trailId}</span>?
          </p>
          <p className="mt-4">
            This action will permanently delete the Trail and it will not be
            recoverable. You can create another Trail with the same URL, but the
            visits and other data will be lost.
          </p>
        </ModalContent>
        <ModalActions>
          <button className="button error" onClick={handleDelete}>
            Delete
          </button>
        </ModalActions>
        {notFoundError && (
          <div className="card-validation-error">
            Trail is either not found, has been expired or the token is invalid.
          </div>
        )}
      </Modal>
    </>
  );
};
