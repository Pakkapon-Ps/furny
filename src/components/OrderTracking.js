import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function OrderTracking() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, "orders"));
      setOrders(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Order Tracking</h2>
      {orders.map((order, index) => (
        <div key={index}>
          <h3>Order ID: {order.id}</h3>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderTracking;
