import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Ruler, Star, Zap, X, Eye } from "lucide-react";
import { useLocation } from "wouter";

const SHIRT_SIZES = ["SS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({});
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; size: string; quantity: number }>>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);

    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    if (savedProducts.length > 0) {
      setProducts(savedProducts);
    }
  }, []);

  const mockProducts = [
    {
      id: 1,
      name: "เสื้อนักเรียนขาว",
      description: "เสื้อนักเรียนสีขาว ผ้าคุณภาพดี ใส่สะบาย เหมาะสำหรับสวมใส่ทุกวัน",
      price: 250,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      color: "ขาว",
      school: "สามัญศึกษา",
      hasSize: true,
      badge: "ยอดนิยม",
      details: "เสื้อนักเรียนขาว ผ้า 100% คอตตอน ทำให้รู้สึกสบายและระบายอากาศได้ดี มีให้เลือกหลายขนาด ตั้งแต่ SS ถึง 5XL",
    },
    {
      id: 2,
      name: "กระโปรงนักเรียน",
      description: "กระโปรงนักเรียนสีกรม ผ้ากระโปรงคุณภาพ ทรงสวย",
      price: 350,
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
      color: "กรม",
      school: "สามัญศึกษา",
      hasSize: false,
      badge: "ราคาถูก",
      details: "กระโปรงนักเรียนสีกรมเข้ม ผ้าคุณภาพสูง ทรงสวยมาตรฐาน เหมาะสำหรับนักเรียนหญิง",
    },
    {
      id: 3,
      name: "เนคไทนักเรียน",
      description: "เนคไทสีกรม สำหรับนักเรียน",
      price: 150,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
      color: "กรม",
      school: "สามัญศึกษา",
      hasSize: false,
      details: "เนคไทนักเรียนสีกรม ผ้าคุณภาพดี ยาวมาตรฐาน เหมาะสำหรับสวมใส่ประจำวัน",
    },
    {
      id: 4,
      name: "เสื้อกีฬานักเรียน",
      description: "เสื้อกีฬาสีฟ้า ผ้าระบายอากาศ",
      price: 200,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      color: "ฟ้า",
      school: "สามัญศึกษา",
      hasSize: true,
      details: "เสื้อกีฬานักเรียนสีฟ้า ผ้าระบายอากาศดี เหมาะสำหรับกิจกรรมกีฬา",
    },
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  const handleAddToCart = (product: any) => {
    if (product.hasSize && !selectedSizes[product.id]) {
      alert("กรุณาเลือกขนาดก่อนเพิ่มลงตะกร้า");
      return;
    }

    const size = selectedSizes[product.id] || "One Size";

    const existingItem = cart.find(
      (item) => item.id === product.id && item.size === size
    );

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        size: size,
        quantity: 1,
      };
      newCart = [...cart, cartItem];
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert("เพิ่มลงตะกร้าสำเร็จ!");
    setShowModal(false);
    setSelectedSizes({ ...selectedSizes, [product.id]: "" });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("กรุณาเลือกสินค้า");
      return;
    }
    setLocation("/checkout");
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              School Uniform Shop
            </h1>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setLocation("/orders")}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              ประวัติการสั่งซื้อ
            </Button>
            <Button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              สั่งซื้อ ({cart.length})
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ยินดีต้อนรับสู่ร้านค้าเสื้อสี
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-4">
            เลือกผ้านักเรียนคุณภาพดี ราคาประหยัด และสะดวกสบาย
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge className="bg-white/20 text-white border-white/30">✓ จัดส่งรวดเร็ว</Badge>
            <Badge className="bg-white/20 text-white border-white/30">✓ ปลอดภัย</Badge>
            <Badge className="bg-white/20 text-white border-white/30">✓ ราคาเป็นธรรม</Badge>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-3">ซื้อเสื้อสี</h3>
          <p className="text-gray-600 text-lg">เลือกสินค้าที่ต้องการและเพิ่มลงตะกร้า</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <Card
              key={product.id}
              className="border-0 shadow-md hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100 h-56 cursor-pointer" onClick={() => openProductModal(product)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.badge && (
                  <Badge className="absolute top-3 right-3 bg-orange-500 text-white border-0">
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <CardContent className="p-4">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-blue-600">฿{product.price}</span>
                  <div className="flex gap-2 text-xs text-gray-500">
                    {product.color && <span>🎨 {product.color}</span>}
                    {product.school && <span>🏫 {product.school}</span>}
                  </div>
                </div>

                {/* Size Selection - Show as buttons */}
                {product.hasSize && (
                  <div className="mb-4">
                    <label className="text-gray-600 text-sm font-semibold mb-2 block">
                      เลือกขนาด *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SHIRT_SIZES.map((size) => (
                        <button
                          key={size}
                          onClick={() =>
                            setSelectedSizes({ ...selectedSizes, [product.id]: size })
                          }
                          className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${selectedSizes[product.id] === size
                              ? "bg-blue-600 text-white border-2 border-blue-600 shadow-md"
                              : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    เพิ่มลงตะกร้า
                  </Button>
                  <Button
                    onClick={() => openProductModal(product)}
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Image */}
                <div className="flex items-center justify-center bg-gray-100 rounded-lg h-80">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase mb-2">ราคา</p>
                    <p className="text-4xl font-bold text-blue-600">฿{selectedProduct.price}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase mb-2">สี</p>
                    <p className="text-gray-700">{selectedProduct.color}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase mb-2">โรงเรียนสา</p>
                    <p className="text-gray-700">{selectedProduct.school}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase mb-2">รายละเอียด</p>
                    <p className="text-gray-700 text-base leading-relaxed">{selectedProduct.details || selectedProduct.description}</p>
                  </div>

                  {selectedProduct.hasSize && (
                    <div>
                      <label className="text-gray-600 text-sm font-semibold uppercase mb-2 block">
                        เลือกขนาด *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SHIRT_SIZES.map((size) => (
                          <button
                            key={size}
                            onClick={() =>
                              setSelectedSizes({ ...selectedSizes, [selectedProduct.id]: size })
                            }
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedSizes[selectedProduct.id] === size
                                ? "bg-blue-600 text-white border-2 border-blue-600 shadow-md"
                                : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    เพิ่มลงตะกร้า
                  </Button>

                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="w-full"
                  >
                    ปิด
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
