import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ cart, setCart }) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setOrderPlaced(true);
    setCart([]);
  };

  const handleBuyNow = () => {
    navigate('/'); // Redirect to login page
  };

  const handleProceedToPayment = () => {
    const totalAmount = cart.reduce((sum, product) => sum + product.price * (product.quantity || 1), 0);
    const uniqueProducts = new Set(cart.map((product) => product.id)).size;
    const totalQuantities = cart.reduce((sum, product) => sum + (product.quantity || 1), 0);

    navigate('/order-summary', { state: { cart, totalAmount, uniqueProducts, totalQuantities } }); // Navigate to order summary page
  };

  const handleRemoveFromCart = async (id) => {
    try {
      const response = await fetch(`https://sharmila-production.up.railway.app/api/cart/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCart(cart.filter((product) => product.id !== id));
      } else {
        console.error('Failed to remove product from cart');
      }
    } catch (error) {
      console.error('An error occurred while removing product from cart:', error);
    }
  };

  const addToCart = (productToAdd) => {
    const existingProduct = cart.find((product) => product.id === productToAdd.id);

    if (existingProduct) {
  
      alert('Product is already in the cart!');
    } else {
    
      setCart((prevCart) => [...prevCart, { ...productToAdd, quantity: 1 }]);
    }
  };

  const incrementQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
 
  return (
    <div className="container my-5" style={{ width: '70%' }}>
      {orderPlaced ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <div style={{
            border: '2px solid #28a745',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#d4edda',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            color: '#155724',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            Your Order Placed Successfully!!!
          </div>
        </div>
      ) : (
        <>
          {cart.length === 0 ? (
            <div className='text-center'>
              <h1>Your Cart is Empty</h1>
              <Link to="/" className="btn btn-warning">
                Continue Shopping...
              </Link>
            </div>
          ) : (
            <>
              {cart.map((product) => (
                <div key={product.id} className="card mb-3" style={{ maxWidth: '700px', margin: '0 auto' }}>
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img src={product.imgSrc} className="img-fluid rounded-start" alt={product.title} />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{product.title}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text">Price: {product.price} ₹</p>
                        <div className="d-flex align-items-center justify-content-center">
                          <button className="btn btn-secondary mx-2" onClick={() => decrementQuantity(product.id)}>-</button>
                          <span className="mx-3">{product.quantity || 1}</span>
                          <button className="btn btn-secondary mx-2" onClick={() => incrementQuantity(product.id)}>+</button>
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                          <p>Total Amount: {product.price * (product.quantity || 1)} ₹</p>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                          <button className="btn btn-danger btn-sm" onClick={() => handleRemoveFromCart(product.id)}>Remove</button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="container text-center my-5">
                <p>Total Number of Unique Products: {new Set(cart.map((product) => product.id)).size}</p>
                <p>Total Number of Quantities: {cart.reduce((sum, product) => sum + (product.quantity || 1), 0)}</p>
                <p>Total Amount: {cart.reduce((sum, product) => sum + product.price * (product.quantity || 1), 0)} ₹</p>
                <button className="btn btn-success mx-3" onClick={handleProceedToPayment}>
                  Proceed to Payment
                </button>
                <button className="btn btn-warning mx-3" onClick={handleCheckout}>
                  Checkout
                </button>
                <button onClick={() => setCart([])} className="btn btn-danger mx-3">
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
