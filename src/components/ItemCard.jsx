import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

/**
 * ItemCard Component
 * Displays a single menu item with image, name, description, price,
 * a favourite toggle button (using local useState), and an Add to Cart action.
 */
const ItemCard = ({ item }) => {
  const { addToCart, getItemQuantity } = useCart();

  // Local state for toggling favourite status
  const [isFavorite, setIsFavorite] = useState(false);
  // Local state for temporary visual feedback when item is added
  const [justAdded, setJustAdded] = useState(false);

  if (!item) return null;

  const isAvailable = item.available !== false;
  const currentInCart = getItemQuantity(item.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAvailable) return;

    const added = addToCart(item, 1);
    if (added) {
      setJustAdded(true);
      setTimeout(() => {
        setJustAdded(false);
      }, 1200);
    }
  };

  return (
    <article
      className={`item-card ${!isAvailable ? 'item-card-unavailable' : ''}`}
      data-testid={`item-card-${item.id}`}
    >
      <div className="card-image-container">
        <img
          src={item.image}
          alt={item.name}
          className="card-image"
          loading="lazy"
          onError={(e) => {
            // Fallback image in case network or external link fails
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Category Pill */}
        {item.category && (
          <span className="card-category-badge">{item.category}</span>
        )}

        {/* Vegetarian Pill if available */}
        {item.isVegetarian && (
          <span className="card-veg-badge" title="Vegetarian">
            🌱 Veg
          </span>
        )}

        {/* Availability Badge */}
        {!isAvailable && (
          <div className="sold-out-overlay">
            <span className="sold-out-badge">Out of Stock</span>
          </div>
        )}

        {/* Favourite Toggle Button */}
        <button
          type="button"
          className={`favourite-btn ${isFavorite ? 'is-fav' : ''}`}
          onClick={handleToggleFavorite}
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

      <div className="card-content">
        <div className="card-header-row">
          <h3 className="card-title">
            <Link to={`/item/${item.id}`} className="card-title-link">
              {item.name}
            </Link>
          </h3>
          <span className="card-price">{formatPrice(item.price)}</span>
        </div>

        <p className="card-description">{item.description}</p>

        {/* Meta badges: prep time, rating */}
        <div className="card-meta">
          {item.prepTime && (
            <span className="meta-item">
              <span className="meta-icon" aria-hidden="true">⏱️</span>
              {item.prepTime}
            </span>
          )}
          {item.calories && (
            <span className="meta-item">
              <span className="meta-icon" aria-hidden="true">🔥</span>
              {item.calories} kcal
            </span>
          )}
          {item.rating && (
            <span className="meta-item rating-item">
              <span className="meta-icon" aria-hidden="true">⭐</span>
              {item.rating}
            </span>
          )}
        </div>

        <div className="card-actions">
          {/* View Details Link */}
          <Link
            to={`/item/${item.id}`}
            className="btn btn-outline card-details-link"
            aria-label={`View details for ${item.name}`}
          >
            Details
          </Link>

          {/* Add to Cart Button */}
          <button
            type="button"
            className={`btn btn-primary add-to-cart-btn ${
              justAdded ? 'btn-added' : ''
            }`}
            onClick={handleAddToCart}
            disabled={!isAvailable}
            aria-label={
              isAvailable
                ? `Add ${item.name} to cart`
                : `${item.name} is currently out of stock`
            }
          >
            {!isAvailable ? (
              'Sold Out'
            ) : justAdded ? (
              <span className="btn-feedback">
                <span aria-hidden="true">✓</span> Added!
              </span>
            ) : (
              <span>
                Add to Cart
                {currentInCart > 0 && ` (${currentInCart})`}
              </span>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
