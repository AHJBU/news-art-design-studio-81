
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash, Edit, Check, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const AppearanceSettings = () => {
  const [fonts, setFonts] = useState([
    { id: 1, name: "Cairo", source: "Google Fonts", url: "https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap" },
    { id: 2, name: "Tajawal", source: "Google Fonts", url: "https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" },
    { id: 3, name: "Almarai", source: "Google Fonts", url: "https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" },
    { id: 4, name: "Changa", source: "Google Fonts", url: "https://fonts.googleapis.com/css2?family=Changa:wght@200;300;400;500;600;700;800&display=swap" },
  ]);

  const [colors, setColors] = useState([
    { id: 1, name: "أحمر", hex: "#e63946" },
    { id: 2, name: "أزرق", hex: "#1d3557" },
    { id: 3, name: "أخضر", hex: "#2a9d8f" },
    { id: 4, name: "برتقالي", hex: "#f77f00" },
    { id: 5, name: "أرجواني", hex: "#7209b7" },
  ]);

  const [newFont, setNewFont] = useState({ name: "", url: "", source: "" });
  const [editingFont, setEditingFont] = useState<number | null>(null);

  const [defaultSettings, setDefaultSettings] = useState({
    defaultTheme: "light",
    defaultFont: "Cairo",
    defaultFontSize: "18",
    defaultColor: "#1d3557",
    defaultAlignment: "right",
  });

  const handleAddFont = () => {
    if (newFont.name && (newFont.url || newFont.source)) {
      setFonts([...fonts, { ...newFont, id: Date.now() }]);
      setNewFont({ name: "", url: "", source: "" });
    }
  };

  const handleDeleteFont = (id: number) => {
    setFonts(fonts.filter((font) => font.id !== id));
  };

  const handleEditColor = (id: number, hex: string) => {
    setColors(
      colors.map((color) => (color.id === id ? { ...color, hex } : color))
    );
  };

  const saveChanges = () => {
    // هنا سيتم إرسال البيانات إلى واجهة برمجة التطبيقات (API)
    console.log("Saving appearance settings...");
    // تم الحفظ بنجاح - إضافة رسالة نجاح هنا
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>إدارة الخطوط</CardTitle>
          <CardDescription>
            تعديل الخطوط المتاحة في التطبيق أو إضافة خطوط جديدة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-96 mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الخط</TableHead>
                  <TableHead>المصدر</TableHead>
                  <TableHead>الرابط</TableHead>
                  <TableHead className="w-24">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fonts.map((font) => (
                  <TableRow key={font.id}>
                    <TableCell className="font-bold">{font.name}</TableCell>
                    <TableCell>{font.source}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {font.url}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingFont(font.id === editingFont ? null : font.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFont(font.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <Label htmlFor="fontName">اسم الخط</Label>
              <Input
                id="fontName"
                value={newFont.name}
                onChange={(e) =>
                  setNewFont({ ...newFont, name: e.target.value })
                }
                placeholder="اسم الخط"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fontSource">المصدر</Label>
              <Input
                id="fontSource"
                value={newFont.source}
                onChange={(e) =>
                  setNewFont({ ...newFont, source: e.target.value })
                }
                placeholder="مثال: Google Fonts"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fontUrl">رابط CSS</Label>
              <Input
                id="fontUrl"
                value={newFont.url}
                onChange={(e) =>
                  setNewFont({ ...newFont, url: e.target.value })
                }
                placeholder="رابط ملف CSS الخاص بالخط"
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleAddFont} className="mt-4">
            <Plus className="ml-2" /> إضافة خط جديد
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الألوان الرئيسية</CardTitle>
          <CardDescription>تعديل الألوان الرئيسية المستخدمة في التطبيق</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colors.map((color) => (
              <div key={color.id} className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-md mb-2 border"
                  style={{ backgroundColor: color.hex }}
                ></div>
                <span className="mb-1 text-sm font-medium">{color.name}</span>
                <Input
                  type="color"
                  value={color.hex}
                  onChange={(e) => handleEditColor(color.id, e.target.value)}
                  className="w-20 h-8"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات النص الافتراضية</CardTitle>
          <CardDescription>
            تعديل الإعدادات الافتراضية للنصوص المضافة في التطبيق
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label htmlFor="defaultFont">الخط الافتراضي</Label>
              <Select
                value={defaultSettings.defaultFont}
                onValueChange={(value) =>
                  setDefaultSettings({ ...defaultSettings, defaultFont: value })
                }
              >
                <SelectTrigger id="defaultFont" className="w-full mt-1">
                  <SelectValue placeholder="اختر الخط الافتراضي" />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font.id} value={font.name}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fontSize">حجم الخط الافتراضي</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="fontSize"
                  type="number"
                  value={defaultSettings.defaultFontSize}
                  onChange={(e) =>
                    setDefaultSettings({
                      ...defaultSettings,
                      defaultFontSize: e.target.value,
                    })
                  }
                  min="10"
                  max="72"
                />
                <span className="mr-2">بكسل</span>
              </div>
            </div>

            <div>
              <Label htmlFor="defaultColor">اللون الافتراضي</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="defaultColor"
                  type="color"
                  value={defaultSettings.defaultColor}
                  onChange={(e) =>
                    setDefaultSettings({
                      ...defaultSettings,
                      defaultColor: e.target.value,
                    })
                  }
                  className="w-16 h-10"
                />
                <Input
                  value={defaultSettings.defaultColor}
                  onChange={(e) =>
                    setDefaultSettings({
                      ...defaultSettings,
                      defaultColor: e.target.value,
                    })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>محاذاة النص الافتراضية</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <RadioGroup
                    value={defaultSettings.defaultAlignment}
                    onValueChange={(value) =>
                      setDefaultSettings({
                        ...defaultSettings,
                        defaultAlignment: value,
                      })
                    }
                    className="flex flex-row gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="right" id="alignment-right" />
                      <Label htmlFor="alignment-right">يمين</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="center" id="alignment-center" />
                      <Label htmlFor="alignment-center">وسط</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="left" id="alignment-left" />
                      <Label htmlFor="alignment-left">يسار</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات المظهر العام</CardTitle>
          <CardDescription>تعديل إعدادات المظهر العام للتطبيق</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>السمة الافتراضية</Label>
              <RadioGroup
                value={defaultSettings.defaultTheme}
                onValueChange={(value) =>
                  setDefaultSettings({
                    ...defaultSettings,
                    defaultTheme: value,
                  })
                }
                className="flex flex-row gap-4 mt-2"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light">فاتح</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark">داكن</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">إلغاء</Button>
        <Button onClick={saveChanges}>حفظ التغييرات</Button>
      </div>
    </div>
  );
};
