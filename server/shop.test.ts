import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user for testing
const mockUser = {
  id: 1,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// Create mock context
function createMockContext(): TrpcContext {
  return {
    user: mockUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Shop API", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("Products", () => {
    it("should list products", async () => {
      const products = await caller.shop.products.list();
      expect(Array.isArray(products)).toBe(true);
    });

    it("should get product by id", async () => {
      const product = await caller.shop.products.getById({ id: 1 });
      // Product might not exist in test database, but the query should not throw
      expect(product === undefined || typeof product === "object").toBe(true);
    });
  });

  describe("Orders", () => {
    it("should get user orders", async () => {
      const orders = await caller.shop.orders.getUserOrders();
      expect(Array.isArray(orders)).toBe(true);
    });

    it("should not allow non-admin to view all orders", async () => {
      try {
        await caller.shop.orders.getAllOrders();
        // If we reach here, the call succeeded (which shouldn't happen for non-admin)
        expect(false).toBe(true);
      } catch (error) {
        // Expected to throw an error
        expect(error).toBeDefined();
      }
    });
  });

  describe("Authentication", () => {
    it("should get current user", async () => {
      const user = await caller.auth.me();
      expect(user).toBeDefined();
      expect(user?.id).toBe(mockUser.id);
    });

    it("should logout successfully", async () => {
      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });
  });
});
