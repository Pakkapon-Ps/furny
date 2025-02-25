import React, { useState } from 'react';
import { db, storage } from './firebase'; // อ้างอิงจากการเชื่อมต่อ Firebase
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function AdminPanel() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  // ฟังก์ชันสำหรับการอัปโหลดรูปภาพไปที่ Firebase Storage
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // ฟังก์ชันเพิ่มสินค้าไปที่ Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !description || !image) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // อัปโหลดรูปภาพไปที่ Firebase Storage
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Error uploading image:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // เพิ่มข้อมูลสินค้าลง Firestore
        try {
          await addDoc(collection(db, "products"), {
            name,
            price: parseFloat(price),
            description,
            imageUrl: downloadURL,
          });
          alert("สินค้าเพิ่มสำเร็จ");
          setName('');
          setPrice('');
          setDescription('');
          setImage(null);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    );
  };

  return (
    <div>
      <h2>Admin Panel - เพิ่มสินค้า</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ชื่อสินค้า:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ราคา:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>รายละเอียดสินค้า:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>อัปโหลดรูปภาพ:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
        </div>
        <button type="submit">เพิ่มสินค้า</button>
      </form>
    </div>
  );
}

export default AdminPanel;