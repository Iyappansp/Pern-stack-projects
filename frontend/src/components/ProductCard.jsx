import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/products/${product.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      if (onDelete) {
        await onDelete(product.id);
      }
    }
  };

  return (
    <div className="product-card p-4 relative group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
      {/* Product Image */}
      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 border-2 border-white/10">
        <img
          src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
      </div>

      {/* Product Name */}
      <h3 className="text-text-primary font-medium text-base mb-2 line-clamp-2 min-h-[2.5rem]">
        {product.name}
      </h3>

      {/* Price */}
      <p className="text-neon-green font-bold text-lg mb-4">
        ${parseFloat(product.price || 0).toFixed(2)}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleEdit}
          className="icon-btn-edit"
          aria-label="Edit product"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="icon-btn-delete"
          aria-label="Delete product"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

