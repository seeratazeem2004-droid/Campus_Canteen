/**
 * Utility function to format numeric prices in Pakistani Rupees (PKR)
 * Example: formatPrice(250) => "Rs. 250"
 *
 * @param {number|string} price - Numeric price
 * @returns {string} Formatted price with "Rs." prefix
 */
export const formatPrice = (price) => {
  const numeric = Number(price);
  if (isNaN(numeric)) {
    return 'Rs. 0';
  }
  return `Rs. ${numeric.toLocaleString('en-PK')}`;
};

export default formatPrice;
