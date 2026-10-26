import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';

const TestComponent = () => {
  const cart = useCart();

  return (
    <div>
      <span data-testid="total-units">{cart.totalUnits}</span>
      <span data-testid="total-price">{cart.totalPrice.toFixed(0)}</span>
      <span data-testid="items-count">{cart.cartItems.length}</span>
      <ul data-testid="items-list">
        {cart.cartItems.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.name} - Qty: {item.quantity} - Rs. {item.price}
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          cart.addToCart({
            id: 'item-1',
            name: 'Chicken Biryani',
            price: 260,
            available: true,
          })
        }
      >
        Add Biryani
      </button>
      <button
        onClick={() =>
          cart.addToCart({
            id: 'item-2',
            name: 'Zafrani Kheer',
            price: 120,
            available: false,
          })
        }
      >
        Add Unavailable
      </button>
      <button onClick={() => cart.incrementQuantity('item-1')}>
        Increment
      </button>
      <button onClick={() => cart.decrementQuantity('item-1')}>
        Decrement
      </button>
      <button onClick={() => cart.removeFromCart('item-1')}>Remove</button>
      <button onClick={() => cart.clearCart()}>Clear</button>
    </div>
  );
};

describe('CartContext & CartProvider', () => {
  it('initializes with empty cart, zero units and zero total price', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('total-units')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  it('adds an item to cart and updates count and total price in PKR', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Biryani').click();
    });

    expect(screen.getByTestId('total-units')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('260');
    expect(screen.getByTestId('item-item-1')).toHaveTextContent('Chicken Biryani - Qty: 1 - Rs. 260');
  });

  it('increments quantity when the same item is added again', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Biryani').click();
    });
    act(() => {
      screen.getByText('Add Biryani').click();
    });

    expect(screen.getByTestId('total-units')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('520');
    expect(screen.getByTestId('item-item-1')).toHaveTextContent('Qty: 2');
  });

  it('does not add unavailable items', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Unavailable').click();
    });

    expect(screen.getByTestId('total-units')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  it('increments and decrements quantity correctly', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Biryani').click();
    });
    act(() => {
      screen.getByText('Increment').click();
    });

    expect(screen.getByTestId('total-units')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('520');

    act(() => {
      screen.getByText('Decrement').click();
    });

    expect(screen.getByTestId('total-units')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('260');

    // Decrementing when quantity is 1 removes the item
    act(() => {
      screen.getByText('Decrement').click();
    });

    expect(screen.getByTestId('total-units')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });

  it('removes item and clears cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    act(() => {
      screen.getByText('Add Biryani').click();
    });
    expect(screen.getByTestId('total-units')).toHaveTextContent('1');

    act(() => {
      screen.getByText('Remove').click();
    });
    expect(screen.getByTestId('total-units')).toHaveTextContent('0');
    expect(screen.getByTestId('items-count')).toHaveTextContent('0');
  });
});
