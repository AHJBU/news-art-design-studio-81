
import { useState, useRef } from "react";
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
  CardFooter,
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
  Image as ImageIcon,
  Text,
  Pencil,
  SquareDashed,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Grid,
  Download,
  Share2,
  UploadCloud,
  Trash,
  Move,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

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
const logoOptions = [
  { id: 1, name: "الشعار الأفقي", url: "https://i.ibb.co/LXbq6Q2P/Logo.png" },
  { id: 2, name: "الشعار المربع", url: "https://i.ibb.co/mC7QkMtH/watermark.png" }
];

const CustomDesignPage = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("design");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [activeElementId, setActiveElementId] = useState<number | null>(null);
  const [elementsCounter, setElementsCounter] = useState(0);
  const [textElements, setTextElements] = useState<any[]>([]);
  const [logoElements, setLogoElements] = useState<any[]>([]);
  const [textContent, setTextContent] = useState("");
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
  
  // Logo editing states
  const [selectedLogoOpacity, setSelectedLogoOpacity] = useState(100);
  const [selectedLogoSize, setSelectedLogoSize] = useState(100);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "خطأ في تحميل الصورة",
        description: "الرجاء اختيار ملف صورة صالح",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);

      // Calculate aspect ratio
      const imgElement = document.createElement('img');
      imgElement.onload = () => {
        setImageAspectRatio(imgElement.width / imgElement.height);
      };
      imgElement.src = result;

      toast({
        title: "تم رفع الصورة بنجاح",
        description: "يمكنك البدء في تخصيص التصميم"
      });
    };

    reader.onerror = () => {
      toast({
        title: "خطأ في تحميل الصورة",
        description: "حدث خطأ أثناء قراءة ملف الصورة",
        variant: "destructive"
      });
    };

    reader.readAsDataURL(file);
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
    const newId = elementsCounter + 1;
    const newText = {
      id: newId,
      type: 'text',
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
      backgroundColor: textBackgroundColor,
      width: 200,
      height: 50
    };
    
    setTextElements([...textElements, newText]);
    setActiveElementId(newId);
    setElementsCounter(newId);
    setTextContent("نص جديد");

    toast({
      title: "تم إضافة نص جديد",
      description: "يمكنك الآن تحرير النص وتنسيقه"
    });
  };

  const handleAddLogo = (logoId: number) => {
    const logo = logoOptions.find(l => l.id === logoId);
    if (!logo) return;

    const newId = elementsCounter + 1;
    const newLogo = {
      id: newId,
      type: 'logo',
      logoId: logo.id,
      url: logo.url,
      x: 50,
      y: 50,
      opacity: 100,
      size: 100,
    };
    
    setLogoElements([...logoElements, newLogo]);
    setActiveElementId(newId);
    setElementsCounter(newId);
    setSelectedLogoOpacity(100);
    setSelectedLogoSize(100);

    toast({
      title: "تم إضافة الشعار",
      description: `تم إضافة ${logo.name} إلى التصميم`
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setTextContent(newContent);
    
    if (activeElementId !== null) {
      const activeElement = textElements.find(text => text.id === activeElementId);
      if (activeElement) {
        setTextElements(textElements.map(text => 
          text.id === activeElementId ? { ...text, content: newContent } : text
        ));
      }
    }
  };

  // New drag handling functions
  const handleElementMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setActiveElementId(id);
    setIsDragging(true);

    // Find the element being dragged
    const textElement = textElements.find(el => el.id === id);
    const logoElement = logoElements.find(el => el.id === id);
    const element = textElement || logoElement;
    
    if (element) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }

    // Text elements specific handling
    if (textElement) {
      setTextContent(textElement.content);
      setSelectedFont(textElement.font);
      setFontSize(textElement.size);
      setTextAlign(textElement.align);
      setTextColor(textElement.color);
      setTextDirection(textElement.direction);
      setTextBold(textElement.bold);
      setTextItalic(textElement.italic);
      setTextUnderline(textElement.underline);
      setTextShadow(textElement.shadow);
      setTextShadowColor(textElement.shadowColor);
      setTextStroke(textElement.stroke);
      setTextStrokeColor(textElement.strokeColor);
      setTextBackgroundColor(textElement.backgroundColor);
    }
    
    // Logo elements specific handling
    if (logoElement) {
      setSelectedLogoOpacity(logoElement.opacity);
      setSelectedLogoSize(logoElement.size);
    }
  };

  const handleElementMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeElementId === null) return;
    
    const workspace = document.getElementById('design-workspace');
    if (!workspace) return;
    
    const workspaceRect = workspace.getBoundingClientRect();
    const newX = e.clientX - workspaceRect.left - dragOffset.x;
    const newY = e.clientY - workspaceRect.top - dragOffset.y;
    
    // Update text elements
    const textElement = textElements.find(el => el.id === activeElementId);
    if (textElement) {
      setTextElements(textElements.map(text => 
        text.id === activeElementId ? { ...text, x: newX, y: newY } : text
      ));
      return;
    }
    
    // Update logo elements
    const logoElement = logoElements.find(el => el.id === activeElementId);
    if (logoElement) {
      setLogoElements(logoElements.map(logo => 
        logo.id === activeElementId ? { ...logo, x: newX, y: newY } : logo
      ));
      return;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateActiveTextStyle = (property: string, value: any) => {
    if (activeElementId === null) return;
    
    const activeElement = textElements.find(text => text.id === activeElementId);
    if (activeElement) {
      setTextElements(textElements.map(text => 
        text.id === activeElementId ? { ...text, [property]: value } : text
      ));
    }
  };

  const resizeTextElement = (width: number, height: number) => {
    if (activeElementId === null) return;
    
    const activeElement = textElements.find(text => text.id === activeElementId);
    if (activeElement) {
      setTextElements(textElements.map(text => 
        text.id === activeElementId ? { ...text, width, height } : text
      ));
    }
  };

  const updateActiveLogoStyle = (property: string, value: any) => {
    if (activeElementId === null) return;
    
    const activeLogo = logoElements.find(logo => logo.id === activeElementId);
    if (activeLogo) {
      setLogoElements(logoElements.map(logo => 
        logo.id === activeElementId ? { ...logo, [property]: value } : logo
      ));
    }
  };

  const handleRemoveElement = () => {
    if (activeElementId === null) return;
    
    const activeTextElement = textElements.find(text => text.id === activeElementId);
    const activeLogoElement = logoElements.find(logo => logo.id === activeElementId);
    
    if (activeTextElement) {
      setTextElements(textElements.filter(text => text.id !== activeElementId));
      toast({
        title: "تم حذف العنصر",
        description: "تم حذف النص بنجاح"
      });
    } else if (activeLogoElement) {
      setLogoElements(logoElements.filter(logo => logo.id !== activeElementId));
      toast({
        title: "تم حذف العنصر",
        description: "تم حذف الشعار بنجاح"
      });
    }
    
    setActiveElementId(null);
  };

  const handleExportDesign = () => {
    if (!uploadedImage) {
      toast({
        title: "لا يوجد تصميم للتصدير",
        description: "الرجاء رفع صورة أولاً لبدء التصميم",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "جاري تصدير التصميم",
      description: "سيتم تنزيل الصورة قريباً"
    });
    
    // Export implementation
    try {
      const workspace = document.getElementById('design-workspace');
      if (!workspace) {
        throw new Error("Element not found");
      }
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Could not create canvas context");
      }
      
      const rect = workspace.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Create a new image for the background
      const img = new Image();
      img.onload = () => {
        // Draw background image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw text elements
        textElements.forEach(text => {
          ctx.save();
          ctx.font = `${text.bold ? 'bold ' : ''}${text.italic ? 'italic ' : ''}${text.size}px ${text.font}`;
          ctx.fillStyle = text.color;
          ctx.textAlign = text.align as CanvasTextAlign;
          ctx.textBaseline = 'top';
          
          if (text.shadow) {
            ctx.shadowColor = text.shadowColor;
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
          }
          
          if (text.stroke) {
            ctx.strokeStyle = text.strokeColor;
            ctx.lineWidth = 2;
            ctx.strokeText(text.content, text.x, text.y);
          }
          
          ctx.fillText(text.content, text.x, text.y);
          ctx.restore();
        });
        
        // Draw logo elements
        logoElements.forEach(logo => {
          const logoImg = new Image();
          logoImg.onload = () => {
            ctx.save();
            ctx.globalAlpha = logo.opacity / 100;
            
            const scale = logo.size / 100;
            const width = logoImg.width * scale;
            const height = logoImg.height * scale;
            
            ctx.drawImage(logoImg, logo.x, logo.y, width, height);
            ctx.restore();
            
            // After the last element is drawn, export the canvas
            const lastLogo = logoElements[logoElements.length - 1];
            if (logo.id === lastLogo.id) {
              // Convert canvas to image and trigger download
              const dataURL = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.download = `تصميم_مخصص_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.png`;
              link.href = dataURL;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              toast({
                title: "تم التصدير بنجاح",
                description: "تم حفظ التصميم بنجاح"
              });
            }
          };
          logoImg.src = logo.url;
        });
        
        // If there are no logos, export the canvas immediately
        if (logoElements.length === 0) {
          const dataURL = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `تصميم_مخصص_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.png`;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast({
            title: "تم التصدير بنجاح",
            description: "تم حفظ التصميم بنجاح"
          });
        }
      };
      img.src = uploadedImage;
      
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التصميم",
        variant: "destructive"
      });
    }
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

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">تخصيص كامل</h1>
        <p className="text-muted-foreground mb-8">
          ارفع صورك الخاصة وأضف عليها النصوص والعناصر المخصصة
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              التصميم
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              التصدير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="space-y-6">
            {!uploadedImage ? (
              <Card className="bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <UploadCloud className="h-14 w-14 text-muted-foreground mb-5 opacity-60" />
                  <h2 className="text-xl font-semibold mb-2">رفع صورة للبدء</h2>
                  <p className="text-muted-foreground max-w-md mb-6">
                    ابدأ بتحميل صورة من جهازك. يمكنك إضافة نصوص وشعارات وتخصيصها بالكامل.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    اختيار صورة
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar - Tools and Elements */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">الأدوات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="flex flex-col h-auto py-3"
                          onClick={handleAddText}
                        >
                          <Text className="h-5 w-5 mb-1" />
                          <span>إضافة نص</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex flex-col h-auto py-3"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-5 w-5 mb-1" />
                          <span>تغيير الصورة</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex flex-col h-auto py-3"
                          onClick={() => setShowGrid(!showGrid)}
                        >
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

                  {/* Logos */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">الشعارات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {logoOptions.map((logo) => (
                          <Button 
                            key={logo.id}
                            variant="outline" 
                            className="h-auto p-3 flex flex-col"
                            onClick={() => handleAddLogo(logo.id)}
                          >
                            <div className="h-12 bg-muted/10 w-full rounded flex items-center justify-center p-1 mb-2">
                              <img 
                                src={logo.url} 
                                alt={logo.name}
                                className="max-h-full max-w-full object-contain" 
                              />
                            </div>
                            <span className="text-sm">{logo.name}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Text editing options (shown when text is selected) */}
                  {activeElementId !== null && textElements.some(text => text.id === activeElementId) && (
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

                  {/* Logo editing options (shown when logo is selected) */}
                  {activeElementId !== null && logoElements.some(logo => logo.id === activeElementId) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">تعديل الشعار</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>شفافية الشعار: {selectedLogoOpacity}%</Label>
                          <Slider
                            value={[selectedLogoOpacity]}
                            min={10}
                            max={100}
                            step={5}
                            onValueChange={(values) => {
                              const newValue = values[0];
                              setSelectedLogoOpacity(newValue);
                              updateActiveLogoStyle('opacity', newValue);
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>حجم الشعار: {selectedLogoSize}%</Label>
                          <Slider
                            value={[selectedLogoSize]}
                            min={20}
                            max={200}
                            step={5}
                            onValueChange={(values) => {
                              const newValue = values[0];
                              setSelectedLogoSize(newValue);
                              updateActiveLogoStyle('size', newValue);
                            }}
                          />
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={handleRemoveElement}
                          >
                            <Trash className="h-4 w-4 ml-2" />
                            إزالة الشعار
                          </Button>
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
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8" onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon className="h-4 w-4 ml-1" />
                          تغيير الصورة
                        </Button>
                        <Button variant="outline" size="sm" className="h-8" onClick={handleExportDesign}>
                          <Download className="h-4 w-4 ml-1" />
                          تصدير
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-0 min-h-[500px] bg-muted/30 overflow-auto">
                      <div 
                        id="design-workspace"
                        className="relative"
                        style={{
                          transform: `scale(${zoomLevel / 100})`,
                          transition: 'transform 0.2s',
                          maxWidth: '100%',
                          margin: '20px 0'
                        }}
                        onMouseMove={isDragging ? handleElementMouseMove : undefined}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        {showGrid && (
                          <div className="absolute inset-0 pointer-events-none">
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
                          {uploadedImage && (
                            <img 
                              src={uploadedImage} 
                              alt="صورة التصميم المخصص"
                              className="max-w-full h-auto"
                            />
                          )}
                          
                          {/* Text Elements */}
                          {textElements.map((text) => (
                            <div 
                              key={text.id}
                              className={`absolute cursor-move ${activeElementId === text.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
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
                                minHeight: '20px'
                              }}
                              onMouseDown={(e) => handleElementMouseDown(e, text.id)}
                            >
                              {text.content || "نص جديد"}
                              
                              {/* Resize handle - only shown when element is active */}
                              {activeElementId === text.id && (
                                <div className="absolute bottom-0 left-0 w-8 h-8 bg-primary opacity-50 cursor-nwse-resize"
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
                          
                          {/* Logo Elements */}
                          {logoElements.map((logo) => (
                            <div 
                              key={logo.id}
                              className={`absolute cursor-move ${activeElementId === logo.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                              style={{
                                left: `${logo.x}px`,
                                top: `${logo.y}px`,
                                opacity: logo.opacity / 100,
                                padding: '4px',
                                transform: `scale(${logo.size / 100})`,
                                transformOrigin: 'top right'
                              }}
                              onMouseDown={(e) => handleElementMouseDown(e, logo.id)}
                            >
                              <img 
                                src={logo.url} 
                                alt="شعار"
                                className="max-w-[150px] max-h-[150px] object-contain"
                                style={{ pointerEvents: 'none' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
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
                        defaultValue={`تصميم_مخصص_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}`} 
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label>تنسيق الملف</Label>
                      <div className="flex mt-2 space-x-4 rtl:space-x-reverse">
                        <div className="flex items-center">
                          <input type="radio" id="png" name="format" value="png" defaultChecked className="ml-2" />
                          <label htmlFor="png">PNG</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="jpeg" name="format" value="jpeg" className="ml-2" />
                          <label htmlFor="jpeg">JPEG</label>
                        </div>
                      </div>
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
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input type="checkbox" id="high-quality" className="rounded text-primary" defaultChecked />
                          <label htmlFor="high-quality">تصدير بجودة عالية</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center bg-muted/20 rounded-lg border border-dashed p-6">
                    {uploadedImage ? (
                      <div className="text-center">
                        <div className="mb-4 max-h-[200px] overflow-hidden">
                          <img 
                            src={uploadedImage} 
                            alt="معاينة التصدير" 
                            className="max-h-[200px] max-w-full object-contain mx-auto" 
                          />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          يتضمن {textElements.length} نص و {logoElements.length} شعار
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
                  <Button onClick={handleExportDesign} disabled={!uploadedImage}>
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

export default CustomDesignPage;
