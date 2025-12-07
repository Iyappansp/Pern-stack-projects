# POSGRESTORE - Frontend

A modern React-based e-commerce product management application with a dark theme and neon green accents.

## 🚀 Features

- **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Dark Theme UI**: Beautiful dark interface with neon green accents
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Updates**: Instant UI updates after operations
- **Error Handling**: User-friendly error messages with toast notifications
- **Loading States**: Smooth loading indicators during data fetching

## 🛠️ Tech Stack

- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   ├── ProductCard.jsx  # Product card component
│   │   └── AddProductModal.jsx # Modal for adding products
│   ├── pages/               # Page-level components
│   │   ├── HomePage.jsx     # Product listing page
│   │   └── ProductPage.jsx   # Product detail/edit page
│   ├── services/            # API services
│   │   └── api.js           # Axios configuration and API calls
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets
├── package.json
├── tailwind.config.js       # Tailwind configuration
└── vite.config.js           # Vite configuration
```

## 🎨 Design System

### Colors
- **Primary Background**: `#0a0a0a` (Dark)
- **Card Background**: `#1a1a1a` (Dark Card)
- **Accent Green**: `#00ff88` (Neon Green)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#a0a0a0` (Gray)

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Logo**: Bold, uppercase
- **Product Names**: 16px, medium weight
- **Prices**: 18px, bold, green accent

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```env
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 📡 API Integration

The frontend communicates with the backend API at `http://localhost:3000/api/products`:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🎯 Features Breakdown

### HomePage
- Product grid (responsive: 1 column mobile, 2 tablet, 3 desktop)
- "Add Product" button with modal
- Product cards with edit/delete actions
- Color category sidebar
- Loading states and empty states

### ProductPage
- Large product image display
- Edit form with all product fields
- Save and delete actions
- Back navigation
- Form validation

### Components
- **Navbar**: Fixed top navigation with logo, refresh, and cart icon
- **ProductCard**: Reusable product display card with hover effects
- **AddProductModal**: Overlay modal for creating new products

## 🎨 Styling Guidelines

All components use Tailwind CSS utility classes with custom theme colors defined in `tailwind.config.js`. Custom component classes are defined in `index.css` using `@layer components`.

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend server is running on port 3000
- Check CORS settings in backend
- Verify API base URL in `.env` file

### Styling Issues
- Ensure Tailwind is properly configured
- Check that `index.css` is imported in `main.jsx`
- Verify custom colors in `tailwind.config.js`

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## 📝 License

This project is part of the PERN Stack Tutorial.
