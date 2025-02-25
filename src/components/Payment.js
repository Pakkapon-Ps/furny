import React from "react";

function Payment({ completePayment }) {
  return (
    <div>
      <h2>Choose Payment Method</h2>
      <button onClick={() => completePayment("Credit Card")}>Credit Card</button>
      <button onClick={() => completePayment("PayPal")}>PayPal</button>
      <button onClick={() => completePayment("Bank Transfer")}>Bank Transfer</button>
    </div>
  );
}

export default Payment;
