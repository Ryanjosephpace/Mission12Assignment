import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';

interface Book {
  bookId: number;
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

  useEffect(() => {
    axios.get<Book[]>('http://localhost:5074/api/books') // Replace PORT with your backend port
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error fetching books:', err));
  }, []);

  const sortedBooks = [...books].sort((a, b) => 
    sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );

  const start = (currentPage - 1) * resultsPerPage;
  const paginatedBooks = sortedBooks.slice(start, start + resultsPerPage);

  return (
    <Container className="mt-4">
      <h2>Online Bookstore</h2>
      
      <div className="d-flex justify-content-between">
        <label>
          Results per page: 
          <select className="ms-2" onChange={e => setResultsPerPage(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>

        <Button variant="secondary" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </Button>
      </div>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBooks.map(book => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.isbn}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
        <Button disabled={start + resultsPerPage >= books.length} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
      </div>
    </Container>
  );
};

export default BookList;
