import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db, collection, addDoc } from "../firebase/firebaseConfig"; // นำเข้า addDoc
import "./PaymentPage.css";

function PaymentPage() {
  const location = useLocation();
  const { cart } = location.state || {}; // ดึงข้อมูลจาก CartPage
  const [cardNumber, setCardNumber] = useState("");
  const navigate = useNavigate();

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    // สร้างข้อมูลคำสั่งซื้อที่ต้องการบันทึก
    const orderData = {
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      paymentStatus: "Paid", // แสดงสถานะการชำระเงิน
      paymentMethod: "Credit Card", // หรือ QR Code, หรือวิธีอื่นๆ
      cardNumber: cardNumber, // จะเก็บหมายเลขบัตรเครดิต
      createdAt: new Date(),
    };

    try {
      // บันทึกคำสั่งซื้อไปยัง Firestore
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order added with ID: ", docRef.id);

      // แสดงข้อความหรือไปยังหน้าต่างการติดตามคำสั่งซื้อ
      alert("Payment processed successfully!");
      navigate("/tracking"); // ไปยังหน้า TrackingPage หลังจากการชำระเงิน
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="payment-page-container">
      <h2>Payment</h2>

      <div className="qr-code-section">
        <h3>Scan QR Code to Pay</h3>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png"
          alt="QR Code for Payment"
          className="qr-code"
        />
      </div>

      <div className="card-input-section">
        <h3>Or enter your card number</h3>
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
        <p>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
      </div>
    </div>
  );
}

export default PaymentPage;
