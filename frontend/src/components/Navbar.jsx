import { Link } from "react-router-dom";
import { FiShoppingCart, FiRefreshCw, FiMoreVertical } from "react-icons/fi";
import { useState, useEffect } from "react";
import { productsAPI } from "../services/api";

const Navbar = ({ onRefresh }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Fetch cart count (for now, we'll use product count as placeholder)
    // In a real app, this would come from a cart context/store
    const fetchCartCount = async () => {
      try {
        const products = await productsAPI.getAll();
        // For demo, using product count as cart items
        // Replace with actual cart logic
        setCartCount(Array.isArray(products) ? products.length : 0);
      } catch (error) {
        // Silently fail if backend is not available
        // Don't log to console to avoid noise
        setCartCount(0);
      }
    };
    fetchCartCount();
  }, []);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    // Refresh cart count
    productsAPI
      .getAll()
      .then((products) =>
        setCartCount(Array.isArray(products) ? products.length : 0)
      )
      .catch(console.error);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-card border-b border-dark-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-bold text-text-primary uppercase tracking-wide">
              Iyap's Store
            </span>
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-full hover:bg-dark-hover transition-colors duration-300"
              aria-label="Refresh"
            >
              <FiRefreshCw className="w-5 h-5 text-text-secondary hover:text-neon-green transition-colors" />
            </button>

            {/* Cart Icon with Badge */}
            <Link
              to="/"
              className="relative p-2 rounded-full hover:bg-dark-hover transition-colors duration-300"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="w-5 h-5 text-text-secondary hover:text-neon-green transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-green text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Menu Button */}
            <button
              className="p-2 rounded-full hover:bg-dark-hover transition-colors duration-300 md:hidden"
              aria-label="Menu"
            >
              <FiMoreVertical className="w-5 h-5 text-text-secondary hover:text-neon-green transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
