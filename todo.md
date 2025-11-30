# Project TODO - School Uniform Shop

## Database & Backend
- [x] เชื่อมต่อ MongoDB ด้วย URI ที่ให้มา
- [x] สร้างตารางสำหรับข้อมูลสินค้า (Products)
- [x] สร้างตารางสำหรับข้อมูลการสั่งซื้อ (Orders) พร้อมข้อมูลนักเรียน
- [x] สร้างตารางสำหรับการแนบสลิปโอนเงิน (Payment Slips)
- [x] สร้าง API สำหรับจัดการสินค้า
- [x] สร้าง API สำหรับสร้างการสั่งซื้อใหม่
- [x] สร้าง API สำหรับการแนบสลิปโอนเงิน
- [x] เชื่อมต่อ Discord Webhook สำหรับการแจ้งเตือนการสั่งซื้อ

## Frontend - หน้าเว็บ
- [x] ออกแบบและสร้างหน้า Home (แสดงสินค้า)
- [ ] สร้างหน้า Product Details (รายละเอียดสินค้า)
- [x] สร้างระบบ Shopping Cart (ตะกร้าสินค้า)
- [x] ออกแบบและสร้างหน้า Checkout (สั่งซื้อ)
- [x] สร้างฟอร์มข้อมูลนักเรียน (ชื่อ, ห้อง, เลขที่, เลขประจำตัว)
- [x] สร้างระบบการแนบสลิปโอนเงิน
- [x] สร้างหน้า Order Confirmation (ยืนยันการสั่งซื้อ)
- [x] สร้างหน้า Order History (ประวัติการสั่งซื้อ)

## Design & UX
- [x] เลือกสีและสไตล์ออกแบบ
- [x] สร้างเนวิเกชั่นบาร์
- [x] เพิ่มลูกเล่นและ animations
- [x] ตรวจสอบความสวยงามและ responsive design

## Testing & Deployment
- [ ] เขียน Unit Tests สำหรับ API
- [ ] ทดสอบการเชื่อมต่อ MongoDB
- [ ] ทดสอบ Discord Webhook
- [ ] ทดสอบการอัปโหลดสลิปโอนเงิน
- [x] เตรียมพร้อมสำหรับ Vercel Deployment
- [x] ตั้งค่า Environment Variables สำหรับ Production

## Features
- [x] ระบบการตรวจสอบสิทธิ์ (Authentication)
- [x] ระบบจัดการสินค้า (Product Management)
- [x] ระบบสั่งซื้อ (Order System)
- [x] ระบบการแนบไฟล์ (File Upload)
- [x] ระบบการแจ้งเตือน (Discord Notifications)


## Bug Fixes & Improvements
- [x] แก้ไขปัญหาการสร้างคำสั่งซื้อ (Error handling)
- [x] ปรับปรุงระบบการแนบสลิปให้ใช้งานได้จริง
- [x] เพิ่ม Error messages ที่ชัดเจน
- [x] ปรับปรุง UI/UX ของหน้า Checkout
- [x] เพิ่มการตรวจสอบความถูกต้องของข้อมูล (Validation)

## Latest Updates
- [x] ปรับปรุงให้สามารถแนบสลิปได้ในขั้นตอนกรอกข้อมูลนักเรียน (Single step checkout)


## Current Issues & Fixes
- [x] แก้ไขปัญหา "Failed to get order ID after creation"
- [x] เพิ่มระบบเลือกขนาดเสื้อ (SS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL)
- [x] เพิ่มรูป SIZE CHART ให้เห็นในหน้าเว็บ
- [x] ทดสอบให้สั่งซื้อได้ปกติ


## Bug Report - Order & Payment Slip Upload
- [x] "Failed to get order ID after creation" - แก้ไขเรียบร้อย
- [x] ไม่สามารถอัพโหลดสลิปได้ - แก้ไขเรียบร้อย


