import axios from "axios";

// API URL configuration - optimized for same Render service
const getApiBase = () => {
  // Use environment variable if set (optional override)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in development mode
  // import.meta.env.DEV is true in development, false in production
  // import.meta.env.MODE === 'development' is another way to check
  const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
  
  // Check if we're running on localhost (development indicator)
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // In production (same Render service), use relative URL
  // Only use relative URL if we're actually in production AND NOT on localhost
  if (import.meta.env.PROD && !isDevelopment && !isLocalhost) {
    return "/api"; // Same domain, so relative URL works
  }
  
  // Development: Use relative URL to leverage Vite proxy
  // This avoids CORS issues completely
  if (isDevelopment || isLocalhost) {
    return "/api"; // Use Vite proxy in development
  }
  
  // Fallback (shouldn't reach here in normal cases)
  return "http://localhost:3000/api";
};

const API_BASE = getApiBase();

// Log API base URL and environment info in development for debugging
if (import.meta.env.DEV) {
  console.log("🔧 API Configuration:", {
    baseURL: API_BASE,
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD,
    viteApiUrl: import.meta.env.VITE_API_URL || "not set"
  });
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging (development only)
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => {
      console.error("[API Request Error]", error);
      return Promise.reject(error);
    }
  );
}

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error in development
    if (import.meta.env.DEV) {
      console.error("[API Error]", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    }
    
    // Enhance error object with more details
    if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
      error.isNetworkError = true;
      error.userMessage = "Cannot connect to server. Please make sure the backend is running on port 3000.";
    } else if (error.response?.status === 500) {
      error.userMessage = "Server error. Please check the backend logs.";
    } else if (error.response?.status === 404) {
      error.userMessage = "API endpoint not found. Check backend routes.";
    }
    
    return Promise.reject(error);
  }
);

// Health check function to test API connection
export const testConnection = async () => {
  try {
    const response = await api.get("/health");
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        baseURL: API_BASE
      }
    };
  }
};

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
