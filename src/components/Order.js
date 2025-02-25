import React from "react";

function Order({ cart, confirmOrder }) {
  return (
    <div>
      <h2>Order Summary</h2>
      {cart.map((item, index) => (
        <div key={index}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>
        </div>
      ))}
      <button onClick={confirmOrder}>Confirm Order</button>
    </div>
  );
}

export default Order;
