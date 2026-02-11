# Figma Design Specification — Nexus Catalog

Use this spec to build designs in Figma. All values match the implemented frontend.

---

## 1. Design Tokens

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `primary-blue` | `#1e40af` | Primary buttons, links, accents, focus rings |
| `primary-blue-hover` | `#1e3a8a` (≈ blue-800) | Button hover states |
| `secondary-gray` | `#4b5563` | Secondary text |
| `gray-50` | `#f9fafb` | Page background |
| `gray-100` | `#f3f4f6` | Light surfaces, borders |
| `gray-200` | `#e5e7eb` | Borders, dividers |
| `gray-300` | `#d1d5db` | Input borders |
| `gray-500` | `#6b7280` | Muted text |
| `gray-700` | `#374151` | Body text |
| `gray-800` | `#1f2937` | Headings |
| `gray-900` | `#111827` | Strong headings |
| `white` | `#ffffff` | Cards, navbar, inputs |
| `red-100` | — | Out-of-stock badge bg |
| `red-800` | — | Out-of-stock badge text |
| `yellow-100` | — | Low-stock badge bg |
| `yellow-800` | — | Low-stock badge text |
| `green-100` | — | In-stock badge bg |
| `green-800` | — | In-stock badge text |
| `red-600` | — | Cart badge, error states |

### Typography
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Font family | Inter | — | — | — |
| Logo | Inter | 24px | 800 | 1.2 |
| H1 | Inter | 30px | 800 | 1.2 |
| H2 | Inter | 24px | 700 | 1.3 |
| H3 | Inter | 18px | 600 | 1.4 |
| Body | Inter | 14–16px | 400 | 1.5 |
| Small / Caption | Inter | 12px | 500 | 1.4 |
| Button | Inter | 14px | 500–600 | — |

### Spacing
- Base unit: 4px
- Small: 8px, Medium: 16px, Large: 24px
- Section padding: 24–32px
- Card padding: 16px
- Input padding: 8px 12px

### Border Radius
- Sm: 6px, Md: 8px, Lg: 12px, Xl: 16px
- Buttons: 8px (rounded-lg)
- Cards: 12px (rounded-xl)
- Inputs: 8px (rounded-lg)

### Shadows
- Card default: `shadow-lg` (Tailwind)
- Card hover: `shadow-xl`
- Navbar: `shadow-md`
- Focus ring: `0 0 0 3px rgba(30, 64, 175, 0.4)`

---

## 2. Layout Structure

### Breakpoints
- Mobile: &lt; 640px
- Tablet: 640px – 1024px  
- Desktop: ≥ 1024px
- Max content width: 1280px (max-w-7xl)

### App Shell
```
┌─────────────────────────────────────────────┐
│  Navbar (fixed, h-64px, z-40)                │
├──────────┬──────────────────────────────────┤
│ Filter   │  Main Content                     │
│ Sidebar  │  (flex-1, max-w-7xl, mx-auto)    │
│ 256px    │                                   │
│ (hidden  │  - Home: Product grid             │
│  mobile) │  - Admin: Forms                    │
├──────────┴──────────────────────────────────┤
│  Footer (p-4, bg-gray-800, text-gray-300)   │
└─────────────────────────────────────────────┘
```

---

## 3. Component Specs

### 3.1 Navbar
- Height: 64px
- Background: white, shadow-md
- Layout: flex, space-between, max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Items:
  - Left: Hamburger (mobile only), Logo "Nexus Catalog"
  - Center: Search bar (hidden mobile, max-w-lg)
  - Right: Cart icon + badge, Admin / Back to Catalog button

### 3.2 Filter Sidebar
- Width: 256px (w-64)
- Mobile: Overlay, slide-in from left, overlay opacity 50%
- Sections: Categories, Price Range (Min/Max inputs)
- Buttons: Apply Filters (primary), Clear Filters (secondary)

### 3.3 Product Card
- Aspect ratio: 1:1 for image
- Border: 1px gray-100, rounded-xl
- Shadow: lg default, xl on hover
- Hover: translate-y -4px
- Content:
  - Image with stock badge (top-right)
  - Category label (12px, gray-500)
  - Product name (18px, semibold, truncate)
  - Rating + review count
  - Price ($XX.XX, primary-blue, 20px)
  - Add to Cart / Sold Out button

### 3.4 Pagination
- Prev/Next arrows
- Page numbers (1–5 visible, ellipsis when needed)
- Active page: primary-blue bg
- Disabled: gray-400, cursor-not-allowed

### 3.5 Sort Dropdown
- Trigger: "Sort by: [value]" with chevron
- Options: Price: Low to High, Price: High to Low, etc.

### 3.6 Admin Dashboard
- Login form: max-w-md, centered, white card
- Authenticated: Create Product form, Update Product form
- Two-column grid on desktop for form fields

---

## 4. Screens to Design

### Screen 1: Home (Product Catalog)
- Full navbar
- Filter sidebar (visible on desktop)
- Header: "Product Catalog (X items)" + Filters + Sort
- 4-column grid (1 col mobile, 2 tablet, 3–4 desktop)
- Product cards with sample data
- Pagination at bottom

### Screen 2: Home — Mobile
- Hamburger menu
- Filters button in header
- Single-column product grid
- Slide-out filter sidebar

### Screen 3: Admin Login
- Centered card, max-width 28rem
- Username, Password inputs
- Login button
- Error message placeholder

### Screen 4: Admin Dashboard (Authenticated)
- Header with "Admin Dashboard" + user + Logout
- Create New Product form (Name, Description, Price, Stock, Category, Image URL)
- Update Existing Product form (ID, Price, Stock, Available checkbox)

### Screen 5: Empty State
- Dashed border container
- "No Products Found"
- "Clear All Filters" button

### Screen 6: Error State
- Red-tinted card
- "Error Loading Catalog"
- "Try Again" button

---

## 5. Interactive States

- **Buttons**: default, hover, active, disabled
- **Inputs**: default, focus (ring primary-blue), error
- **Product card**: default, hover (lift + shadow)
- **Sidebar**: open, closed (mobile)
- **Category filter**: selected (primary-blue bg), unselected

---

## 6. Assets

- Icons: Lucide-style (Menu, X, Search, ShoppingCart, SlidersHorizontal, ChevronLeft, ChevronRight, Star)
- Placeholder images: 400×400 for products

---

## 7. Figma Implementation Tips

1. Create a **Design System** file with tokens (colors, typography, spacing).
2. Build **Components** for Navbar, ProductCard, FilterSidebar, Pagination, etc.
3. Use **Auto Layout** for responsive behavior.
4. Add **Variants** for button states, sidebar open/closed.
5. Create **Frames** for each screen at 1440px (desktop) and 375px (mobile).
6. Use **Component Properties** for dynamic content (product name, price, etc.).