## New Features - Phase 2
- [x] เพิ่มสรุปการสั่งซื้อ (Order Summary) ในหน้า Checkout
- [x] เพิ่มปุ่มเอาออกสินค้าจากตะกร้า (Remove from cart)
- [x] เพิ่มตัวเลือกการสั่งซื้อ (สั่งให้ตัวเอง / สั่งให้เพื่อน)
- [x] สร้างหน้า Admin Dashboard
- [x] เพิ่มระบบการยืนยันสลิป (Verify payment slip)
- [x] เพิ่มระบบจัดการสินค้า (Manage products)
- [x] ปรับปรุง UI ให้สวยงาม
- [x] ทดสอบให้ใช้งานได้จริง


## Phase 3 - Profile & Admin Management
- [ ] สร้างหน้าโปรไฟล์ (Profile) ให้ผู้ใช้แก้ไขข้อมูล
- [ ] เพิ่มฟีเจอร์จัดการสินค้าในหน้า Admin (เพิ่ม/แก้ไข/ลบ)
- [ ] เพิ่มฟีเจอร์จัดการผู้ใช้ในหน้า Admin
- [ ] เพิ่มเมนูนำทาง (Navigation) ที่มีลิงก์ไปยังโปรไฟล์และ Admin
- [ ] ทดสอบให้ใช้งานได้จริง


## Phase 4 - Database Migration & Profile Update
- [x] เปลี่ยนฟูงชันจาก MongoDB เป็น Supabase PostgreSQL
- [x] สร้างตารางใหมใน Supabase และสินค้า
- [x] อัพเดต database connection string
- [ ] ย้ยข้อมูลเก่า (ถ้ามี)
- [ ] ปรับปรุงหน้าโปรไฟล์ใหเป็นของ admin เท่านั้น
- [ ] เพิ่มเมนูนำทาง (Navigation)
- [ ] ทดสอบให้ใช้งานได้จริง

## Phase 5 - Fix OAuth & localStorage Implementation
- [x] ลบการใช้ useAuth() ออกจากทุกหน้า
- [x] เปลี่ยนจาก sessionStorage เป็น localStorage สำหรับตะกร้า
- [x] ทำให้ทุกหน้าทำงานโดยไม่ต้อง authentication
- [x] ทดสอบการเพิ่มสินค้าลงตะกร้า
- [x] ทดสอบการสั่งซื้อ
- [x] ทดสอบหน้า Admin
- [x] ทดสอบประวัติการสั่งซื้อ
- [x] ตรวจสอบว่าตะกร้าเก็บข้อมูลอย่างถูกต้อง


## Phase 6 - Add Contact Fields & Discord Webhook
- [x] เพิ่มช่องโทรศัพท์ในฟอร์ม Checkout
- [x] เพิ่มช่องอีเมลในฟอร์ม Checkout
- [x] สร้าง tRPC procedure สำหรับส่ง Discord webhook
- [x] เชื่อมต่อการสั่งซื้อกับ Discord webhook
- [x] ส่งรูปสลิปโอนเงินไปยัง Discord
- [x] ทดสอบการส่ง webhook


## Phase 7 - UI Improvements
- [x] ลบปุ่ม Admin ออกจากหน้าแรก (ผู้ใช้เข้า /admin โดยตรง)


### Phase 8 - Contact, Public Orders & Product Management
- [x] เพิ่มช่องติดต่อ IG, FB ในหน้า Checkout พร้อมลิงค์
- [x] ทำให้ประวัติการสั่งซื้อแบบสาธารณะ (ทุกคนดูได้)
- [x] เพิ่ม Tab จัดการสินค้าใน Admin
- [ ] สร้างระบบเพิ่มสินค้าใหม่
- [ ] ทดสอบการเพิ่มสินค้า
- [ ] ทดสอบการแสดงประวัติการสั่งซื้อมสินค้า
- [ ] ทดสอบการแสดงประวัติการสั่งซื้อ


