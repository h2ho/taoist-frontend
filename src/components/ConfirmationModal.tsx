import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Action</h2>
        <p>{message}</p>
        <button className="modal-button confirm" onClick={onConfirm}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
