import { useState } from 'react';
import { FiX, FiPackage, FiDollarSign, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { productsAPI } from '../services/api';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.price || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate price
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsLoading(true);
    try {
      await productsAPI.create({
        name: formData.name,
        price: price,
        image: formData.image,
        description: formData.description || '',
      });
      
      toast.success('Product added successfully!');
      setFormData({ name: '', price: '', image: '', description: '' });
      if (onProductAdded) {
        onProductAdded();
      }
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-dark-card rounded-xl border border-dark-border w-full max-w-md mx-4 p-6 relative shadow-neon-green-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-dark-hover transition-colors"
          aria-label="Close modal"
        >
          <FiX className="w-5 h-5 text-text-secondary" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-text-primary mb-6">Add New Product</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Product Name
            </label>
            <div className="relative">
              <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Price
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Image URL
            </label>
            <div className="relative">
              <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-text-secondary text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
              className="input-field resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;

