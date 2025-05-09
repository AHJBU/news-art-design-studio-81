
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";

// Type definitions for censorship data
interface CensorshipWord {
  id: number;
  original: string;
  replacement: string;
}

const CensorshipSettings = () => {
  const { toast } = useToast();
  const [words, setWords] = useState<CensorshipWord[]>([]);
  const [newOriginal, setNewOriginal] = useState("");
  const [newReplacement, setNewReplacement] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Load initial censorship words from API/storage
  useEffect(() => {
    // In a real implementation, this would fetch from your API
    const initialWords: CensorshipWord[] = [
      { id: 1, original: "فلسطين", replacement: "فلسـطين" },
      { id: 2, original: "حماس", replacement: "حمـ.ـاس" },
      { id: 3, original: "الاحتلال", replacement: "الآحـتلال" }
    ];
    
    setWords(initialWords);
  }, []);

  const addWord = () => {
    if (!newOriginal || !newReplacement) {
      toast({
        title: "خطأ في الإدخال",
        description: "الرجاء إدخال الكلمة الأصلية والبديل",
        variant: "destructive"
      });
      return;
    }
    
    const newId = words.length > 0 ? Math.max(...words.map(w => w.id)) + 1 : 1;
    const newWord = {
      id: newId,
      original: newOriginal,
      replacement: newReplacement
    };
    
    const updatedWords = [...words, newWord];
    setWords(updatedWords);
    setNewOriginal("");
    setNewReplacement("");
    
    // In a real implementation, this would be saved to the API immediately
    saveToAPI(updatedWords);
  };

  const removeWord = (id: number) => {
    const updatedWords = words.filter(word => word.id !== id);
    setWords(updatedWords);
    
    // In a real implementation, this would be saved to the API immediately
    saveToAPI(updatedWords);
  };

  const saveToAPI = async (wordList: CensorshipWord[]) => {
    setIsSaving(true);
    
    try {
      // In a real implementation, this would be an API call to save the words
      // For this example, we'll simulate a successful API call
      console.log("Saving censorship words:", wordList);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات الرقابة"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "لم يتم حفظ التغييرات، الرجاء المحاولة مرة أخرى",
        variant: "destructive"
      });
      console.error("Error saving censorship settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    saveToAPI(words);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة رقابة النصوص</CardTitle>
          <CardDescription>
            أضف وإدارة الكلمات التي سيتم استبدالها عند تطبيق الرقابة على النصوص
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الكلمة الأصلية</TableHead>
                <TableHead>البديل</TableHead>
                <TableHead className="w-[100px]">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {words.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                    لا توجد كلمات للرقابة. أضف كلمات جديدة أدناه.
                  </TableCell>
                </TableRow>
              ) : (
                words.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell>{word.original}</TableCell>
                    <TableCell>{word.replacement}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWord(word.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">حذف</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">إضافة كلمة جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="original">الكلمة الأصلية</Label>
                <Input
                  id="original"
                  placeholder="أدخل الكلمة الأصلية"
                  value={newOriginal}
                  onChange={(e) => setNewOriginal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="replacement">البديل</Label>
                <Input
                  id="replacement"
                  placeholder="أدخل البديل"
                  value={newReplacement}
                  onChange={(e) => setNewReplacement(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={addWord}>إضافة كلمة</Button>
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t p-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>معاينة رقابة النصوص</CardTitle>
          <CardDescription>
            هذه معاينة لكيفية عمل الرقابة على نموذج نص
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md bg-muted/20">
            <p className="mb-2 font-medium">النص الأصلي:</p>
            <p className="text-muted-foreground mb-4">
              حماس، الحركة التي تدافع عن القضية الفلسطينية، تواجه الاحتلال الإسرائيلي المستمر للأراضي الفلسطينية.
            </p>

            <p className="mb-2 font-medium">النص بعد تطبيق الرقابة:</p>
            <p>
              {words.reduce(
                (text, word) => text.replace(new RegExp(word.original, "g"), word.replacement),
                "حماس، الحركة التي تدافع عن القضية الفلسطينية، تواجه الاحتلال الإسرائيلي المستمر للأراضي الفلسطينية."
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CensorshipSettings;
