import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { productsAPI } from "../services/api";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productsAPI.getById(id);
        const productData = data.product || data;
        setProduct(productData);
        setFormData({
          name: productData.name || "",
          price: productData.price || "",
          image: productData.image || "",
          description: productData.description || "",
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.price || !formData.image) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setIsSaving(true);
    try {
      await productsAPI.update(id, {
        name: formData.name,
        price: price,
        image: formData.image,
        description: formData.description || "",
      });
      toast.success("Product updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${product?.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await productsAPI.delete(id);
      toast.success("Product deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-4">Product not found</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-text-secondary hover:text-neon-green transition-colors mb-6"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Product Image - Left Side */}
          <div className="lg:col-span-3">
            <div className="bg-dark-card rounded-xl border border-dark-border p-6">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-white/10">
                <img
                  src={
                    formData.image ||
                    product.image ||
                    "https://via.placeholder.com/800x800?text=No+Image"
                  }
                  alt={formData.name || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x800?text=No+Image";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Edit Form - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-dark-card rounded-xl border border-dark-border p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Edit Product
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                      $
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="input-field pl-8"
                      required
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="input-field resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn-danger flex-1 flex items-center justify-center gap-2"
                    disabled={isDeleting}
                  >
                    <FiTrash2 className="w-4 h-4" />
                    {isDeleting ? "Deleting..." : "Delete Product"}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={isSaving}
                  >
                    <FiCheck className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
