import React from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = ({ items, cart, setCart }) => {
  const storeOrder = async (product) => {
    const data = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      imgSrc: product.imgSrc
    };

    try {
      const response = await fetch("https://sharmila-production.up.railway.app/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("send to backend failed");
      }
    } catch (error) {
      console.error("An error occurred while sending to backend:", error);
    }
  };

  const addToCart = (product) => {
    const exists = cart.some((item) => item.id === product.id);
    if (exists) {
      toast.info('Item already exists in the cart', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: { backgroundColor: '#f0ad4e', color: '#000' }
      });
    } else {
      setCart([...cart, product]);
      storeOrder(product); // Call storeOrder here
      toast.success('Item added to cart', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="container my-5">
        <div className="row">
          {items.map((product) => {
            return (
              <div key={product.id} className="col-lg-4 col-md-6 my-3 text-center">
                <div className="card" style={{ width: "18rem" }}>
                  <Link to={`/product/${product.id}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <img
                      src={product.imgSrc}
                      className="card-img-top"
                      alt={product.title}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text">{product.description}</p>
                    <button className="btn btn-primary mx-3">
                      {product.price} ₹
                    </button>
                    <button
                      onClick={() => addToCart({
                        id: product.id,
                        price: product.price,
                        title: product.title,
                        description: product.description,
                        imgSrc: product.imgSrc,
                        quantity: 1 // Add default quantity if needed
                      })}
                      className="btn btn-warning"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Product;
