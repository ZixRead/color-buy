import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft, BarChart3, Plus, Edit2, Trash2, TrendingUp, Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const SHIRT_SIZES = ["SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
const COLORS = ["เหลือง", "ส้ม", "เขียว", "แดง", "ฟ้า", "ชมพู"];
const SCHOOLS = ["สา",];

export default function Admin() {
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [products, setProducts] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    color: "",
    school: "",
    description: "",
    details: "",
    sizes: [] as string[],
  });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);

    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    if (savedProducts.length === 0) {
      const defaultProducts = [
        {
          id: 1,
          name: "เสื้อนักเรียนขาว",
          price: 250,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          sizes: ["S", "M", "L", "XL"],
          color: "ขาว",
          school: "สามัญศึกษา",
          description: "เสื้อนักเรียนสีขาว ผ้าคุณภาพดี",
          details: "เสื้อนักเรียนขาว ผ้า 100% คอตตอน ทำให้รู้สึกสบายและระบายอากาศได้ดี",
        },
        {
          id: 2,
          name: "กระโปรงนักเรียน",
          price: 350,
          image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
          sizes: ["S", "M", "L"],
          color: "กรม",
          school: "สามัญศึกษา",
          description: "กระโปรงนักเรียนสีกรม ผ้ากระโปรงคุณภาพ",
          details: "กระโปรงนักเรียนสีกรมเข้ม ผ้าเนื้อดี ทรงสวยมาตรฐาน",
        },
        {
          id: 3,
          name: "เนคไทนักเรียน",
          price: 80,
          image: "https://images.unsplash.com/photo-1608032158040-915481c6b69f?w=400&h=400&fit=crop",
          sizes: [],
          color: "กรม",
          school: "สามัญศึกษา",
          description: "เนคไทสีกรม ลายเรียบ",
          details: "เนคไทสีกรมเข้ม ลายเรียบ ใส่ได้ทั้งชายและหญิง",
        },
        {
          id: 4,
          name: "เสื้อกีฬานักเรียน",
          price: 200,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
          sizes: ["M", "L", "XL", "2XL"],
          color: "เขียว",
          school: "สามัญศึกษา",
          description: "เสื้อกีฬาสีเขียว ผ้าระบายอากาศ",
          details: "เสื้อกีฬาสีเขียว ผ้า Dri-fit ระบายอากาศได้ดี เหมาะสำหรับกีฬา",
        },
      ];
      setProducts(defaultProducts);
      localStorage.setItem("products", JSON.stringify(defaultProducts));
    } else {
      setProducts(savedProducts);
    }
  }, []);

  const filteredOrders = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const handleStatusChange = (orderId: number, newStatus: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast.success("อัปเดตสถานะสำเร็จ");
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.color || !newProduct.school) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const product = {
      id: editingProduct?.id || Date.now(),
      name: newProduct.name,
      price: parseInt(newProduct.price),
      image: newProduct.image || "https://via.placeholder.com/300x300",
      sizes: newProduct.sizes,
      color: newProduct.color,
      school: newProduct.school,
      description: newProduct.description,
      details: newProduct.details,
    };

    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? product : p);
      toast.success("แก้ไขสินค้าสำเร็จ");
    } else {
      updatedProducts = [...products, product];
      toast.success("เพิ่มสินค้าสำเร็จ");
    }

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setNewProduct({ name: "", price: "", image: "", color: "", school: "", description: "", details: "", sizes: [] });
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    toast.success("ลบสินค้าสำเร็จ");
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "รอการยืนยัน", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      shipped: { label: "จัดส่งแล้ว", color: "bg-purple-100 text-purple-800", icon: TrendingUp },
      completed: { label: "เสร็จสิ้น", color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800", icon: XCircle },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return config;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">คำสั่งซื้อทั้งหมด</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">รอการยืนยัน</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">เสร็จสิ้น</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">จัดส่งแล้ว</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.shipped}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 font-semibold">รายได้รวม</p>
                <p className="text-3xl font-bold text-red-600 mt-2">฿{totalRevenue}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              คำสั่งซื้อ
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Package className="w-4 h-4 mr-2" />
              จัดการสินค้า
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "confirmed", "shipped", "completed", "cancelled"].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-gradient-to-r from-blue-600 to-indigo-600" : ""}
                >
                  {status === "all" ? "ทั้งหมด" : getStatusBadge(status).label}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">ไม่มีคำสั่งซื้อในหมวดหมู่นี้</AlertDescription>
                </Alert>
              ) : (
                filteredOrders.map(order => {
                  const statusConfig = getStatusBadge(order.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-lg text-gray-900">คำสั่งซื้อ #{order.id}</h4>
                              <Badge className={`${statusConfig.color} border-0`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">👤 {order.studentName} | 📞 {order.phoneNumber}</p>
                            <p className="text-sm text-gray-600">🏫 ห้อง {order.studentRoom} เลขที่ {order.studentNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">฿{order.totalPrice}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString("th-TH")}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg mb-4 max-h-40 overflow-y-auto">
                          {order.cart?.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                              <span>{item.name} ({item.size})</span>
                              <span className="font-semibold">฿{item.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Select value={order.status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                            <SelectTrigger className="w-40 border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">รอการยืนยัน</SelectItem>
                              <SelectItem value="confirmed">ยืนยันแล้ว</SelectItem>
                              <SelectItem value="shipped">จัดส่งแล้ว</SelectItem>
                              <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                              <SelectItem value="cancelled">ยกเลิก</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Button
              onClick={() => {
                setShowAddProduct(!showAddProduct);
                setEditingProduct(null);
                setNewProduct({ name: "", price: "", image: "", color: "", school: "", description: "", details: "", sizes: [] });
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มสินค้าใหม่
            </Button>

            {showAddProduct && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle>{editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-semibold">ชื่อสินค้า</Label>
                      <Input
                        id="name"
                        placeholder="เช่น เสื้อนักเรียนขาว"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price" className="text-gray-700 font-semibold">ราคา</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="250"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image" className="text-gray-700 font-semibold">URL รูปภาพ</Label>
                    <Input
                      id="image"
                      placeholder="https://..."
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color" className="text-gray-700 font-semibold">สี</Label>
                      <Select value={newProduct.color} onValueChange={(value) => setNewProduct({ ...newProduct, color: value })}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="เลือกสี" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLORS.map((color) => (
                            <SelectItem key={color} value={color}>{color}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="school" className="text-gray-700 font-semibold">โรงเรียนสา</Label>
                      <Select value={newProduct.school} onValueChange={(value) => setNewProduct({ ...newProduct, school: value })}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="เลือกโรงเรียน" />
                        </SelectTrigger>
                        <SelectContent>
                          {SCHOOLS.map((school) => (
                            <SelectItem key={school} value={school}>{school}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-700 font-semibold">คำอธิบายสั้น</Label>
                    <Input
                      id="description"
                      placeholder="คำอธิบายสั้น ๆ"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="details" className="text-gray-700 font-semibold">รายละเอียด</Label>
                    <Textarea
                      id="details"
                      placeholder="รายละเอียดสินค้า"
                      value={newProduct.details}
                      onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
                      className="border-gray-300 focus:border-blue-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-semibold">เลือกขนาด (ไม่บังคับ)</Label>
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {SHIRT_SIZES.map(size => (
                        <Checkbox
                          key={size}
                          checked={newProduct.sizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, size] });
                            } else {
                              setNewProduct({ ...newProduct, sizes: newProduct.sizes.filter(s => s !== size) });
                            }
                          }}
                          id={size}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleAddProduct}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    >
                      {editingProduct ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสินค้า"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAddProduct(false);
                        setEditingProduct(null);
                        setNewProduct({ name: "", price: "", image: "", color: "", school: "", description: "", details: "", sizes: [] });
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-all overflow-hidden group">
                  <div className="relative overflow-hidden bg-gray-100 h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <div className="text-xs text-gray-600 mb-3 space-y-1">
                      <p>🎨 {product.color}</p>
                      <p>🏫 {product.school}</p>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold text-blue-600">฿{product.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setNewProduct({
                            name: product.name,
                            price: product.price.toString(),
                            image: product.image,
                            color: product.color || "",
                            school: product.school || "",
                            description: product.description || "",
                            details: product.details || "",
                            sizes: product.sizes || [],
                          });
                          setShowAddProduct(true);
                        }}
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        แก้ไข
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        ลบ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
