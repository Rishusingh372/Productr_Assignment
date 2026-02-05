import React from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

export default function DeleteConfirmModal({ open, onClose, onConfirm, name }) {
  return (
    <Modal open={open} title="Delete Product" onClose={onClose} width="max-w-md">
      <p className="text-sm text-gray-700">
        Are you sure you want to delete this Product <b>“{name}”</b> ?
      </p>

      <div className="mt-5 flex justify-end gap-2">
        <Button onClick={onClose} className="border bg-white hover:bg-gray-50">
          Cancel
        </Button>
        <Button onClick={onConfirm} className="bg-[#0b157a] text-white hover:opacity-90">
          Delete
        </Button>
      </div>
    </Modal>
  );
}
