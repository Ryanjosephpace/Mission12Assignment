import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import BookList from './components/BookList';
import CartPage from './pages/CartPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/adminbooks" element={<AddBook />}/>
        <Route path="/editbook/:id" element={<EditBook/>}/>
      </Routes>
    </Router>
  );
}

export default App;

