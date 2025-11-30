import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, ShoppingBag, Clock, CheckCircle, Truck, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Orders() {
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        label: "รอการยืนยัน",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        bgGradient: "from-yellow-50 to-yellow-100",
      },
      confirmed: {
        label: "ยืนยันแล้ว",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        bgGradient: "from-blue-50 to-blue-100",
      },
      shipped: {
        label: "จัดส่งแล้ว",
        color: "bg-purple-100 text-purple-800",
        icon: Truck,
        bgGradient: "from-purple-50 to-purple-100",
      },
      completed: {
        label: "สำเร็จ",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        bgGradient: "from-green-50 to-green-100",
      },
      cancelled: {
        label: "ยกเลิก",
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
        bgGradient: "from-red-50 to-red-100",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปหน้าแรก
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ประวัติการสั่งซื้อ
            </h1>
          </div>
          <p className="text-gray-600 text-lg">ดูรายการสั่งซื้อของคุณและติดตามสถานะ</p>
        </div>

        {orders.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-600 text-xl font-semibold mb-2">ยังไม่มีการสั่งซื้อ</p>
              <p className="text-gray-500 mb-6">เริ่มเลือกซื้อสินค้าเพื่อสร้างคำสั่งซื้อแรกของคุณ</p>
              <Button
                onClick={() => setLocation("/")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                เลือกซื้อสินค้า
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-semibold">คำสั่งซื้อทั้งหมด</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{orders.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-semibold">เสร็จสิ้น</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {orders.filter(o => o.status === "completed").length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-semibold">รอการยืนยัน</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {orders.filter(o => o.status === "pending").length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                const totalItems = order.cart?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0;

                return (
                  <Card
                    key={order.id}
                    className={`border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-br ${statusConfig.bgGradient}`}
                  >
                    <CardContent className="pt-6">
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">คำสั่งซื้อ #{order.id}</h3>
                            <Badge className={`${statusConfig.color} border-0 shadow-sm`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            📅 {new Date(order.createdAt).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ฿{order.totalPrice}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{totalItems} รายการ</p>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200/50">
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">ชื่อนักเรียน</p>
                          <p className="text-gray-900 font-semibold">{order.studentName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">เบอร์โทรศัพท์</p>
                          <p className="text-gray-900 font-semibold">{order.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">ห้องเรียน</p>
                          <p className="text-gray-900 font-semibold">ห้อง {order.studentRoom} เลขที่ {order.studentNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">เลขประจำตัว</p>
                          <p className="text-gray-900 font-semibold">{order.studentId}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-4 pb-4 border-b border-gray-200/50">
                        <p className="text-sm font-semibold text-gray-700 mb-3">📦 รายการสินค้า</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {order.cart?.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm bg-white/50 p-2 rounded border border-gray-200/50"
                            >
                              <div>
                                <p className="font-semibold text-gray-900">{item.name}</p>
                                <p className="text-xs text-gray-600">ขนาด: {item.size}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-blue-600">฿{item.price}</p>
                                <p className="text-xs text-gray-600">x{item.quantity || 1}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Social Links */}
                      {(order.instagram || order.facebook) && (
                        <div className="flex gap-3">
                          {order.instagram && (
                            <a
                              href={order.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded font-semibold text-sm hover:shadow-lg transition-shadow text-center"
                            >
                              📷 Instagram
                            </a>
                          )}
                          {order.facebook && (
                            <a
                              href={order.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded font-semibold text-sm hover:shadow-lg transition-shadow text-center"
                            >
                              👤 Facebook
                            </a>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
