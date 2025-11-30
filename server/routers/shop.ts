import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  getAllProducts,
  getProductById,
  createOrder,
  getOrderById,
  getUserOrders,
  createOrderItem,
  getOrderItems,
  createPaymentSlip,
  getPaymentSlipsByOrderId,
  getAllOrders,
  getAllPaymentSlips,
} from "../db";
import { notifyNewOrder, notifyPaymentSlipUploaded } from "../discord";
import { storagePut, storageGet } from "../storage";

export const shopRouter = router({
  // Products
  products: router({
    list: publicProcedure.query(async () => {
      return getAllProducts();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getProductById(input.id);
      }),
  }),

  // Orders
  orders: router({
    create: protectedProcedure
      .input(
        z.object({
          studentName: z.string().min(1, "ต้องระบุชื่อนักเรียน"),
          studentRoom: z.string().min(1, "ต้องระบุห้องเรียน"),
          studentNumber: z.string().min(1, "ต้องระบุเลขที่"),
          studentId: z.string().min(1, "ต้องระบุเลขประจำตัว"),
          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number().min(1),
              price: z.number(),
              size: z.string().optional(),
              color: z.string().optional(),
            })
          ),
          totalPrice: z.number(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Create order
          const orderResult = await createOrder({
            userId: ctx.user.id,
            studentName: input.studentName,
            studentRoom: input.studentRoom,
            studentNumber: input.studentNumber,
            studentId: input.studentId,
            totalPrice: input.totalPrice,
            notes: input.notes,
            status: "pending",
          });

          // Get the created order ID
          const orderId = (orderResult as any).id || (orderResult as any).insertId;

          // Create order items
          if (!orderId) {
            console.error("Order result:", orderResult);
            throw new Error("Failed to get order ID after creation");
          }
          
          for (const item of input.items) {
            try {
              await createOrderItem({
                orderId: orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color,
              });
            } catch (itemError) {
              console.error("Error creating order item:", itemError);
              throw itemError;
            }
          }

          // Get product details for Discord notification
          const orderItems = await getOrderItems(orderId);
          const itemsWithDetails = await Promise.all(
            orderItems.map(async (item) => {
              const product = await getProductById(item.productId);
              return {
                name: product?.name || "Unknown",
                quantity: item.quantity,
                price: item.price,
              };
            })
          );

          // Send Discord notification
          await notifyNewOrder({
            orderId,
            studentName: input.studentName,
            studentRoom: input.studentRoom,
            studentNumber: input.studentNumber,
            studentId: input.studentId,
            totalPrice: input.totalPrice,
            items: itemsWithDetails,
          });

          return { orderId, success: true };
        } catch (error) {
          console.error("Error creating order:", error);
          throw error;
        }
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getOrderById(input.id);
      }),

    getUserOrders: protectedProcedure.query(async ({ ctx }) => {
      return getUserOrders(ctx.user.id);
    }),

    getAllOrders: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can view all orders
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return getAllOrders();
    }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(["pending", "confirmed", "shipped", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Only admin can update order status
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized");
        }
        throw new Error("Not implemented");
      }),

    getItems: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        return getOrderItems(input.orderId);
      }),
  }),

  // Payment Slips
  paymentSlips: router({
    upload: protectedProcedure
      .input(
        z.object({
          orderId: z.number(),
          file: z.instanceof(File),
          studentName: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Convert file to buffer
          const buffer = await input.file.arrayBuffer();

          // Upload to S3
          const fileKey = `payment-slips/${input.orderId}-${Date.now()}-${input.file.name}`;
          const { url } = await storagePut(fileKey, Buffer.from(buffer), input.file.type);

          // Save payment slip to database
          await createPaymentSlip({
            orderId: input.orderId,
            fileUrl: url,
            fileName: input.file.name,
          });

          // Send Discord notification
          await notifyPaymentSlipUploaded({
            orderId: input.orderId,
            studentName: input.studentName,
            fileName: input.file.name,
          });

          return { success: true, url };
        } catch (error) {
          console.error("Error uploading payment slip:", error);
          throw error;
        }
      }),

    getByOrderId: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const slips = await getPaymentSlipsByOrderId(input.orderId);
        return slips.length > 0 ? slips[0] : null;
      }),

    getUrl: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input }) => {
        const slips = await getPaymentSlipsByOrderId(input.orderId);
        if (slips.length === 0) return null;
        const slip = slips[0];
        return { url: slip.fileUrl, verified: slip.verified };
      }),
  }),
});
