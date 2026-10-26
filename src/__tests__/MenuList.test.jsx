import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MenuList from '../components/MenuList';
import { CartProvider } from '../context/CartContext';

const mockItems = [
  {
    id: 'item-1',
    name: 'Chicken Biryani',
    description: 'Spiced basmati rice with chicken',
    price: 260,
    category: 'Rice & Meals',
    image: 'https://example.com/1.jpg',
    available: true,
  },
  {
    id: 'item-2',
    name: 'Chicken Paratha Roll',
    description: 'Juicy chicken boti wrapped in crispy paratha',
    price: 180,
    category: 'Rolls & Fast Food',
    image: 'https://example.com/2.jpg',
    available: true,
  },
  {
    id: 'item-3',
    name: 'Karak Doodh Patti Chai',
    description: 'Strong brewed tea with cardamom and milk',
    price: 80,
    category: 'Chai & Beverages',
    image: 'https://example.com/3.jpg',
    available: true,
  },
];

describe('MenuList Component', () => {
  it('renders all Pakistani items initially', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <MenuList items={mockItems} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Chicken Biryani')).toBeInTheDocument();
    expect(screen.getByText('Chicken Paratha Roll')).toBeInTheDocument();
    expect(screen.getByText('Karak Doodh Patti Chai')).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 3 of 3 items');
  });

  it('filters items by category selection', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <MenuList items={mockItems} />
        </CartProvider>
      </BrowserRouter>
    );

    // Click on "Chai & Beverages" category pill
    const chaiPill = screen.getByRole('tab', { name: /Chai & Beverages/i });
    fireEvent.click(chaiPill);

    expect(screen.getByText('Karak Doodh Patti Chai')).toBeInTheDocument();
    expect(screen.queryByText('Chicken Biryani')).not.toBeInTheDocument();
    expect(screen.queryByText('Chicken Paratha Roll')).not.toBeInTheDocument();
  });

  it('filters items by search input', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <MenuList items={mockItems} />
        </CartProvider>
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search biryani/i);
    fireEvent.change(searchInput, { target: { value: 'paratha' } });

    expect(screen.getByText('Chicken Paratha Roll')).toBeInTheDocument();
    expect(screen.queryByText('Chicken Biryani')).not.toBeInTheDocument();
    expect(screen.queryByText('Karak Doodh Patti Chai')).not.toBeInTheDocument();
  });

  it('shows empty results message when no items match and allows reset', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <MenuList items={mockItems} />
        </CartProvider>
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search biryani/i);
    fireEvent.change(searchInput, { target: { value: 'xyznotfound' } });

    expect(screen.getByText('No Menu Items Found')).toBeInTheDocument();

    const resetButton = screen.getByRole('button', { name: /Show All Menu Items/i });
    fireEvent.click(resetButton);

    expect(screen.getByText('Chicken Biryani')).toBeInTheDocument();
  });
});
