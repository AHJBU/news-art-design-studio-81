
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  Image,
  Text,
  FileText,
  Pencil,
  SquareDashed,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Save,
  Share2,
  ZoomIn,
  ZoomOut,
  Grid,
  Download
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// افتراض أننا سنجلب هذه البيانات من ملفات التكوين عن طريق API في المستقبل
const templateData = [
  {
    id: 1,
    name: "قالب 1",
    variants: [
      { id: 1, name: "1:1 مربع", url: "https://i.ibb.co/DggW7WJb/11.jpg", ratio: "1:1" },
      { id: 2, name: "4:5 منشور", url: "https://i.ibb.co/jkPRt4Vd/33.jpg", ratio: "4:5" },
      { id: 3, name: "9:16 ستوري", url: "https://i.ibb.co/b55XkRwV/22.jpg", ratio: "9:16" }
    ]
  },
  {
    id: 2,
    name: "قالب 2",
    variants: [
      { id: 4, name: "1:1 مربع", url: "https://i.ibb.co/9HtdNY63/333.jpg", ratio: "1:1" },
      { id: 5, name: "4:5 منشور", url: "https://i.ibb.co/qLQ0QF0K/111.jpg", ratio: "4:5" },
      { id: 6, name: "9:16 ستوري", url: "https://i.ibb.co/GfZQYGYg/33332.jpg", ratio: "9:16" }
    ]
  },
  {
    id: 3,
    name: "قالب 3",
    variants: [
      { id: 7, name: "1:1 مربع", url: "https://i.ibb.co/CKPFn9y1/1.jpg", ratio: "1:1" },
      { id: 8, name: "4:5 منشور", url: "https://i.ibb.co/vCnbYtyk/3.jpg", ratio: "4:5" },
      { id: 9, name: "9:16 ستوري", url: "https://i.ibb.co/d4GnHR2J/2.jpg", ratio: "9:16" }
    ]
  }
];

// افتراض أننا سنجلب هذه البيانات من ملفات التكوين عن طريق API في المستقبل
const fontOptions = [
  { value: "Cairo", label: "القاهرة" },
  { value: "Tajawal", label: "تجوال" },
  { value: "Almarai", label: "المراعي" },
  { value: "Changa", label: "تشانغا" },
  { value: "GE Dinar One", label: "جي إي دينار ون" },
  { value: "Frutiger Arabic", label: "فروتيجر عربي" },
  { value: "Neo Sans Arabic", label: "نيو سانس عربي" },
  { value: "Kufigraph", label: "كوفي جراف" },
  { value: "Bukra", label: "بكرا" }
];

// افتراض أننا سنجلب هذه البيانات من ملفات التكوين عن طريق API في المستقبل
const colorOptions = [
  { value: "#ffffff", label: "أبيض" },
  { value: "#000000", label: "أسود" },
  { value: "#e63946", label: "أحمر" },
  { value: "#2a9d8f", label: "أخضر" },
  { value: "#e9c46a", label: "أصفر" },
  { value: "#264653", label: "كحلي" }
];

// افتراض أننا سنجلب هذه البيانات من ملفات التكوين عن طريق API في المستقبل
const textTemplates = [
  { id: 1, name: "خبر عاجل", content: "عاجل: [النص هنا]", category: "أخبار" },
  { id: 2, name: "اقتباس", content: "\" [النص هنا] \"", category: "اقتباسات" },
  { id: 3, name: "تهنئة", content: "نهنئكم بمناسبة [المناسبة]\nمع أطيب التمنيات بدوام التوفيق", category: "مناسبات" }
];

const NewsDesignPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("design");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [activeTextId, setActiveTextId] = useState<number | null>(null);
  const [textElements, setTextElements] = useState<any[]>([]);
  const [textCounter, setTextCounter] = useState(0);
  
  // Text editing states
  const [selectedFont, setSelectedFont] = useState("Cairo");
  const [fontSize, setFontSize] = useState(24);
  const [textAlign, setTextAlign] = useState("right");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textDirection, setTextDirection] = useState("rtl");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textUnderline, setTextUnderline] = useState(false);
  const [textShadow, setTextShadow] = useState(false);
  const [textShadowColor, setTextShadowColor] = useState("#000000");
  const [textStroke, setTextStroke] = useState(false);
  const [textStrokeColor, setTextStrokeColor] = useState("#000000");
  const [textBackgroundColor, setTextBackgroundColor] = useState("transparent");

  const selectedTemplate = selectedTemplateId 
    ? templateData.find(template => template.id === selectedTemplateId) 
    : null;
  
  const selectedVariant = selectedTemplate && selectedVariantId 
    ? selectedTemplate.variants.find(variant => variant.id === selectedVariantId) 
    : null;

  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setSelectedVariantId(null); // Reset variant selection
  };

  const handleSelectVariant = (variantId: number) => {
    setSelectedVariantId(variantId);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(prevZoom => prevZoom + 10);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(prevZoom => prevZoom - 10);
    }
  };

  const handleAddText = () => {
    const newId = textCounter + 1;
    const newText = {
      id: newId,
      content: "نص جديد",
      x: 50,
      y: 50 + (textElements.length * 30),
      font: selectedFont,
      size: fontSize,
      color: textColor,
      align: textAlign,
      direction: textDirection,
      bold: textBold,
      italic: textItalic,
      underline: textUnderline,
      shadow: textShadow,
      shadowColor: textShadowColor,
      stroke: textStroke,
      strokeColor: textStrokeColor,
      backgroundColor: textBackgroundColor
    };
    
    setTextElements([...textElements, newText]);
    setActiveTextId(newId);
    setTextCounter(newId);
    setTextContent("نص جديد");

    toast({
      title: "تم إضافة نص جديد",
      description: "يمكنك الآن تحرير النص وتنسيقه"
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setTextContent(newContent);
    
    if (activeTextId !== null) {
      setTextElements(textElements.map(text => 
        text.id === activeTextId ? { ...text, content: newContent } : text
      ));
    }
  };

  const updateActiveTextStyle = (property: string, value: any) => {
    if (activeTextId === null) return;
    
    setTextElements(textElements.map(text => 
      text.id === activeTextId ? { ...text, [property]: value } : text
    ));
  };

  const handleExportDesign = () => {
    toast({
      title: "جاري تصدير التصميم",
      description: "سيتم تنزيل الصورة قريباً"
    });
    
    // هنا يمكن إضافة آلية فعلية لتصدير التصميم
    setTimeout(() => {
      toast({
        title: "تم التصدير بنجاح",
        description: "تم حفظ التصميم بنجاح"
      });
    }, 1500);
  };

  const handleShareDesign = () => {
    toast({
      title: "جاري تحضير رابط المشاركة",
      description: "سيتم نسخ الرابط إلى الحافظة"
    });
    
    // هنا يمكن إضافة آلية فعلية لمشاركة التصميم
    setTimeout(() => {
      toast({
        title: "تم نسخ الرابط",
        description: "يمكنك مشاركته مع الآخرين الآن"
      });
    }, 1000);
  };

  const applyTextTemplate = (template: any) => {
    const content = template.content.replace("[النص هنا]", textContent || "");
    
    if (activeTextId !== null) {
      setTextContent(content);
      setTextElements(textElements.map(text => 
        text.id === activeTextId ? { ...text, content } : text
      ));
      
      toast({
        title: "تم تطبيق القالب",
        description: `تم تطبيق قالب "${template.name}" على النص المحدد`
      });
    } else {
      toast({
        title: "لم يتم اختيار نص",
        description: "الرجاء اختيار نص أو إضافة نص جديد أولاً",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">تصميم الأخبار</h1>
        <p className="text-muted-foreground mb-8">
          صمم منشورات إخبارية احترافية باستخدام القوالب الجاهزة
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="design" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              التصميم
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              التصدير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6">
            {/* Template Selection Section */}
            {!selectedTemplateId && (
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templateData.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <CardTitle className="text-xl">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div 
                        className="aspect-square bg-muted relative overflow-hidden cursor-pointer"
                        onClick={() => handleSelectTemplate(template.id)}
                      >
                        <img 
                          src={template.variants[0].url} 
                          alt={template.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button variant="secondary" className="font-bold">
                            اختيار القالب
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>
            )}

            {/* Variant Selection Section */}
            {selectedTemplateId && !selectedVariantId && selectedTemplate && (
              <>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-2"
                    onClick={() => setSelectedTemplateId(null)}
                  >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    رجوع
                  </Button>
                  <h2 className="text-xl font-bold">{selectedTemplate.name}: اختر أبعاد التصميم</h2>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {selectedTemplate.variants.map((variant) => (
                    <Card key={variant.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{variant.name}</CardTitle>
                        <CardDescription>{variant.ratio}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div 
                          className="relative overflow-hidden cursor-pointer"
                          style={{
                            aspectRatio: variant.ratio === "1:1" ? "1/1" : 
                                        variant.ratio === "4:5" ? "4/5" : "9/16"
                          }}
                          onClick={() => handleSelectVariant(variant.id)}
                        >
                          <img 
                            src={variant.url} 
                            alt={variant.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button variant="secondary" className="font-bold">
                              اختيار البعد
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>
              </>
            )}

            {/* Design Workspace */}
            {selectedTemplateId && selectedVariantId && selectedTemplate && selectedVariant && (
              <>
                <div className="flex items-center mb-6">
                  <Button 
                    variant="ghost" 
                    className="mr-2"
                    onClick={() => setSelectedVariantId(null)}
                  >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    رجوع للأبعاد
                  </Button>
                  <h2 className="text-xl font-bold">
                    {selectedTemplate.name} - {selectedVariant.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Sidebar - Tools and Elements */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">الأدوات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2">
                          <Button variant="outline" className="flex flex-col h-auto py-3" onClick={handleAddText}>
                            <Text className="h-5 w-5 mb-1" />
                            <span>إضافة نص</span>
                          </Button>
                          <Button variant="outline" className="flex flex-col h-auto py-3">
                            <Image className="h-5 w-5 mb-1" />
                            <span>إضافة صورة</span>
                          </Button>
                          <Button variant="outline" className="flex flex-col h-auto py-3" onClick={() => setShowGrid(!showGrid)}>
                            <Grid className="h-5 w-5 mb-1" />
                            <span>{showGrid ? 'إخفاء الشبكة' : 'إظهار الشبكة'}</span>
                          </Button>
                          <Button variant="outline" className="flex flex-col h-auto py-3">
                            <FileText className="h-5 w-5 mb-1" />
                            <span>قوالب نصية</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Text Templates */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">قوالب النصوص</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {textTemplates.map((template) => (
                            <Button 
                              key={template.id}
                              variant="outline" 
                              className="w-full justify-start text-right h-auto py-2"
                              onClick={() => applyTextTemplate(template)}
                            >
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {template.content}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Text Editing Options */}
                    {activeTextId !== null && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg">تحرير النص</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="textContent">محتوى النص</Label>
                            <Textarea
                              id="textContent"
                              value={textContent}
                              onChange={handleTextChange}
                              className="mt-1"
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="fontSize">حجم الخط</Label>
                            <div className="flex items-center mt-1">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  const newSize = Math.max(8, fontSize - 2);
                                  setFontSize(newSize);
                                  updateActiveTextStyle('size', newSize);
                                }}
                              >
                                <span className="text-lg">-</span>
                              </Button>
                              <Input
                                id="fontSize"
                                type="number"
                                min="8"
                                max="120"
                                value={fontSize}
                                className="w-16 text-center mx-2"
                                onChange={(e) => {
                                  const newSize = parseInt(e.target.value);
                                  setFontSize(newSize);
                                  updateActiveTextStyle('size', newSize);
                                }}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  const newSize = Math.min(120, fontSize + 2);
                                  setFontSize(newSize);
                                  updateActiveTextStyle('size', newSize);
                                }}
                              >
                                <span className="text-lg">+</span>
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="font">نوع الخط</Label>
                            <Select 
                              value={selectedFont}
                              onValueChange={(val) => {
                                setSelectedFont(val);
                                updateActiveTextStyle('font', val);
                              }}
                            >
                              <SelectTrigger id="font" className="mt-1">
                                <SelectValue placeholder="اختر نوع الخط" />
                              </SelectTrigger>
                              <SelectContent>
                                {fontOptions.map((font) => (
                                  <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>محاذاة النص</Label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              <Button
                                type="button"
                                variant={textAlign === "right" ? "default" : "outline"}
                                className="w-full"
                                onClick={() => {
                                  setTextAlign("right");
                                  updateActiveTextStyle('align', 'right');
                                }}
                              >
                                يمين
                              </Button>
                              <Button
                                type="button"
                                variant={textAlign === "center" ? "default" : "outline"}
                                className="w-full"
                                onClick={() => {
                                  setTextAlign("center");
                                  updateActiveTextStyle('align', 'center');
                                }}
                              >
                                وسط
                              </Button>
                              <Button
                                type="button"
                                variant={textAlign === "left" ? "default" : "outline"}
                                className="w-full"
                                onClick={() => {
                                  setTextAlign("left");
                                  updateActiveTextStyle('align', 'left');
                                }}
                              >
                                يسار
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label>لون النص</Label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              {colorOptions.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  className={`w-full h-8 rounded border ${textColor === color.value ? 'ring-2 ring-primary' : ''}`}
                                  style={{ backgroundColor: color.value }}
                                  onClick={() => {
                                    setTextColor(color.value);
                                    updateActiveTextStyle('color', color.value);
                                  }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label>تأثيرات النص</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Button
                                type="button"
                                variant={textBold ? "default" : "outline"}
                                className="w-auto px-3"
                                onClick={() => {
                                  const newValue = !textBold;
                                  setTextBold(newValue);
                                  updateActiveTextStyle('bold', newValue);
                                }}
                              >
                                عريض
                              </Button>
                              <Button
                                type="button"
                                variant={textItalic ? "default" : "outline"}
                                className="w-auto px-3"
                                onClick={() => {
                                  const newValue = !textItalic;
                                  setTextItalic(newValue);
                                  updateActiveTextStyle('italic', newValue);
                                }}
                              >
                                مائل
                              </Button>
                              <Button
                                type="button"
                                variant={textUnderline ? "default" : "outline"}
                                className="w-auto px-3"
                                onClick={() => {
                                  const newValue = !textUnderline;
                                  setTextUnderline(newValue);
                                  updateActiveTextStyle('underline', newValue);
                                }}
                              >
                                تسطير
                              </Button>
                              <Button
                                type="button"
                                variant={textShadow ? "default" : "outline"}
                                className="w-auto px-3"
                                onClick={() => {
                                  const newValue = !textShadow;
                                  setTextShadow(newValue);
                                  updateActiveTextStyle('shadow', newValue);
                                }}
                              >
                                ظل
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Middle - Design Canvas */}
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden">
                      <CardHeader className="border-b flex-row justify-between items-center py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <span>{zoomLevel}%</span>
                          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8" onClick={handleExportDesign}>
                            <Download className="h-4 w-4 ml-1" />
                            تصدير
                          </Button>
                          <Button variant="outline" size="sm" className="h-8" onClick={handleShareDesign}>
                            <Share2 className="h-4 w-4 ml-1" />
                            مشاركة
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center p-0 min-h-[500px] bg-muted/30 overflow-auto">
                        <div 
                          className="relative"
                          style={{
                            transform: `scale(${zoomLevel / 100})`,
                            transition: 'transform 0.2s',
                            aspectRatio: selectedVariant.ratio === "1:1" ? "1/1" : 
                                        selectedVariant.ratio === "4:5" ? "4/5" : "9/16",
                            width: selectedVariant.ratio === "1:1" ? '500px' : 
                                  selectedVariant.ratio === "4:5" ? '400px' : '280px',
                            maxWidth: '100%'
                          }}
                        >
                          <div className="absolute inset-0 pointer-events-none">
                            {showGrid && (
                              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                              </svg>
                            )}
                          </div>
                          
                          <div className="relative h-full">
                            <img 
                              src={selectedVariant.url} 
                              alt={selectedVariant.name}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Text Elements */}
                            {textElements.map((text) => (
                              <div 
                                key={text.id}
                                className={`absolute cursor-move p-2 ${activeTextId === text.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                style={{
                                  left: `${text.x}px`,
                                  top: `${text.y}px`,
                                  fontFamily: text.font,
                                  fontSize: `${text.size}px`,
                                  color: text.color,
                                  textAlign: text.align,
                                  direction: text.direction,
                                  fontWeight: text.bold ? 'bold' : 'normal',
                                  fontStyle: text.italic ? 'italic' : 'normal',
                                  textDecoration: text.underline ? 'underline' : 'none',
                                  textShadow: text.shadow ? `1px 1px 2px ${text.shadowColor}` : 'none',
                                  backgroundColor: text.backgroundColor !== 'transparent' ? text.backgroundColor : 'transparent',
                                  WebkitTextStroke: text.stroke ? `1px ${text.strokeColor}` : 'none',
                                  padding: '4px',
                                  maxWidth: '80%'
                                }}
                                onClick={() => {
                                  setActiveTextId(text.id);
                                  setTextContent(text.content);
                                  setSelectedFont(text.font);
                                  setFontSize(text.size);
                                  setTextAlign(text.align);
                                  setTextColor(text.color);
                                  setTextDirection(text.direction);
                                  setTextBold(text.bold);
                                  setTextItalic(text.italic);
                                  setTextUnderline(text.underline);
                                  setTextShadow(text.shadow);
                                  setTextShadowColor(text.shadowColor);
                                  setTextStroke(text.stroke);
                                  setTextStrokeColor(text.strokeColor);
                                  setTextBackgroundColor(text.backgroundColor);
                                }}
                              >
                                {text.content || "نص جديد"}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>خيارات التصدير</CardTitle>
                <CardDescription>
                  اختر الإعدادات المناسبة لتصدير التصميم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fileName">اسم الملف</Label>
                      <Input 
                        id="fileName" 
                        placeholder="اسم الملف" 
                        defaultValue={`تصميم_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}`} 
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>تنسيق الملف</Label>
                      <RadioGroup defaultValue="png" className="mt-2">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem value="png" id="png" />
                          <Label htmlFor="png">PNG</Label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <RadioGroupItem value="jpeg" id="jpeg" />
                          <Label htmlFor="jpeg">JPEG</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>خيارات متقدمة</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input type="checkbox" id="keep-ratio" className="rounded text-primary" defaultChecked />
                          <label htmlFor="keep-ratio">الحفاظ على الأبعاد الأصلية</label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input type="checkbox" id="transparent-bg" className="rounded text-primary" />
                          <label htmlFor="transparent-bg">خلفية شفافة (PNG فقط)</label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input type="checkbox" id="include-text-bg" className="rounded text-primary" />
                          <label htmlFor="include-text-bg">إظهار خلفيات النصوص</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center bg-muted/20 rounded-lg border border-dashed p-6">
                    {selectedVariantId && selectedVariant ? (
                      <div className="text-center">
                        <div className="mb-4">
                          <img 
                            src={selectedVariant.url} 
                            alt="معاينة التصدير" 
                            className="max-h-[200px] max-w-full object-contain mx-auto" 
                          />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          الأبعاد: {selectedVariant.ratio}
                        </div>
                        <Button onClick={handleExportDesign}>
                          <Download className="ml-2 h-4 w-4" />
                          تصدير التصميم
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <SquareDashed className="h-12 w-12 mx-auto mb-2 opacity-30" />
                        <p>قم بإنشاء تصميم أولاً ليتم معاينته هنا</p>
                        <Button 
                          variant="link" 
                          className="mt-2"
                          onClick={() => setActiveTab("design")}
                        >
                          العودة إلى صفحة التصميم
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleExportDesign} disabled={!selectedVariantId}>
                    <Download className="ml-2 h-4 w-4" />
                    تصدير التصميم
                  </Button>
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

export default NewsDesignPage;
