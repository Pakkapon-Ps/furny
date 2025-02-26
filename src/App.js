import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Products from "./pages/Products";
import CartPage from "./pages/CartPage";
import OrderPage from "./pages/OrderPage";
import PaymentPage from "./pages/PaymentPage";
import TrackingPage from "./pages/TrackingPage";
import AdminPage from "./pages/AdminPage";
import Auth from "./pages/Auth";
import OrderHistoryPage from "./pages/OrderHistoryPage";

function Navbar({ user, cart, setShowLogin }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-logo">🛒Furny</div>
      <div className="nav-links">
        <Link to="/">Product</Link>
        <button onClick={() => navigate("/cart")}>Cart ({cart.length})</button>
        {user && <Link to="/admin">Admin</Link>}
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  // โหลดข้อมูลตะกร้าจาก Local Storage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // อัปเดต Local Storage เมื่อ Cart เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <Router>
      <Navbar user={user} cart={cart} setShowLogin={setShowLogin} />

      {/* ปุ่ม Login มุมล่างซ้าย */}
      <div className="login-button">
        {user ? (
          <button onClick={() => setUser(null)}>Logout</button>
        ) : (
          <button onClick={() => setShowLogin(true)}>Login</button>
        )}
      </div>

      {/* Popup Login */}
      {showLogin && (
        <div className="popup-overlay">
          <div className="popup-box">
            <button className="close-btn" onClick={() => setShowLogin(false)}>✖</button>
            <h2>Login</h2>
            <Auth user={user} setUser={setUser} />
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Products cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/order" element={<OrderPage cart={cart} />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/admin" element={user ? <AdminPage /> : <p>Please login to access Admin Page</p>} />
      </Routes>

      {/* CSS Styling */}
      <style>{`
        /* Dark Theme */
        body {
          background: #121212;
          color: white;
          font-family: Arial, sans-serif;
        }

        /* Navbar */
        .navbar {
          background: rgb(150, 22, 20);
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }

        .nav-logo {
          font-size: 22px;
          font-weight: bold;
          color: white;
        }

        .nav-links {
          display: flex;
          gap: 15px;
        }

        .nav-links a, .nav-links button {
          color: white;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 8px 12px;
          border-radius: 5px;
          transition: 0.3s;
        }

        .nav-links a:hover, .nav-links button:hover {
          background: white;
          color: rgb(150, 22, 20);
          font-weight: bold;
        }

        /* ปุ่ม Login มุมล่างซ้าย */
        .login-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
        }

        .login-button button {
          background: white;
          color: black;
          border: none;
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 8px;
          transition: 0.3s;
        }

        .login-button button:hover {
          background: rgb(150, 22, 20);
          color: white;
        }

        /* Popup Login */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-box {
          background: #222;
          padding: 20px;
          border-radius: 8px;
          width: 300px;
          position: relative;
          box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .popup-box h2 {
          margin-bottom: 15px;
          color: white;
        }

        .close-btn {
          position: absolute;
          transform: translate(-51.5%, -30%); /* เคลื่อนที่ไปกลางกล่อง */
          background: none;
          border: none;
          font-size: 20px; /* ขนาดปุ่มเล็กลง */
          cursor: pointer;
          color: white;
        }

        .close-btn:hover {
          color: red;
        }

        /* ฟอร์ม Login */
        .popup-box input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: none;
          border-radius: 5px;
          background: #333;
          color: white;
        }

        .popup-box button {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
          background: red;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: 0.3s;
        }

        .popup-box button:hover {
          background: darkred;
        }
      `}</style>
    </Router>
  );
}

export default App;