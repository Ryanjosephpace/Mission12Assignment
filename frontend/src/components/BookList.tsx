import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Table,
  Container,
  Button,
  OverlayTrigger,
  Tooltip,
  Accordion,
  Toast,
  ToastContainer,
} from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const { addToCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const fetchBooks = () => {
    axios.get('http://localhost:5074/api/books', {
      params: {
        page: currentPage,
        pageSize: resultsPerPage,
        ascending: sortOrder === 'asc',
        category: category || null,
      },
    })
      .then((res) => {
        setBooks(res.data.data);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => console.error('Error fetching books:', err));
  };

  const fetchCategories = () => {
    axios.get('http://localhost:5074/api/books')
      .then((res) => {
        const categoriesRaw = (res.data.data as Book[]).map((book) => book.category);
        const uniqueCategories = [...new Set(categoriesRaw)];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error('Error fetching categories:', err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [currentPage, resultsPerPage, sortOrder, category]);

  return (
    <Container className="mt-4">
      <div className="row">
        <div className="col-12 text-center mb-4">
          <h2>Online Bookstore</h2>
        </div>

        <div className="col-12">
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <div>
              <strong>Cart Summary:</strong> {totalItems} item{totalItems !== 1 && 's'} | Total: ${totalPrice.toFixed(2)}
            </div>
            <Button
              variant="outline-primary"
              onClick={() => navigate('/cart', { state: { fromPage: currentPage } })}
            >
              View Cart <span className="badge bg-primary ms-2">{totalItems}</span>
            </Button>
          </div>
        </div>

        {/* Accordion for filters */}
        <div className="col-12 mb-3">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Search & Filter Options</Accordion.Header>
              <Accordion.Body>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Results per page:</label>
                    <select
                      className="form-select form-select-sm"
                      value={resultsPerPage}
                      onChange={(e) => {
                        setResultsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Filter by Category:</label>
                    <select
                      className="form-select form-select-sm"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All</option>
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 d-flex align-items-end">
                    <Button
                      variant="secondary"
                      onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                      className="w-100"
                    >
                      Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </Button>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        <div className="col-12">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookID}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Add this book to your cart</Tooltip>}
                    >
                      <Button
                        variant="success"
                        onClick={() => {
                          addToCart({
                            bookId: book.bookID,
                            title: book.title,
                            price: book.price,
                            quantity: 1,
                          });
                          setShowToast(true);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="col-12 d-flex justify-content-between align-items-center mt-3">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            Previous
          </Button>

          <div>
            {Array.from({ length: Math.ceil(totalCount / resultsPerPage) }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                variant={currentPage === i + 1 ? 'primary' : 'outline-primary'}
                className="mx-1"
                onClick={() => setCurrentPage(i + 1)}
              >
                Page {i + 1}
              </Button>
            ))}
          </div>

          <Button
            disabled={currentPage * resultsPerPage >= totalCount}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={1500}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Cart</strong>
          </Toast.Header>
          <Toast.Body className="text-white">Book added to cart!</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default BookList;