## Phase 9 - Implement Product Management System
- [x] สร้าง state สำหรับจัดการสินค้าใน localStorage
- [x] สร้างฟอร์มเพิ่มสินค้าใหม่ (ชื่อ, ราคา, รูป, จำนวน)
- [x] สร้างตารางแสดงสินค้าทั้งหมด
- [x] เพิ่มปุ่มแก้ไข/ลบสินค้า
- [x] เชื่อมต่อ Home ใหแสดงสินค้าจาก localStorage
- [x] ออกแบบให้สวยๆ
- [x] ทดสอบการเพิ่ม/แก้ไข/ลบสินค้า


## Phase 10 - Add Size Selection & Remove Email
- [x] เพิ่มการเลือกขนาดในฟอร์เพิ่มสินค้า
- [x] ลบช่องอีเมลออกจากฟอร์ Checkout
- [x] ปรับปรุง UI ให้สวยๆ
- [x] ทดสอบการเลือกขนาดและการสั่งซื้อ


## Phase 11 - UI/UX Enhancement
- [x] ปรับปรุง Home page ให้สวยขึ้น (สี Typography Hover Effects)
- [x] ปรับปรุง Checkout page ให้สวยขึ้น
- [x] ปรับปรุง Admin Dashboard ให้สวยขึ้น
- [x] ปรับปรุง Orders page ให้สวยขึ้น
- [x] ทดสอบแลยว่างแลงบันทึก checkpoint

## Phase 12 - Product Details Modal & Enhanced Information
- [x] เพิ่มฟิลด์ข้อมูลในสินค้า
- [x] สร้าง Modal ดูรายละเอียดสินค้า
- [x] อัพเดต Home page ใหแสดงรายละเอียด
- [x] อัพเดต Admin ฟอร์มเพิ่มฟิลด์
- [x] ทดสอบการดูรายละเอียดและการเพิ่มสินค้า


## Phase 13 - Simplify Product Information
- [x] เปลี่ยนชื่อ "โรงเรียน" เป็น "โรงเรียนสา"
- [x] ลบฟิลด์ "สาขา" ออก
- [x] ลบการแสดง "สต็อก" (จำนวนสินค้าคงเหลือ)
- [x] ทำให้อธิบายสินค้า (Description) ขึ้นและเด่นขึ้น


## Phase 14 - Make Size Selection Optional
- [x] ทำให้การเลือกขนาดเป็นตัวเลือก (ไม่บังคับ) ใน Admin
- [x] ทำให้การเลือกขนาดเป็นตัวเลือก (ไม่บังคับ) ใน Home
- [x] ทดสอบแลยว่างแลงบันทึก checkpoint

## Phase 15 - Change Section Title
- [x] เปลี่ยนหัวข้อ "สินค้าของเรา" เป็น "ซื้อเสื้อสี"
- [x] ทดสอบแลยว่างแลงบันทึก checkpoint

## Phase 16 - Require Size Selection Before Purchase
- [x] ทำให้การเลือกขนาดเป็นบังคับก่อนเพิ่มลงตะกร้า
- [x] แสดงขนาดที่เลือกในตะกร้า
- [x] แสดงขนาดในหน้า Checkout
- [x] แสดงขนาดในหน้า Orders
- [x] ทดสอบแลยว่างแลงบันทึก checkpoint

## Phase 17 - Show Size Selection Dropdown on Product Cards
- [x] เพิ่ม Dropdown เลือกขนาดโดยตรงบนการ์ดสินค้า
- [x] ทดสอบการเลือกขนาดและเพิ่มลงตะกร้า
- [x] ตรวจสอบว่าขนาดแสดงในหน้า Checkout
- [x] ตรวจสอบว่าขนาดแสดงในหน้า Orders

## Phase 18 - Change Size Selection to Button Buttons
- [x] เปลี่ยนจาก Dropdown เป็น Size Buttons (SS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL)
- [x] ปุ่มที่เลือกแสดงเป็นสีฟ้า ปุ่มที่ยังไม่เลือกแสดงเป็นสีเทา
- [x] ทดสอบการเลือกขนาดและเพิ่มลงตะกร้า
- [x] ตรวจสอบว่าขนาดแสดงในตะกร้า Checkout ถูกต้อง