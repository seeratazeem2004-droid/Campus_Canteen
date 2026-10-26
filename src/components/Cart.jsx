import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

/**
 * Cart Component
 * Displays the items currently in the cart, allowing students to modify quantities,
 * remove items, see subtotal and total, or continue browsing if empty.
 * Supports props for maximum reusability or defaults to useCart() context values.
 */
const Cart = ({
  items: propItems,
  onIncrement: propIncrement,
  onDecrement: propDecrement,
  onRemove: propRemove,
  onClear: propClear,
}) => {
  const context = useCart();

  // Prefer props if passed, otherwise fall back to CartContext
  const items = propItems !== undefined ? propItems : context.cartItems;
  const incrementQuantity = propIncrement || context.incrementQuantity;
  const decrementQuantity = propDecrement || context.decrementQuantity;
  const removeFromCart = propRemove || context.removeFromCart;
  const clearCart = propClear || context.clearCart;

  // Calculate totals dynamically from current items
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Delivery / service fee (free for campus pickup)
  const pickupFee = 0.0;
  const finalTotal = totalPrice + pickupFee;

  if (items.length === 0) {
    return (
      <section className="empty-cart-view" aria-label="Empty Cart">
        <div className="empty-cart-card">
          <div className="empty-cart-graphic" role="img" aria-label="Empty tray">
            🛒
          </div>
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-subtitle">
            Looks like you haven't added anything to your tray yet. Check out our
            daily specials and freshly prepared campus meals!
          </p>
          <Link to="/" className="btn btn-primary btn-large">
            Browse Menu & Start Order
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-container" aria-label="Cart Overview">
      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-section">
          <div className="cart-header-bar">
            <h2 className="cart-heading">
              Your Order Tray ({totalUnits} {totalUnits === 1 ? 'item' : 'items'})
            </h2>
            <button
              type="button"
              className="btn-clear-cart"
              onClick={clearCart}
              aria-label="Clear all items from cart"
            >
              Clear Tray
            </button>
          </div>

          <ul className="cart-items-list">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;

              return (
                <li key={item.id} className="cart-item-row" data-testid={`cart-item-${item.id}`}>
                  {/* Item Image */}
                  <div className="cart-item-thumb-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-thumb"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </div>

                  {/* Item Info */}
                  <div className="cart-item-info">
                    <Link to={`/item/${item.id}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <span className="cart-item-unit-price">
                      {formatPrice(item.price)} each
                    </span>
                    {item.category && (
                      <span className="cart-item-category">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-controls">
                    <div
                      className="quantity-stepper"
                      role="group"
                      aria-label={`Quantity selector for ${item.name}`}
                    >
                      <button
                        type="button"
                        className="stepper-btn stepper-btn-decrease"
                        onClick={() => decrementQuantity(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        title={
                          item.quantity === 1
                            ? 'Remove item'
                            : 'Decrease quantity'
                        }
                      >
                        {item.quantity === 1 ? '🗑️' : '−'}
                      </button>

                      <span
                        className="stepper-value"
                        aria-live="polite"
                        aria-label={`Current quantity: ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        className="stepper-btn stepper-btn-increase"
                        onClick={() => incrementQuantity(item.id)}
                        aria-label={`Increase quantity of ${item.name}`}
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="cart-item-subtotal">
                      {formatPrice(itemTotal)}
                    </span>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      title="Remove item"
                    >
                      <svg
                        className="trash-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="cart-navigation-actions">
            <Link to="/" className="continue-shopping-link">
              ← Continue Shopping / Add More Items
            </Link>
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <aside className="order-summary-sidebar" aria-label="Order Summary">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Items Total ({totalUnits} units)</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="summary-row">
              <span>Campus Pickup</span>
              <span className="badge-free">FREE</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax (included)</span>
              <span>Rs. 0</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-total-row">
              <span className="total-label">Total Amount</span>
              <span className="total-amount">{formatPrice(finalTotal)}</span>
            </div>

            <div className="pickup-info-box">
              <span className="pickup-badge">📍 Superior University Gold Campus — Canteen Counter</span>
              <p className="pickup-est">Ready in approx. 10-15 minutes for pickup</p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-checkout"
              onClick={() => {
                alert(
                  `🎉 Order Placed Successfully!\n\nOrder Total: ${formatPrice(
                    finalTotal
                  )}\nItems: ${totalUnits} items\nPickup: Superior University Gold Campus Canteen Counter\n\nThank you for ordering with Campus Canteen!`
                );
                clearCart();
              }}
            >
              Confirm & Place Campus Order
            </button>

            <p className="payment-note">
              💳 Cash on pickup, JazzCash, EasyPaisa, or Student Card accepted at counter.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
