import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../components/Cart';
import { CartProvider } from '../context/CartContext';

const mockCartItems = [
  {
    id: 'item-1',
    name: 'Chicken Biryani (Single Plate)',
    price: 260,
    quantity: 2,
    image: 'https://example.com/biryani.jpg',
    category: 'Rice & Meals',
  },
  {
    id: 'item-2',
    name: 'Karak Doodh Patti Chai',
    price: 80,
    quantity: 1,
    image: 'https://example.com/chai.jpg',
    category: 'Chai & Beverages',
  },
];

describe('Cart Component', () => {
  it('renders empty cart message when there are no items', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Cart items={[]} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse Menu & Start Order/i })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('renders cart items, unit prices in PKR, quantities, and correct subtotal & total', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Cart items={mockCartItems} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Chicken Biryani (Single Plate)')).toBeInTheDocument();
    expect(screen.getByText('Rs. 260 each')).toBeInTheDocument();
    expect(screen.getByText('Karak Doodh Patti Chai')).toBeInTheDocument();
    expect(screen.getByText('Rs. 80 each')).toBeInTheDocument();

    // Total units: 2 + 1 = 3
    expect(screen.getByText(/Your Order Tray \(3 items\)/i)).toBeInTheDocument();
    // Subtotal: 260*2 + 80*1 = 600 (appears in items total and final total)
    const priceElements = screen.getAllByText('Rs. 600');
    expect(priceElements.length).toBeGreaterThanOrEqual(1);

    // Displays Superior University Gold Campus pickup note
    expect(screen.getByText(/Superior University Gold Campus/i)).toBeInTheDocument();
  });

  it('calls increment, decrement, and remove handlers on user click', () => {
    const handleIncrement = vi.fn();
    const handleDecrement = vi.fn();
    const handleRemove = vi.fn();

    render(
      <BrowserRouter>
        <CartProvider>
          <Cart
            items={mockCartItems}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
          />
        </CartProvider>
      </BrowserRouter>
    );

    // Click increment for biryani
    const increaseButtons = screen.getAllByRole('button', { name: /Increase quantity/i });
    fireEvent.click(increaseButtons[0]);
    expect(handleIncrement).toHaveBeenCalledWith('item-1');

    // Click decrement for biryani
    const decreaseButtons = screen.getAllByRole('button', { name: /Decrease quantity/i });
    fireEvent.click(decreaseButtons[0]);
    expect(handleDecrement).toHaveBeenCalledWith('item-1');

    // Click remove for chai
    const removeButtons = screen.getAllByRole('button', { name: /Remove .* from cart/i });
    fireEvent.click(removeButtons[1]);
    expect(handleRemove).toHaveBeenCalledWith('item-2');
  });
});
