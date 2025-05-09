
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, ExternalLink, RefreshCw } from "lucide-react";

export const TemplateSettings = () => {
  // بيانات وهمية للعرض والتجربة
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "قالب 1 - بعد 1",
      url: "https://i.ibb.co/DggW7WJb/11.jpg",
    },
    {
      id: 2,
      name: "قالب 1 - بعد 2",
      url: "https://i.ibb.co/jkPRt4Vd/33.jpg",
    },
    {
      id: 3,
      name: "قالب 1 - بعد 3",
      url: "https://i.ibb.co/b55XkRwV/22.jpg",
    },
    {
      id: 4,
      name: "قالب 2 - بعد 1",
      url: "https://i.ibb.co/9HtdNY63/333.jpg",
    },
    {
      id: 5,
      name: "قالب 2 - بعد 2",
      url: "https://i.ibb.co/qLQ0QF0K/111.jpg",
    },
    {
      id: 6,
      name: "قالب 2 - بعد 3",
      url: "https://i.ibb.co/GfZQYGYg/33332.jpg",
    },
    {
      id: 7,
      name: "قالب 3 - بعد 1",
      url: "https://i.ibb.co/CKPFn9y1/1.jpg",
    },
    {
      id: 8,
      name: "قالب 3 - بعد 2",
      url: "https://i.ibb.co/vCnbYtyk/3.jpg",
    },
    {
      id: 9,
      name: "قالب 3 - بعد 3",
      url: "https://i.ibb.co/d4GnHR2J/2.jpg",
    },
  ]);

  const [logos, setLogos] = useState([
    {
      id: 1,
      name: "الشعار الأفقي",
      url: "https://i.ibb.co/LXbq6Q2P/Logo.png",
    },
    {
      id: 2,
      name: "الشعار المربع",
      url: "https://i.ibb.co/mC7QkMtH/watermark.png",
    },
  ]);

  const [activeTab, setActiveTab] = useState("templates");

  const handleUrlChange = (id: number, newUrl: string, isLogo: boolean = false) => {
    if (isLogo) {
      setLogos(logos.map((logo) => (logo.id === id ? { ...logo, url: newUrl } : logo)));
    } else {
      setTemplates(
        templates.map((template) =>
          template.id === id ? { ...template, url: newUrl } : template
        )
      );
    }
  };

  const handleFileUpload = (id: number, file: File, isLogo: boolean = false) => {
    // هنا ستكون آلية رفع الملف إلى الخادم
    console.log(`Uploading file for ${isLogo ? "logo" : "template"} ID: ${id}`, file);
    
    // تقليد عملية الرفع ورابط الملف الجديد
    const fakeUrl = URL.createObjectURL(file);
    
    if (isLogo) {
      setLogos(logos.map((logo) => (logo.id === id ? { ...logo, url: fakeUrl } : logo)));
    } else {
      setTemplates(
        templates.map((template) =>
          template.id === id ? { ...template, url: fakeUrl } : template
        )
      );
    }
  };

  const saveChanges = () => {
    // هنا سيتم إرسال البيانات إلى واجهة برمجة التطبيقات (API)
    console.log("Saving template settings...");
    // تم الحفظ بنجاح - إضافة رسالة نجاح هنا
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="templates">قوالب التصميم</TabsTrigger>
          <TabsTrigger value="logos">الشعارات</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>إدارة قوالب التصميم</CardTitle>
              <CardDescription>
                تعديل روابط وصور قوالب التصميم المستخدمة في التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="aspect-video bg-muted/20 rounded-md border overflow-hidden flex items-center justify-center">
                      {template.url ? (
                        <img
                          src={template.url}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground">لا توجد صورة</div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">{template.name}</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`url-${template.id}`}>رابط الصورة</Label>
                          <div className="flex mt-1">
                            <Input
                              id={`url-${template.id}`}
                              value={template.url}
                              onChange={(e) =>
                                handleUrlChange(template.id, e.target.value)
                              }
                              className="rounded-l-none"
                            />
                            <Button
                              variant="secondary" 
                              className="rounded-r-none"
                              onClick={() => {
                                if (template.url) window.open(template.url, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`file-${template.id}`}>رفع صورة جديدة</Label>
                          <div className="mt-1">
                            <Input
                              id={`file-${template.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(template.id, e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => document.getElementById(`file-${template.id}`)?.click()}
                            >
                              <UploadCloud className="ml-2 h-4 w-4" /> اختيار صورة
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logos">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الشعارات</CardTitle>
              <CardDescription>
                تعديل روابط وصور الشعارات المستخدمة في التطبيق
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {logos.map((logo) => (
                  <div
                    key={logo.id}
                    className="border rounded-lg p-6 space-y-4"
                  >
                    <div className="h-40 bg-muted/20 rounded-md border overflow-hidden flex items-center justify-center p-4">
                      {logo.url ? (
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-muted-foreground">لا يوجد شعار</div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2 text-lg">{logo.name}</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor={`logo-url-${logo.id}`}>رابط الشعار</Label>
                          <div className="flex mt-1">
                            <Input
                              id={`logo-url-${logo.id}`}
                              value={logo.url}
                              onChange={(e) =>
                                handleUrlChange(logo.id, e.target.value, true)
                              }
                              className="rounded-l-none"
                            />
                            <Button
                              variant="secondary" 
                              className="rounded-r-none"
                              onClick={() => {
                                if (logo.url) window.open(logo.url, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`logo-file-${logo.id}`}>رفع شعار جديد</Label>
                          <div className="mt-1">
                            <Input
                              id={`logo-file-${logo.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(logo.id, e.target.files[0], true);
                                }
                              }}
                              className="hidden"
                            />
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => document.getElementById(`logo-file-${logo.id}`)?.click()}
                            >
                              <UploadCloud className="ml-2 h-4 w-4" /> اختيار صورة
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">إلغاء</Button>
        <Button onClick={saveChanges}>حفظ التغييرات</Button>
      </div>
    </div>
  );
};
