import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import './AdminPage.css'; // นำเข้าไฟล์ CSS

function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");  // ใช้สำหรับเก็บ URL ของภาพ
  const [products, setProducts] = useState([]);  // เก็บรายการสินค้าที่ดึงมาจาก Firestore
  const [orders, setOrders] = useState([]); // เก็บรายการคำสั่งซื้อ
  const [editProduct, setEditProduct] = useState(null); // สำหรับเก็บข้อมูลสินค้าที่จะทำการแก้ไข
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // สำหรับเปิดปิด Popup

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
      fetchProducts();  // รีเฟรชรายการสินค้าเมื่อเพิ่มสินค้าใหม่
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
      fetchProducts();  // รีเฟรชรายการสินค้าเมื่อมีการลบ
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
      setIsEditPopupOpen(false);  // ปิด Popup หลังจากแก้ไขสำเร็จ
      fetchProducts();  // รีเฟรชรายการสินค้า
    } catch (error) {
      console.error("Error updating product:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขสินค้า");
    }
  };

  // ดึงข้อมูลสินค้าจาก Firestore
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productsArray);  // อัปเดต state ด้วยรายการสินค้า
  };

  // ดึงข้อมูลคำสั่งซื้อจาก Firestore
  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const ordersArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersArray);  // อัปเดต state ด้วยรายการคำสั่งซื้อ
  };

  // โหลดข้อมูลสินค้าและคำสั่งซื้อเมื่อหน้าโหลด
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ฟังก์ชันสำหรับเปลี่ยนสถานะการส่ง
  const handleShippingStatusChange = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId 
      ? { ...order, shippingStatus: order.shippingStatus === 'ส่งเสร็จสิ้น' ? 'กำลังจัดส่ง' : 'ส่งเสร็จสิ้น' } 
      : order
    ));
  };

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
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-item">
              <img src={product.imageUrl} alt={product.name} />
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.price} บาท</p>
              </div>
              <div className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditProduct(product);
                    setIsEditPopupOpen(true); // เปิด Popup เพื่อแก้ไข
                  }}
                >
                  แก้ไข
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  ลบ
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>ยังไม่มีสินค้า</p>
        )}
      </div>

      {/* ฟอร์มแก้ไขสินค้า */}
      {isEditPopupOpen && (
        <div className="edit-form">
          <button
            className="close-popup-btn"
            onClick={() => setIsEditPopupOpen(false)}
          >
            X
          </button>
          <h3>แก้ไขสินค้า</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleEditProduct(); }}>
            <div className="form-group">
              <label>ชื่อสินค้า</label>
              <input
                type="text"
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                placeholder="ชื่อสินค้า"
              />
            </div>
            <div className="form-group">
              <label>ราคา</label>
              <input
                type="number"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                placeholder="ราคา"
              />
            </div>
            <div className="form-group">
              <label>URL ของรูปภาพ</label>
              <input
                type="text"
                value={editProduct.imageUrl}
                onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })}
                placeholder="URL ของรูปภาพ"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">บันทึกการเปลี่ยนแปลง</button>
            </div>
          </form>
        </div>
      )}

      <h3 className="mt-3">ประวัติคำสั่งซื้อ</h3>
      <div className="order-list mt-3">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <h4>ลูกค้า: {order.customerName}</h4>
              <ul>
                {Array.isArray(order.items) && order.items.length > 0 ? (
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

              {/* สวิตซ์สถานะการส่ง */}
              <div className="shipping-status-toggle">
                <label>
                  สถานะการส่ง:
                  <input 
                    type="checkbox" 
                    checked={order.shippingStatus === 'ส่งเสร็จสิ้น'}
                    onChange={() => handleShippingStatusChange(order.id)}
                  />
                </label>
                <span className={`status-text ${order.shippingStatus === 'ส่งเสร็จสิ้น' ? 'delivered' : 'shipping'}`}>
                  {order.shippingStatus === 'ส่งเสร็จสิ้น' ? 'ส่งเสร็จสิ้น' : 'กำลังจัดส่ง'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>ยังไม่มีคำสั่งซื้อ</p>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
