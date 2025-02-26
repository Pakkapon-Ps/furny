// AdminPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import './AdminPage.css'; // นำเข้าไฟล์ CSS

function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const navigate = useNavigate(); // สำหรับนำทาง

  // ฟังก์ชันที่ใช้สำหรับไปหน้าประวัติการสั่งซื้อ
  const goToOrderHistory = () => {
    navigate("/order-history"); // ใช้ navigate เพื่อไปหน้า OrderHistoryPage
  };

  // ฟังก์ชันเพิ่มสินค้า
  const handleAddProduct = async () => {
    if (!name || !price || !imageUrl) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
        imageUrl,
      });

      alert("เพิ่มสินค้าเรียบร้อยแล้ว!");
      setName("");
      setPrice("");
      setImageUrl("");
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  };

  // ฟังก์ชันลบสินค้า
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      alert("ลบสินค้าสำเร็จ");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  // ฟังก์ชันแก้ไขสินค้า
  const handleEditProduct = async () => {
    if (!editProduct.name || !editProduct.price || !editProduct.imageUrl) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const productRef = doc(db, "products", editProduct.id);
      await updateDoc(productRef, {
        name: editProduct.name,
        price: parseFloat(editProduct.price),
        imageUrl: editProduct.imageUrl,
      });

      alert("แก้ไขสินค้าเรียบร้อยแล้ว!");
      setIsEditPopupOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขสินค้า");
    }
  };

  // ดึงข้อมูลสินค้าจาก Firestore
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsArray);
  };

  // โหลดข้อมูลสินค้าเมื่อหน้าโหลด
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-container">
      <h2>เพิ่มสินค้าใหม่</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="ราคา"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL ของรูปภาพ"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <button className="add-product-btn" onClick={handleAddProduct}>เพิ่มสินค้า</button>

      <h3>รายการสินค้า</h3>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <img src={product.imageUrl} alt={product.name} />
            <div className="product-info">
              <h4>{product.name}</h4>
              <p>{product.price} บาท</p>
            </div>
            <div className="action-buttons">
              <button className="edit-btn" onClick={() => { setEditProduct(product); setIsEditPopupOpen(true); }}>แก้ไข</button>
              <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>ลบ</button>
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่มไปหน้าประวัติคำสั่งซื้อ */}
      <button className="view-orders-btn" onClick={goToOrderHistory}>
        ดูประวัติคำสั่งซื้อ
      </button>
    </div>
  );
}

export default AdminPage;