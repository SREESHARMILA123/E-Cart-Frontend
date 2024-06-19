import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Order = () => {
  const [orderedProducts, setOrderedProducts] = useState([]);

  useEffect(() => {
    fetchOrderedProducts();
  }, []);

  const fetchOrderedProducts = async () => {
    try {
      const response = await axios.get('https://sharmila-production.up.railway.app/api/orders'); // Ensure this endpoint matches your backend
      setOrderedProducts(response.data);
    } catch (error) {
      console.error('Error fetching ordered products:', error);
    }
  };

  const handleRemoveOrder = async (productId) => {
    try {
      const response = await axios.delete(`https://sharmila-production.up.railway.app/api/orders/${productId}`);
      if (response.status === 200) {
        setOrderedProducts(orderedProducts.filter(product => product.id !== productId));
        toast.success(`Order with id: ${productId} successfully deleted`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error removing order:', error);
      toast.error('Failed to delete order', {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer />
      <h1 className="text-center">Ordered Products</h1>
      {orderedProducts.length === 0 ? (
        <div className="text-center">
          <h4>No orders yet</h4>
          <Link to="/" className="btn btn-warning" style={{ backgroundColor: '#95F9CC' }}>Go to Home</Link>
        </div>
      ) : (
        <div className="d-flex justify-content-center flex-wrap">
          {orderedProducts.map(product => (
            <div key={product.id} className="card mb-3 my-5 shadow-lg mx-3" style={{ width: '900px' }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={product.imgSrc} className="img-fluid rounded-start" alt={product.title} />
                </div>
                <div className="col-md-8">
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">Quantity: {(product.quantity || 1)}</p>
                    <p className="card-text">Price per unit: {product.price} ₹</p>
                    <p className="card-text"><strong>Total: {(product.quantity || 1) * product.price} ₹</strong></p>
                    <button
                      className="btn mx-2"
                      style={{ backgroundColor: '#FFCA4B', color: '#000' }}
                      onClick={() => handleRemoveOrder(product.id)}
                      title="Remove Order"
                    >Remove Order</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
