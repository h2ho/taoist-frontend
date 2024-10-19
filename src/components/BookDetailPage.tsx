import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from '../types/Book';
import './BookDetailPage.css';
import ConfirmationModal from './ConfirmationModal';
import { UserContext } from './UserContext';
import { format } from 'date-fns';

type Inventory = {
  id: string;
  user: string | null;
  loanDate: string | null;
};

const BookDetailPage: React.FC = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserContext must be used within a UserProvider');
  }
  const { user } = userContext;
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [selectedInventoryId, setSelectedInventoryId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'borrow' | 'return' | null>(null);

  const fetchBookDetails = async () => {
    try {
      const bookUrl = `${import.meta.env.REACT_APP_API_URL || 'http://localhost:8080'}/books/${bookId}`;
      const response = await fetch(bookUrl);
      const data = await response.json();
      setBook({
        id: data.id,
        title: data.title,
        author: data.author,
        image: data.image,
        inventoryUserResponseList: data.inventoryUserResponseList,
      });
      setInventory(data.inventoryUserResponseList);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleConfirm = async () => {
      try {
        await fetchBookDetails();
      } catch (error) {
        console.error('Error fetching');
      } finally {
        closeModal();
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
                <td>{item.loanDate ? format(new Date(item.loanDate), 'yyyy/MM') : 'N/A'}</td>
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
        inventoryId={selectedInventoryId}
        action={actionType || 'borrow'}
        userId={user?.id || null}
      />

    </div>
  );
};

export default BookDetailPage;