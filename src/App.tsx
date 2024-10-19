import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import BookDetailPage from './components/BookDetailPage';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books/:bookId" element={<BookDetailPage />} />

          {/* Add other routes as needed */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
