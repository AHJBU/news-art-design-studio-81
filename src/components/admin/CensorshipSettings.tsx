
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Plus, Trash, Edit, Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const CensorshipSettings = () => {
  // بيانات وهمية للعرض والتجربة
  const [words, setWords] = useState([
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
  ]);

  const [newWord, setNewWord] = useState({
    original: "",
    replacement: "",
    note: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedWord, setEditedWord] = useState({
    original: "",
    replacement: "",
    note: "",
  });

  const handleAddWord = () => {
    if (newWord.original && newWord.replacement) {
      setWords([...words, { ...newWord, id: Date.now() }]);
      setNewWord({ original: "", replacement: "", note: "" });
    }
  };

  const handleDeleteWord = (id: number) => {
    setWords(words.filter((word) => word.id !== id));
  };

  const startEditing = (word: any) => {
    setEditingId(word.id);
    setEditedWord({
      original: word.original,
      replacement: word.replacement,
      note: word.note,
    });
  };

  const saveEdit = (id: number) => {
    setWords(
      words.map((word) =>
        word.id === id ? { ...word, ...editedWord } : word
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveChanges = () => {
    // هنا سيتم إرسال البيانات إلى واجهة برمجة التطبيقات (API)
    console.log("Saving censorship settings...");
    // تم الحفظ بنجاح - إضافة رسالة نجاح هنا
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>إدارة قائمة الرقابة النصية</CardTitle>
          <CardDescription>
            إضافة وتعديل الكلمات الخاضعة للرقابة وكيفية استبدالها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-96 mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الكلمة الأصلية</TableHead>
                  <TableHead>البديل</TableHead>
                  <TableHead>ملاحظات</TableHead>
                  <TableHead className="w-24">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {words.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell className="font-medium">
                      {editingId === word.id ? (
                        <Input
                          value={editedWord.original}
                          onChange={(e) =>
                            setEditedWord({
                              ...editedWord,
                              original: e.target.value,
                            })
                          }
                        />
                      ) : (
                        word.original
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === word.id ? (
                        <Input
                          value={editedWord.replacement}
                          onChange={(e) =>
                            setEditedWord({
                              ...editedWord,
                              replacement: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span className="text-xdesign font-medium">{word.replacement}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {editingId === word.id ? (
                        <Input
                          value={editedWord.note}
                          onChange={(e) =>
                            setEditedWord({
                              ...editedWord,
                              note: e.target.value,
                            })
                          }
                        />
                      ) : (
                        word.note
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === word.id ? (
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEdit(word.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(word)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteWord(word.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle>إضافة كلمة جديدة للرقابة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="originalWord">الكلمة الأصلية</Label>
                  <Input
                    id="originalWord"
                    value={newWord.original}
                    onChange={(e) =>
                      setNewWord({ ...newWord, original: e.target.value })
                    }
                    placeholder="الكلمة المراد رقابتها"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="replacementWord">الكلمة البديلة</Label>
                  <Input
                    id="replacementWord"
                    value={newWord.replacement}
                    onChange={(e) =>
                      setNewWord({ ...newWord, replacement: e.target.value })
                    }
                    placeholder="البديل الذي سيظهر"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="wordNote">ملاحظات (اختياري)</Label>
                  <Input
                    id="wordNote"
                    value={newWord.note}
                    onChange={(e) =>
                      setNewWord({ ...newWord, note: e.target.value })
                    }
                    placeholder="وصف طريقة الاستبدال"
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddWord} className="mt-4">
                <Plus className="ml-2 h-4 w-4" /> إضافة كلمة
              </Button>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">اختبار نظام الرقابة</h3>
            <Textarea
              placeholder="اكتب نصًا هنا لاختبار نظام الرقابة..."
              className="min-h-[100px] mb-2"
            />
            <Button variant="secondary">تطبيق الرقابة</Button>
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
