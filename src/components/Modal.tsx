"use client";

import { useEffect, useRef } from "react";
import { IconButton } from "./IconButton";
import { CloseOutlined } from "@mui/icons-material";

type ModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onCloseAction, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 card max-w-md w-full self-center justify-self-center text-default outline-0 relative"
      onCancel={onCloseAction}
    >
      {children}
    </dialog>
  );
};

type ModalTitleProps = {
  children: React.ReactNode;
};

export const ModalTitle = ({ children }: ModalTitleProps) => (
  <h2 className="text-xl font-semibold mb-4">{children}</h2>
);

type ModalTitleWithCloseProps = {
  children: React.ReactNode;
  onCloseAction: () => void;
};

export const ModalTitleWithClose = ({
  children,
  onCloseAction,
}: ModalTitleWithCloseProps) => (
  <div className="flex">
    <h2 className="text-xl font-semibold mb-4">{children}</h2>
    <IconButton onClick={onCloseAction} className="absolute top-4 right-4">
      <CloseOutlined />
    </IconButton>
  </div>
);

type ModalContentProps = {
  children: React.ReactNode;
};

export const ModalContent = ({ children }: ModalContentProps) => children;

type ModalActionsProps = {
  children: React.ReactNode;
};

export const ModalActions = ({ children }: ModalActionsProps) => (
  <div className="flex gap-2 justify-end mt-4">{children}</div>
);
