import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaymentPage.css"; // นำเข้าไฟล์ CSS

function PaymentPage() {
  const location = useLocation();
  const { cart } = location.state || {}; // ดึงข้อมูลจาก CartPage
  const [cardNumber, setCardNumber] = useState("");
  const navigate = useNavigate();

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    // ส่งข้อมูลไปยังหน้า TrackingPage
    alert(`Payment processed with card number: ${cardNumber}`);
    navigate("/tracking"); // ไปยังหน้า TrackingPage หลังจากการชำระเงิน
  };

  return (
    <div className="payment-page-container">
      <h2>Payment</h2>
      
      <div className="qr-code-section">
        <h3>Scan QR Code to Pay</h3>
        {/* ใช้รูปภาพ QR Code */}
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png" 
          alt="QR Code for Payment" 
          className="qr-code"
        />
      </div>

      <div className="card-input-section">
        <h3>Or enter your card number</h3>
        {/* ฟอร์มกรอกหมายเลขบัตรเครดิต */}
        <form onSubmit={handleSubmitPayment}>
          <input
            type="text"
            placeholder="Enter your card number"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength="16"
            required
            className="card-input"
          />
          <button type="submit" className="submit-btn">Submit Payment</button>
        </form>
      </div>

      <div className="order-summary">
        <h3>Your Order</h3>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PaymentPage;
