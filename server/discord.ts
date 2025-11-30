import { ENV } from './_core/env';

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  timestamp?: string;
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
}

/**
 * ส่งข้อความไปยัง Discord Webhook
 */
export async function sendDiscordNotification(message: DiscordMessage): Promise<boolean> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.warn("[Discord] Webhook URL not configured");
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("[Discord] Failed to send notification:", response.status, response.statusText);
      return false;
    }

    console.log("[Discord] Notification sent successfully");
    return true;
  } catch (error) {
    console.error("[Discord] Error sending notification:", error);
    return false;
  }
}

/**
 * ส่งการแจ้งเตือนการสั่งซื้อใหม่ไปยัง Discord
 */
export async function notifyNewOrder(orderData: {
  orderId: number;
  studentName: string;
  studentRoom: string;
  studentNumber: string;
  studentId: string;
  totalPrice: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}): Promise<boolean> {
  const itemsText = orderData.items
    .map(item => `• ${item.name} x${item.quantity} = ${(item.price * item.quantity / 100).toFixed(2)} บาท`)
    .join('\n');

  const message: DiscordMessage = {
    content: '🎉 **มีการสั่งซื้อใหม่!**',
    embeds: [
      {
        title: `คำสั่งซื้อ #${orderData.orderId}`,
        color: 3447003, // Blue
        fields: [
          {
            name: '👤 ชื่อนักเรียน',
            value: orderData.studentName,
            inline: true,
          },
          {
            name: '🏫 ห้องเรียน',
            value: orderData.studentRoom,
            inline: true,
          },
          {
            name: '📍 เลขที่',
            value: orderData.studentNumber,
            inline: true,
          },
          {
            name: '🆔 เลขประจำตัว',
            value: orderData.studentId,
            inline: true,
          },
          {
            name: '📦 รายการสินค้า',
            value: itemsText || 'ไม่มีรายการ',
            inline: false,
          },
          {
            name: '💰 ราคารวม',
            value: `${(orderData.totalPrice / 100).toFixed(2)} บาท`,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return sendDiscordNotification(message);
}

/**
 * ส่งการแจ้งเตือนการสั่งซื้อจาก localStorage ไปยัง Discord
 */
export async function notifyOrderFromLocalStorage(orderData: {
  orderId: number;
  studentName: string;
  studentRoom: string;
  studentNumber: string;
  studentId: string;
  phoneNumber: string;
  email: string;
  totalPrice: number;
  items: Array<{ name: string; quantity: number; price: number; size: string }>;
  paymentFileName: string;
  paymentFileUrl?: string;
}): Promise<boolean> {
  const itemsText = orderData.items
    .map(item => `• ${item.name} (${item.size}) x${item.quantity} = ${item.price * item.quantity} บาท`)
    .join('\n');

  const message: DiscordMessage = {
    content: '🎉 **มีการสั่งซื้อใหม่!**',
    embeds: [
      {
        title: `คำสั่งซื้อ #${orderData.orderId}`,
        color: 3447003, // Blue
        fields: [
          {
            name: '👤 ชื่อนักเรียน',
            value: orderData.studentName,
            inline: true,
          },
          {
            name: '📞 เบอร์โทรศัพท์',
            value: orderData.phoneNumber,
            inline: true,
          },
          {
            name: '📧 อีเมล',
            value: orderData.email,
            inline: true,
          },
          {
            name: '🏫 ห้องเรียน',
            value: orderData.studentRoom,
            inline: true,
          },
          {
            name: '📍 เลขที่',
            value: orderData.studentNumber,
            inline: true,
          },
          {
            name: '🆔 เลขประจำตัว',
            value: orderData.studentId,
            inline: true,
          },
          {
            name: '📦 รายการสินค้า',
            value: itemsText || 'ไม่มีรายการ',
            inline: false,
          },
          {
            name: '💰 ราคารวม',
            value: `${orderData.totalPrice} บาท`,
            inline: false,
          },
          {
            name: '💳 สลิปโอนเงิน',
            value: orderData.paymentFileName,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return sendDiscordNotification(message);
}

/**
 * ส่งการแจ้งเตือนการอัปโหลดสลิปโอนเงินไปยัง Discord
 */
export async function notifyPaymentSlipUploaded(orderData: {
  orderId: number;
  studentName: string;
  fileName: string;
}): Promise<boolean> {
  const message: DiscordMessage = {
    content: '💳 **สลิปโอนเงินถูกอัปโหลด**',
    embeds: [
      {
        title: `คำสั่งซื้อ #${orderData.orderId}`,
        color: 65280, // Green
        fields: [
          {
            name: '👤 ชื่อนักเรียน',
            value: orderData.studentName,
            inline: false,
          },
          {
            name: '📄 ชื่อไฟล์',
            value: orderData.fileName,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return sendDiscordNotification(message);
}
