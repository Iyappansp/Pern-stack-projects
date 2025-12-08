import axios from "axios";

// Automatically detect API URL based on environment
const getApiBase = () => {
  // Use environment variable if set (for production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production build, use relative URL if same domain
  // Otherwise, you MUST set VITE_API_URL environment variable
  if (import.meta.env.PROD) {
    // If frontend and backend are on same domain, use relative URL
    // If different domains, you MUST set VITE_API_URL
    return window.location.origin.includes('localhost') 
      ? "http://localhost:3000/api" 
      : "/api"; // Adjust this based on your setup
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
