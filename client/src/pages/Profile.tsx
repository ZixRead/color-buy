import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // ถ้าไม่ใช่ admin ให้ redirect ไปหน้า home
    if (!loading && (!user || user.role !== "admin")) {
      toast.error("เฉพาะ admin เท่านั้นที่สามารถเข้าหน้านี้ได้");
      setLocation("/");
      return;
    }

    // ตั้งค่าฟอร์มจากข้อมูลผู้ใช้
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, loading, setLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: เพิ่ม API สำหรับอัปเดตโปรไฟล์
      toast.success("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>โปรไฟล์ของฉัน</CardTitle>
            <CardDescription>แก้ไขข้อมูลส่วนตัว (Admin เท่านั้น)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ข้อมูลพื้นฐาน */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ชื่อ-นามสกุล"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="อีเมล"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>บทบาท</Label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <span className="font-medium">Admin</span>
                </div>
              </div>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
                className="flex-1"
              >
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
