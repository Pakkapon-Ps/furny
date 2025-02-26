import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, "orders"); // ชื่อคอลเลกชัน Firebase ที่เก็บคำสั่งซื้อ
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
    };

    fetchOrders();
  }, []); // useEffect จะทำงานแค่ครั้งเดียวเมื่อ component ถูก mount

  const handleStatusChange = async (orderId, newStatus) => {
    const orderDoc = doc(db, "orders", orderId);
    await updateDoc(orderDoc, {
      status: newStatus,
    });
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleDeleteOrder = async (orderId) => {
    const orderDoc = doc(db, "orders", orderId);
    await deleteDoc(orderDoc);
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };

  // ฟังก์ชันสำหรับการแสดงสีของสถานะคำสั่งซื้อ
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f0ad4e"; // สีส้ม
      case "Processing":
        return "#5bc0de"; // สีน้ำเงินอ่อน
      case "Shipped":
        return "#0275d8"; // สีน้ำเงิน
      case "Delivered":
        return "#28a745"; // สีเขียว
      default:
        return "#f0ad4e"; // สีเริ่มต้น (ถ้าไม่มีสถานะ)
    }
  };

  return (
    <div>
      <h3 className="mt-3">ประวัติคำสั่งซื้อ</h3>
      <div className="order-list mt-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <h4>ลูกค้า: {order.customerName}</h4>
              <ul>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.price} บาท x {item.quantity}
                    </li>
                  ))
                ) : (
                  <p>ไม่มีรายการสินค้าในคำสั่งซื้อ</p>
                )}
              </ul>
              <p>ราคารวม: {order.total} บาท</p>
              <p>สถานะการชำระเงิน: {order.paymentStatus}</p>
              <p>วิธีการชำระเงิน: {order.paymentMethod}</p>
              <p>วันที่สั่งซื้อ: {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : "ไม่ระบุ"}</p>

              {/* สถานะคำสั่งซื้อ Dropdown */}
              <div className="status-dropdown">
                <label>สถานะคำสั่งซื้อ:</label>
                <select
                  value={order.status || "Pending"} // ถ้าไม่มีสถานะใน Firestore จะใช้ Pending เป็นค่าเริ่มต้น
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <p>สถานะปัจจุบัน: <span style={{ color: getStatusColor(order.status) }}>{order.status}</span></p>
              </div>

              {/* ปุ่มลบคำสั่งซื้อ */}
              <button
                onClick={() => handleDeleteOrder(order.id)}
                style={{ backgroundColor: "#d9534f", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
              >
                ลบคำสั่งซื้อ
              </button>
            </div>
          ))
        ) : (
          <p>ยังไม่มีคำสั่งซื้อ</p>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryPage;