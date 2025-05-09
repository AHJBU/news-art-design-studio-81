
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRightLeft,
  Copy,
  FileText,
  Download,
  Eraser,
  Undo2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Interface for censorship words
interface CensorshipWord {
  id: number;
  original: string;
  replacement: string;
}

const TextCensorshipPage = () => {
  const { toast } = useToast();
  const [originalText, setOriginalText] = useState("");
  const [censoredText, setCensoredText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [censorshipWords, setCensorshipWords] = useState<CensorshipWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load censorship words from API
  useEffect(() => {
    // In a real implementation, this would fetch from your API
    const initialWords: CensorshipWord[] = [
      { id: 1, original: "فلسطين", replacement: "فلسـطين" },
      { id: 2, original: "حماس", replacement: "حمـ.ـاس" },
      { id: 3, original: "الاحتلال", replacement: "الآحـتلال" }
    ];
    
    setCensorshipWords(initialWords);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setOriginalText(text);
    
    // Update word and character counts
    updateCounts(text);
  };

  const updateCounts = (text: string) => {
    // Count words (split by whitespace)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    
    // Count characters (excluding whitespace)
    const chars = text.replace(/\s+/g, "").length;
    setCharCount(chars);
  };

  const applyCensorship = () => {
    if (!originalText.trim()) {
      toast({
        title: "لا يوجد نص",
        description: "الرجاء إدخال نص لتطبيق الرقابة عليه",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let text = originalText;
      
      // Apply each censorship rule
      censorshipWords.forEach(word => {
        const regex = new RegExp(word.original, "g");
        text = text.replace(regex, word.replacement);
      });
      
      setCensoredText(text);
      
      toast({
        title: "تم تطبيق الرقابة",
        description: "تم تطبيق قواعد الرقابة على النص بنجاح"
      });
    } catch (error) {
      console.error("Error applying censorship:", error);
      toast({
        title: "خطأ في تطبيق الرقابة",
        description: "حدث خطأ أثناء تطبيق قواعد الرقابة",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetText = () => {
    setOriginalText("");
    setCensoredText("");
    setWordCount(0);
    setCharCount(0);
    
    toast({
      title: "تم مسح النص",
      description: "تم مسح النص الأصلي والمعدل"
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "تم النسخ",
          description: "تم نسخ النص إلى الحافظة"
        });
      })
      .catch(err => {
        console.error("Error copying text: ", err);
        toast({
          title: "خطأ في النسخ",
          description: "لم يتم نسخ النص، الرجاء المحاولة مرة أخرى",
          variant: "destructive"
        });
      });
  };

  const downloadAsTextFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "تم التنزيل",
      description: `تم تنزيل الملف باسم ${filename}`
    });
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">رقابة النصوص</h1>
        <p className="text-muted-foreground mb-8">
          أداة بسيطة لتطبيق قواعد رقابة النصوص على المحتوى الخاص بك
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Text Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="ml-2 h-5 w-5" />
                النص الأصلي
              </CardTitle>
              <CardDescription>
                أدخل النص الذي ترغب في تطبيق الرقابة عليه
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="أدخل النص هنا..."
                value={originalText}
                onChange={handleTextChange}
                className="min-h-[300px] resize-none"
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                <span className="ml-2">{wordCount} كلمة</span>
                <span>{charCount} حرف</span>
              </div>
              <div className="space-x-2 rtl:space-x-reverse">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(originalText)}
                  disabled={!originalText}
                >
                  <Copy className="h-4 w-4 ml-1" />
                  نسخ
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadAsTextFile(originalText, "النص_الأصلي.txt")}
                  disabled={!originalText}
                >
                  <Download className="h-4 w-4 ml-1" />
                  تنزيل
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Censored Text Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="ml-2 h-5 w-5" />
                النص بعد الرقابة
              </CardTitle>
              <CardDescription>
                النص بعد تطبيق قواعد الرقابة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={censoredText}
                readOnly
                className="min-h-[300px] resize-none bg-muted/20"
                placeholder="سيظهر هنا النص بعد تطبيق الرقابة..."
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                {censoredText && (
                  <>
                    <span className="ml-2">{censoredText.trim().split(/\s+/).length} كلمة</span>
                    <span>{censoredText.replace(/\s+/g, "").length} حرف</span>
                  </>
                )}
              </div>
              <div className="space-x-2 rtl:space-x-reverse">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(censoredText)}
                  disabled={!censoredText}
                >
                  <Copy className="h-4 w-4 ml-1" />
                  نسخ
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadAsTextFile(censoredText, "النص_المراقب.txt")}
                  disabled={!censoredText}
                >
                  <Download className="h-4 w-4 ml-1" />
                  تنزيل
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button 
            size="lg" 
            onClick={applyCensorship}
            disabled={isLoading || !originalText}
            className="min-w-[180px]"
          >
            <ArrowRightLeft className="ml-2 h-5 w-5" />
            {isLoading ? "جاري التطبيق..." : "تطبيق الرقابة"}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={resetText}
            className="min-w-[180px]"
          >
            <Eraser className="ml-2 h-5 w-5" />
            مسح النص
          </Button>
        </div>

        <Separator className="my-8" />

        {/* Censorship Rules Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">قواعد الرقابة المطبقة</h2>
          <p className="text-muted-foreground mb-4">
            هذه قائمة بالكلمات التي سيتم استبدالها عند تطبيق الرقابة:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {censorshipWords.map(word => (
              <Card key={word.id} className="bg-muted/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{word.original}</div>
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground mx-2" />
                    <div className="font-medium">{word.replacement}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            * يمكن للمسؤول تعديل قواعد الرقابة من لوحة التحكم
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextCensorshipPage;
