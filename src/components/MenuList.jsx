import React, { useState, useMemo } from 'react';
import ItemCard from './ItemCard';

/**
 * MenuList Component
 * Receives menu items via props, renders search and category filters,
 * and displays filtered items using ItemCard components with unique item IDs as keys.
 */
const MenuList = ({ items = [] }) => {
  // State for search query and active category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories dynamically from the loaded items
  const categories = useMemo(() => {
    const unique = new Set(items.map((item) => item.category).filter(Boolean));
    return ['All', ...Array.from(unique)];
  }, [items]);

  // Filter items based on search query and category selection
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const normalizedSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch === '' ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        (item.category && item.category.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <section className="menu-list-section" aria-label="Canteen Menu Catalog">
      {/* Search and Filter Controls */}
      <div className="filter-controls">
        <div className="search-bar-container">
          <label htmlFor="menu-search-input" className="sr-only">
            Search food, snacks, and drinks
          </label>
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">
              🔍
            </span>
            <input
              id="menu-search-input"
              type="search"
              className="search-input"
              placeholder="Search biryani, zinger, chai, coke, mango juice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search menu items"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="category-filters-container" role="tablist" aria-label="Menu Categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              className={`category-pill ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {category === 'All'
                ? ` (${items.length})`
                : ` (${items.filter((i) => i.category === category).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Status Summary */}
      <div className="filter-summary">
        <span className="results-count">
          Showing <strong>{filteredItems.length}</strong> of {items.length} items
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {(selectedCategory !== 'All' || searchQuery) && (
          <button
            type="button"
            className="btn-reset-filters"
            onClick={handleClearFilters}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Items Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="menu-grid" role="region" aria-label="Menu Items Grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty-results-card" role="alert">
          <div className="empty-icon" aria-hidden="true">
            🥗
          </div>
          <h3>No Menu Items Found</h3>
          <p>
            We couldn't find any items matching your current search or category
            filter. Try adjusting your keywords or browse all categories.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClearFilters}
          >
            Show All Menu Items
          </button>
        </div>
      )}
    </section>
  );
};

export default MenuList;
