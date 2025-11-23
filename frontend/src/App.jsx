import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductPage />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1a1a1a",
              color: "#ffffff",
              border: "1px solid #2a2a2a",
            },
            success: {
              iconTheme: {
                primary: "#00ff88",
                secondary: "#000000",
              },
            },
            error: {
              iconTheme: {
                primary: "#ff4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
