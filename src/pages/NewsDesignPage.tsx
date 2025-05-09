
import { useState, useRef, useEffect } from "react";
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
  CardFooter
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
  Text,
  Save,
  Grid,
  Download,
  Trash,
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
  { value: "Bukra", label: "بكرا" },
  // إضافة 5 خطوط عربية جديدة
  { value: "Reem Kufi", label: "ريم كوفي" },
  { value: "Aref Ruqaa", label: "عارف رقعة" },
  { value: "Lateef", label: "لطيف" },
  { value: "Scheherazade New", label: "شهرزاد الجديد" },
  { value: "Amiri", label: "أميري" }
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

const NewsDesignPage = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("design");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [activeTextId, setActiveTextId] = useState<number | null>(null);
  const [textElements, setTextElements] = useState<any[]>([]);
  const [textCounter, setTextCounter] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
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
  const [fileName, setFileName] = useState(`تصميم_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}`);
  const [fileFormat, setFileFormat] = useState("png");
  const [keepRatio, setKeepRatio] = useState(true);
  const [transparentBg, setTransparentBg] = useState(false);
  const [includeTextBg, setIncludeTextBg] = useState(false);
  
  // كائن الصورة الذي سنستخدمه للتصدير
  const templateImg = useRef<HTMLImageElement | null>(null);

  const selectedTemplate = templateData.find(template => template.id === selectedTemplateId) || templateData[0];
  const selectedVariant = selectedTemplate.variants.find(variant => variant.id === selectedVariantId) || selectedTemplate.variants[0];

  // تحميل الصورة المختارة مسبقاً
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // مهم للتعامل مع CORS
    img.src = selectedVariant.url;
    img.onload = () => {
      templateImg.current = img;
    };
  }, [selectedVariant.url]);

  // عند تحميل الصفحة، نضيف مربع نص افتراضي في المنتصف
  useEffect(() => {
    if (textElements.length === 0) {
      handleAddText();
    }
  }, []);

  const handleTemplateChange = (templateId: string) => {
    const id = parseInt(templateId, 10);
    setSelectedTemplateId(id);
    
    // Find first variant of this template
    const template = templateData.find(t => t.id === id);
    if (template && template.variants.length > 0) {
      setSelectedVariantId(template.variants[0].id);
    }
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(parseInt(variantId, 10));
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
    if (!canvasRef.current) return;

    // الحصول على أبعاد مساحة العمل
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = canvasRect.width / 2 - 100; // نصف عرض مربع النص تقريبًا
    const centerY = canvasRect.height / 2 - 25; // نصف ارتفاع مربع النص تقريبًا

    const newId = textCounter + 1;
    const newText = {
      id: newId,
      content: "نص جديد\nسطر جديد", // جعل النص الافتراضي سطرين
      x: centerX,
      y: centerY,
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
      backgroundColor: textBackgroundColor,
      width: 200, // عرض كافٍ لسطرين
      height: 60  // زيادة الارتفاع ليناسب سطرين
    };
    
    setTextElements([...textElements, newText]);
    setActiveTextId(newId);
    setTextCounter(newId);
    setTextContent("نص جديد\nسطر جديد");

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

  // Element dragging functions
  const handleTextMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setActiveTextId(id);
    setIsDragging(true);

    const text = textElements.find(text => text.id === id);
    if (text) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });

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
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeTextId === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setTextElements(textElements.map(text => 
      text.id === activeTextId ? { ...text, x, y } : text
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateActiveTextStyle = (property: string, value: any) => {
    if (activeTextId === null) return;
    
    setTextElements(textElements.map(text => 
      text.id === activeTextId ? { ...text, [property]: value } : text
    ));
  };

  const resizeTextElement = (width: number, height: number) => {
    if (activeTextId === null) return;
    
    setTextElements(textElements.map(text => 
      text.id === activeTextId ? { ...text, width, height } : text
    ));
  };

  const handleRemoveElement = () => {
    if (activeTextId === null) return;
    
    setTextElements(textElements.filter(text => text.id !== activeTextId));
    setActiveTextId(null);
    
    toast({
      title: "تم حذف العنصر",
      description: "تم حذف النص بنجاح"
    });
  };

  const handleExportDesign = () => {
    if (!templateImg.current) {
      toast({
        title: "خطأ في التصدير",
        description: "الرجاء الانتظار حتى تحميل الصورة بالكامل",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "جاري تصدير التصميم",
      description: "سيتم تنزيل الصورة قريباً"
    });
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not create canvas context");
      }
      
      // حجم الصورة المستخدمة (الأصلية)
      const img = templateImg.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // رسم صورة القالب
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // حساب النسبة بين أبعاد الصورة الأصلية والمعروضة
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;
      
      const displayedRect = canvasElement.getBoundingClientRect();
      
      // تحسين: الحصول على صحة محتوى الصورة في النافذة
      const imgElement = canvasElement.querySelector('img');
      const imgRect = imgElement?.getBoundingClientRect();
      
      if (!imgRect) return;
      
      // استخدام أبعاد الصورة المعروضة بدلاً من أبعاد الكانفاس للحصول على تحويل أكثر دقة
      const adjustedScaleX = img.naturalWidth / imgRect.width;
      const adjustedScaleY = img.naturalHeight / imgRect.height;
      
      // رسم جميع عناصر النص
      textElements.forEach(text => {
        ctx.save();
        
        // تطبيق تنسيقات النص
        let fontStyle = '';
        if (text.bold) fontStyle += 'bold ';
        if (text.italic) fontStyle += 'italic ';
        fontStyle += `${text.size * adjustedScaleY}px ${text.font}`;
        ctx.font = fontStyle;
        ctx.fillStyle = text.color;
        ctx.textAlign = text.align as CanvasTextAlign;
        ctx.direction = text.direction === 'rtl' ? 'rtl' : 'ltr';
        
        // تصحيح موضع النص باستخدام أبعاد الصورة الحقيقية بدلاً من الكانفاس
        // حساب الإزاحة الدقيقة من حافة الصورة
        const imgLeft = imgRect.left - displayedRect.left;
        const imgTop = imgRect.top - displayedRect.top;
        
        // حساب المواقع النسبية للنص داخل صورة العرض
        const relativeX = text.x - imgLeft;
        const relativeY = text.y - imgTop;
        
        if (text.shadow) {
          ctx.shadowColor = text.shadowColor;
          ctx.shadowBlur = 4 * adjustedScaleY;
          ctx.shadowOffsetX = 2 * adjustedScaleX;
          ctx.shadowOffsetY = 2 * adjustedScaleY;
        }
        
        if (text.stroke) {
          ctx.strokeStyle = text.strokeColor;
          ctx.lineWidth = 2 * adjustedScaleY;
        }
        
        // رسم النص مع مراعاة الرجوع للسطر التالي
        const lines = text.content.split('\n');
        const lineHeight = text.size * 1.2; // ارتفاع السطر (1.2 من حجم النص)
        
        lines.forEach((line: string, index: number) => {
          // استخدام الإحداثيات النسبية المصححة
          const yPosition = (relativeY + (index * lineHeight)) * adjustedScaleY;
          const xPosition = relativeX * adjustedScaleX;
          
          if (text.stroke) {
            ctx.strokeText(line, xPosition, yPosition);
          }
          
          ctx.fillText(line, xPosition, yPosition);
        });
        
        ctx.restore();
      });
      
      // تحويل إلى صورة وتنزيلها
      const dataURL = canvas.toDataURL(`image/${fileFormat}`, 1.0);
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${fileName}.${fileFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم حفظ التصميم بنجاح"
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التصميم. تأكد من أن الصور محملة بشكل صحيح.",
        variant: "destructive"
      });
    }
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
              التصميم
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              التصدير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar - Tools and Elements */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">اختيار القالب والأبعاد</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="template">القالب</Label>
                      <Select
                        value={selectedTemplateId.toString()}
                        onValueChange={handleTemplateChange}
                      >
                        <SelectTrigger id="template" className="mt-1">
                          <SelectValue placeholder="اختر القالب" />
                        </SelectTrigger>
                        <SelectContent>
                          {templateData.map(template => (
                            <SelectItem key={template.id} value={template.id.toString()}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="variant">الأبعاد</Label>
                      <Select
                        value={selectedVariantId.toString()}
                        onValueChange={handleVariantChange}
                      >
                        <SelectTrigger id="variant" className="mt-1">
                          <SelectValue placeholder="اختر الأبعاد" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedTemplate.variants.map(variant => (
                            <SelectItem key={variant.id} value={variant.id.toString()}>
                              {variant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
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
                      <Button variant="outline" className="flex flex-col h-auto py-3" onClick={() => setShowGrid(!showGrid)}>
                        <Grid className="h-5 w-5 mb-1" />
                        <span>{showGrid ? 'إخفاء الشبكة' : 'إظهار الشبكة'}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-auto py-3"
                        onClick={handleRemoveElement}
                        disabled={activeTextId === null}
                      >
                        <Trash className="h-5 w-5 mb-1" />
                        <span>حذف العنصر</span>
                      </Button>
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
                        <span className="text-lg">-</span>
                      </Button>
                      <span>{zoomLevel}%</span>
                      <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                        <span className="text-lg">+</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8" onClick={handleExportDesign}>
                        <Download className="h-4 w-4 ml-1" />
                        تصدير
                      </Button>
                      <Button variant="outline" size="sm" className="h-8" onClick={handleShareDesign}>
                        <Save className="h-4 w-4 ml-1" />
                        حفظ
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 min-h-[500px] bg-muted/30 overflow-auto">
                    <div 
                      ref={canvasRef}
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
                      onMouseMove={isDragging ? handleMouseMove : undefined}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      {showGrid && (
                        <div className="absolute inset-0 pointer-events-none z-10">
                          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="relative h-full">
                        <img 
                          src={selectedVariant.url} 
                          alt={selectedVariant.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                        
                        {/* Text Elements */}
                        {textElements.map((text) => (
                          <div 
                            key={text.id}
                            className={`absolute cursor-move ${activeTextId === text.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
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
                              width: text.width ? `${text.width}px` : 'auto',
                              minWidth: '30px',
                              minHeight: '20px',
                              zIndex: 20
                            }}
                            onMouseDown={(e) => handleTextMouseDown(e, text.id)}
                          >
                            {text.content || "نص جديد"}
                            
                            {/* Resize handle - only shown when element is active */}
                            {activeTextId === text.id && (
                              <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary opacity-50 cursor-nwse-resize"
                                  onMouseDown={(e) => {
                                    e.stopPropagation();
                                    const startWidth = text.width || 200;
                                    const startHeight = text.height || 50;
                                    const startX = e.clientX;
                                    const startY = e.clientY;
                                    
                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                      const dx = moveEvent.clientX - startX;
                                      const dy = moveEvent.clientY - startY;
                                      const newWidth = startWidth + dx;
                                      const newHeight = startHeight + dy;
                                      
                                      resizeTextElement(
                                        Math.max(30, newWidth), 
                                        Math.max(20, newHeight)
                                      );
                                    };
                                    
                                    const handleMouseUp = () => {
                                      document.removeEventListener('mousemove', handleMouseMove);
                                      document.removeEventListener('mouseup', handleMouseUp);
                                    };
                                    
                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                  }}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
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
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>تنسيق الملف</Label>
                      <RadioGroup 
                        value={fileFormat} 
                        onValueChange={setFileFormat}
                        className="mt-2"
                      >
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
                          <input 
                            type="checkbox" 
                            id="keep-ratio" 
                            className="rounded text-primary"
                            checked={keepRatio}
                            onChange={(e) => setKeepRatio(e.target.checked)}
                          />
                          <label htmlFor="keep-ratio">الحفاظ على الأبعاد الأصلية</label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input 
                            type="checkbox" 
                            id="transparent-bg" 
                            className="rounded text-primary"
                            checked={transparentBg}
                            onChange={(e) => setTransparentBg(e.target.checked)}
                          />
                          <label htmlFor="transparent-bg">خلفية شفافة (PNG فقط)</label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input 
                            type="checkbox" 
                            id="include-text-bg" 
                            className="rounded text-primary"
                            checked={includeTextBg}
                            onChange={(e) => setIncludeTextBg(e.target.checked)}
                          />
                          <label htmlFor="include-text-bg">إظهار خلفيات النصوص</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center bg-muted/20 rounded-lg border border-dashed p-6">
                    <div className="text-center">
                      <div className="mb-4">
                        <img 
                          src={selectedVariant.url} 
                          alt="معاينة التصدير" 
                          className="max-h-[200px] max-w-full object-contain mx-auto"
                          crossOrigin="anonymous"
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
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end">
                  <Button onClick={handleExportDesign}>
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
