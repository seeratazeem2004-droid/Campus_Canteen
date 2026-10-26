import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

/**
 * ItemDetailsPage Component
 * Route: /item/:id
 * Displays full details for an individual menu item, including high-res image,
 * dietary info, preparation time, category, price, quantity selector,
 * and an Add to Cart button.
 */
const ItemDetailsPage = ({ items = [], loading = false, error = null }) => {
  const { id } = useParams();
  const { addToCart, getItemQuantity } = useCart();

  // Local state for quantity to add and favourite status
  const [selectedQty, setSelectedQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedMessage, setAddedMessage] = useState(false);

  // If still loading menu data
  if (loading) {
    return (
      <main className="details-page-main" id="main-content">
        <div className="status-container loading-state" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p className="status-text">Loading item details...</p>
        </div>
      </main>
    );
  }

  // Find item by ID
  const item = items.find((i) => String(i.id) === String(id));

  // If item not found
  if (!item) {
    return (
      <main className="details-page-main" id="main-content">
        <div className="not-found-card" role="alert">
          <div className="not-found-icon" aria-hidden="true">🔍</div>
          <h2>Item Not Found</h2>
          <p>
            Sorry, we couldn't find the menu item you're looking for (ID: "{id}").
            It might have been removed or updated.
          </p>
          <Link to="/" className="btn btn-primary">
            ← Return to Full Menu
          </Link>
        </div>
      </main>
    );
  }

  const isAvailable = item.available !== false;
  const inCartQty = getItemQuantity(item.id);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    const success = addToCart(item, selectedQty);
    if (success) {
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 2000);
    }
  };

  const handleQtyChange = (delta) => {
    setSelectedQty((prev) => Math.max(1, prev + delta));
  };

  return (
    <main className="details-page-main" id="main-content">
      <div className="details-container">
        {/* Breadcrumb / Back Navigation */}
        <nav className="breadcrumb-nav" aria-label="Breadcrumb navigation">
          <Link to="/" className="back-link">
            <span aria-hidden="true">←</span> Back to Menu
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-category">{item.category}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current" aria-current="page">
            {item.name}
          </span>
        </nav>

        <article className="details-card">
          {/* Left Column: Image with overlays */}
          <div className="details-image-wrapper">
            <img
              src={item.image}
              alt={item.name}
              className="details-image"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {!isAvailable && (
              <div className="sold-out-overlay">
                <span className="sold-out-badge">Currently Sold Out</span>
              </div>
            )}

            <button
              type="button"
              className={`details-fav-btn ${isFavorite ? 'is-fav' : ''}`}
              onClick={() => setIsFavorite((prev) => !prev)}
              aria-label={
                isFavorite
                  ? `Remove ${item.name} from favourites`
                  : `Add ${item.name} to favourites`
              }
              title={isFavorite ? 'Unmark favourite' : 'Mark as favourite'}
            >
              <svg
                className="favourite-svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="details-content">
            <div className="details-badges">
              {item.category && (
                <span className="tag-pill category-pill-tag">
                  {item.category}
                </span>
              )}
              {item.isVegetarian && (
                <span className="tag-pill veg-pill-tag">
                  🌱 100% Vegetarian
                </span>
              )}
              {isAvailable ? (
                <span className="tag-pill in-stock-tag">✓ In Stock</span>
              ) : (
                <span className="tag-pill out-of-stock-tag">✕ Sold Out</span>
              )}
            </div>

            <h1 className="details-title">{item.name}</h1>

            <div className="details-price-row">
              <span className="details-price">
                {formatPrice(item.price)}
              </span>
              {inCartQty > 0 && (
                <span className="already-in-cart-pill">
                  {inCartQty} already in your cart
                </span>
              )}
            </div>

            <p className="details-description">{item.description}</p>

            {/* Nutrition and Kitchen Info */}
            <div className="details-specs-grid">
              <div className="spec-card">
                <span className="spec-label">Estimated Prep</span>
                <span className="spec-value">{item.prepTime || '8-12 min'}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Energy</span>
                <span className="spec-value">{item.calories ? `${item.calories} kcal` : 'Freshly Made'}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">Student Rating</span>
                <span className="spec-value">⭐ {item.rating || '4.8'} / 5.0</span>
              </div>
            </div>

            {/* Ordering Controls */}
            {isAvailable ? (
              <div className="details-order-actions">
                <div className="quantity-control-block">
                  <label htmlFor="quantity-input" className="qty-label">
                    Quantity:
                  </label>
                  <div className="stepper-box">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => handleQtyChange(-1)}
                      disabled={selectedQty <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span id="quantity-input" className="stepper-number" aria-live="polite">
                      {selectedQty}
                    </span>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => handleQtyChange(1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn btn-primary btn-add-details ${
                    addedMessage ? 'btn-success' : ''
                  }`}
                  onClick={handleAddToCart}
                >
                  {addedMessage ? (
                    <span>✓ Added {selectedQty} to Tray!</span>
                  ) : (
                    <span>
                      Add {selectedQty} to Cart • {formatPrice(item.price * selectedQty)}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="unavailable-notice" role="alert">
                <p>
                  <strong>Notice:</strong> This item is freshly made daily but is
                  currently sold out. Our chefs are preparing more for the next shift.
                </p>
                <button type="button" className="btn btn-disabled" disabled>
                  Item Unavailable
                </button>
              </div>
            )}

            {/* Quick checkout shortcut if cart has items */}
            <div className="details-footer-links">
              <Link to="/cart" className="view-cart-link">
                View Cart & Checkout →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ItemDetailsPage;
