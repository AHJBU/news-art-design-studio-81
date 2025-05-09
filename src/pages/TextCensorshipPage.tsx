import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { ArrowDown, Save } from 'lucide-react';

// تعريف نوع CensorshipWord هنا
export type CensorshipWord = {
  id: number | string;
  original: string;
  replacement: string;
};

const TextCensorshipPage = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [censorshipWords, setCensorshipWords] = useState<CensorshipWord[]>([
    { id: 1, original: "فلسطين", replacement: "فلسـطين" },
    { id: 2, original: "حماس", replacement: "حمـ.ـاس" },
    { id: 3, original: "الاحتلال", replacement: "الآحـتلال" },
    // إضافة الكلمات الجديدة هنا مع تأثيرات عشوائية
    { id: 4, original: "غزة", replacement: "غـ،ـزة" },
    { id: 5, original: "الضفة", replacement: "الضـ.ـفة" },
    { id: 6, original: "نابلس", replacement: "نابـ،ـلس" },
    { id: 7, original: "جنين", replacement: "جـ.ـنين" },
    { id: 8, original: "القدس", replacement: "القـ.ـدس" },
    { id: 9, original: "المسجد الأقصى", replacement: "المسـجد الأقـ،ـصى" },
    { id: 10, original: "حي الشيخ جراح", replacement: "حـي الشيـخ جـ.ـراح" },
    { id: 11, original: "رفح", replacement: "رفـ،ـح" },
    { id: 12, original: "خانيونس", replacement: "خـ.ـانيونـ،ـس" },
    { id: 13, original: "المستوطنين", replacement: "المستـ،ـوطنين" },
    { id: 14, original: "الحصار", replacement: "الحـ.ـصار" },
    { id: 15, original: "التطهير العرقي", replacement: "التطـ،ـهير العـرقي" },
    { id: 16, original: "النكبة", replacement: "النكـ.ـبة" },
    { id: 17, original: "النكسة", replacement: "النكـ،ـسة" },
    { id: 18, original: "التطبيع", replacement: "التـ.ـطبيع" },
    { id: 19, original: "جدار الفصل", replacement: "جـ،ـدار الفـصل" },
    { id: 20, original: "تهويد", replacement: "تهـ.ـويد" },
    { id: 21, original: "ضم", replacement: "ضـ،ـم" },
    { id: 22, original: "المقاومة", replacement: "المقـ.ـاومة" },
    { id: 23, original: "الجهاد الإسلامي", replacement: "الجـ،ـهاد الإسـلامي" },
    { id: 24, original: "كتائب القسام", replacement: "كـ.ـتائب القـ،ـسام" },
    { id: 25, original: "سرايا القدس", replacement: "سـرايا القـ.ـدس" },
    { id: 26, original: "كتائب الأقصى", replacement: "كـ،ـتائب الأقـ،ـصى" },
    { id: 27, original: "ألوية الناصر", replacement: "ألـ.ـوية الناصـ،ـر" },
    { id: 28, original: "الرد الصاروخي", replacement: "الـرد الصـ.ـاروخي" },
    { id: 29, original: "صاروخ", replacement: "صـ،ـاروخ" },
    { id: 30, original: "طائرة مسيرة", replacement: "طـ.ـائرة مسـ،ـيرة" },
    { id: 31, original: "قنص", replacement: "قـ،ـنص" },
    { id: 32, original: "اشتباك", replacement: "اشتـ.ـباك" },
    { id: 33, original: "عبوة ناسفة", replacement: "عـ،ـبوة ناسـ.ـفة" },
    { id: 34, original: "نفق", replacement: "نـ،ـفق" },
    { id: 35, original: "كمين", replacement: "كـ.ـمين" },
    { id: 36, original: "استهداف", replacement: "استـ،ـهداف" },
    { id: 37, original: "الرد الفوري", replacement: "الـ.ـرد الفـ،ـوري" },
    { id: 38, original: "العمليات الفدائية", replacement: "العمـ.ـليات الفـ،ـدائية" },
    { id: 39, original: "تحرير", replacement: "تـ،ـحرير" },
    { id: 40, original: "انتفاضة", replacement: "انتفـ.ـاضة" },
    { id: 41, original: "شهيد", replacement: "شـ،ـهيد" },
    { id: 42, original: "أسير", replacement: "أسـ.ـير" },
    { id: 43, original: "أسرى", replacement: "أسـ،ـرى" },
    { id: 44, original: "محرر", replacement: "مـ.ـحرر" },
    { id: 45, original: "معتقل", replacement: "معتـ،ـقل" },
    { id: 46, original: "محتل", replacement: "مـ.ـحتل" },
    { id: 47, original: "مجرم حرب", replacement: "مـ،ـجرم حـ.ـرب" },
    { id: 48, original: "مفقود", replacement: "مفـ،ـقود" },
    { id: 49, original: "مجزرة", replacement: "مـ.ـجزرة" },
    { id: 50, original: "إبادة", replacement: "إبـ،ـادة" },
    { id: 51, original: "جهاد", replacement: "جـ.ـهاد" },
    { id: 52, original: "الله أكبر", replacement: "اللـ،ـه أكـ.ـبر" },
    { id: 53, original: "النصر", replacement: "النـ،ـصر" },
    { id: 54, original: "معركة", replacement: "معـ.ـركة" },
    { id: 55, original: "رباط", replacement: "ربـ،ـاط" },
    { id: 56, original: "استشهاد", replacement: "استشـ.ـهاد" },
    { id: 57, original: "شهادة", replacement: "شـ،ـهادة" },
    { id: 58, original: "فداء", replacement: "فـ.ـداء" },
    { id: 59, original: "دعاء النصر", replacement: "دعـ،ـاء النـ.ـصر" },
    { id: 60, original: "وعد الآخرة", replacement: "وعـ.ـد الآخـ،ـرة" },
    { id: 61, original: "أحمد ياسين", replacement: "أحـ.ـمد ياسـ،ـين" },
    { id: 62, original: "عبد العزيز الرنتيسي", replacement: "عـ،ـبد العـ.ـزيز الرنتـ،ـيسي" },
    { id: 63, original: "يحيى السنوار", replacement: "يحـ.ـيى السنـ،ـوار" },
    { id: 64, original: "محمد الضيف", replacement: "محـ،ـمد الضـ.ـيف" },
    { id: 65, original: "خليل الوزير", replacement: "خـ.ـليل الـ،ـوزير" },
    { id: 66, original: "أبو جهاد", replacement: "أبـ،ـو جـ.ـهاد" },
    { id: 67, original: "محمود المبحوح", replacement: "محـ.ـمود المبحـ،ـوح" },
    { id: 68, original: "عياش", replacement: "عيـ،ـاش" },
    { id: 69, original: "القائد الميداني", replacement: "القـ.ـائد الميـ،ـداني" },
    { id: 70, original: "أبو عبيدة", replacement: "أبـ،ـو عبـ.ـيدة" },
    { id: 71, original: "العدوان على غزة", replacement: "العـ،ـدوان على غـ.ـزة" },
    { id: 72, original: "صمت دولي", replacement: "صـ.ـمت دولـ،ـي" },
    { id: 73, original: "التواطؤ", replacement: "التـ،ـواطؤ" },
    { id: 74, original: "قصف مدنيين", replacement: "قـ.ـصف مدنيـ،ـين" },
    { id: 75, original: "جرائم إسرائيل", replacement: "جـ،ـرائم إسـ.ـرائيل" },
    { id: 76, original: "جرائم حرب", replacement: "جـ.ـرائم حـ،ـرب" },
    { id: 77, original: "استخدام الفسفور", replacement: "استخـ،ـدام الفسـ.ـفور" },
    { id: 78, original: "قصف مستشفى", replacement: "قـ.ـصف مستشـ،ـفى" },
    { id: 79, original: "إبادة عائلات", replacement: "إبـ،ـادة عائـ.ـلات" },
    { id: 80, original: "تدمير أبراج", replacement: "تدمـ.ـير أبـ،ـراج" },
    { id: 81, original: "قاطعوا إسرائيل", replacement: "قاطـ،ـعوا إسـ.ـرائيل" },
    { id: 82, original: "المقاومة مستمرة", replacement: "المقـ.ـاومة مستـ،ـمرة" },
    { id: 83, original: "الحق الفلسطيني", replacement: "الحـ،ـق الفلسـ.ـطيني" },
    { id: 84, original: "من البحر إلى النهر", replacement: "من البـ.ـحر إلى النـ،ـهر" },
    { id: 85, original: "القضية المركزية", replacement: "القضـ،ـية المـ.ـركزية" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // جلب قائمة كلمات الرقابة عند تحميل الصفحة
  useEffect(() => {
    // محاولة قراءة البيانات من localStorage أولاً (للاستخدام بدون API)
    const savedWords = localStorage.getItem('censorshipWords');
    if (savedWords) {
      try {
        const parsedWords = JSON.parse(savedWords);
        if (Array.isArray(parsedWords) && parsedWords.length > 0) {
          setCensorshipWords(parsedWords);
          return;
        }
      } catch (error) {
        console.error("Error parsing stored censorship words:", error);
      }
    }

    // إذا لم يتم العثور على بيانات في localStorage، جرب طلب البيانات من الخادم
    fetch('/api/censorship/words')
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('Failed to fetch censorship words');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCensorshipWords(data);
        }
      })
      .catch(error => {
        console.error('Error fetching censorship words:', error);
        // استخدام القائمة الافتراضية في حال فشل الطلب
      });
  }, []);

  // حساب عدد الكلمات والأحرف عند تغيير النص
  useEffect(() => {
    setCharCount(inputText.length);
    setWordCount(inputText.trim() ? inputText.trim().split(/\s+/).length : 0);
  }, [inputText]);

  // تطبيق قواعد الرقابة على النص
  const applyCensorship = () => {
    setIsLoading(true);
    let censoredText = inputText;

    // تطبيق جميع قواعد الرقابة
    censorshipWords.forEach(word => {
      const regex = new RegExp(word.original, 'g');
      censoredText = censoredText.replace(regex, word.replacement);
    });

    // محاكاة تأخير بسيط لتحسين تجربة المستخدم
    setTimeout(() => {
      setOutputText(censoredText);
      setIsLoading(false);
      
      toast({
        title: "تم تطبيق قواعد الرقابة",
        description: "يمكنك الآن نسخ النص المعدل"
      });
    }, 300);
  };

  // نسخ النص المعدل إلى الحافظة
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText)
      .then(() => {
        toast({
          title: "تم النسخ",
          description: "تم نسخ النص المعدل إلى الحافظة"
        });
      })
      .catch((error) => {
        console.error('Error copying text:', error);
        toast({
          title: "فشل النسخ",
          description: "تعذر نسخ النص، الرجاء المحاولة مرة أخرى",
          variant: "destructive"
        });
      });
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">رقابة النصوص</h1>
        <p className="text-muted-foreground mb-8">
          أداة لتطبيق قواعد الرقابة على النصوص تلقائياً
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>النص الأصلي</CardTitle>
              <CardDescription>
                قم بإدخال النص المراد تطبيق الرقابة عليه
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="أدخل النص هنا..."
                className="min-h-[300px]"
              />
            </CardContent>
            <CardFooter className="justify-between border-t p-3">
              <div className="text-sm text-muted-foreground">
                {charCount} حرف, {wordCount} كلمة
              </div>
              <Button onClick={applyCensorship} disabled={!inputText || isLoading}>
                {isLoading ? "جاري المعالجة..." : "تطبيق قواعد الرقابة"}
              </Button>
            </CardFooter>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>النص بعد الرقابة</CardTitle>
              <CardDescription>
                النص بعد تطبيق قواعد الرقابة عليه
              </CardDescription>
            </CardHeader>
            <CardContent>
              {outputText ? (
                <div className="border rounded-md p-4 min-h-[300px] bg-muted/20 whitespace-pre-wrap">
                  {outputText}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] border rounded-md p-4 text-center bg-muted/10">
                  <ArrowDown className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    سيظهر النص المعدل هنا بعد تطبيق قواعد الرقابة
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end border-t p-3">
              <Button
                onClick={copyToClipboard}
                disabled={!outputText}
                variant="secondary"
              >
                <Save className="ml-2 h-4 w-4" />
                نسخ النص المعدل
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Rules Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>قواعد الرقابة المطبقة</CardTitle>
            <CardDescription>
              الكلمات التي سيتم استبدالها تلقائياً عند تطبيق قواعد الرقابة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {censorshipWords.map((word) => (
                <div key={word.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{word.original}</span>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-primary-foreground bg-primary rounded px-2 py-1">
                    {word.replacement}
                  </div>
                </div>
              ))}
              
              {censorshipWords.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  لا توجد قواعد رقابة محددة. يمكن إضافة قواعد جديدة من صفحة الإعدادات.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TextCensorshipPage;
