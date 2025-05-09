
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// نوع لعنصر الاستبدال
type ReplacementItem = {
  id: string;
  original: string;
  replacement: string;
};

// استرجاع البيانات من التخزين المحلي
const getStoredReplacements = (): ReplacementItem[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("textCensorshipReplacements");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored replacements:", e);
      }
    }
  }
  return [
    { id: "1", original: "فلسطين", replacement: "فلسـطين" },
    { id: "2", original: "حماس", replacement: "حمـ.ـاس" },
    { id: "3", original: "الاحتلال", replacement: "الآحـتلال" },
  ];
};

const CensorshipSettings = () => {
  const { toast } = useToast();
  const [replacements, setReplacements] = useState<ReplacementItem[]>([]);
  const [newOriginal, setNewOriginal] = useState("");
  const [newReplacement, setNewReplacement] = useState("");

  // استرجاع البيانات عند تحميل المكون
  useEffect(() => {
    setReplacements(getStoredReplacements());
  }, []);

  // حفظ البيانات في التخزين المحلي عندما تتغير
  const saveReplacements = (items: ReplacementItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("textCensorshipReplacements", JSON.stringify(items));
    }
  };

  // إضافة عنصر استبدال جديد
  const handleAddReplacement = () => {
    if (!newOriginal || !newReplacement) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال النص الأصلي والبديل",
        variant: "destructive",
      });
      return;
    }

    const newItem: ReplacementItem = {
      id: Date.now().toString(),
      original: newOriginal,
      replacement: newReplacement,
    };

    const updatedReplacements = [...replacements, newItem];
    setReplacements(updatedReplacements);
    saveReplacements(updatedReplacements);
    
    setNewOriginal("");
    setNewReplacement("");

    toast({
      title: "تم الإضافة بنجاح",
      description: "تمت إضافة عنصر الاستبدال الجديد",
    });
  };

  // حذف عنصر استبدال
  const handleDeleteReplacement = (id: string) => {
    const updatedReplacements = replacements.filter((item) => item.id !== id);
    setReplacements(updatedReplacements);
    saveReplacements(updatedReplacements);

    toast({
      title: "تم الحذف",
      description: "تم حذف عنصر الاستبدال بنجاح",
    });
  };

  // تعديل عنصر استبدال
  const handleUpdateReplacement = (id: string, field: "original" | "replacement", value: string) => {
    const updatedReplacements = replacements.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setReplacements(updatedReplacements);
    saveReplacements(updatedReplacements);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>قائمة كلمات الاستبدال</CardTitle>
          <CardDescription>
            إدارة قائمة الكلمات التي سيتم استبدالها تلقائياً في نصوص التصميم
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="النص الأصلي"
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="النص البديل"
                  value={newReplacement}
                  onChange={(e) => setNewReplacement(e.target.value)}
                />
              </div>
              <div>
                <Button onClick={handleAddReplacement}>
                  <PlusCircle className="ml-1 h-4 w-4" />
                  إضافة
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>النص الأصلي</TableHead>
                    <TableHead>النص البديل</TableHead>
                    <TableHead className="w-[100px]">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {replacements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        لا توجد عناصر للعرض
                      </TableCell>
                    </TableRow>
                  ) : (
                    replacements.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.original}
                            onChange={(e) =>
                              handleUpdateReplacement(
                                item.id,
                                "original",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.replacement}
                            onChange={(e) =>
                              handleUpdateReplacement(
                                item.id,
                                "replacement",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/20"
                            onClick={() => handleDeleteReplacement(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات أداة الرقابة النصية</CardTitle>
          <CardDescription>
            ضبط خيارات عمل أداة استبدال النصوص
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="autocensor"
                className="rounded text-primary"
                defaultChecked={true}
              />
              <label htmlFor="autocensor">
                تطبيق الاستبدال تلقائياً عند إضافة نص جديد
              </label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="case-sensitive"
                className="rounded text-primary"
                defaultChecked={true}
              />
              <label htmlFor="case-sensitive">
                مراعاة حالة الأحرف (كبيرة/صغيرة) عند الاستبدال
              </label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="partial-match"
                className="rounded text-primary"
                defaultChecked={true}
              />
              <label htmlFor="partial-match">
                استبدال الكلمات ضمن النصوص الأكبر
              </label>
            </div>

            <div className="flex justify-end mt-6">
              <Button>حفظ الإعدادات</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CensorshipSettings;
