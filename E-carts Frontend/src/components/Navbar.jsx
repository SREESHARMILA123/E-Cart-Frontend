import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsFillCartCheckFill } from 'react-icons/bs'; // Cart icon
import { MdOutlineAssignment } from 'react-icons/md'; // Order icon
import { items } from './Data';

const Navbar = ({ cart, setData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check local storage or any authentication method to set initial login state
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const filterByCategory = (category) => {
    const element = items.filter((product) => product.category === category);
    setData(element);
  };

  const filterByPrice = (price) => {
    const element = items.filter((product) => product.price >= price);
    setData(element);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search/${searchTerm}`);
    setSearchTerm("");
  };

  const handleAuth = () => {
    if (isLoggedIn) {
      // Perform logout
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
    } else {
      // Perform login (this would usually involve setting a token after authentication)
      window.location.href = "/signin";
    }
  };

  const handleOrderClick = () => {
    if (cart.length === 0) {
      // If cart is empty, navigate to order summary with empty state
      navigate('/order-summary', {
        state: {
          totalQuantities: 0,
          uniqueProducts: 0,
          totalAmount: 0,
          isEmpty: true
        }
      });
    } else {
      // Calculate total quantities, unique products, and total price
      const totalQuantities = cart.reduce((total, product) => total + (product.quantity || 1), 0);
      const uniqueProducts = new Set(cart.map(product => product.id)).size;
      const totalAmount = cart.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);

      navigate('/order-summary', {
        state: {
          totalQuantities,
          uniqueProducts,
          totalAmount,
          isEmpty: false
        }
      });
    }
  };

  return (
    <header className="sticky-top">
      <div className="nav-bar d-flex justify-content-between align-items-center">
        <Link to={'/'} className="brand">E-Cart</Link>

        <form onSubmit={handleSubmit} className="search-bar">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search Products"
            className="form-control me-2"
          />
        </form>

        <div className="d-flex align-items-center">
          <button onClick={handleAuth} className="btn btn-outline-primary me-3">
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>

          <button onClick={handleOrderClick} className="btn btn-primary position-relative me-3">
            <MdOutlineAssignment style={{ fontSize: '1.5rem' }} />
          
           
           
          </button>

          <Link to={'/cart'} className="cart">
            <button type="button" className="btn btn-primary position-relative">
              <BsFillCartCheckFill style={{ fontSize: '1.5rem' }} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cart.length}
              </span>
            </button>
          </Link>
        </div>
      </div>

      {location.pathname === '/' && (
        <div className="nav-bar-wrapper">
          <div className="items">Filter by {"->"}</div>
          <div onClick={() => setData(items)} className="items">No Filter</div>
          <div onClick={() => filterByCategory('mobiles')} className="items">Mobiles</div>
          <div onClick={() => filterByCategory('laptops')} className="items">Laptops</div>
          <div onClick={() => filterByCategory('tablets')} className="items">Tablets</div>
          <div onClick={() => filterByPrice(29999)} className="items">{">="}29999</div>
          <div onClick={() => filterByPrice(49999)} className="items">{">="}49999</div>
          <div onClick={() => filterByPrice(69999)} className="items">{">="}69999</div>
          <div onClick={() => filterByPrice(89999)} className="items">{">="}89999</div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
