
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { CensorshipWord } from '@/components/admin/CensorshipSettings';
import { ArrowDown, Save } from 'lucide-react';

const TextCensorshipPage = () => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [censorshipWords, setCensorshipWords] = useState<CensorshipWord[]>([
    { id: 1, original: "فلسطين", replacement: "فلسـطين" },
    { id: 2, original: "حماس", replacement: "حمـ.ـاس" },
    { id: 3, original: "الاحتلال", replacement: "الآحـتلال" }
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
