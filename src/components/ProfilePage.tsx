import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import './ProfilePage.css'
import { Inventory } from '../types/Inventory';

function ProfilePage() {

    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error('UserContext must be used within a UserProvider');
    }
    const { user, isLoggedIn } = userContext;
    const [inventories, setInventory] = useState<Inventory[]>([]);

    useEffect(() => {
        if (userContext) {
            const fetchBorrowedBooks = async () => {
                try {
                    const apiUrl = `${import.meta.env.REACT_APP_API_URL || 'http://localhost:8080'}/user/${user.id}`;
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    const inventoriesList = data.inventoryBookResponses.map((inventoryItem: any) => ({
                        id: inventoryItem.id,
                        book: {
                            id: inventoryItem.bookResponse?.id,
                            title: inventoryItem.bookResponse?.title,
                            image: inventoryItem.bookResponse?.image,
                            author: inventoryItem.bookResponse?.author
                        }
                    }));

                    setInventory(inventoriesList);
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
                {inventories.length > 0 ? (
                    inventories.map((inventory) => (
                        <div key={inventory.id} className="book-card">
                            <img src={inventory.book.image} alt={inventory.book.title} className="book-cover" />
                            <p>{inventory.book.title}</p>
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
