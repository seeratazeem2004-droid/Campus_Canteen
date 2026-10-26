import React from 'react';
import MenuList from '../components/MenuList';

/**
 * MenuPage Component
 * Route: /
 * Displays the campus canteen hero banner, filter controls,
 * loading indicator, error messages, and the menu catalog.
 */
const MenuPage = ({ items = [], loading = false, error = null, onRetry }) => {
  return (
    <main className="menu-page-main" id="main-content">
      {/* Hero Welcome Banner */}
      <section className="canteen-hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <span className="hero-badge">🇵🇰 Superior University • Gold Campus, Lahore</span>
          <h1 id="hero-title" className="hero-title">
            Campus Canteen | Superior University Gold Campus
          </h1>
          <p className="hero-subtitle">
            Welcome to the campus canteen portal! This application is designed for students
            and faculty at Superior University, Gold Campus to explore authentic Pakistani food
            options from freshly cooked Biryani, Karahi, and Paratha Rolls to steaming Karak
            Chai and crispy Samosas and prepare your orders for quick counter pickup.
          </p>
          <div className="hero-perks">
            <div className="perk-item">
              <span className="perk-icon" aria-hidden="true">⚡</span>
              <span>Fast Campus Pickup</span>
            </div>
            <div className="perk-item">
              <span className="perk-icon" aria-hidden="true">🍲</span>
              <span>Fresh Pakistani Taste</span>
            </div>
            <div className="perk-item">
              <span className="perk-icon" aria-hidden="true">🇵🇰</span>
              <span>Affordable PKR Student Prices</span>
            </div>
          </div>
          <p className="hero-disclaimer">
            <small>
              📍 <strong>Location:</strong> Superior University, Gold Campus, Lahore, Punjab, Pakistan.<br />
              <em>*Note: This is an independent student dining portal created for campus convenience and is not officially operated or endorsed by The Superior University.</em>
            </small>
          </p>
        </div>
      </section>

      {/* Main Content Area: Loading, Error, or MenuList */}
      <div className="menu-container">
        {loading && (
          <div className="status-container loading-state" role="status" aria-live="polite">
            <div className="loading-spinner" aria-hidden="true"></div>
            <p className="status-text">Loading delicious menu items...</p>
            <span className="status-subtext">Fetching fresh data from the kitchen</span>
          </div>
        )}

        {!loading && error && (
          <div className="status-container error-state" role="alert">
            <div className="error-icon" aria-hidden="true">⚠️</div>
            <h2 className="error-title">Unable to Load Menu</h2>
            <p className="status-text">{error}</p>
            {onRetry && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onRetry}
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="status-container empty-state" role="alert">
            <div className="empty-icon" aria-hidden="true">🍽️</div>
            <h2 className="empty-title">Menu Currently Empty</h2>
            <p className="status-text">
              The canteen kitchen is currently updating the daily menu. Please check back shortly!
            </p>
            {onRetry && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={onRetry}
              >
                Refresh Menu
              </button>
            )}
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <MenuList items={items} />
        )}
      </div>
    </main>
  );
};

export default MenuPage;
