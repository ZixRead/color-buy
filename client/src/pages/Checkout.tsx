import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Trash2, Package } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<any[]>([]);
  const [step, setStep] = useState<"checkout" | "confirmation">("checkout");
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentName: "",
    studentRoom: "",
    studentNumber: "",
    studentId: "",
    phoneNumber: "",
    instagram: "",
    facebook: "",
    notes: "",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleRemoveItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleCreateOrder = async () => {
    if (!formData.studentName || !formData.studentRoom || !formData.studentNumber || !formData.studentId || !formData.phoneNumber) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (!paymentFile) {
      setError("กรุณาแนบสลิปโอนเงิน");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newOrderId = Math.floor(Math.random() * 10000) + 1;
      setOrderId(newOrderId);
      setStep("confirmation");

      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push({
        id: newOrderId,
        ...formData,
        cart,
        totalPrice,
        paymentFile: paymentFile.name,
        createdAt: new Date().toISOString(),
        status: "pending",
      });
      localStorage.setItem("orders", JSON.stringify(orders));

      try {
        const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1444560370374148197/q-n7ASBt4lpM3A453jQXwaCqLQwSpmuytb90vc_ICDwdmV_25khWtFym2SkGX-2IgocF";

        const itemsText = cart
          .map(item => `• ${item.name} (${item.size}) x${item.quantity || 1} = ${item.price * (item.quantity || 1)} บาท`)
          .join('\n');

        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: "🎉 **มีการสั่งซื้อใหม่!**",
            embeds: [
              {
                title: `คำสั่งซื้อ #${newOrderId}`,
                color: 3447003,
                fields: [
                  { name: "👤 ชื่อนักเรียน", value: formData.studentName, inline: true },
                  { name: "📞 เบอร์โทรศัพท์", value: formData.phoneNumber, inline: true },
                  { name: "🏫 ห้องเรียน", value: formData.studentRoom, inline: true },
                  { name: "📍 เลขที่", value: formData.studentNumber, inline: true },
                  { name: "🆔 เลขประจำตัว", value: formData.studentId, inline: true },
                  { name: "📦 รายการสินค้า", value: itemsText || "ไม่มีรายการ", inline: false },
                  { name: "💰 ราคารวม", value: `${totalPrice} บาท`, inline: false },
                  { name: "💳 สลิปโอนเงิน", value: paymentFile.name, inline: false },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        });
      } catch (discordError) {
        console.error("เกิดข้อผิดพลาดในการส่ง Discord:", discordError);
      }

      toast.success("สั่งซื้อสำเร็จ!");
      localStorage.removeItem("cart");
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการสั่งซื้อ");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <CardTitle className="text-3xl">สั่งซื้อสำเร็จ!</CardTitle>
              <CardDescription className="text-green-100">เลขที่สั่งซื้อ: #{orderId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <Alert className="bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  ขอบคุณที่สั่งซื้อ เจ้าหน้าที่จะตรวจสอบสลิปและยืนยันการชำระเงินในเร็วๆนี้
                </AlertDescription>
              </Alert>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg space-y-3 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ชื่อ</p>
                    <p className="font-semibold text-gray-900">{formData.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">เบอร์โทร</p>
                    <p className="font-semibold text-gray-900">{formData.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ห้อง</p>
                    <p className="font-semibold text-gray-900">{formData.studentRoom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">เลขที่</p>
                    <p className="font-semibold text-gray-900">{formData.studentNumber}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-600 mb-3">รายการสินค้า</p>
                <div className="space-y-2">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                      <span>{item.name} ({item.size})</span>
                      <span className="font-semibold">฿{item.price * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">รวมทั้งสิ้น:</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">฿{totalPrice}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setLocation("/")} className="flex-1 border-gray-300">
                  กลับหน้าแรก
                </Button>
                <Button onClick={() => setLocation("/orders")} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  ดูประวัติการสั่งซื้อ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={() => setLocation("/")} className="mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับไปหน้าแรก
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle>ข้อมูลนักเรียน</CardTitle>
                <CardDescription className="text-blue-100">กรุณากรอกข้อมูลให้ครบถ้วน</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentName" className="text-gray-700 font-semibold">ชื่อนักเรียน</Label>
                    <Input
                      id="studentName"
                      placeholder="เช่น สมชาย ใจดี"
                      value={formData.studentName}
                      onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentRoom" className="text-gray-700 font-semibold">ห้องเรียน</Label>
                    <Input
                      id="studentRoom"
                      placeholder="เช่น 4/2"
                      value={formData.studentRoom}
                      onChange={(e) => setFormData({ ...formData, studentRoom: e.target.value })}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="studentNumber" className="text-gray-700 font-semibold">เลขที่</Label>
                    <Input
                      id="studentNumber"
                      placeholder="เช่น 30"
                      value={formData.studentNumber}
                      onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentId" className="text-gray-700 font-semibold">เลขประจำตัว</Label>
                    <Input
                      id="studentId"
                      placeholder="เช่น 11111 มี5ตัว"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="เช่น 0812345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="text-gray-700 font-semibold">Instagram จำเป็นต้องมี</Label>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/..."
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebook" className="text-gray-700 font-semibold">Facebook จำเป็นต้องมี</Label>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/..."
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-gray-700 font-semibold">หมายเหตุ (ไม่บังคับ)</Label>
                  <Textarea
                    id="notes"
                    placeholder="เพิ่มเติมข้อมูลอื่น ๆ"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Slip Upload */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
                <CardTitle>อัพโหลดสลิปโอนเงิน</CardTitle>
                <CardDescription className="text-orange-100">กรุณาอัพโหลดสลิปการโอนเงิน</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setPaymentFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="payment-file"
                  />
                  <label htmlFor="payment-file" className="cursor-pointer block">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-blue-400" />
                    <p className="text-sm text-gray-600 font-semibold">
                      {paymentFile ? paymentFile.name : "คลิกเพื่ออัพโหลด"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">รองรับไฟล์ JPG, PNG, GIF</p>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  สรุปการสั่งซื้อ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">ไม่มีสินค้า</p>
                  ) : (
                    cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-start text-sm border-b pb-3 group">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">ขนาด: {item.size}</p>
                          <p className="text-xs text-gray-500">จำนวน: {item.quantity || 1}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">฿{item.price * (item.quantity || 1)}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1 h-7"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>รวมสินค้า:</span>
                    <span className="font-bold">฿{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    <span>รวมทั้งสิ้น:</span>
                    <span>฿{totalPrice}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCreateOrder}
                  disabled={isLoading || cart.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "กำลังประมวลผล..." : "ยืนยันการสั่งซื้อ"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
