import { useEffect, useState } from 'react'
import './LandingPage.css'
import { useNavigate } from 'react-router-dom';
import { Book } from '../types/Book';

function LandingPage() {

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const apiUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:8080/books';;
        if (!apiUrl) {
          console.error('API URL is undefined');
        }
        const response = await fetch(apiUrl); 
        const data = await response.json();
        setBooks(data); 
        console.log(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks(); 
  }, []);

  // If the data is still loading, display a loading message
  if (loading) {
    return <div>Loading books...</div>;
  }

  const handleBookClick = (bookId: string) => {
    // Navigate to the book detail page using book ID
    navigate(`/books/${bookId}`);
  };

  return (
    <div>
      <section className="books-section">
        <h2>Books you might like</h2>
        <div className="books-grid" >
          {books.map((book, index) => (
            <div key={index} className="book-card" onClick={() => handleBookClick(book.id)}>
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    
  )
}

export default LandingPage