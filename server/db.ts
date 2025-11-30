import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, products, orders, orderItems, paymentSlips, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, type PaymentSlip, type InsertPaymentSlip } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const userData = {
      openId: user.openId,
      name: user.name || null,
      email: user.email || null,
      loginMethod: user.loginMethod || null,
      role: user.role || (user.openId === ENV.ownerOpenId ? 'admin' : 'user'),
      lastSignedIn: user.lastSignedIn || new Date(),
    };

    await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.openId,
      set: {
        name: userData.name,
        email: userData.email,
        loginMethod: userData.loginMethod,
        role: userData.role,
        lastSignedIn: userData.lastSignedIn,
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get products: database not available");
    return [];
  }

  return await db.select().from(products);
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get product: database not available");
    return undefined;
  }

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Order queries
export async function createOrder(order: InsertOrder): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(orders).values(order).returning({ id: orders.id });
  return result[0]?.id || 0;
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order: database not available");
    return undefined;
  }

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserOrders(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user orders: database not available");
    return [];
  }

  return await db.select().from(orders).where(eq(orders.userId, userId));
}

// Order Item queries
export async function createOrderItem(item: InsertOrderItem): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(orderItems).values(item).returning({ id: orderItems.id });
  return result[0]?.id || 0;
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get order items: database not available");
    return [];
  }

  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// Payment Slip queries
export async function createPaymentSlip(slip: InsertPaymentSlip): Promise<number> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(paymentSlips).values(slip).returning({ id: paymentSlips.id });
  return result[0]?.id || 0;
}

export async function getPaymentSlipsByOrderId(orderId: number): Promise<PaymentSlip[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get payment slips: database not available");
    return [];
  }

  return await db.select().from(paymentSlips).where(eq(paymentSlips.orderId, orderId));
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get all orders: database not available");
    return [];
  }

  return await db.select().from(orders);
}

export async function getAllPaymentSlips(): Promise<PaymentSlip[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get all payment slips: database not available");
    return [];
  }

  return await db.select().from(paymentSlips);
}
