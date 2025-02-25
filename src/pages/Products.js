import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import './Products.css';

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    let updatedCart;
    if (existingProduct) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    console.log("Product added:", product, "Quantity:", quantity);
  };

  const goToCartPage = () => {
    navigate("/cart");
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="product-container">
      {products.length > 0 ? (
        <div className="product-card-container">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="quantity-input"
                />
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>ไม่มีสินค้าในระบบ</p>
      )}
      <button onClick={goToCartPage} className="go-to-cart-btn">Go to Cart</button>
    </div>
  );
}

export default Products;