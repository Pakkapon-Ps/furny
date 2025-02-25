import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loadingGif from "./loading.gif"; // นำเข้า GIF
import "./TrackingPage.css";

function TrackingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // ตั้งเวลาให้แสดงสถานะ Loading หลังจาก 3 วินาที
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // เปลี่ยนสถานะเป็นไม่โหลดหลังจาก 3 วินาที
    }, 3000); // 3 วินาที

    return () => clearTimeout(timer); // ลบ timer เมื่อออกจากหน้า
  }, []);

  // หากไม่อยู่ในสถานะการโหลด จะนำไปยังหน้า "Your Order has been Shipped"
  if (!loading) {
    return (
      <div className="tracking-container">
        <h2>Your Order is on the way!</h2>
        <p>Tracking your delivery...</p>
        <div>
          <h3>Status: Shipped</h3>
          <p>Your order is on the way and will be delivered soon.</p>
          <button onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-container">
      <h2>Tracking Your Order</h2>
      <p>Loading...</p>
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
      <p>Please wait while we process your order.</p>
    </div>
  );
}

export default TrackingPage;