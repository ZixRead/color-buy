import { integer, pgEnum, pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "shipped", "completed", "cancelled"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum().default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Products table - สินค้าเสื้อผ้า
export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(), // ชื่อสินค้า
  description: text("description"), // รายละเอียดสินค้า
  price: integer("price").notNull(), // ราคา (เก็บเป็นจำนวนเต็ม เช่น 500 = 5.00 บาท)
  image: text("image"), // URL รูปภาพสินค้า
  stock: integer("stock").notNull().default(0), // จำนวนสินค้าในคลัง
  size: varchar("size", { length: 50 }), // ขนาด (S, M, L, XL)
  color: varchar("color", { length: 50 }), // สี
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Orders table - ข้อมูลการสั่งซื้อ
export const orders = pgTable("orders", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(), // ผู้ใช้ที่สั่งซื้อ
  studentName: varchar("studentName", { length: 255 }).notNull(), // ชื่อนักเรียน
  studentRoom: varchar("studentRoom", { length: 50 }).notNull(), // ห้องเรียน (เช่น 4/1, 5/2)
  studentNumber: varchar("studentNumber", { length: 50 }).notNull(), // เลขที่นักเรียน
  studentId: varchar("studentId", { length: 50 }).notNull(), // เลขประจำตัวนักเรียน
  totalPrice: integer("totalPrice").notNull(), // ราคารวม
  status: orderStatusEnum().default("pending").notNull(), // สถานะการสั่งซื้อ
  notes: text("notes"), // หมายเหตุเพิ่มเติม
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order Items table - รายการสินค้าในการสั่งซื้อ
export const orderItems = pgTable("orderItems", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("orderId").notNull(), // ลิงก์ไปยังการสั่งซื้อ
  productId: integer("productId").notNull(), // ลิงก์ไปยังสินค้า
  quantity: integer("quantity").notNull(), // จำนวนสินค้า
  price: integer("price").notNull(), // ราคาต่อหน่วย
  size: varchar("size", { length: 50 }), // ขนาดที่เลือก
  color: varchar("color", { length: 50 }), // สีที่เลือก
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Payment Slips table - สลิปโอนเงิน
export const paymentSlips = pgTable("paymentSlips", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("orderId").notNull(), // ลิงก์ไปยังการสั่งซื้อ
  fileUrl: text("fileUrl").notNull(), // URL ของไฟล์สลิป
  fileName: varchar("fileName", { length: 255 }).notNull(), // ชื่อไฟล์
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(), // เวลาที่อัปโหลด
  verified: boolean("verified").default(false).notNull(), // ยืนยันการชำระเงินแล้วหรือไม่
  verifiedAt: timestamp("verifiedAt"), // เวลาที่ยืนยัน
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PaymentSlip = typeof paymentSlips.$inferSelect;
export type InsertPaymentSlip = typeof paymentSlips.$inferInsert;
