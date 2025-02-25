import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderItems } = location.state || {};
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  if (!orderItems || orderItems.length === 0) {
    return <p>No orders found.</p>;
  }

  const handleConfirmOrder = () => {
    setShowPaymentPopup(true); // เปิด Popup
  };

  const handleCompletePayment = () => {
    setShowPaymentPopup(false); // ปิด Popup
    navigate("/tracking"); // ไปหน้า TrackingPage
  };

  return (
    <div>
      <h2>Order Details</h2>
      <ul>
        {orderItems.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={handleConfirmOrder}>Confirm Order</button>

      {/* Payment Modal */}
      {showPaymentPopup && (
        <div className="modal">
          <div className="modal-content">
            <h3>Payment</h3>
            <p>Select Payment Method:</p>
            <button onClick={handleCompletePayment}>Complete Payment</button>
            <button onClick={() => setShowPaymentPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* CSS สำหรับ Modal */}
      <style>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }
        .modal-content button {
          margin: 10px;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}

export default OrderPage;