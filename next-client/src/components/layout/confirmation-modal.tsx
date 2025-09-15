import React from "react";
import { Modal, ModalContent, ModalHeader } from "../ui/modal";
import { Button } from "../ui/button";

const ConfirmationModal = ({
  title,
  message,
  isOpen = false,
  onClose,
  onConfirm,
  loadingConfirm,
}: {
  title?: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loadingConfirm: boolean;
}) => {
  if (!isOpen) return null;
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalHeader>
        <span>Confirmation</span>
      </ModalHeader>
      <ModalContent>
        {title && <h5 style={{ width: "100%" }}>{title}</h5>}
        <p>{message}</p>

        <div className="modal-action-btns">
          <Button
            variant="primary"
            style={{ backgroundColor: "var(--color-red)" }}
            onClick={onConfirm}
            disabled={loadingConfirm}
          >
            Confirm
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
