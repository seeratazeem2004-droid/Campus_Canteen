import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import MenuPage from './pages/MenuPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import CartPage from './pages/CartPage';

/**
 * Root Application Component
 * Manages fetching menu data from public/menu.json using useEffect, fetch, and async/await.
 * Provides CartContext and React Router navigation.
 */
function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch menu items dynamically from /menu.json
   */
  const loadMenuData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch data from /menu.json
      const response = await fetch('/menu.json');

      // 2. Check whether the HTTP response is successful before parsing JSON
      if (!response.ok) {
        throw new Error(
          `Failed to load menu data (HTTP status: ${response.status} ${response.statusText})`
        );
      }

      const data = await response.json();

      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('Menu data format is invalid. Expected an array of items.');
      }

      // 3. Store the retrieved menu items in React state
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      // 5. Display a meaningful error message if loading fails
      setError(
        err.message || 'An unexpected error occurred while loading the menu. Please check your connection.'
      );
    } finally {
      // 4. Loading state finishes
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="app-layout">
          {/* Skip link for keyboard accessibility */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          {/* Persistent Header with Navigation and Cart Counter */}
          <Header />

          {/* Dynamic Router View */}
          <div className="app-body">
            <Routes>
              <Route
                path="/"
                element={
                  <MenuPage
                    items={menuItems}
                    loading={loading}
                    error={error}
                    onRetry={loadMenuData}
                  />
                }
              />
              <Route
                path="/item/:id"
                element={
                  <ItemDetailsPage
                    items={menuItems}
                    loading={loading}
                    error={error}
                  />
                }
              />
              <Route path="/cart" element={<CartPage />} />
              {/* Fallback route for unmatched paths */}
              <Route
                path="*"
                element={
                  <main className="status-page-main" id="main-content">
                    <div className="status-container error-state" role="alert">
                      <div className="error-icon" aria-hidden="true">🗺️</div>
                      <h2>404 - Page Not Found</h2>
                      <p className="status-text">
                        The canteen page you requested does not exist.
                      </p>
                      <Link to="/" className="btn btn-primary">
                        Return to Menu
                      </Link>
                    </div>
                  </main>
                }
              />
            </Routes>
          </div>

          {/* Semantic Footer */}
          <footer className="site-footer">
            <div className="footer-container">
              <div className="footer-col">
                <div className="footer-brand">
                  <span className="footer-logo" aria-hidden="true">🍽️</span>
                  <h3>Campus Canteen</h3>
                </div>
                <p className="footer-desc">
                  Serving authentic Pakistani meals, karak doodh patti chai, and freshly made snacks
                  to students and faculty at Superior University Gold Campus.
                </p>
                <p className="footer-disclaimer">
                  <small>
                    *Independent student ordering application for campus convenience. Not officially operated or endorsed by The Superior University.
                  </small>
                </p>
              </div>

              <div className="footer-col">
                <h4>Hours of Operation</h4>
                <ul className="footer-list">
                  <li>Monday – Friday: 7:30 AM – 7:30 PM</li>
                  <li>Saturday: 8:30 AM – 5:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Campus Location</h4>
                <address className="footer-address">
                  <strong>The Superior University</strong><br />
                  <strong>Campus:</strong> Gold Campus<br />
                  <strong>City:</strong> Lahore, Punjab, Pakistan<br />
                  <span className="address-full">
                    Superior University, Gold Campus, Lahore, Punjab, Pakistan.
                  </span>
                </address>
              </div>
            </div>

            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()} Campus Canteen | Superior University Gold Campus, Lahore.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
