import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import './ProfilePage.css'
import { Book } from '../types/Book';

function ProfilePage() {

    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error('UserContext must be used within a UserProvider');
    }
    const { user, isLoggedIn } = userContext;
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        if (userContext) {
            const fetchBorrowedBooks = async () => {
                try {
                    const apiUrl = `${import.meta.env.REACT_APP_API_URL || 'http://localhost:8080'}/user/${user.id}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    console.log(data.inventoryBookResponses);
                    const borrowedBooks = data.inventoryBookResponses.map((inventoryItem: any) => ({
                        id: inventoryItem.bookResponse?.id,
                        title: inventoryItem.bookResponse?.title,
                        image: inventoryItem.bookResponse?.image,
                        author: inventoryItem.bookResponse?.author
                    }));
                    console.log(borrowedBooks);
                    setBooks(borrowedBooks);
                } catch (error) {
                    console.error('Error fetching books:', error);
                }
            };

            fetchBorrowedBooks();
        }
    }, [user]);

    if (!user || !isLoggedIn()) {
        return <p>User is not logged in</p>;
    }

    return (
        <div className="profile-page">
            <h1>Profile</h1>
            <div className="profile-info">
                <p>Name: </p>
                <div>{user.username}</div>
                <p>Role:</p>
                <div>{user.role.toUpperCase()}</div>
            </div>

            <h3>Borrowed Books</h3>
            <div className="borrowed-books-grid">
                {books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id} className="book-card">
                            <img src={book.image} alt={book.title} className="book-cover" />
                            <p>{book.title}</p>
                        </div>
                    ))
                ) : (
                    <p>No borrowed books</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
