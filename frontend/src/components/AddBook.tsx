import { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
const API_BASE_URL = 'https://mission13assignmentproject-g6ggdzaee7dwhugz.eastus-01.azurewebsites.net/api';


const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0
  });

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
      await axios.post(`${API_BASE_URL}/Books`, formData);
      alert("Book added successfully!");
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add a New Book</h2>
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
        <Button type="submit">Add Book</Button>
      </Form>
    </Container>
  );
};

export default AddBook;
