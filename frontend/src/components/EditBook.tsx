import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
const API_BASE_URL = 'https://mission13assignmentproject-g6ggdzaee7dwhugz.eastus-01.azurewebsites.net/api';


const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bookID: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/Books/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error("Error fetching book:", err));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pageCount' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/Books/${id}`, formData);
      alert("Book updated!");
      navigate('/');
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Failed to update book.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Edit Book</h2>
      <Form onSubmit={handleSubmit}>
        {['title', 'author', 'publisher', 'isbn', 'classification', 'category'].map(field => (
          <Form.Group key={field} className="mb-3">
            <Form.Label>{field}</Form.Label>
            <Form.Control name={field} value={formData[field as keyof typeof formData]} onChange={handleChange} required />
          </Form.Group>
        ))}
        <Form.Group className="mb-3">
          <Form.Label>Page Count</Form.Label>
          <Form.Control type="number" name="pageCount" value={formData.pageCount} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit">Update Book</Button>
      </Form>
    </Container>
  );
};

export default EditBook;
