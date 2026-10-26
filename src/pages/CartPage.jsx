import React from 'react';
import Cart from '../components/Cart';

/**
 * CartPage Component
 * Route: /cart
 * Wraps the Cart component in a semantic main container,
 * with breadcrumbs and checkout flow messaging.
 */
const CartPage = () => {
  return (
    <main className="cart-page-main" id="main-content">
      <div className="cart-page-wrapper">
        <header className="page-header">
          <h1 className="page-title">Your Food Tray & Checkout</h1>
          <p className="page-description">
            Review your campus canteen order, adjust item quantities, and prepare
            for express counter pickup.
          </p>
        </header>

        {/* Reusable Cart Component */}
        <Cart />
      </div>
    </main>
  );
};

export default CartPage;
