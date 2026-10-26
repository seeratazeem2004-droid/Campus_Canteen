import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { CartProvider } from '../context/CartContext';

const mockItem = {
  id: 'item-1',
  name: 'Chicken Biryani (Single Plate)',
  description: 'Aromatic basmati rice cooked with spiced chicken.',
  price: 260,
  category: 'Rice & Meals',
  image: 'https://example.com/biryani.jpg',
  available: true,
  prepTime: '5-8 min',
  calories: 580,
  rating: 4.9,
  isVegetarian: false,
};

const mockUnavailableItem = {
  ...mockItem,
  id: 'item-2',
  name: 'Zafrani Matka Kheer',
  available: false,
};

describe('ItemCard Component', () => {
  it('renders Pakistani item information and PKR price correctly', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ItemCard item={mockItem} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Chicken Biryani (Single Plate)')).toBeInTheDocument();
    expect(screen.getByText('Aromatic basmati rice cooked with spiced chicken.')).toBeInTheDocument();
    expect(screen.getByText('Rs. 260')).toBeInTheDocument();
    expect(screen.getByText('Rice & Meals')).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockItem.image);
    expect(image).toHaveAttribute('alt', mockItem.name);
  });

  it('toggles favourite state when clicking favourite button', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ItemCard item={mockItem} />
        </CartProvider>
      </BrowserRouter>
    );

    const favButton = screen.getByRole('button', {
      name: /Add Chicken Biryani \(Single Plate\) to favourites/i,
    });
    expect(favButton).toBeInTheDocument();
    expect(favButton).not.toHaveClass('is-fav');

    // Click to favourite
    fireEvent.click(favButton);
    expect(screen.getByRole('button', { name: /Remove Chicken Biryani \(Single Plate\) from favourites/i })).toHaveClass('is-fav');

    // Click again to unmark
    fireEvent.click(favButton);
    expect(screen.getByRole('button', { name: /Add Chicken Biryani \(Single Plate\) to favourites/i })).not.toHaveClass('is-fav');
  });

  it('renders a link to the item details page', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ItemCard item={mockItem} />
        </CartProvider>
      </BrowserRouter>
    );

    const detailsLink = screen.getByRole('link', { name: /View details for Chicken Biryani \(Single Plate\)/i });
    expect(detailsLink).toHaveAttribute('href', '/item/item-1');
  });

  it('prevents unavailable items from being added to the cart', () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <ItemCard item={mockUnavailableItem} />
        </CartProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    const addButton = screen.getByRole('button', { name: /Zafrani Matka Kheer is currently out of stock/i });
    expect(addButton).toBeDisabled();
    expect(addButton).toHaveTextContent('Sold Out');
  });
});
