
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
  CardFooter,
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
  Text,
  Grid,
  Download,
  Trash,
  Save,
  ArrowUp,
  Square,
  MoveHorizontal,
  Opacity,
  ImageIcon
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

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

// وضع الصور من بيانات التكوين
const logoOptions = {
  squareLogo: "https://placehold.co/400x400/png?text=شعار+مربع",
  horizontalLogo: "https://placehold.co/600x150/png?text=شعار+أفقي",
};

// تعريف الأنواع للعناصر
type ElementType = "text" | "logo";

interface ElementBase {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  opacity: number;
}

interface TextElement extends ElementBase {
  type: "text";
  content: string;
  font: string;
  size: number;
  color: string;
  align: string;
  direction: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  shadow: boolean;
  shadowColor: string;
  stroke: boolean;
  strokeColor: string;
  backgroundColor: string;
  width: number;
  height: number;
}

interface LogoElement extends ElementBase {
  type: "logo";
  logoType: "square" | "horizontal";
  width: number;
  height: number;
  source: string;
}

type DesignElement = TextElement | LogoElement;

const CustomDesignPage = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("design");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [activeElementId, setActiveElementId] = useState<number | null>(null);
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [elementCounter, setElementCounter] = useState(0);
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

  // Background image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState(`تصميم_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}`);
  const [fileFormat, setFileFormat] = useState("png");
  const [keepRatio, setKeepRatio] = useState(true);
  const [transparentBg, setTransparentBg] = useState(false);
  const [includeTextBg, setIncludeTextBg] = useState(false);
  
  // كائن الصورة الذي سنستخدمه للتصدير
  const customImg = useRef<HTMLImageElement | null>(null);
  // مرجع للصورة المعروضة في واجهة المستخدم
  const displayedImgRef = useRef<HTMLImageElement | null>(null);

  // إذا كانت هناك صورة خلفية، احفظها كصورة لاستخدامها لاحقًا في التصدير
  useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // مهم للتعامل مع CORS
      img.src = backgroundImage;
      img.onload = () => {
        customImg.current = img;
      };
    }
  }, [backgroundImage]);

  // عند تحميل الصفحة، نضيف مربع نص افتراضي إذا كانت هناك صورة خلفية
  useEffect(() => {
    if (backgroundImage && elements.length === 0) {
      handleAddText();
    }
  }, [backgroundImage]);

  useEffect(() => {
    // تحديث مرجع الصورة المعروضة بعد التحميل
    if (canvasRef.current && backgroundImage) {
      const imgElement = canvasRef.current.querySelector('img');
      if (imgElement) {
        displayedImgRef.current = imgElement;
      }
    }
  }, [backgroundImage, canvasRef.current]);

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
    const newText: TextElement = {
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
      width: 200, // عرض كافٍ للنص
      height: 60,  // ارتفاع كافٍ لسطرين
      opacity: 1
    };
    
    setElements(prev => [...prev, newText]);
    setActiveElementId(newId);
    setElementCounter(newId);
    setTextContent("نص جديد");

    toast({
      title: "تم إضافة نص جديد",
      description: "يمكنك الآن تحرير النص وتنسيقه"
    });
  };

  const handleAddLogo = (logoType: "square" | "horizontal") => {
    if (!canvasRef.current) return;
    
    // الحصول على أبعاد مساحة العمل
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    // تحديد موقع الشعار استنادًا إلى نوعه وحجمه
    let posX: number, posY: number, logoWidth: number, logoHeight: number;
    
    // اختيار مصدر الشعار بناءً على نوعه
    const logoSrc = logoType === "square" 
      ? logoOptions.squareLogo
      : logoOptions.horizontalLogo;
    
    if (logoType === "square") {
      logoWidth = 80;
      logoHeight = 80;
      posX = canvasRect.width - logoWidth - 20; // الركن العلوي الأيمن
      posY = 20;
    } else {
      logoWidth = 200;
      logoHeight = 60;
      posX = canvasRect.width / 2 - logoWidth / 2; // في الوسط أعلى الصورة
      posY = 20;
    }

    const newId = elementCounter + 1;
    const newLogo: LogoElement = {
      id: newId,
      type: "logo",
      logoType,
      x: posX,
      y: posY,
      width: logoWidth,
      height: logoHeight,
      source: logoSrc,
      opacity: 1
    };
    
    setElements(prev => [...prev, newLogo]);
    setActiveElementId(newId);
    setElementCounter(newId);

    toast({
      title: "تم إضافة شعار",
      description: "يمكنك الآن تحريك الشعار وتغيير حجمه"
    });
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // فحص أن الملف هو صورة
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطأ في نوع الملف",
        description: "يرجى تحديد ملف صورة.",
        variant: "destructive"
      });
      return;
    }

    // إنشاء URL للصورة
    const imageUrl = URL.createObjectURL(file);
    setBackgroundImage(imageUrl);
    
    // إضافة نص افتراضي إذا لم يكن هناك نصوص بعد
    if (elements.length === 0) {
      setTimeout(handleAddText, 100); // تأخير قليل لضمان تحميل الصورة
    }

    toast({
      title: "تم تحميل الصورة بنجاح",
      description: "يمكنك الآن إضافة النصوص على الصورة"
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setTextContent(newContent);
    
    if (activeElementId !== null) {
      setElements(elements.map(elem => {
        if (elem.id === activeElementId && elem.type === "text") {
          return { ...elem, content: newContent };
        }
        return elem;
      }));
    }
  };

  const handleSetOpacity = (value: number[]) => {
    if (activeElementId === null) return;
    
    setElements(elements.map(elem => {
      if (elem.id === activeElementId) {
        return { ...elem, opacity: value[0] };
      }
      return elem;
    }));
  };

  // Element dragging functions
  const handleElementMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setActiveElementId(id);
    setIsDragging(true);

    const element = elements.find(elem => elem.id === id);
    if (!element) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    if (element.type === "text") {
      setTextContent(element.content);
      setSelectedFont(element.font);
      setFontSize(element.size);
      setTextAlign(element.align);
      setTextColor(element.color);
      setTextDirection(element.direction);
      setTextBold(element.bold);
      setTextItalic(element.italic);
      setTextUnderline(element.underline);
      setTextShadow(element.shadow);
      setTextShadowColor(element.shadowColor);
      setTextStroke(element.stroke);
      setTextStrokeColor(element.strokeColor);
      setTextBackgroundColor(element.backgroundColor);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeElementId === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setElements(elements.map(elem => 
      elem.id === activeElementId ? { ...elem, x, y } : elem
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateActiveTextStyle = (property: string, value: any) => {
    if (activeElementId === null) return;
    
    setElements(elements.map(elem => {
      if (elem.id === activeElementId && elem.type === "text") {
        return { ...elem, [property]: value };
      }
      return elem;
    }));
  };

  const resizeElement = (width: number, height: number) => {
    if (activeElementId === null) return;
    
    setElements(elements.map(elem => {
      if (elem.id === activeElementId) {
        if (elem.type === "text") {
          return { ...elem, width, height };
        } else if (elem.type === "logo") {
          return { ...elem, width, height };
        }
      }
      return elem;
    }));
  };

  const handleRemoveElement = () => {
    if (activeElementId === null) return;
    
    setElements(elements.filter(elem => elem.id !== activeElementId));
    setActiveElementId(null);
    
    toast({
      title: "تم حذف العنصر",
      description: "تم حذف العنصر بنجاح"
    });
  };

  const handleExportDesign = () => {
    if (!backgroundImage || !customImg.current) {
      toast({
        title: "خطأ في التصدير",
        description: "الرجاء تحميل صورة خلفية أولاً",
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
      const img = customImg.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      // رسم صورة الخلفية
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // الحصول على عنصر الكانفاس
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;
      
      // الحصول على الصورة المعروضة
      const imgElement = displayedImgRef.current;
      if (!imgElement) return;
      
      // الحصول على أبعاد الصورة المعروضة في واجهة المستخدم
      const displayedRect = imgElement.getBoundingClientRect();
      const canvasRect = canvasElement.getBoundingClientRect();
      
      // حساب نسب التحويل من أحجام العرض إلى الحجم الأصلي للصورة
      const scaleX = img.naturalWidth / displayedRect.width;
      const scaleY = img.naturalHeight / displayedRect.height;
      
      // رسم جميع عناصر التصميم
      for (const element of elements) {
        // تحديد الموضع على الصورة المعروضة
        const elementNode = canvasElement.querySelector(`[data-element-id="${element.id}"]`) as HTMLElement;
        if (!elementNode) continue;
        
        const elementRect = elementNode.getBoundingClientRect();
        
        // حساب الإزاحة من حافة الصورة
        const relativeX = elementRect.left - displayedRect.left;
        const relativeY = elementRect.top - displayedRect.top;
        
        // تحويل الموضع النسبي إلى موضع في الصورة الأصلية
        const absoluteX = relativeX * scaleX;
        const absoluteY = relativeY * scaleY;
        
        if (element.type === "text") {
          ctx.save();
          
          // تطبيق تنسيقات النص
          let fontStyle = '';
          if (element.bold) fontStyle += 'bold ';
          if (element.italic) fontStyle += 'italic ';
          fontStyle += `${element.size * scaleY}px ${element.font}`;
          ctx.font = fontStyle;
          ctx.fillStyle = element.color;
          ctx.textAlign = element.align as CanvasTextAlign;
          ctx.direction = element.direction === 'rtl' ? 'rtl' : 'ltr';
          ctx.globalAlpha = element.opacity;
          
          if (element.shadow) {
            ctx.shadowColor = element.shadowColor;
            ctx.shadowBlur = 4 * scaleY;
            ctx.shadowOffsetX = 2 * scaleX;
            ctx.shadowOffsetY = 2 * scaleY;
          }
          
          if (element.stroke) {
            ctx.strokeStyle = element.strokeColor;
            ctx.lineWidth = 2 * scaleY;
          }
          
          // رسم خلفية مربع النص إذا كان مطلوباً
          if (includeTextBg && element.backgroundColor !== 'transparent') {
            const padding = 5 * scaleY;
            const lines = element.content.split('\n');
            const lineHeight = element.size * 1.2 * scaleY;
            const textHeight = lines.length * lineHeight;
            
            ctx.fillStyle = element.backgroundColor;
            
            let textWidth = 0;
            for (const line of lines) {
              const lineWidth = ctx.measureText(line).width;
              textWidth = Math.max(textWidth, lineWidth);
            }
            
            // تحديد موضع المستطيل استنادًا إلى محاذاة النص
            let rectX = absoluteX;
            const rectY = absoluteY;
            
            if (element.align === 'center') rectX -= textWidth / 2;
            else if (element.align === 'right') rectX -= textWidth;
            
            ctx.fillRect(
              rectX - padding, 
              rectY - padding,
              textWidth + padding * 2, 
              textHeight + padding * 2
            );
          }
          
          // رسم النص مع مراعاة الرجوع للسطر التالي
          ctx.fillStyle = element.color;
          const lines = element.content.split('\n');
          const lineHeight = element.size * 1.2 * scaleY; // ارتفاع السطر
          
          lines.forEach((line: string, index: number) => {
            // تصحيح موضع النص عند الرسم
            let textX = absoluteX;
            let textY = absoluteY + (index * lineHeight) + element.size * 0.8 * scaleY; // إضافة إزاحة للمحاذاة الرأسية
            
            if (element.stroke) {
              ctx.strokeText(line, textX, textY);
            }
            
            ctx.fillText(line, textX, textY);
          });
          
          ctx.restore();
        } else if (element.type === "logo") {
          ctx.save();
          
          // ضبط شفافية الشعار
          ctx.globalAlpha = element.opacity;
          
          // إنشاء صورة جديدة للشعار
          const logoImg = new Image();
          logoImg.crossOrigin = "anonymous";
          logoImg.src = element.source;
          
          // رسم الشعار بعد تحميله
          logoImg.onload = () => {
            const scaledWidth = element.width * scaleX;
            const scaledHeight = element.height * scaleY;
            ctx.drawImage(logoImg, absoluteX, absoluteY, scaledWidth, scaledHeight);
            
            // استكمال عملية التصدير بعد رسم الشعار
            if (element === elements[elements.length - 1]) {
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
            }
          };
          
          ctx.restore();
        }
      }
      
      // التصدير إذا لم تكن هناك صور شعارات للانتظار لتحميلها
      if (!elements.some(elem => elem.type === "logo")) {
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
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التصميم. تأكد من أن الصور محملة بشكل صحيح.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">تصميم مخصص</h1>
        <p className="text-muted-foreground mb-8">
          قم بتحميل صورة خاصة وتخصيص التصميم بحرية كاملة
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
                    <CardTitle className="text-lg">الصورة الخلفية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Label htmlFor="bgImage">تحميل صورة خلفية</Label>
                      <Input
                        id="bgImage"
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="mt-1"
                      />
                      {!backgroundImage && (
                        <div className="text-sm text-muted-foreground mt-2">
                          قم بتحميل صورة من جهازك لتبدأ التصميم
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {backgroundImage && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">الأدوات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
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
                          disabled={activeElementId === null}
                        >
                          <Trash className="h-5 w-5 mb-1" />
                          <span>حذف العنصر</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-auto py-3" onClick={() => handleAddLogo("square")}>
                          <Square className="h-5 w-5 mb-1" />
                          <span>شعار مربع</span>
                        </Button>
                        <Button variant="outline" className="flex flex-col h-auto py-3" onClick={() => handleAddLogo("horizontal")}>
                          <MoveHorizontal className="h-5 w-5 mb-1" />
                          <span>شعار أفقي</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Element Editing Options */}
                {activeElementId !== null && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">تحرير العنصر</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {elements.find(e => e.id === activeElementId)?.type === "text" ? (
                        // تحرير النص
                        <>
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
                        </>
                      ) : (
                        // تحرير الشعار
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="logoType">نوع الشعار</Label>
                            <div className="text-sm mt-1">
                              {(elements.find(e => e.id === activeElementId) as LogoElement)?.logoType === "square" ? "شعار مربع" : "شعار أفقي"}
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="logoOpacity">شفافية الشعار</Label>
                            <Slider 
                              id="logoOpacity" 
                              min={0} 
                              max={1} 
                              step={0.01} 
                              defaultValue={[(elements.find(e => e.id === activeElementId) as ElementBase)?.opacity || 1]} 
                              onValueChange={handleSetOpacity}
                              className="mt-2"
                            />
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              className="w-full" 
                              onClick={handleRemoveElement}
                            >
                              <Trash className="h-4 w-4 ml-2" />
                              حذف الشعار
                            </Button>
                          </div>
                        </div>
                      )}
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8" 
                        onClick={handleExportDesign}
                        disabled={!backgroundImage}
                      >
                        <Download className="h-4 w-4 ml-1" />
                        تصدير
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8"
                        disabled={!backgroundImage}
                      >
                        <Save className="h-4 w-4 ml-1" />
                        حفظ
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 min-h-[500px] bg-muted/30 overflow-auto">
                    {!backgroundImage ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <ArrowUp className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">قم بتحميل صورة لتبدأ</h3>
                        <p className="text-muted-foreground">
                          استخدم خيار "تحميل صورة خلفية" من القائمة الجانبية لرفع الصورة التي تريد تصميمها
                        </p>
                      </div>
                    ) : (
                      <div 
                        ref={canvasRef}
                        className="relative"
                        style={{
                          transform: `scale(${zoomLevel / 100})`,
                          transition: 'transform 0.2s',
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
                        
                        <div className="relative">
                          <img 
                            src={backgroundImage} 
                            alt="صورة مخصصة"
                            className="max-w-full h-auto"
                            crossOrigin="anonymous"
                          />
                          
                          {/* Design Elements */}
                          {elements.map((element) => {
                            if (element.type === "text") {
                              return (
                                <div 
                                  key={element.id}
                                  data-element-id={element.id}
                                  className={`absolute cursor-move ${activeElementId === element.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                  style={{
                                    left: `${element.x}px`,
                                    top: `${element.y}px`,
                                    fontFamily: element.font,
                                    fontSize: `${element.size}px`,
                                    color: element.color,
                                    textAlign: element.align as "left" | "center" | "right",
                                    direction: element.direction as "rtl" | "ltr",
                                    fontWeight: element.bold ? 'bold' : 'normal',
                                    fontStyle: element.italic ? 'italic' : 'normal',
                                    textDecoration: element.underline ? 'underline' : 'none',
                                    textShadow: element.shadow ? `1px 1px 2px ${element.shadowColor}` : 'none',
                                    backgroundColor: element.backgroundColor !== 'transparent' ? element.backgroundColor : 'transparent',
                                    WebkitTextStroke: element.stroke ? `1px ${element.strokeColor}` : 'none',
                                    padding: '4px',
                                    width: element.width ? `${element.width}px` : 'auto',
                                    minWidth: '30px',
                                    minHeight: '20px',
                                    opacity: element.opacity,
                                    zIndex: 20
                                  }}
                                  onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                                >
                                  {element.content}
                                  
                                  {/* Resize handle - only shown when element is active */}
                                  {activeElementId === element.id && (
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary opacity-50 cursor-nwse-resize"
                                        onMouseDown={(e) => {
                                          e.stopPropagation();
                                          const startWidth = element.width || 200;
                                          const startHeight = element.height || 50;
                                          const startX = e.clientX;
                                          const startY = e.clientY;
                                          
                                          const handleMouseMove = (moveEvent: MouseEvent) => {
                                            const dx = moveEvent.clientX - startX;
                                            const dy = moveEvent.clientY - startY;
                                            const newWidth = startWidth + dx;
                                            const newHeight = startHeight + dy;
                                            
                                            resizeElement(
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
                              );
                            } else if (element.type === "logo") {
                              return (
                                <div 
                                  key={element.id}
                                  data-element-id={element.id}
                                  className={`absolute cursor-move ${activeElementId === element.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                  style={{
                                    left: `${element.x}px`,
                                    top: `${element.y}px`,
                                    width: `${element.width}px`,
                                    height: `${element.height}px`,
                                    opacity: element.opacity
                                  }}
                                  onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                                >
                                  <img 
                                    src={element.source} 
                                    alt="شعار"
                                    className="w-full h-full object-contain"
                                    crossOrigin="anonymous"
                                  />
                                  
                                  {/* Resize handle - only shown when element is active */}
                                  {activeElementId === element.id && (
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary opacity-50 cursor-nwse-resize"
                                        onMouseDown={(e) => {
                                          e.stopPropagation();
                                          const startWidth = element.width || 100;
                                          const startHeight = element.height || 100;
                                          const startX = e.clientX;
                                          const startY = e.clientY;
                                          
                                          const handleMouseMove = (moveEvent: MouseEvent) => {
                                            const dx = moveEvent.clientX - startX;
                                            const dy = moveEvent.clientY - startY;
                                            const newWidth = startWidth + dx;
                                            const newHeight = startHeight + dy;
                                            
                                            resizeElement(
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
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    )}
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
                          <label htmlFor="include-text-bg">تضمين خلفية النص</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">معاينة الإعدادات</h3>
                      <div className="p-4 border rounded bg-muted/20">
                        <p className="text-sm">سيتم تصدير التصميم بالإعدادات التالية:</p>
                        <ul className="mt-2 text-sm space-y-1">
                          <li>الاسم: {fileName}.{fileFormat}</li>
                          <li>التنسيق: {fileFormat === 'png' ? 'PNG' : 'JPEG'}</li>
                          <li>الحفاظ على النسبة: {keepRatio ? 'نعم' : 'لا'}</li>
                          {fileFormat === 'png' && (
                            <li>خلفية شفافة: {transparentBg ? 'نعم' : 'لا'}</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full" 
                        onClick={handleExportDesign}
                        disabled={!backgroundImage}
                      >
                        <Download className="ml-2 h-4 w-4" />
                        تصدير التصميم
                      </Button>
                    </div>
                  </div>
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

export default CustomDesignPage;
