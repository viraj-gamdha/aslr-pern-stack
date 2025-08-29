import React from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";

const ConfirmationModal = ({
  title,
  message,
  onClose,
  onConfirm,
  loadingConfirm,
}: {
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  loadingConfirm: boolean;
}) => {
  return (
    <Modal heading="Confirmation" onClose={onClose}>
      <div className="modal-content">
        {title && <h5 style={{width: "100%"}}>{title}</h5>}
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
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
