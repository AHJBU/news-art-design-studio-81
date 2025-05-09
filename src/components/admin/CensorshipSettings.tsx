
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
import { type CensorshipWord } from "../../pages/TextCensorshipPage";

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
        // تحويل البيانات إلى النوع المطلوب
        const parsedData = JSON.parse(stored);
        // التأكد من أن كل id هو نوع string
        return parsedData.map((item: any) => ({
          ...item,
          id: String(item.id)
        }));
      } catch (e) {
        console.error("Error parsing stored replacements:", e);
      }
    }
  }
  return [
    { id: "1", original: "فلسطين", replacement: "فلسـطين" },
    { id: "2", original: "حماس", replacement: "حمـ.ـاس" },
    { id: "3", original: "الاحتلال", replacement: "الآحـتلال" },
    // إضافة بعض الكلمات الجديدة كافتراضي
    { id: "4", original: "غزة", replacement: "غـ،ـزة" },
    { id: "5", original: "القدس", replacement: "القـ.ـدس" },
    { id: "6", original: "المقاومة", replacement: "المقـ.ـاومة" },
    { id: "7", original: "شهيد", replacement: "شـ،ـهيد" },
    { id: "8", original: "جهاد", replacement: "جـ.ـهاد" },
    { id: "9", original: "الضفة", replacement: "الضـ،ـفة" },
    { id: "10", original: "نابلس", replacement: "نـ.ـابلس" },
    { id: "11", original: "جنين", replacement: "جـ.ـنين" },
    { id: "12", original: "المسجد الأقصى", replacement: "المسـجد الأقـ،ـصى" },
    { id: "13", original: "حي الشيخ جراح", replacement: "حـ.ـي الشـ،ـيخ جـ.ـراح" },
    { id: "14", original: "رفح", replacement: "ر.فـ،ـح" },
    { id: "15", original: "خانيونس", replacement: "خـ،ـانيـ.ـونس" },
    { id: "16", original: "المستوطنين", replacement: "المستـ.ـوطنين" },
    { id: "17", original: "الحصار", replacement: "الحـ،ـصار" },
    { id: "18", original: "التطهير العرقي", replacement: "التطـ.ـهير العـ،ـرقي" },
    { id: "19", original: "النكبة", replacement: "النكـ،ـبة" },
    { id: "20", original: "النكسة", replacement: "النـ.ـكسة" },
    { id: "21", original: "التطبيع", replacement: "التطـ،ـبيع" },
    { id: "22", original: "جدار الفصل", replacement: "جـ.ـدار الفـ،ـصل" },
    { id: "23", original: "تهويد", replacement: "تهـ.ـويد" },
    { id: "24", original: "ضم", replacement: "ضـ،ـم" },
    { id: "25", original: "الجهاد الإسلامي", replacement: "الجـ،ـهاد الإسـ.ـلامي" },
    { id: "26", original: "كتائب القسام", replacement: "كتـ.ـائب القـ،ـسام" },
    { id: "27", original: "سرايا القدس", replacement: "سـ،ـرايا القـ.ـدس" },
    { id: "28", original: "كتائب الأقصى", replacement: "كتـ،ـائب الأقـ.ـصى" },
    { id: "29", original: "ألوية الناصر", replacement: "ألـ.ـوية النـ،ـاصر" },
    { id: "30", original: "الرد الصاروخي", replacement: "الـ،ـرد الصـ.ـاروخي" },
    { id: "31", original: "صاروخ", replacement: "صـ،ـاروخ" },
    { id: "32", original: "طائرة مسيرة", replacement: "طـ.ـائرة مسـ،ـيرة" },
    { id: "33", original: "قنص", replacement: "قـ،ـنص" },
    { id: "34", original: "اشتباك", replacement: "اشتـ.ـباك" },
    { id: "35", original: "عبوة ناسفة", replacement: "عبـ،ـوة نـ.ـاسفة" },
    { id: "36", original: "نفق", replacement: "نـ،ـفق" },
    { id: "37", original: "كمين", replacement: "كـ.ـمين" },
    { id: "38", original: "استهداف", replacement: "استـ،ـهداف" },
    { id: "39", original: "الرد الفوري", replacement: "الـ.ـرد الفـ،ـوري" },
    { id: "40", original: "العمليات الفدائية", replacement: "العمليـ.ـات الفدائـ،ـية" },
    { id: "41", original: "تحرير", replacement: "تـ،ـحرير" },
    { id: "42", original: "انتفاضة", replacement: "انتفـ.ـاضة" },
    { id: "43", original: "أسير", replacement: "أسـ،ـير" },
    { id: "44", original: "أسرى", replacement: "أسـ.ـرى" },
    { id: "45", original: "محرر", replacement: "مـ،ـحرر" },
    { id: "46", original: "معتقل", replacement: "معتـ.ـقل" },
    { id: "47", original: "محتل", replacement: "مـ،ـحتل" },
    { id: "48", original: "مجرم حرب", replacement: "مجـ.ـرم حـ،ـرب" },
    { id: "49", original: "مفقود", replacement: "مفـ،ـقود" },
    { id: "50", original: "مجزرة", replacement: "مجـ.ـزرة" },
    { id: "51", original: "إبادة", replacement: "إبـ،ـادة" },
    { id: "52", original: "الله أكبر", replacement: "اللـ.ـه أكـ،ـبر" },
    { id: "53", original: "النصر", replacement: "النـ،ـصر" },
    { id: "54", original: "معركة", replacement: "معـ.ـركة" },
    { id: "55", original: "رباط", replacement: "ربـ،ـاط" },
    { id: "56", original: "استشهاد", replacement: "استشـ.ـهاد" },
    { id: "57", original: "شهادة", replacement: "شـ،ـهادة" },
    { id: "58", original: "فداء", replacement: "فـ.ـداء" },
    { id: "59", original: "دعاء النصر", replacement: "دعـ،ـاء النـ.ـصر" },
    { id: "60", original: "وعد الآخرة", replacement: "وعـ.ـد الآخـ،ـرة" },
    { id: "61", original: "أحمد ياسين", replacement: "أحمـ،ـد يـ.ـاسين" },
    { id: "62", original: "عبد العزيز الرنتيسي", replacement: "عبـ.ـد العـ،ـزيز الرنتـ.ـيسي" },
    { id: "63", original: "يحيى السنوار", replacement: "يحـ،ـيى السنـ.ـوار" },
    { id: "64", original: "محمد الضيف", replacement: "محـ.ـمد الضـ،ـيف" },
    { id: "65", original: "خليل الوزير", replacement: "خلـ،ـيل الـ.ـوزير" },
    { id: "66", original: "أبو جهاد", replacement: "أبـ.ـو جـ،ـهاد" },
    { id: "67", original: "محمود المبحوح", replacement: "محمـ،ـود المبـ.ـحوح" },
    { id: "68", original: "عياش", replacement: "عيـ.ـاش" },
    { id: "69", original: "القائد الميداني", replacement: "القـ،ـائد الميـ.ـداني" },
    { id: "70", original: "أبو عبيدة", replacement: "أبـ.ـو عبـ،ـيدة" },
    { id: "71", original: "العدوان على غزة", replacement: "العـ،ـدوان علـ.ـى غـ،ـزة" },
    { id: "72", original: "صمت دولي", replacement: "صـ.ـمت دولـ،ـي" },
    { id: "73", original: "التواطؤ", replacement: "التـ،ـواطؤ" },
    { id: "74", original: "قصف مدنيين", replacement: "قـ.ـصف مدنـ،ـيين" },
    { id: "75", original: "جرائم إسرائيل", replacement: "جـ،ـرائم إسـ.ـرائيل" },
    { id: "76", original: "جرائم حرب", replacement: "جـ.ـرائم حـ،ـرب" },
    { id: "77", original: "استخدام الفسفور", replacement: "استخـ،ـدام الفـ.ـسفور" },
    { id: "78", original: "قصف مستشفى", replacement: "قـ.ـصف مستـ،ـشفى" },
    { id: "79", original: "إبادة عائلات", replacement: "إبـ،ـادة عـ.ـائلات" },
    { id: "80", original: "تدمير أبراج", replacement: "تدمـ.ـير أبـ،ـراج" },
    { id: "81", original: "قاطعوا إسرائيل", replacement: "قاطـ،ـعوا إسـ.ـرائيل" },
    { id: "82", original: "المقاومة مستمرة", replacement: "المقـ.ـاومة مستـ،ـمرة" },
    { id: "83", original: "الحق الفلسطيني", replacement: "الحـ،ـق الفلسـ.ـطيني" },
    { id: "84", original: "من البحر إلى النهر", replacement: "من البـ.ـحر إلـ،ـى النـ.ـهر" },
    { id: "85", original: "القضية المركزية", replacement: "القضـ،ـية المـ.ـركزية" }
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
