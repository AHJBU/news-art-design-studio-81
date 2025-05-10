
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
  Image,
  Maximize,
  Minimize,
  Square,
  Move,
  RectangleHorizontal
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

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

// بيانات الشعار
const logoOptions = {
  square: "https://i.ibb.co/3vctvJw/logo-square.png", // شعار مربع
  horizontal: "https://i.ibb.co/kqnQfPz/logo-horizontal.png" // شعار أفقي
};

// نوع العنصر (نص أو صورة)
type ElementType = "text" | "image";

// واجهة لكل عنصر
interface DesignElement {
  id: number;
  type: ElementType;
  content?: string; // للنصوص
  src?: string; // للصور
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number; // للشفافية
  
  // خصائص النص
  font?: string;
  size?: number;
  color?: string;
  align?: string;
  direction?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  shadow?: boolean;
  shadowColor?: string;
  stroke?: boolean;
  strokeColor?: string;
  backgroundColor?: string;
}

const NewsDesignPage = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("design");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [activeElementId, setActiveElementId] = useState<number | null>(null);
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [elementCounter, setElementCounter] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  
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

  const activeElement = activeElementId !== null 
    ? elements.find(el => el.id === activeElementId) 
    : null;

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
    if (elements.length === 0) {
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
    const centerY = canvasRect.height / 2 - 30; // نصف ارتفاع مربع النص تقريبًا

    const newId = elementCounter + 1;
    const newElement: DesignElement = {
      id: newId,
      type: "text",
      content: "نص جديد",
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
      width: 200,
      height: 60  // ارتفاع أكبر للنص
    };
    
    setElements([...elements, newElement]);
    setActiveElementId(newId);
    setElementCounter(newId);
    setTextContent("نص جديد");

    toast({
      title: "تم إضافة نص جديد",
      description: "يمكنك الآن تحرير النص وتنسيقه"
    });
  };

  // إضافة شعار مربع
  const handleAddSquareLogo = () => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = canvasRect.width / 2 - 40; // وسط الكانفاس مع إزاحة
    const centerY = canvasRect.height - 100; // في أسفل الكانفاس

    const newId = elementCounter + 1;
    const newElement: DesignElement = {
      id: newId,
      type: "image",
      src: logoOptions.square,
      x: centerX,
      y: centerY,
      width: 80,
      height: 80,
      opacity: 1
    };
    
    setElements([...elements, newElement]);
    setActiveElementId(newId);
    setElementCounter(newId);

    toast({
      title: "تم إضافة الشعار المربع",
      description: "يمكنك تحريك الشعار وتغيير حجمه"
    });
  };

  // إضافة شعار أفقي
  const handleAddHorizontalLogo = () => {
    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = canvasRect.width / 2 - 75; // وسط الكانفاس مع إزاحة
    const centerY = canvasRect.height - 80; // في أسفل الكانفاس

    const newId = elementCounter + 1;
    const newElement: DesignElement = {
      id: newId,
      type: "image",
      src: logoOptions.horizontal,
      x: centerX,
      y: centerY,
      width: 150,
      height: 50,
      opacity: 1
    };
    
    setElements([...elements, newElement]);
    setActiveElementId(newId);
    setElementCounter(newId);

    toast({
      title: "تم إضافة الشعار الأفقي",
      description: "يمكنك تحريك الشعار وتغيير حجمه"
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setTextContent(newContent);
    
    if (activeElementId !== null) {
      setElements(elements.map(element => 
        element.id === activeElementId && element.type === "text" 
          ? { ...element, content: newContent } 
          : element
      ));
    }
  };

  // Element dragging functions
  const handleElementMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setActiveElementId(id);
    setIsDragging(true);

    const element = elements.find(el => el.id === id);
    if (element) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });

      if (element.type === "text") {
        setTextContent(element.content || "");
        setSelectedFont(element.font || "Cairo");
        setFontSize(element.size || 24);
        setTextAlign(element.align || "right");
        setTextColor(element.color || "#ffffff");
        setTextDirection(element.direction || "rtl");
        setTextBold(element.bold || false);
        setTextItalic(element.italic || false);
        setTextUnderline(element.underline || false);
        setTextShadow(element.shadow || false);
        setTextShadowColor(element.shadowColor || "#000000");
        setTextStroke(element.stroke || false);
        setTextStrokeColor(element.strokeColor || "#000000");
        setTextBackgroundColor(element.backgroundColor || "transparent");
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging && activeElementId !== null && !isResizing) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 10));
      const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 10));

      setElements(elements.map(element => 
        element.id === activeElementId ? { ...element, x, y } : element
      ));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const updateActiveElementStyle = (property: string, value: any) => {
    if (activeElementId === null) return;
    
    setElements(elements.map(element => 
      element.id === activeElementId ? { ...element, [property]: value } : element
    ));
  };

  const handleOpacityChange = (value: number[]) => {
    if (activeElementId === null) return;
    
    setElements(elements.map(element => 
      element.id === activeElementId ? { ...element, opacity: value[0] / 100 } : element
    ));
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
  };

  const handleRemoveElement = () => {
    if (activeElementId === null) return;
    
    setElements(elements.filter(element => element.id !== activeElementId));
    setActiveElementId(null);
    
    toast({
      title: "تم حذف العنصر",
      description: "تم حذف العنصر بنجاح"
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
      
      // الحصول على حاوية الكانفاس المرئية
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;
      
      // الحصول على عناصر DOM الحقيقية للصورة والعناصر
      const imgElement = canvasElement.querySelector('img');
      if (!imgElement) return;
      
      const imgRect = imgElement.getBoundingClientRect();
      const containerRect = canvasElement.getBoundingClientRect();
      
      // حساب عاملي التحويل
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      
      // رسم جميع العناصر
      elements.forEach(element => {
        // حساب الموقع النسبي للعنصر داخل الكانفاس
        const elementDOM = document.getElementById(`element-${element.id}`);
        if (!elementDOM) return;
        
        const elementRect = elementDOM.getBoundingClientRect();
        
        // حساب موقع العنصر بالنسبة لصورة القالب
        const relativeX = elementRect.left - imgRect.left;
        const relativeY = elementRect.top - imgRect.top;
        
        // تحويل الإحداثيات إلى مقياس الصورة الأصلية
        const scaledX = relativeX * scaleX;
        const scaledY = relativeY * scaleY;
        const scaledWidth = elementRect.width * scaleX;
        const scaledHeight = elementRect.height * scaleY;
        
        if (element.type === "text" && element.content) {
          ctx.save();
          
          // تطبيق تنسيقات النص
          let fontStyle = '';
          if (element.bold) fontStyle += 'bold ';
          if (element.italic) fontStyle += 'italic ';
          fontStyle += `${element.size! * scaleY}px ${element.font}`;
          ctx.font = fontStyle;
          ctx.fillStyle = element.color || "#ffffff";
          ctx.textAlign = element.align as CanvasTextAlign || "right";
          ctx.direction = element.direction === 'rtl' ? 'rtl' : 'ltr';
          
          if (element.shadow) {
            ctx.shadowColor = element.shadowColor || "#000000";
            ctx.shadowBlur = 4 * scaleY;
            ctx.shadowOffsetX = 2 * scaleX;
            ctx.shadowOffsetY = 2 * scaleY;
          }
          
          if (element.stroke) {
            ctx.strokeStyle = element.strokeColor || "#000000";
            ctx.lineWidth = 2 * scaleY;
          }
          
          // حساب الإزاحة لمحاذاة النص
          let xOffset = 0;
          if (element.align === "center") {
            xOffset = scaledWidth / 2;
          } else if (element.align === "right") {
            xOffset = scaledWidth;
          }
          
          // رسم النص مع مراعاة الرجوع للسطر التالي
          const lines = element.content.split('\n');
          const lineHeight = element.size! * 1.2 * scaleY; // ارتفاع السطر
          
          lines.forEach((line: string, index: number) => {
            const yPosition = scaledY + (index * lineHeight / scaleY) * scaleY;
            
            if (element.stroke) {
              ctx.strokeText(line, scaledX + xOffset, yPosition + (element.size! * 0.8 * scaleY));
            }
            
            ctx.fillText(line, scaledX + xOffset, yPosition + (element.size! * 0.8 * scaleY));
          });
          
          ctx.restore();
        } else if (element.type === "image" && element.src) {
          // رسم الصورة (الشعار)
          const logoImg = new Image();
          logoImg.src = element.src;
          
          // استخدام الشفافية إذا كانت محددة
          if (element.opacity !== undefined) {
            ctx.globalAlpha = element.opacity;
          }
          
          ctx.drawImage(
            logoImg, 
            scaledX, 
            scaledY, 
            scaledWidth, 
            scaledHeight
          );
          
          ctx.globalAlpha = 1.0; // إعادة تعيين الشفافية
        }
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
                      <Button variant="outline" className="flex flex-col h-auto py-3" onClick={handleAddSquareLogo}>
                        <Square className="h-5 w-5 mb-1" />
                        <span>شعار مربع</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col h-auto py-3" onClick={handleAddHorizontalLogo}>
                        <RectangleHorizontal className="h-5 w-5 mb-1" />
                        <span>شعار أفقي</span>
                      </Button>
                      <Button variant="outline" className="flex flex-col h-auto py-3" onClick={() => setShowGrid(!showGrid)}>
                        <Grid className="h-5 w-5 mb-1" />
                        <span>{showGrid ? 'إخفاء الشبكة' : 'إظهار الشبكة'}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex flex-col h-auto py-3"
                        onClick={handleRemoveElement}
                        disabled={activeElementId === null}
                      >
                        <Trash className="h-5 w-5 mb-1" />
                        <span>حذف العنصر</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Text Editing Options */}
                {activeElement?.type === "text" && (
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
                              updateActiveElementStyle('size', newSize);
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
                              updateActiveElementStyle('size', newSize);
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => {
                              const newSize = Math.min(120, fontSize + 2);
                              setFontSize(newSize);
                              updateActiveElementStyle('size', newSize);
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
                            updateActiveElementStyle('font', val);
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
                              updateActiveElementStyle('align', 'right');
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
                              updateActiveElementStyle('align', 'center');
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
                              updateActiveElementStyle('align', 'left');
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
                                updateActiveElementStyle('color', color.value);
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
                              updateActiveElementStyle('bold', newValue);
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
                              updateActiveElementStyle('italic', newValue);
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
                              updateActiveElementStyle('underline', newValue);
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
                              updateActiveElementStyle('shadow', newValue);
                            }}
                          >
                            ظل
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Image Editing Options */}
                {activeElement?.type === "image" && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">تعديل الصورة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="opacity">الشفافية</Label>
                        <div className="pt-2">
                          <Slider
                            defaultValue={[(activeElement.opacity || 1) * 100]}
                            max={100}
                            step={1}
                            onValueChange={handleOpacityChange}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>المقاس</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (activeElementId === null) return;
                              const element = elements.find(el => el.id === activeElementId);
                              if (!element) return;
                              
                              const newWidth = element.width * 0.9;
                              const newHeight = element.height * 0.9;
                              
                              setElements(elements.map(el => 
                                el.id === activeElementId 
                                  ? { ...el, width: newWidth, height: newHeight } 
                                  : el
                              ));
                            }}
                          >
                            <Minimize className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (activeElementId === null) return;
                              const element = elements.find(el => el.id === activeElementId);
                              if (!element) return;
                              
                              const newWidth = element.width * 1.1;
                              const newHeight = element.height * 1.1;
                              
                              setElements(elements.map(el => 
                                el.id === activeElementId 
                                  ? { ...el, width: newWidth, height: newHeight } 
                                  : el
                              ));
                            }}
                          >
                            <Maximize className="h-4 w-4" />
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
                      className="relative select-none"
                      style={{
                        transform: `scale(${zoomLevel / 100})`,
                        transition: 'transform 0.2s',
                        aspectRatio: selectedVariant.ratio === "1:1" ? "1/1" : 
                                    selectedVariant.ratio === "4:5" ? "4/5" : "9/16",
                        width: selectedVariant.ratio === "1:1" ? '500px' : 
                              selectedVariant.ratio === "4:5" ? '400px' : '280px',
                        maxWidth: '100%'
                      }}
                      onMouseMove={handleMouseMove}
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
                        
                        {/* All Elements */}
                        {elements.map((element) => (
                          <div 
                            key={element.id}
                            id={`element-${element.id}`}
                            className={`absolute cursor-move ${activeElementId === element.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            style={{
                              left: `${element.x}px`,
                              top: `${element.y}px`,
                              width: element.width ? `${element.width}px` : 'auto',
                              height: element.height ? `${element.height}px` : 'auto',
                              opacity: element.opacity !== undefined ? element.opacity : 1,
                              ...(element.type === "text" ? {
                                fontFamily: element.font,
                                fontSize: `${element.size}px`,
                                color: element.color,
                                textAlign: element.align as any,
                                direction: element.direction,
                                fontWeight: element.bold ? 'bold' : 'normal',
                                fontStyle: element.italic ? 'italic' : 'normal',
                                textDecoration: element.underline ? 'underline' : 'none',
                                textShadow: element.shadow ? `1px 1px 2px ${element.shadowColor}` : 'none',
                                backgroundColor: element.backgroundColor !== 'transparent' ? element.backgroundColor : 'transparent',
                                WebkitTextStroke: element.stroke ? `1px ${element.strokeColor}` : 'none',
                                padding: '4px',
                                minWidth: '30px',
                                minHeight: '20px',
                                userSelect: 'none' as any,
                              } : {}),
                              zIndex: element.type === "image" ? 10 : 20
                            }}
                            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                          >
                            {element.type === "text" && (
                              element.content || "نص جديد"
                            )}
                            
                            {element.type === "image" && (
                              <img 
                                src={element.src} 
                                alt="شعار" 
                                className="w-full h-full object-contain" 
                                draggable={false}
                              />
                            )}
                            
                            {/* Resize handle - only shown when element is active */}
                            {activeElementId === element.id && (
                              <div 
                                className="absolute bottom-0 right-0 w-5 h-5 bg-primary opacity-50 cursor-nwse-resize"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  setIsResizing(true);
                                  
                                  const startWidth = element.width || 200;
                                  const startHeight = element.height || 50;
                                  const startX = e.clientX;
                                  const startY = e.clientY;
                                  
                                  const handleResize = (moveEvent: MouseEvent) => {
                                    if (!isResizing) return;
                                    
                                    const dx = moveEvent.clientX - startX;
                                    const dy = moveEvent.clientY - startY;
                                    const newWidth = Math.max(30, startWidth + dx);
                                    const newHeight = Math.max(20, startHeight + dy);
                                    
                                    setElements(elements.map(el => 
                                      el.id === element.id ? { ...el, width: newWidth, height: newHeight } : el
                                    ));
                                  };
                                  
                                  const handleResizeEnd = () => {
                                    setIsResizing(false);
                                    document.removeEventListener('mousemove', handleResize);
                                    document.removeEventListener('mouseup', handleResizeEnd);
                                  };
                                  
                                  document.addEventListener('mousemove', handleResize);
                                  document.addEventListener('mouseup', handleResizeEnd);
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
