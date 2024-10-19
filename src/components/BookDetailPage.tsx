import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from '../types/Book';
import './BookDetailPage.css';
import ConfirmationModal from './ConfirmationModal';

type Inventory = {
  id: string;
  user: string | null;
  date: string | null;
};

const BookDetailPage: React.FC = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'borrow' | 'return' | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const bookUrl = `${import.meta.env.REACT_APP_API_URL || 'http://localhost:8080/books'}/${bookId}`;
        const response = await fetch(bookUrl);
        const data = await response.json();
        console.log(data);
        setBook({
            id: data.id,
            title: data.title,
            author: data.author,
            image: data.image,
            inventoryUserResponseList: data.inventoryUserResponseList
          });
          setInventory(data.inventoryUserResponseList);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  if (loading) {
    return <div>Loading book details...</div>;
  }

  if (!book) {
    return <div>Book not found.</div>;
  }

  const openModal = (inventoryId: string, action: 'borrow' | 'return') => {
    setSelectedInventoryId(inventoryId);
    setActionType(action);
    setModalMessage(`Would you like to ${action === 'borrow' ? 'borrow' : 'return'} this book?`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInventoryId(null);
    setActionType(null);
  };

  const handleConfirm = () => {
    if (selectedInventoryId && actionType) {
      // Perform the borrow or return action
      console.log(`${actionType} inventory item with id ${selectedInventoryId}`);
    }
    closeModal();
  };

  const handleBorrowReturn = async (inventoryId: string, action: 'borrow' | 'return') => {
    console.log(`${action} inventory item with id ${inventoryId}`);
  
    const url = action === 'borrow' ? '/borrow' : '/return';
    const userId = 'user123';
  
    const borrowRequest = {
      userId: userId,        
      inventoryId: inventoryId 
    };
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(borrowRequest),
      });
  
      if (response.status === 202) {
        console.log(`${action} was successful for inventory item with id ${inventoryId}`);
      } else {
        const errorMessage = await response.text();
        console.error(`Failed to ${action}:`, errorMessage);
      }
    } catch (error) {
      console.error(`Error occurred while trying to ${action}:`, error);
    }
  };

  return (
    <div className="book-detail-container">
      <div className="book-detail-info">
        <img src={book.image} alt={book.title} className="book-detail-image" />
        <h2>{book.title}</h2>
        <p className="book-author">{book.author}</p>
      </div>
      <div className="inventory-section">
        <h3>Inventory</h3>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.user || 'N/A'}</td>
                <td>{item.date || 'N/A'}</td>
                <td>
                  {item.user ? (
                    <button
                    onClick={() => openModal(item.id, 'return')}
                      className="action-button return"
                    >
                      Return
                    </button>
                  ) : (
                    <button
                    onClick={() => openModal(item.id, 'borrow')}
                      className="action-button borrow"
                    >
                      Borrow
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        message={modalMessage}
        onConfirm={handleConfirm}
        onClose={closeModal}
      />

    </div>
  );
};

export default BookDetailPage;