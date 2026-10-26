import React, { createContext, useContext, useState } from 'react';

// Create Cart Context
const CartContext = createContext();

/**
 * Custom hook to consume the CartContext easily
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * CartProvider component to manage and supply cart state across the app
 */
export const CartProvider = ({ children }) => {
  // Single source of truth for cart items
  // Each item in cartItems: { id, name, price, image, category, quantity, available }
  const [cartItems, setCartItems] = useState([]);

  /**
   * Add an item to the cart. If already present, increment quantity.
   * Does not add if item is unavailable.
   */
  const addToCart = (item, quantityToAdd = 1) => {
    if (!item || item.available === false) {
      return false;
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((ci) => ci.id === item.id);

      if (existingItemIndex > -1) {
        // Item exists, update its quantity
        const updated = [...prevItems];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + quantityToAdd,
        };
        return updated;
      } else {
        // Item does not exist, append with quantity
        return [
          ...prevItems,
          {
            ...item,
            quantity: quantityToAdd > 0 ? quantityToAdd : 1,
          },
        ];
      }
    });

    return true;
  };

  /**
   * Remove an item completely from the cart by its ID
   */
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  /**
   * Update the quantity of a specific cart item
   * If newQuantity <= 0, the item is removed from the cart
   */
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * Increase quantity by 1
   */
  const incrementQuantity = (itemId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  /**
   * Decrease quantity by 1. If it hits 0, it removes the item.
   */
  const decrementQuantity = (itemId) => {
    setCartItems((prevItems) => {
      const target = prevItems.find((item) => item.id === itemId);
      if (!target) return prevItems;
      if (target.quantity <= 1) {
        return prevItems.filter((item) => item.id !== itemId);
      }
      return prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Helper to get current quantity of an item in the cart
   */
  const getItemQuantity = (itemId) => {
    const item = cartItems.find((ci) => ci.id === itemId);
    return item ? item.quantity : 0;
  };

  // Calculate cart count (total units) and total price dynamically from current cart state
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getItemQuantity,
    totalUnits,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
