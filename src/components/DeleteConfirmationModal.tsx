import React, { ReactNode } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface DeleteConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void | Promise<void>;
  studentName: string;
  children?: ReactNode;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  studentName,
  children
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error in delete confirmation:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete {studentName ? `"${studentName}"` : 'this student'}? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        {children || (
          <Button variant="danger" onClick={handleConfirm}>
            Delete
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
