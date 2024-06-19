import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSummary = ({ cart, setCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount, uniqueProducts, totalQuantities } = location.state;
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleRemoveFromCart = async (id) => {
    const updatedCart = cart.filter((product) => product.id !== id);
    setCart(updatedCart);

    try {
      const response = await fetch(`https://sharmila-production.up.railway.app/api/cart/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Failed to remove product from cart');
      }
    } catch (error) {
      console.error('An error occurred while removing product from cart:', error);
    }
  };

  const storeOrder = async (product) => {
    const data = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };

    try {
      const response = await fetch("https://sharmila-production.up.railway.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(`Order for product ${product.id} stored successfully`);
      } else {
        console.error("Failed to send to backend");
      }
    } catch (error) {
      console.error("An error occurred while sending to backend:", error);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      for (const product of cart) {
        await storeOrder(product);
      }
      setOrderPlaced(true);
      console.log('Proceeding to payment...');
    } catch (error) {
      console.error('Error proceeding to payment:', error);
    }
  };

  const handleGoToShopping = () => {
    navigate('/'); // Navigate back to the main shopping page
  };

  return (
    <div className="container my-5" style={{ width: '70%' }}>
      <h2>Order Summary</h2>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        {cart.map((product) => (
          <div key={product.id} className="card mb-3" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src={product.imgSrc} className="img-fluid rounded-start" alt={product.title} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">Quantity: {product.quantity || 1}</p>
                  <p className="card-text">Price: {product.price} ₹</p>
                  <p className="card-text">Total: {product.price * (product.quantity || 1)} ₹</p>
                  <div className="d-flex align-items-center">
                    <button className="btn btn-danger btn-sm me-3" onClick={() => handleRemoveFromCart(product.id)}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="container text-center my-5">
          <p>Total Number of Unique Products: {uniqueProducts}</p>
          <p>Total Number of Quantities: {totalQuantities}</p>
          <p>Total Amount: {totalAmount} ₹</p>
          <p>Payment Mode: Cash on Delivery</p>
          {!orderPlaced && (
            <button className="btn btn-primary" onClick={handleProceedToPayment}>Proceed to Payment</button>
          )}
          {orderPlaced && (
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
              marginTop: '20px',
            }}>
              Order Placed Successfully!!!
            </div>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-start mt-3">
        <button className="btn btn-info" onClick={handleGoToShopping} style={{ backgroundColor: '#17a2b8', color: 'white' }}>
          Go to Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
