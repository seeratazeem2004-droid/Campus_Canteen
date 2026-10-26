import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';

const mockMenuData = [
  {
    id: 'item-1',
    name: 'Chicken Biryani (Single Plate)',
    description: 'Aromatic basmati rice cooked with spiced chicken and potatoes',
    price: 260,
    category: 'Rice & Meals',
    image: 'https://example.com/biryani.jpg',
    available: true,
    prepTime: '5-8 min',
    calories: 580,
    rating: 4.9,
  },
  {
    id: 'item-2',
    name: 'Karak Doodh Patti Chai',
    description: 'Slow-brewed rich canteen chai with milk and cardamom',
    price: 80,
    category: 'Chai & Beverages',
    image: 'https://example.com/chai.jpg',
    available: true,
    prepTime: '3-5 min',
    calories: 120,
    rating: 5.0,
  },
];

describe('App Integration & Routing', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('loads and displays Pakistani menu items dynamically from /menu.json', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMenuData,
    });

    render(<App />);

    // Initially displays loading state
    expect(screen.getByText(/Loading delicious menu items.../i)).toBeInTheDocument();

    // After fetch completes, displays items and campus branding
    await waitFor(() => {
      expect(screen.getByText('Chicken Biryani (Single Plate)')).toBeInTheDocument();
      expect(screen.getByText('Karak Doodh Patti Chai')).toBeInTheDocument();
      expect(
        screen.getByText('Campus Canteen | Superior University Gold Campus')
      ).toBeInTheDocument();
      const addressElements = screen.getAllByText(/Superior University, Gold Campus, Lahore, Punjab, Pakistan./i);
      expect(addressElements.length).toBeGreaterThanOrEqual(1);
    });

    expect(global.fetch).toHaveBeenCalledWith('/menu.json');
  });

  it('displays a meaningful error message when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to Load Menu/i)).toBeInTheDocument();
      expect(screen.getByText(/Failed to load menu data/i)).toBeInTheDocument();
    });
  });

  it('updates cart count immediately in the header and shows on cart screen with PKR prices', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMenuData,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Chicken Biryani (Single Plate)')).toBeInTheDocument();
    });

    // Header initially has no cart badge
    const cartNavLink = screen.getByRole('link', { name: /Shopping cart with 0 items/i });
    expect(cartNavLink).toBeInTheDocument();

    // Click "Add to Cart" on the biryani
    const addToCartButtons = screen.getAllByRole('button', { name: /Add .* to cart/i });
    fireEvent.click(addToCartButtons[0]);

    // Cart badge in header should now show "1"
    await waitFor(() => {
      const updatedCartNavLink = screen.getByRole('link', { name: /Shopping cart with 1 items/i });
      expect(updatedCartNavLink).toBeInTheDocument();
    });

    // Navigate to /cart by clicking the cart link
    fireEvent.click(screen.getByRole('link', { name: /Shopping cart with 1 items/i }));

    // Verify Cart Page displays the item and correct PKR total
    await waitFor(() => {
      expect(screen.getByText(/Your Order Tray \(1 item\)/i)).toBeInTheDocument();
      expect(screen.getByText('Chicken Biryani (Single Plate)')).toBeInTheDocument();
      const priceElements = screen.getAllByText('Rs. 260');
      expect(priceElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('navigates to item details screen and allows adding custom quantity with PKR formatting', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockMenuData,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Chicken Biryani (Single Plate)')).toBeInTheDocument();
    });

    // Click "Details" button on the first item
    const detailsButtons = screen.getAllByRole('link', { name: /View details for/i });
    fireEvent.click(detailsButtons[0]);

    // Check item details view
    await waitFor(() => {
      expect(screen.getByText('Back to Menu')).toBeInTheDocument();
      expect(screen.getByText('Student Rating')).toBeInTheDocument();
      expect(screen.getByText('Estimated Prep')).toBeInTheDocument();
      expect(screen.getByText('Rs. 260')).toBeInTheDocument();
    });

    // Increment quantity on details page to 2
    const incQtyBtn = screen.getByRole('button', { name: /Increase quantity/i });
    fireEvent.click(incQtyBtn);

    // Button should now show 2 * 260 = Rs. 520
    const addDetailsBtn = screen.getByRole('button', { name: /Add 2 to Cart • Rs. 520/i });
    expect(addDetailsBtn).toBeInTheDocument();
    fireEvent.click(addDetailsBtn);

    // Header badge should now display 2
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Shopping cart with 2 items/i })).toBeInTheDocument();
    });

    // Click Back to Menu
    fireEvent.click(screen.getByText('Back to Menu'));
    await waitFor(() => {
      expect(
        screen.getByText('Campus Canteen | Superior University Gold Campus')
      ).toBeInTheDocument();
    });
  });
});
