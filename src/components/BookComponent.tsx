import React from 'react';

// Define the Book type that the component will receive
type Book = {
  title: string;
  author: string;
  image: string;
};

// Define the props interface for the BookComponent
interface BookComponentProps {
  book: Book;
}

// BookComponent function that accepts book as a prop
const BookComponent: React.FC<BookComponentProps> = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
    </div>
  );
};

export default BookComponent;