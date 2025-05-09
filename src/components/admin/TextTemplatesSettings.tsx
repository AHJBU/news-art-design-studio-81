
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export const TextTemplatesSettings = () => {
  // بيانات وهمية للعرض والتجربة
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "خبر عاجل",
      content: "عاجل: [النص هنا]",
      category: "أخبار",
    },
    {
      id: 2,
      name: "اقتباس",
      content: """ [النص هنا] """,
      category: "اقتباسات",
    },
    {
      id: 3,
      name: "تهنئة",
      content: "نهنئكم بمناسبة [المناسبة]\nمع أطيب التمنيات بدوام التوفيق",
      category: "مناسبات",
    },
  ]);

  const [categories, setCategories] = useState([
    "أخبار",
    "اقتباسات",
    "مناسبات",
    "تنبيهات",
    "عام",
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    content: "",
    category: "عام",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTemplate, setEditedTemplate] = useState({
    name: "",
    content: "",
    category: "",
  });

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      setTemplates([
        ...templates,
        { ...newTemplate, id: Date.now() },
      ]);
      setNewTemplate({ name: "", content: "", category: "عام" });
    }
  };

  const handleDeleteTemplate = (id: number) => {
    setTemplates(templates.filter((template) => template.id !== id));
  };

  const startEditing = (template: any) => {
    setEditingId(template.id);
    setEditedTemplate({
      name: template.name,
      content: template.content,
      category: template.category,
    });
  };

  const saveEdit = (id: number) => {
    setTemplates(
      templates.map((template) =>
        template.id === id
          ? { ...template, ...editedTemplate }
          : template
      )
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveChanges = () => {
    // هنا سيتم إرسال البيانات إلى واجهة برمجة التطبيقات (API)
    console.log("Saving text template settings...");
    // تم الحفظ بنجاح - إضافة رسالة نجاح هنا
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>إدارة قوالب النصوص</CardTitle>
          <CardDescription>
            إضافة وتعديل قوالب النصوص المسبقة لتسهيل عملية إنشاء المحتوى
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-96 mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم القالب</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>المحتوى</TableHead>
                  <TableHead className="w-24">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      {editingId === template.id ? (
                        <Input
                          value={editedTemplate.name}
                          onChange={(e) =>
                            setEditedTemplate({
                              ...editedTemplate,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span className="font-medium">{template.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === template.id ? (
                        <Select
                          value={editedTemplate.category}
                          onValueChange={(value) =>
                            setEditedTemplate({
                              ...editedTemplate,
                              category: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر فئة" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>{template.category}</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      {editingId === template.id ? (
                        <Textarea
                          value={editedTemplate.content}
                          onChange={(e) =>
                            setEditedTemplate({
                              ...editedTemplate,
                              content: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap line-clamp-3">
                          {template.content}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === template.id ? (
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEdit(template.id)}
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
                            onClick={() => startEditing(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.id)}
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
              <CardTitle>إضافة قالب نص جديد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="templateName">اسم القالب</Label>
                    <Input
                      id="templateName"
                      value={newTemplate.name}
                      onChange={(e) =>
                        setNewTemplate({ ...newTemplate, name: e.target.value })
                      }
                      placeholder="مثال: خبر عاجل"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="templateCategory">الفئة</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) =>
                        setNewTemplate({ ...newTemplate, category: value })
                      }
                    >
                      <SelectTrigger id="templateCategory" className="mt-1">
                        <SelectValue placeholder="اختر فئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="templateContent">محتوى القالب</Label>
                  <Textarea
                    id="templateContent"
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, content: e.target.value })
                    }
                    placeholder="اكتب محتوى القالب هنا. يمكنك استخدام [النص هنا] كنص متغير سيتم استبداله."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <Button onClick={handleAddTemplate}>
                  <Plus className="ml-2 h-4 w-4" /> إضافة القالب
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">إلغاء</Button>
        <Button onClick={saveChanges}>حفظ التغييرات</Button>
      </div>
    </div>
  );
};
