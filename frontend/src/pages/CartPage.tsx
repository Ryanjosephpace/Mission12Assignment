import { useCart } from '../context/CartContext';
import { Table, Button, Container } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const CartPage = () => {
  const { cart, totalItems, totalPrice, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const lastPage = location.state?.fromPage || 1;

  return (
    <Container className="mt-4">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <>
          <p>Your cart is empty.</p>
          <Button
            variant="outline-primary"
            onClick={() => navigate('/', { state: { fromPage: lastPage } })}
          >
            Continue Shopping
          </Button>
        </>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.bookId}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Total Items:</strong> {totalItems} <br />
              <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
            </div>
            <div>
              <Button
                variant="outline-primary"
                onClick={() => navigate('/', { state: { fromPage: lastPage } })}
              >
                Continue Shopping
              </Button>{' '}
              <Button variant="outline-danger" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;
