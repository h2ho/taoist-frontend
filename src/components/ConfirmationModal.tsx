import React, { useEffect, useRef, useState } from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  inventoryId: string | null;
  action: 'borrow' | 'return';
  userId: string | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onClose, inventoryId, action, userId }) => {
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  const handleBorrowReturn = async (): Promise<boolean> => {
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/books/${action}`;

    const borrowRequest = {
      userId: userId,
      inventoryId: inventoryId
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(borrowRequest),
      });

      if (response.status === 202) {
        console.log(`${action} was successful for inventory item with id ${inventoryId}`);
        setError(null);
        return true;
      } else {
        const errorMessage = await response.json();
        console.error(`Failed to ${action}:`, errorMessage.errors);
        setError(`Failed to ${action}: ${errorMessage.errors}`);
      }
    } catch (error: any) {
      console.error(`Error occurred while trying to ${action}:`, error);
      setError(`Error occurred: ${error.message}`);
    }
    return false;

  };

  const handleConfirm = async () => {
    const result = await handleBorrowReturn();
    if (!!result) {
      onConfirm();
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>Action</h2>
        <p>{message}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="modal-button confirm" onClick={handleConfirm}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
