import axios from "axios";

// API URL configuration - optimized for same Render service
const getApiBase = () => {
  // Use environment variable if set (optional override)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production (same Render service), use relative URL
  if (import.meta.env.PROD) {
    return "/api"; // Same domain, so relative URL works
  }
  
  // Development fallback
  return "http://localhost:3000/api";
};

const API_BASE = getApiBase();

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const productsAPI = {
  // Get all products
  getAll: async () => {
    const response = await api.get("/products");
    // Backend returns array directly
    return Array.isArray(response.data)
      ? response.data
      : response.data.products || [];
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    // Backend returns { success: true, product: {...} }
    return response.data.product || response.data;
  },

  // Create product
  create: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  // Update product
  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default api;
