
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// نوع بيانات إعدادات التصدير
interface ExportSettingsData {
  defaultFormat: string;
  pngQuality: number;
  jpegQuality: number;
  preserveTransparency: boolean;
  defaultFilenameTemplate: string;
  includeMetadata: boolean;
  highResolutionExport: boolean;
  maxWidthOutput: number;
  exportTextBackgrounds: boolean;
}

// الإعدادات الافتراضية
const defaultSettings: ExportSettingsData = {
  defaultFormat: "png",
  pngQuality: 90,
  jpegQuality: 85,
  preserveTransparency: true,
  defaultFilenameTemplate: "xdesign_{date}",
  includeMetadata: false,
  highResolutionExport: true,
  maxWidthOutput: 2000,
  exportTextBackgrounds: false,
};

export const ExportSettings = () => {
  const { toast } = useToast();
  const [exportSettings, setExportSettings] = useState<ExportSettingsData>(defaultSettings);

  // استرجاع الإعدادات المخزنة عند تحميل المكون
  useEffect(() => {
    const storedSettings = localStorage.getItem("exportSettings");
    if (storedSettings) {
      try {
        setExportSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error("Error parsing stored export settings:", e);
      }
    }
  }, []);

  // تحديث الإعدادات
  const handleSettingChange = (
    setting: keyof ExportSettingsData,
    value: string | number | boolean
  ) => {
    setExportSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // حفظ الإعدادات
  const saveChanges = () => {
    localStorage.setItem("exportSettings", JSON.stringify(exportSettings));
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ إعدادات التصدير بنجاح",
    });
  };

  // إعادة تعيين الإعدادات
  const resetSettings = () => {
    setExportSettings(defaultSettings);
    localStorage.removeItem("exportSettings");
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة إعدادات التصدير للقيم الافتراضية",
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات التصدير</CardTitle>
          <CardDescription>
            تخصيص إعدادات تصدير التصاميم الافتراضية في التطبيق
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">تنسيق الملف الافتراضي</h3>
            <RadioGroup
              value={exportSettings.defaultFormat}
              onValueChange={(value) =>
                handleSettingChange("defaultFormat", value)
              }
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="png" id="format-png" />
                <Label htmlFor="format-png">PNG</Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="jpeg" id="format-jpeg" />
                <Label htmlFor="format-jpeg">JPEG</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">جودة PNG</h3>
              <div className="space-y-4">
                <Slider
                  value={[exportSettings.pngQuality]}
                  onValueChange={(value) =>
                    handleSettingChange("pngQuality", value[0])
                  }
                  min={50}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">50%</span>
                  <span className="font-medium">{exportSettings.pngQuality}%</span>
                  <span className="text-muted-foreground">100%</span>
                </div>
                <Progress value={exportSettings.pngQuality} className="h-1" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">جودة JPEG</h3>
              <div className="space-y-4">
                <Slider
                  value={[exportSettings.jpegQuality]}
                  onValueChange={(value) =>
                    handleSettingChange("jpegQuality", value[0])
                  }
                  min={50}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">50%</span>
                  <span className="font-medium">{exportSettings.jpegQuality}%</span>
                  <span className="text-muted-foreground">100%</span>
                </div>
                <Progress value={exportSettings.jpegQuality} className="h-1" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="preserveTransparency"
                  checked={exportSettings.preserveTransparency}
                  onCheckedChange={(value) =>
                    handleSettingChange("preserveTransparency", Boolean(value))
                  }
                />
                <div>
                  <Label
                    htmlFor="preserveTransparency"
                    className="font-medium mb-1.5 block"
                  >
                    حفظ الشفافية
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    الاحتفاظ بخاصية الشفافية في صور PNG المصدرة
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="highResolutionExport"
                  checked={exportSettings.highResolutionExport}
                  onCheckedChange={(value) =>
                    handleSettingChange("highResolutionExport", Boolean(value))
                  }
                />
                <div>
                  <Label
                    htmlFor="highResolutionExport"
                    className="font-medium mb-1.5 block"
                  >
                    تصدير بدقة عالية
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    تصدير التصاميم بدقة عالية للطباعة والاستخدامات الاحترافية
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="includeMetadata"
                  checked={exportSettings.includeMetadata}
                  onCheckedChange={(value) =>
                    handleSettingChange("includeMetadata", Boolean(value))
                  }
                />
                <div>
                  <Label
                    htmlFor="includeMetadata"
                    className="font-medium mb-1.5 block"
                  >
                    تضمين البيانات الوصفية
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    إضافة بيانات وصفية مثل اسم التطبيق وتاريخ الإنشاء
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <Checkbox
                  id="exportTextBackgrounds"
                  checked={exportSettings.exportTextBackgrounds}
                  onCheckedChange={(value) =>
                    handleSettingChange("exportTextBackgrounds", Boolean(value))
                  }
                />
                <div>
                  <Label
                    htmlFor="exportTextBackgrounds"
                    className="font-medium mb-1.5 block"
                  >
                    تصدير خلفيات النصوص
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    تضمين خلفيات مربعات النصوص في الملفات المصدرة
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="maxWidth" className="font-medium mb-1.5 block">
                  أقصى عرض للتصدير
                </Label>
                <Select
                  value={exportSettings.maxWidthOutput.toString()}
                  onValueChange={(value) =>
                    handleSettingChange("maxWidthOutput", parseInt(value))
                  }
                >
                  <SelectTrigger id="maxWidth">
                    <SelectValue placeholder="اختر القياس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1200">1200 بكسل</SelectItem>
                    <SelectItem value="1600">1600 بكسل</SelectItem>
                    <SelectItem value="2000">2000 بكسل</SelectItem>
                    <SelectItem value="2400">2400 بكسل</SelectItem>
                    <SelectItem value="3000">3000 بكسل</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  تحديد أقصى عرض للصور المصدرة لتحسين حجم الملف
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={resetSettings}>إعادة التعيين</Button>
        <Button onClick={saveChanges}>حفظ التغييرات</Button>
      </div>
    </div>
  );
};
