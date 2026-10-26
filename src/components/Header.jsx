import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * Header component displaying the brand logo, navigation links,
 * and a live shopping cart badge with the current total units.
 */
const Header = () => {
  const { totalUnits } = useCart();

  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="brand-logo" aria-label="Campus Canteen - Superior University Gold Campus">
          <span className="logo-icon" role="img" aria-hidden="true">
            🍽️
          </span>
          <div className="brand-text">
            <span className="brand-title">Campus Canteen</span>
            <span className="brand-subtitle">Superior University • Gold Campus</span>
          </div>
        </Link>

        <nav className="main-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
                end
              >
                <span className="nav-icon" aria-hidden="true">📋</span>
                <span>Menu</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive ? 'nav-link cart-link active' : 'nav-link cart-link'
                }
                aria-label={`Shopping cart with ${totalUnits} items`}
              >
                <span className="cart-icon-wrapper">
                  <svg
                    className="cart-svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  {totalUnits > 0 && (
                    <span className="cart-badge" key={totalUnits}>
                      {totalUnits > 99 ? '99+' : totalUnits}
                    </span>
                  )}
                </span>
                <span className="cart-label">Cart</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
