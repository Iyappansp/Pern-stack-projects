import { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import { productsAPI } from '../services/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const productsList = await productsAPI.getAll();
      setProducts(productsList);
    } catch (error) {
      // Check if it's a connection error
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        toast.error("Cannot connect to server. Please make sure the backend is running on port 3000.");
      } else {
        toast.error("Failed to load products");
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleProductAdded = () => {
    fetchProducts(); // Refresh the list
  };

  // Color categories for the sidebar
  const colorCategories = [
    { name: 'Pastel', color: 'bg-pink-400' },
    { name: 'Retro', color: 'bg-orange-400' },
    { name: 'Coffee', color: 'bg-amber-700' },
    { name: 'Forest', color: 'bg-green-500' },
    { name: 'Cyberpunk', color: 'bg-cyan-400' },
    { name: 'Synthwave', color: 'bg-purple-500' },
    { name: 'Luxury', color: 'bg-yellow-400' },
    { name: 'Autumn', color: 'bg-red-500' },
    { name: 'Valentine', color: 'bg-pink-500' },
    { name: 'Aqua', color: 'bg-teal-400' },
    { name: 'Business', color: 'bg-gray-400' },
    { name: 'Night', color: 'bg-blue-600' },
    { name: 'Dracula', color: 'bg-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Header with Add Product Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-text-primary">Home Page</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-secondary text-lg mb-4">No products found</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary"
                >
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Color Category Sidebar */}
          <div className="hidden lg:block w-48 flex-shrink-0">
            <div className="bg-dark-card rounded-xl border border-dark-border p-4 sticky top-24">
              <h3 className="text-text-secondary text-sm font-medium mb-4 uppercase tracking-wide">
                Categories
              </h3>
              <div className="space-y-2">
                {colorCategories.map((category) => (
                  <button
                    key={category.name}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-dark-hover transition-colors group"
                  >
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <span className="text-text-secondary text-sm group-hover:text-text-primary transition-colors">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default HomePage;

