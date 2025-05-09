
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

// نفترض أننا سنقرأ هذه القائمة من ملف التكوين عن طريق API في المستقبل
const defaultCensorshipRules = [
  {
    id: 1,
    original: "فلسطين",
    replacement: "فلسـطين",
    note: "إضافة فاصلة مخفية",
  },
  {
    id: 2,
    original: "حماس",
    replacement: "حمـ.ـاس",
    note: "تقسيم الكلمة بنقطة",
  },
  {
    id: 3,
    original: "الاحتلال",
    replacement: "الآحـتلال",
    note: "استخدام مد للتمويه",
  },
];

const TextCensorshipPage = () => {
  const { toast } = useToast();
  const [originalText, setOriginalText] = useState("");
  const [censoredText, setCensoredText] = useState("");
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [censorshipRules, setCensorshipRules] = useState(defaultCensorshipRules);
  const [stats, setStats] = useState({ 
    words: 0, 
    characters: 0,
    replacements: 0,
    originalWords: 0,
    originalCharacters: 0
  });

  const applyCensorship = () => {
    if (!originalText.trim()) {
      toast({
        title: "لا يوجد نص للرقابة",
        description: "يرجى إدخال نص قبل تطبيق الرقابة",
        variant: "destructive",
      });
      return;
    }

    let result = originalText;
    let replacementsCount = 0;

    censorshipRules.forEach((rule) => {
      const regex = new RegExp(rule.original, "g");
      const matches = result.match(regex);
      if (matches) {
        replacementsCount += matches.length;
      }
      result = result.replace(regex, rule.replacement);
    });

    setCensoredText(result);

    // تحديث الإحصائيات
    const originalWordCount = originalText.trim().split(/\s+/).length;
    const originalCharCount = originalText.length;
    const wordCount = result.trim().split(/\s+/).length;
    const charCount = result.length;

    setStats({
      words: wordCount,
      characters: charCount,
      replacements: replacementsCount,
      originalWords: originalWordCount,
      originalCharacters: originalCharCount
    });

    toast({
      title: "تم تطبيق الرقابة",
      description: `تم استبدال ${replacementsCount} كلمة من قائمة الرقابة`,
    });
  };

  const copyToClipboard = () => {
    if (!censoredText) {
      toast({
        title: "لا يوجد نص للنسخ",
        description: "يرجى تطبيق الرقابة على النص أولاً",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(censoredText);
    toast({
      title: "تم النسخ",
      description: "تم نسخ النص المعدّل إلى الحافظة",
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setOriginalText(newText);
    
    // تحديث إحصائيات النص الأصلي فقط
    const wordCount = newText.trim() ? newText.trim().split(/\s+/).length : 0;
    const charCount = newText.length;
    
    setStats(prev => ({
      ...prev,
      originalWords: wordCount,
      originalCharacters: charCount
    }));
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">رقابة النصوص</h1>
        <p className="text-muted-foreground mb-8">
          راجع نصوصك وطبّق عليها قواعد الرقابة المناسبة
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              محرر الرقابة
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              قواعد الرقابة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">النص الأصلي</h2>
                <Textarea
                  placeholder="أدخل النص الأصلي هنا..."
                  className="min-h-[300px] text-base"
                  value={originalText}
                  onChange={handleTextChange}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>الكلمات: {stats.originalWords}</span>
                  <span>الحروف: {stats.originalCharacters}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">النص بعد الرقابة</h2>
                <Textarea
                  placeholder="النص بعد تطبيق قواعد الرقابة سيظهر هنا..."
                  className="min-h-[300px] text-base"
                  value={censoredText}
                  readOnly
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>الكلمات: {stats.words}</span>
                  <span>الحروف: {stats.characters}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {stats.replacements > 0 && (
                  <span>تم إجراء {stats.replacements} استبدال وفقاً لقواعد الرقابة</span>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button onClick={applyCensorship} className="px-6">
                  تطبيق الرقابة
                </Button>
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  disabled={!censoredText}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  نسخ النص
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">قائمة قواعد الرقابة</h2>
                <p className="text-muted-foreground mb-6">
                  هذه القواعد يتم تطبيقها عند استخدام المرشح. يمكن للمسؤول تعديل هذه القواعد من لوحة الإدارة.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-3 px-4">الكلمة الأصلية</th>
                        <th className="text-right py-3 px-4">البديل</th>
                        <th className="text-right py-3 px-4">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {censorshipRules.map((rule) => (
                        <tr key={rule.id} className="border-b hover:bg-muted/20">
                          <td className="py-3 px-4 font-medium">{rule.original}</td>
                          <td className="py-3 px-4 text-xdesign">{rule.replacement}</td>
                          <td className="py-3 px-4 text-muted-foreground">{rule.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    لتعديل هذه القواعد، يرجى الانتقال إلى{" "}
                    <a href="/admin" className="text-primary underline">
                      لوحة الإدارة
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default TextCensorshipPage;
