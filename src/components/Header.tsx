import React, { useState, useContext } from 'react';
import './Header.css';
import { UserContext } from './UserContext';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error('UserContext must be used within a UserProvider');
  }

  const { user, logout } = userContext;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const openLoginModal = () => {
    setIsModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  const navigate = useNavigate();

  const handleGoToProfile = () => {
    togglePopover();
    navigate('/profile');
  };

  return (
    <div>
      <header className="header">
        <h1 onClick={() => navigate('/')}>Book Rental</h1>
        {user ? (
          <div className="user-section">
            <button className="user-button" onClick={togglePopover}>
              {user.username}
            </button>
            {isPopoverOpen && (
              <div className="popover">
                <p>Hi {user.username}</p>
                <button onClick={handleGoToProfile}>Profile</button>
                <button onClick={logout}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="user-button" onClick={openLoginModal}>
            User
          </button>
        )}
      </header>
      <hr />
      {isModalOpen && <LoginModal closeModal={closeLoginModal} />}
    </div>
  );
};

export default Header;