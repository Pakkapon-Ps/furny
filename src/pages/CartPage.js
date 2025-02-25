import React from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";  // นำเข้าไฟล์ CSS

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();

  // ถ้า cart ว่าง
  if (!cart || cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  // ฟังก์ชันลบสินค้าออกจากตะกร้า
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // อัปเดต Local Storage
  };

  // ไปที่หน้า Payment
  const handleCheckout = () => {
    navigate("/payment", { state: { cart } }); // ส่งข้อมูล cart ไปยัง PaymentPage
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <span>
              {item.name} - ${item.price} x {item.quantity}
            </span>
            <button onClick={() => removeFromCart(index)} className="remove-btn">❌ Remove</button>
          </div>
        ))}
      </div>
      <button onClick={handleCheckout} className="checkout-btn">
        Checkout
      </button>
    </div>
  );
}

export default CartPage;