import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import './Products.css';

function Products({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [quantityByProduct, setQuantityByProduct] = useState({}); // สร้าง state เพื่อเก็บ quantity สำหรับแต่ละสินค้า
  const navigate = useNavigate();

  const handleQuantityChange = (productId, quantity) => {
    setQuantityByProduct((prevState) => ({
      ...prevState,
      [productId]: quantity
    }));
  };

  const addToCart = (product) => {
    const quantity = quantityByProduct[product.id] || 1; // ใช้ค่า quantity ที่กำหนดหรือ 1 หากไม่ได้กำหนด
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
                  value={quantityByProduct[product.id] || 1} // แสดงค่า quantity สำหรับสินค้านั้นๆ
                  min="1"
                  onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
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
