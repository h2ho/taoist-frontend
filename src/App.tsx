import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import BookDetailPage from './components/BookDetailPage';
import { UserProvider } from './components/UserContext';
import ProfilePageComponent from './components/ProfilePage';

function App() {
  return (
    <Router>
      <UserProvider>
        <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books/:bookId" element={<BookDetailPage />} />
          <Route path="/profile" element={<ProfilePageComponent />} />

        </Routes>
      </main>
      </UserProvider>
    </Router>
  );
}

export default App;
