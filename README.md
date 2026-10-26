# 🍽️ Campus Canteen | Superior University Gold Campus, Lahore

A complete, responsive campus canteen online ordering web application tailored for students and faculty at **The Superior University, Gold Campus, Lahore**, featuring an authentic Pakistani food menu, realistic PKR pricing, Context API cart state management, and React Router navigation.

---

## 🏛️ Campus Information

- **Institution:** The Superior University
- **Campus:** Gold Campus
- **City:** Lahore, Punjab, Pakistan
- **Address:** Superior University, Gold Campus, Lahore, Punjab, Pakistan.
- **Heading:** `Campus Canteen | Superior University Gold Campus`
- **Notice / Disclaimer:** *This application is an independent student project created for campus convenience to help students browse authentic Pakistani canteen options and prepare their orders for counter pickup. It is not officially operated or endorsed by The Superior University administration.*

---

## 🍛 Authentic Pakistani Food Menu & Realistic PKR Prices

All food items in `public/menu.json` are authentic Pakistani dishes commonly found in university canteens across Lahore:

| Category | Item Name | Estimated PKR Price | Availability |
|---|---|---|---|
| **Rice & Meals** | Chicken Biryani (Single Plate) | Rs. 260 | In Stock |
| **Rice & Meals** | Special Chicken Pulao | Rs. 240 | In Stock |
| **Rice & Meals** | Daal Chawal Platter | Rs. 160 | In Stock (Veg) |
| **Rice & Meals** | Boneless Chicken Karahi (Single) | Rs. 320 | In Stock |
| **Rolls & Fast Food** | Crispy Zinger Burger | Rs. 330 | In Stock |
| **Rolls & Fast Food** | Chicken Paratha Roll | Rs. 180 | In Stock |
| **Rolls & Fast Food** | Chicken Shawarma Roll | Rs. 170 | In Stock |
| **Rolls & Fast Food** | Special Daal Shami Bun Kebab | Rs. 120 | In Stock |
| **Snacks & Chaat** | Crispy French Fries (Masala) | Rs. 100 | In Stock (Veg) |
| **Snacks & Chaat** | Aloo Samosa (2 Pieces) | Rs. 60 | In Stock (Veg) |
| **Snacks & Chaat** | Mixed Pakora Plate | Rs. 90 | In Stock (Veg) |
| **Snacks & Chaat** | Lahori Chana Chaat | Rs. 110 | In Stock (Veg) |
| **Breakfast & Parathas** | Aloo Cheese Paratha | Rs. 150 | In Stock (Veg) |
| **Breakfast & Parathas** | Anda Paratha with Omelette | Rs. 130 | In Stock |
| **Chai & Beverages** | Karak Doodh Patti Chai | Rs. 80 | In Stock (Veg) |
| **Chai & Beverages** | Special Cardamom Tea (Elaichi Doodh Patti) | Rs. 90 | In Stock (Veg) |
| **Chai & Beverages** | Elaichi Green Tea (Kahwa) | Rs. 50 | In Stock (Veg) |
| **Chai & Beverages** | Chilled Coca-Cola (345ml Bottle) | Rs. 80 | In Stock (Veg) |
| **Chai & Beverages** | Chilled Pepsi (345ml Bottle) | Rs. 80 | In Stock (Veg) |
| **Chai & Beverages** | Chilled Fanta (345ml Bottle) | Rs. 80 | In Stock (Veg) |
| **Chai & Beverages** | Fresh Chaunsa Mango Juice (Chilled) | Rs. 140 | In Stock (Veg) |
| **Chai & Beverages** | Fresh Multi-Fruit Cocktail Juice | Rs. 150 | In Stock (Veg) |
| **Chai & Beverages** | Chilled Rooh Afza Sharbat | Rs. 70 | In Stock (Veg) |
| **Chai & Beverages** | Fresh Lime Soda | Rs. 80 | In Stock (Veg) |
| **Desserts** | Hot Gulab Jamun (2 Pieces) | Rs. 100 | In Stock (Veg) |
| **Desserts** | Zafrani Matka Kheer | Rs. 120 | Out of Stock (Testing) |

*Prices in numeric format in `public/menu.json` and formatted across all UI screens with the `Rs.` prefix using a central `formatPrice` utility.*

---

## 🚀 Running the Application

### 1. Development Mode

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 2. Automated Tests (Vitest & React Testing Library)

```bash
npm test
```

All 21 unit and integration tests covering Context API, ItemCard, MenuList, Cart, and App routing pass 100%.

### 3. Production Build

```bash
npm run build
```

---

## 🛠️ Technology Stack Preserved

- **React (v18.3.1)**: Pure React components with functional hooks.
- **JavaScript (ES2022+)**: Application logic and asynchronous fetch.
- **CSS3**: Pure CSS Grid & Flexbox with media queries (mobile-first).
- **React Context API**: Shared cart state with derived count and total price calculations.
- **React Router (v6.28.0)**: Smooth client-side transitions between `/`, `/item/:id`, and `/cart`.
- **Fetch API**: Dynamic asynchronous loading from `public/menu.json` with loading/error handling.
